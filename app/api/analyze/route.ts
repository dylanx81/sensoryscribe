import { NextRequest, NextResponse } from 'next/server';
import { analyzeSensoryDetails, SensoryAnalysisRequest } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const body: SensoryAnalysisRequest = await request.json();
    
    // Validate required fields
    if (!body.text || !body.genre || !body.sense) {
      return NextResponse.json(
        { error: 'Missing required fields: text, genre, sense' },
        { status: 400 }
      );
    }

    // Validate text length (reasonable limits)
    if (body.text.length > 10000) {
      return NextResponse.json(
        { error: 'Text too long. Please limit to 10,000 characters.' },
        { status: 400 }
      );
    }

    if (body.text.length < 50) {
      return NextResponse.json(
        { error: 'Text too short. Please provide at least 50 characters for analysis.' },
        { status: 400 }
      );
    }

    // Perform analysis
    const analysis = await analyzeSensoryDetails(body, apiKey);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze text. Please try again.' },
      { status: 500 }
    );
  }
}