
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sword, Skull, Rocket, Eye, Volume2, Hand, Wind, Cherry } from 'lucide-react';
import { useState, useEffect } from 'react';

interface GenreData {
  genreName: string;
  overview: string;
  sensoryApplications: Array<{
    senseName: string;
    explanation: string;
    examples: string[];
  }>;
}

interface ResearchData {
  genres: GenreData[];
}

const genreIcons = {
  Fantasy: Sword,
  Horror: Skull,
  'Science Fiction': Rocket
};

const senseIcons = {
  sight: Eye,
  sound: Volume2,
  touch: Hand,
  smell: Wind,
  taste: Cherry
};

const senseColors = {
  sight: '#60B5FF',
  sound: '#FF9149',
  touch: '#FF9898',
  smell: '#80D8C3',
  taste: '#A19AD3'
};

export function GenreExamples() {
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
        <p className="text-muted-foreground">Loading genre examples...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Genre-Specific Sensory Examples</h3>
        <p className="text-muted-foreground text-sm">
          Learn from powerful sensory writing examples across fantasy, horror, and science fiction
        </p>
      </div>

      <Tabs defaultValue="Fantasy" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {researchData.genres.map((genre) => {
            const IconComponent = genreIcons[genre.genreName as keyof typeof genreIcons];
            return (
              <TabsTrigger key={genre.genreName} value={genre.genreName} className="flex items-center space-x-2">
                <IconComponent className="h-4 w-4" />
                <span className="hidden sm:inline">{genre.genreName}</span>
                <span className="sm:hidden">
                  {genre.genreName === 'Science Fiction' ? 'Sci-Fi' : genre.genreName}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {researchData.genres.map((genre) => (
          <TabsContent key={genre.genreName} value={genre.genreName} className="space-y-4">
            {/* Genre Overview */}
            <Card className="sense-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {(() => {
                    const IconComponent = genreIcons[genre.genreName as keyof typeof genreIcons];
                    return <IconComponent className="h-5 w-5 text-primary" />;
                  })()}
                  <span>{genre.genreName} Sensory Writing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{genre.overview}</p>
              </CardContent>
            </Card>

            {/* Sensory Applications */}
            <div className="space-y-4">
              {genre.sensoryApplications.map((application, index) => {
                const senseKey = application.senseName.toLowerCase();
                const IconComponent = senseIcons[senseKey as keyof typeof senseIcons];
                const color = senseColors[senseKey as keyof typeof senseColors];

                return (
                  <Card key={index} className="sense-card">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-base">
                        <IconComponent 
                          className="h-4 w-4" 
                          style={{ color }}
                        />
                        <span>{application.senseName} in {genre.genreName}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {application.examples.length} examples
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {application.explanation}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-sm font-medium">Examples:</h4>
                        <div className="space-y-3">
                          {application.examples.map((example, exampleIndex) => {
                            // Parse examples that might have categories (e.g., "Worldbuilding: 'example text'")
                            const parts = example.split(': ');
                            const hasCategory = parts.length > 1 && parts[0].length < 20;
                            const category = hasCategory ? parts[0] : null;
                            const text = hasCategory ? parts.slice(1).join(': ') : example;

                            return (
                              <div key={exampleIndex} className="bg-muted/50 rounded-lg p-3">
                                {category && (
                                  <Badge variant="outline" className="mb-2 text-xs">
                                    {category}
                                  </Badge>
                                )}
                                <p className="text-sm italic leading-relaxed">
                                  {text.replace(/^["']|["']$/g, '')}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
