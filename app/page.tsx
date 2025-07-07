'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import SensoryRadarChart from '@/components/RadarChart';
import FeedbackPanel from '@/components/FeedbackPanel';

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

  const handleAnalyze = async (data: { text: string; genre: string; sense: string }) => {
    setIsLoading(true);
    setError(null);
    
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">Sensory Scribe</h1>
          <p className="text-gray-400 mt-1">Analyze and improve sensory details in your fiction writing</p>
        </div>
      </header>

      {/* Main Content - 2 Panel Layout */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Input */}
          <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

          {/* Right Panel - Results */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Analysis Results</h2>
            
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
          </div>
        </div>
      </main>
    </div>
  );
}