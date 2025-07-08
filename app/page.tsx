'use client';

import { useState, useEffect } from 'react';
import InputForm from '@/components/InputForm';
import SensoryRadarChart from '@/components/RadarChart';
import FeedbackPanel from '@/components/FeedbackPanel';
import ExportButton from '@/components/ExportButton';
import RewriteSuggestions from '@/components/RewriteSuggestions';
import { saveDraft, SensoryDraft, canUseApp, incrementUsage, getRemainingAnalyses } from '@/lib/localStorage';

interface AnalysisResult {
  radar_scores: {
    sight: number;
    sound: number;
    touch: number;
    taste: number;
    smell: number;
  };
  feedback: string;
}

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInput, setCurrentInput] = useState<{ text: string; genre: string; sense: string } | null>(null);
  const [remainingAnalyses, setRemainingAnalyses] = useState(3);

  useEffect(() => {
    setRemainingAnalyses(getRemainingAnalyses());
  }, []);

  const handleAnalyze = async (data: { text: string; genre: string; sense: string }) => {
    // Check usage limit before proceeding
    if (!canUseApp()) {
      setError("You've reached the free usage limit for this session.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentInput(data);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze text');
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);

      // Increment usage count after successful analysis
      incrementUsage();
      setRemainingAnalyses(getRemainingAnalyses());

      // Auto-save the draft with analysis results
      if (data.text.trim() && data.genre) {
        saveDraft({
          text: data.text,
          genre: data.genre,
          sense: data.sense,
          analysis: result
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDraftLoaded = (draft: SensoryDraft) => {
    // Load the analysis results if they exist
    if (draft.analysis) {
      setAnalysisResult(draft.analysis);
      setError(null);
    } else {
      // Clear results if no analysis in the draft
      setAnalysisResult(null);
    }
    
    setCurrentInput({
      text: draft.text,
      genre: draft.genre,
      sense: draft.sense
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">Sensory Scribe</h1>
              <p className="text-gray-400 mt-1">Analyze and improve sensory details in your fiction writing</p>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${remainingAnalyses === 0 ? 'text-red-400' : 'text-blue-400'}`}>
                {remainingAnalyses > 0 
                  ? `${remainingAnalyses} free analysis${remainingAnalyses !== 1 ? 'es' : ''} remaining`
                  : 'Usage limit reached'
                }
              </div>
              <div className="text-xs text-gray-500 mt-1">this session</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 2 Panel Layout */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Input */}
          <InputForm 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading}
            onDraftLoaded={handleDraftLoaded}
          />

          {/* Right Panel - Results */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Analysis Results</h2>
              {analysisResult && currentInput && (
                <ExportButton 
                  data={{
                    text: currentInput.text,
                    genre: currentInput.genre,
                    sense: currentInput.sense,
                    radarScores: analysisResult.radar_scores,
                    feedback: analysisResult.feedback
                  }}
                />
              )}
            </div>
            
            {/* Error State */}
            {error && (
              <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="text-red-400 mr-2">⚠️</div>
                  <div>
                    <h3 className="font-semibold text-red-300">Error</h3>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Radar Chart */}
            <div className="mb-6">
              <SensoryRadarChart 
                data={analysisResult?.radar_scores} 
              />
            </div>
            
            {/* Feedback Panel */}
            <FeedbackPanel 
              feedback={analysisResult?.feedback} 
              isLoading={isLoading}
            />

            {/* Rewrite Suggestions */}
            {analysisResult && currentInput && (
              <div className="mt-6">
                <RewriteSuggestions
                  originalText={currentInput.text}
                  genre={currentInput.genre}
                  radarScores={analysisResult.radar_scores}
                />
              </div>
            )}

            {/* Auto-save indicator */}
            {analysisResult && currentInput && (
              <div className="mt-4 p-2 bg-gray-700 rounded text-xs text-gray-400 text-center">
                💾 Analysis automatically saved with draft
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}