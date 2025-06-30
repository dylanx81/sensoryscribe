
import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const sense = searchParams.get('sense');

    if (!genre || !sense) {
      return NextResponse.json(
        { error: 'Both genre and sense parameters are required' },
        { status: 400 }
      );
    }

    // Read the research data
    const dataPath = join(process.cwd(), 'data', 'sensory_writing_research.json');
    const researchData = JSON.parse(readFileSync(dataPath, 'utf8'));

    // Find the specific genre
    const genreData = researchData.genres?.find(
      (g: any) => g.genreName?.toLowerCase() === genre.toLowerCase()
    );

    if (!genreData) {
      return NextResponse.json(
        { error: `Genre "${genre}" not found. Available genres: Fantasy, Horror, Science Fiction` },
        { status: 404 }
      );
    }

    // Find the specific sense within the genre
    const senseData = genreData.sensoryApplications?.find(
      (s: any) => s.senseName?.toLowerCase() === sense.toLowerCase()
    );

    if (!senseData) {
      return NextResponse.json(
        { error: `Sense "${sense}" not found for genre "${genre}". Available senses: Sight, Sound, Smell, Taste, Touch` },
        { status: 404 }
      );
    }

    // Extract explanation and examples
    const explanation = senseData.explanation || '';
    const examples = senseData.examples || [];

    // Ensure we have exactly 3 examples (or as many as available)
    const finalExamples = examples.slice(0, 3);

    return NextResponse.json({
      explanation,
      examples: finalExamples
    });

  } catch (error) {
    console.error('Error in genre-examples API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
