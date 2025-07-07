'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface RadarData {
  sense: string;
  score: number;
  fullMark: number;
}

interface RadarChartProps {
  data?: {
    sight: number;
    sound: number;
    touch: number;
    taste: number;
    smell: number;
  };
}

export default function SensoryRadarChart({ data }: RadarChartProps) {
  // Convert data to radar chart format
  const radarData: RadarData[] = data ? [
    { sense: 'Sight', score: data.sight, fullMark: 10 },
    { sense: 'Sound', score: data.sound, fullMark: 10 },
    { sense: 'Touch', score: data.touch, fullMark: 10 },
    { sense: 'Taste', score: data.taste, fullMark: 10 },
    { sense: 'Smell', score: data.smell, fullMark: 10 },
  ] : [];

  if (!data) {
    return (
      <div className="bg-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center text-2xl">
            📊
          </div>
          <p>Sensory Radar Chart</p>
          <p className="text-sm">Results will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4 h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={radarData}>
          <PolarGrid stroke="#4b5563" />
          <PolarAngleAxis 
            dataKey="sense" 
            tick={{ fill: '#d1d5db', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]}
            tick={{ fill: '#9ca3af', fontSize: 10 }}
          />
          <Radar
            name="Sensory Score"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Score Summary */}
      <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
        {radarData.map((item) => (
          <div key={item.sense} className="text-center">
            <div className="text-gray-300">{item.sense}</div>
            <div className="text-blue-400 font-semibold">{item.score}/10</div>
          </div>
        ))}
      </div>
    </div>
  );
}