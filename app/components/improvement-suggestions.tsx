
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Eye, Volume2, Hand, Wind, Cherry, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ImprovementSuggestionsProps {
  scores: {
    sight: number;
    sound: number;
    touch: number;
    smell: number;
    taste: number;
  };
}

interface ResearchData {
  senses: Array<{
    senseName: string;
    improvementStrategies: string[];
    commonMistakes: string[];
  }>;
  techniques: Array<{
    techniqueName: string;
    description: string;
    example?: {
      telling?: string;
      showing?: string;
      generic?: string;
      specific?: string;
    };
  }>;
  commonMistakes: Array<{
    mistakeTitle: string;
    explanation: string;
    badExample?: string;
    goodExample?: string;
  }>;
}

const senseIcons = {
  sight: Eye,
  sound: Volume2,
  touch: Hand,
  smell: Wind,
  taste: Cherry
};

export function ImprovementSuggestions({ scores }: ImprovementSuggestionsProps) {
  const [researchData, setResearchData] = useState<ResearchData | null>(null);

  useEffect(() => {
    // Load research data
    fetch('/data/sensory_writing_research.json')
      .then(response => response.json())
      .then(data => setResearchData(data))
      .catch(error => console.error('Failed to load research data:', error));
  }, []);

  if (!researchData) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading improvement suggestions...</p>
      </div>
    );
  }

  // Identify weakest senses (score < 6)
  const weakSenses = Object.entries(scores || {})
    .filter(([_, score]) => score < 6)
    .sort(([,a], [,b]) => a - b) // Sort by score (lowest first)
    .slice(0, 3); // Focus on top 3 weakest

  // Get suggestions for weak senses
  const senseSuggestions = weakSenses.map(([senseName, score]) => {
    const senseData = researchData.senses.find(s => 
      s.senseName.toLowerCase() === senseName.toLowerCase()
    );
    return { senseName, score, strategies: senseData?.improvementStrategies || [] };
  });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Personalized Improvement Suggestions</h3>
        <p className="text-muted-foreground text-sm">
          Based on your analysis, here are targeted recommendations to enhance your sensory writing
        </p>
      </div>

      {/* Priority Improvements */}
      {senseSuggestions.length > 0 && (
        <Card className="sense-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Priority Improvements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {senseSuggestions.map(({ senseName, score, strategies }) => {
              const IconComponent = senseIcons[senseName as keyof typeof senseIcons];
              
              return (
                <div key={senseName} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-orange-600" />
                      <span className="font-medium capitalize">{senseName}</span>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      {score}/10 - Needs Work
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Recommended Strategies:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {strategies.slice(0, 3).map((strategy, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* General Writing Techniques */}
      <Card className="sense-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Essential Sensory Writing Techniques</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {researchData.techniques.slice(0, 4).map((technique, index) => (
            <div key={index} className="space-y-3">
              <div>
                <h4 className="font-medium text-foreground">{technique.techniqueName}</h4>
                <p className="text-sm text-muted-foreground mt-1">{technique.description}</p>
              </div>
              
              {technique.example && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  {technique.example.telling && technique.example.showing && (
                    <>
                      <div>
                        <span className="text-xs font-medium text-red-600">Telling:</span>
                        <p className="text-sm italic">"{technique.example.telling}"</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-green-600">Showing:</span>
                        <p className="text-sm italic">"{technique.example.showing}"</p>
                      </div>
                    </>
                  )}
                  {technique.example.generic && technique.example.specific && (
                    <>
                      <div>
                        <span className="text-xs font-medium text-red-600">Generic:</span>
                        <p className="text-sm italic">"{technique.example.generic}"</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-green-600">Specific:</span>
                        <p className="text-sm italic">"{technique.example.specific}"</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Common Mistakes to Avoid */}
      <Card className="sense-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Common Mistakes to Avoid</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {researchData.commonMistakes.slice(0, 3).map((mistake, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-medium text-foreground">{mistake.mistakeTitle}</h4>
              <p className="text-sm text-muted-foreground">{mistake.explanation}</p>
              
              {mistake.badExample && mistake.goodExample && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div>
                    <span className="text-xs font-medium text-red-600">Avoid:</span>
                    <p className="text-sm italic">"{mistake.badExample}"</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-green-600">Better:</span>
                    <p className="text-sm italic">"{mistake.goodExample}"</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="sense-card border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            <span>Quick Writing Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Use specific, evocative words instead of generic adjectives</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Layer multiple senses within the same scene</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Connect sensory details to character emotions</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-primary">✓</span>
              <span className="text-sm">Don't overload - use sensory details strategically</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
