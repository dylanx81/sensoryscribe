
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sword, Skull, Rocket, Eye, Volume2, Hand, Wind, Cherry, Target, Lightbulb, Loader2 } from 'lucide-react';
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

interface TargetedExamples {
  explanation: string;
  examples: string[];
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

const genres = ['Fantasy', 'Horror', 'Science Fiction'];
const senses = ['Sight', 'Sound', 'Touch', 'Smell', 'Taste'];

export function GenreExamples() {
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedSense, setSelectedSense] = useState<string>('');
  const [targetedExamples, setTargetedExamples] = useState<TargetedExamples | null>(null);
  const [isLoadingTargeted, setIsLoadingTargeted] = useState(false);
  const [targetedError, setTargetedError] = useState<string>('');

  useEffect(() => {
    // Load research data
    fetch('/data/sensory_writing_research.json')
      .then(response => response.json())
      .then(data => setResearchData(data))
      .catch(error => console.error('Failed to load research data:', error));
  }, []);

  const fetchTargetedExamples = async () => {
    if (!selectedGenre || !selectedSense) {
      setTargetedError('Please select both a genre and a sense.');
      return;
    }

    setIsLoadingTargeted(true);
    setTargetedError('');
    setTargetedExamples(null);

    try {
      const response = await fetch(
        `/api/genre-examples?genre=${encodeURIComponent(selectedGenre)}&sense=${encodeURIComponent(selectedSense)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch examples');
      }

      const data = await response.json();
      setTargetedExamples(data);
    } catch (error) {
      console.error('Error fetching targeted examples:', error);
      setTargetedError(error instanceof Error ? error.message : 'Failed to fetch examples');
    } finally {
      setIsLoadingTargeted(false);
    }
  };

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

      {/* Targeted Examples Tool */}
      <Card className="sense-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>Get Targeted Examples</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a specific genre and sense to get focused examples and insights for your writing.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      <div className="flex items-center space-x-2">
                        {(() => {
                          const IconComponent = genreIcons[genre as keyof typeof genreIcons];
                          return <IconComponent className="h-4 w-4" />;
                        })()}
                        <span>{genre}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sense</label>
              <Select value={selectedSense} onValueChange={setSelectedSense}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sense" />
                </SelectTrigger>
                <SelectContent>
                  {senses.map((sense) => {
                    const senseKey = sense.toLowerCase();
                    const IconComponent = senseIcons[senseKey as keyof typeof senseIcons];
                    const color = senseColors[senseKey as keyof typeof senseColors];
                    return (
                      <SelectItem key={sense} value={sense}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" style={{ color }} />
                          <span>{sense}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={fetchTargetedExamples}
            disabled={!selectedGenre || !selectedSense || isLoadingTargeted}
            className="w-full"
          >
            {isLoadingTargeted ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting Examples...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 mr-2" />
                Get Targeted Examples
              </>
            )}
          </Button>

          {targetedError && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{targetedError}</p>
            </div>
          )}

          {targetedExamples && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  {(() => {
                    const GenreIcon = genreIcons[selectedGenre as keyof typeof genreIcons];
                    const senseKey = selectedSense.toLowerCase();
                    const SenseIcon = senseIcons[senseKey as keyof typeof senseIcons];
                    const color = senseColors[senseKey as keyof typeof senseColors];
                    return (
                      <>
                        <GenreIcon className="h-4 w-4 text-primary" />
                        <SenseIcon className="h-4 w-4" style={{ color }} />
                      </>
                    );
                  })()}
                  <h4 className="font-medium">{selectedSense} in {selectedGenre}</h4>
                </div>
              </div>

              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <div>
                  <h5 className="text-sm font-medium mb-2">How it's used:</h5>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {targetedExamples.explanation}
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-3">Examples:</h5>
                  <div className="space-y-3">
                    {targetedExamples.examples.map((example, index) => {
                      // Parse examples that might have categories
                      const parts = example.split(': ');
                      const hasCategory = parts.length > 1 && parts[0].length < 20;
                      const category = hasCategory ? parts[0] : null;
                      const text = hasCategory ? parts.slice(1).join(': ') : example;

                      return (
                        <div key={index} className="bg-background rounded-lg p-3 border">
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or browse all examples by genre
          </span>
        </div>
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
