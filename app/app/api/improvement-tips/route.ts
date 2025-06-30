
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

interface ResearchData {
  senses: Array<{
    senseName: string;
    improvementStrategies: string[];
    commonMistakes: string[];
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sense = searchParams.get('sense')?.toLowerCase();

    if (!sense) {
      return NextResponse.json(
        { error: 'Sense parameter is required' },
        { status: 400 }
      );
    }

    // Validate sense parameter
    const validSenses = ['sight', 'sound', 'touch', 'smell', 'taste'];
    if (!validSenses.includes(sense)) {
      return NextResponse.json(
        { error: 'Invalid sense. Must be one of: sight, sound, touch, smell, taste' },
        { status: 400 }
      );
    }

    // Load research data
    const dataPath = join(process.cwd(), 'data', 'sensory_writing_research.json');
    const fileContents = await readFile(dataPath, 'utf8');
    const researchData: ResearchData = JSON.parse(fileContents);

    // Find the sense data
    const senseData = researchData.senses.find(s => 
      s.senseName.toLowerCase() === sense
    );

    if (!senseData) {
      return NextResponse.json(
        { error: 'Sense data not found' },
        { status: 404 }
      );
    }

    // Return 3 strategies and 3 mistakes as specified
    const strategies = senseData.improvementStrategies.slice(0, 3);
    const mistakes = senseData.commonMistakes.slice(0, 3);

    return NextResponse.json({
      strategies,
      mistakes
    });

  } catch (error) {
    console.error('Error in improvement-tips API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch improvement tips' },
      { status: 500 }
    );
  }
}
