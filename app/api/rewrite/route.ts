import { NextRequest, NextResponse } from 'next/server';
import { generateRewriteSuggestions, RewriteRequest } from '@/lib/rewriteUtils';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
    }

    const body: RewriteRequest = await request.json();
    
    // Validate required fields
    if (!body.originalText || !body.genre || !body.targetSense || body.currentScore === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: originalText, genre, targetSense, currentScore' },
        { status: 400 }
      );
    }

    // Validate text length
    if (body.originalText.length > 10000) {
      return NextResponse.json(
        { error: 'Text too long. Please limit to 10,000 characters.' },
        { status: 400 }
      );
    }

    if (body.originalText.length < 50) {
      return NextResponse.json(
        { error: 'Text too short. Please provide at least 50 characters for rewrite suggestions.' },
        { status: 400 }
      );
    }

    // Validate sense
    const validSenses = ['sight', 'sound', 'touch', 'taste', 'smell'];
    if (!validSenses.includes(body.targetSense.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid target sense. Must be one of: sight, sound, touch, taste, smell' },
        { status: 400 }
      );
    }

    // Validate score
    if (body.currentScore < 0 || body.currentScore > 10) {
      return NextResponse.json(
        { error: 'Invalid current score. Must be between 0 and 10.' },
        { status: 400 }
      );
    }

    // Generate rewrite suggestions
    const suggestion = await generateRewriteSuggestions(body, apiKey);
    
    return NextResponse.json(suggestion);
  } catch (error) {
    console.error('Rewrite suggestion error:', error);
    return NextResponse.json(
      { error: 'Failed to generate rewrite suggestions. Please try again.' },
      { status: 500 }
    );
  }
}