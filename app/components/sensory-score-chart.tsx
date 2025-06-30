
'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Volume2, Hand, Wind, Cherry } from 'lucide-react';

interface SensoryScoreChartProps {
  scores: {
    sight: number;
    sound: number;
    touch: number;
    smell: number;
    taste: number;
  };
}

const senseColors = {
  sight: '#60B5FF',
  sound: '#FF9149', 
  touch: '#FF9898',
  smell: '#80D8C3',
  taste: '#A19AD3'
};

const senseIcons = {
  sight: Eye,
  sound: Volume2,
  touch: Hand,
  smell: Wind,
  taste: Cherry
};

export function SensoryScoreChart({ scores }: SensoryScoreChartProps) {
  const data = [
    { name: 'Sight', score: scores?.sight ?? 0, fullName: 'Visual Details' },
    { name: 'Sound', score: scores?.sound ?? 0, fullName: 'Auditory Details' },
    { name: 'Touch', score: scores?.touch ?? 0, fullName: 'Tactile Details' },
    { name: 'Smell', score: scores?.smell ?? 0, fullName: 'Olfactory Details' },
    { name: 'Taste', score: scores?.taste ?? 0, fullName: 'Gustatory Details' }
  ];

  const averageScore = data.reduce((sum, item) => sum + item.score, 0) / data.length;
  const strongestSense = data.reduce((prev, current) => prev.score > current.score ? prev : current);
  const weakestSense = data.reduce((prev, current) => prev.score < current.score ? prev : current);

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="sense-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary animate-count-up">
                {averageScore.toFixed(1)}/10
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="sense-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                {(() => {
                  const IconComponent = senseIcons[strongestSense.name.toLowerCase() as keyof typeof senseIcons];
                  return <IconComponent className="h-4 w-4 text-green-600" />;
                })()}
                <div className="text-lg font-semibold text-green-600">
                  {strongestSense.score}/10
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Strongest: {strongestSense.fullName}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="sense-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                {(() => {
                  const IconComponent = senseIcons[weakestSense.name.toLowerCase() as keyof typeof senseIcons];
                  return <IconComponent className="h-4 w-4 text-orange-600" />;
                })()}
                <div className="text-lg font-semibold text-orange-600">
                  {weakestSense.score}/10
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Needs Work: {weakestSense.fullName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="sense-card">
        <CardHeader>
          <CardTitle className="text-center">Sensory Analysis Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <XAxis 
                  dataKey="name"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  domain={[0, 10]}
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ 
                    value: 'Score', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: 11 }
                  }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={senseColors[entry.name.toLowerCase() as keyof typeof senseColors]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Individual Sense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {data.map((sense) => {
          const IconComponent = senseIcons[sense.name.toLowerCase() as keyof typeof senseIcons];
          const color = senseColors[sense.name.toLowerCase() as keyof typeof senseColors];
          
          return (
            <Card key={sense.name} className="sense-card">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center">
                    <IconComponent 
                      className="h-6 w-6" 
                      style={{ color }}
                    />
                  </div>
                  <div>
                    <div className="text-xl font-bold animate-count-up" style={{ color }}>
                      {sense.score}/10
                    </div>
                    <p className="text-sm font-medium text-foreground">{sense.name}</p>
                    <p className="text-xs text-muted-foreground">{sense.fullName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
