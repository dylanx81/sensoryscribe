
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Eye, Volume2, Hand, Wind, Cherry } from 'lucide-react';

interface DetailedBreakdownProps {
  scores: {
    sight: number;
    sound: number;
    touch: number;
    smell: number;
    taste: number;
  };
  phrases: {
    sight: string[];
    sound: string[];
    touch: string[];
    smell: string[];
    taste: string[];
  };
  analysis: {
    sight: string;
    sound: string;
    touch: string;
    smell: string;
    taste: string;
  };
}

const senseData = {
  sight: {
    icon: Eye,
    color: '#60B5FF',
    title: 'Visual Details',
    description: 'Colors, shapes, lighting, movement, and visual imagery'
  },
  sound: {
    icon: Volume2,
    color: '#FF9149',
    title: 'Auditory Details', 
    description: 'Sounds, noises, music, silence, and acoustic elements'
  },
  touch: {
    icon: Hand,
    color: '#FF9898',
    title: 'Tactile Details',
    description: 'Textures, temperatures, pressure, and physical sensations'
  },
  smell: {
    icon: Wind,
    color: '#80D8C3',
    title: 'Olfactory Details',
    description: 'Scents, aromas, fragrances, and smell-related descriptions'
  },
  taste: {
    icon: Cherry,
    color: '#A19AD3',
    title: 'Gustatory Details',
    description: 'Flavors, tastes, and gustatory experiences'
  }
};

export function DetailedBreakdown({ scores, phrases, analysis }: DetailedBreakdownProps) {
  const senses = ['sight', 'sound', 'touch', 'smell', 'taste'] as const;

  const getScoreLevel = (score: number) => {
    if (score >= 8) return { level: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 6) return { level: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 4) return { level: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Needs Work', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Detailed Sensory Breakdown</h3>
        <p className="text-muted-foreground text-sm">
          Explore each sense with specific examples and detailed analysis
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {senses.map((sense) => {
          const senseInfo = senseData[sense];
          const IconComponent = senseInfo.icon;
          const score = scores?.[sense] ?? 0;
          const senseAnalysis = analysis?.[sense] ?? '';
          const sensePhrases = phrases?.[sense] ?? [];
          const scoreInfo = getScoreLevel(score);

          return (
            <AccordionItem key={sense} value={sense} className="border rounded-lg">
              <Card className="sense-card border-0">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full mr-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3">
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: senseInfo.color }}
                        />
                        <div className="text-left">
                          <h4 className="font-semibold text-foreground">{senseInfo.title}</h4>
                          <p className="text-sm text-muted-foreground">{senseInfo.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={scoreInfo.color}>
                        {scoreInfo.level}
                      </Badge>
                      <div 
                        className="text-xl font-bold"
                        style={{ color: senseInfo.color }}
                      >
                        {score}/10
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-4">
                    {/* Analysis */}
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Analysis</h5>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {senseAnalysis || 'No detailed analysis available for this sense.'}
                      </p>
                    </div>

                    {/* Highlighted Phrases */}
                    <div>
                      <h5 className="font-medium text-foreground mb-2">
                        Identified Phrases ({sensePhrases.length})
                      </h5>
                      {sensePhrases.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {sensePhrases.map((phrase, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="text-xs"
                            >
                              "{phrase}"
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">
                          No specific phrases identified for this sense. Consider adding more {sense} details to enhance your prose.
                        </p>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
