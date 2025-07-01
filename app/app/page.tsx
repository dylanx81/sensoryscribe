
'use client';

import { useState } from 'react';
import { BookText, Sparkles, BarChart, Lightbulb, BookOpen, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { SensoryScoreChart } from '@/components/sensory-score-chart';
import { DetailedBreakdown } from '@/components/detailed-breakdown';
import { ImprovementSuggestions } from '@/components/improvement-suggestions';
import { GenreExamples } from '@/components/genre-examples';
import { RewriteSuggester } from '@/components/rewrite-suggester';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface AnalysisResult {
  id: string;
  sensory_scores: {
    sight: number;
    sound: number;
    touch: number;
    smell: number;
    taste: number;
  };
  highlight_phrases: {
    sight: string[];
    sound: string[];
    touch: string[];
    smell: string[];
    taste: string[];
  };
  analysis_chain_of_thought: {
    sight: string;
    sound: string;
    touch: string;
    smell: string;
    taste: string;
  };
}

export default function Home() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!text?.trim()) {
      toast.error('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error ?? 'Analysis failed');
      }

      const result = await response.json();
      setAnalysisResult(result);
      
      // Scroll to results section
      setTimeout(() => {
        const resultsSection = document.getElementById('results-section');
        resultsSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
      toast.success('Analysis completed successfully!');
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast.error(error?.message ?? 'Failed to analyze text');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="container-max py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookText className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-serif font-bold text-foreground">Sensory Scribe</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient py-16">
        <div className="container-max">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                Uncover the Sensory Soul of Your Story
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Paste your prose to analyze its sensory depth and receive expert guidance to make your writing more immersive.
              </p>
            </div>

            <Card className="prose-analysis-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-left">
                  <BookText className="h-5 w-5 text-primary" />
                  <span>Enter Your Prose</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your fiction writing here to analyze its sensory details across sight, sound, touch, smell, and taste..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] resize-none text-base leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {text.length} characters
                  </Badge>
                  <Button 
                    onClick={handleAnalyze}
                    disabled={isLoading || !text.trim()}
                    size="lg"
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Prose
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rewrite Suggester Section */}
      <section className="py-16 bg-background">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 animate-fade-in-up">
              <h3 className="text-3xl font-serif font-bold text-foreground mb-2">
                AI-Powered Rewrite Suggestions
              </h3>
              <p className="text-muted-foreground">
                Get targeted suggestions to enhance the sensory richness of your prose
              </p>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <RewriteSuggester />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {analysisResult && (
        <section id="results-section" className="py-16 bg-muted/30">
          <div className="container-max">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 animate-fade-in-up">
                <h3 className="text-3xl font-serif font-bold text-foreground mb-2">
                  Your Sensory Analysis
                </h3>
                <p className="text-muted-foreground">
                  Explore your prose's sensory depth and discover opportunities for enhancement
                </p>
              </div>

              <Card className="prose-analysis-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-6">
                  <Tabs defaultValue="scores" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="scores" className="flex items-center space-x-2">
                        <BarChart className="h-4 w-4" />
                        <span className="hidden sm:inline">Sensory Scores</span>
                        <span className="sm:hidden">Scores</span>
                      </TabsTrigger>
                      <TabsTrigger value="breakdown" className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Detailed Breakdown</span>
                        <span className="sm:hidden">Details</span>
                      </TabsTrigger>
                      <TabsTrigger value="suggestions" className="flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4" />
                        <span className="hidden sm:inline">Improvement Tips</span>
                        <span className="sm:hidden">Tips</span>
                      </TabsTrigger>
                      <TabsTrigger value="rewrite" className="flex items-center space-x-2">
                        <Wand2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Rewrite Suggester</span>
                        <span className="sm:hidden">Rewrite</span>
                      </TabsTrigger>
                      <TabsTrigger value="examples" className="flex items-center space-x-2">
                        <BookText className="h-4 w-4" />
                        <span className="hidden sm:inline">Genre Examples</span>
                        <span className="sm:hidden">Examples</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="scores" className="mt-6">
                      <SensoryScoreChart scores={analysisResult.sensory_scores} />
                    </TabsContent>

                    <TabsContent value="breakdown" className="mt-6">
                      <DetailedBreakdown 
                        scores={analysisResult.sensory_scores}
                        phrases={analysisResult.highlight_phrases}
                        analysis={analysisResult.analysis_chain_of_thought}
                      />
                    </TabsContent>

                    <TabsContent value="suggestions" className="mt-6">
                      <ImprovementSuggestions scores={analysisResult.sensory_scores} />
                    </TabsContent>

                    <TabsContent value="rewrite" className="mt-6">
                      <RewriteSuggester />
                    </TabsContent>

                    <TabsContent value="examples" className="mt-6">
                      <GenreExamples />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container-max">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 Sensory Scribe
          </div>
        </div>
      </footer>
    </div>
  );
}
