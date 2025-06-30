
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text is required for analysis' },
        { status: 400 }
      );
    }

    // Call the LLM API for sensory analysis
    const analysisPrompt = `You are an expert in sensory writing analysis. Analyze the following prose text for sensory details across all five senses: sight, sound, touch, smell, and taste.

For each sense, provide:
1. A score from 0-10 (0 = no sensory details, 10 = rich, vivid sensory details)
2. Specific phrases from the text that contribute to that sense (highlight_phrases)
3. A detailed explanation for the score (analysis_chain_of_thought)

Text to analyze:
"${text}"

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting. Use this exact structure:

{
  "sensory_scores": {
    "sight": 0,
    "sound": 0, 
    "touch": 0,
    "smell": 0,
    "taste": 0
  },
  "highlight_phrases": {
    "sight": [],
    "sound": [],
    "touch": [],
    "smell": [],
    "taste": []
  },
  "analysis_chain_of_thought": {
    "sight": "explanation for sight score",
    "sound": "explanation for sound score", 
    "touch": "explanation for touch score",
    "smell": "explanation for smell score",
    "taste": "explanation for taste score"
  }
}`;

    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM API request failed: ${response.status}`);
    }

    const apiResponse = await response.json();
    
    if (!apiResponse?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from LLM API');
    }

    let analysisResult;
    try {
      // Clean and parse the JSON response
      let jsonContent = apiResponse.choices[0].message.content.trim();
      
      // Remove any markdown code blocks if present
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Remove any leading/trailing characters that aren't part of JSON
      const startIndex = jsonContent.indexOf('{');
      const endIndex = jsonContent.lastIndexOf('}');
      if (startIndex !== -1 && endIndex !== -1) {
        jsonContent = jsonContent.substring(startIndex, endIndex + 1);
      }

      analysisResult = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error('Failed to parse LLM response:', parseError);
      throw new Error('Failed to parse analysis results');
    }

    // Validate the structure
    if (!analysisResult?.sensory_scores || !analysisResult?.highlight_phrases || !analysisResult?.analysis_chain_of_thought) {
      throw new Error('Invalid analysis result structure');
    }

    // Store the analysis in the database
    const savedAnalysis = await prisma.analysis.create({
      data: {
        text: text,
        sightScore: analysisResult.sensory_scores.sight ?? 0,
        soundScore: analysisResult.sensory_scores.sound ?? 0,
        touchScore: analysisResult.sensory_scores.touch ?? 0,
        smellScore: analysisResult.sensory_scores.smell ?? 0,
        tasteScore: analysisResult.sensory_scores.taste ?? 0,
        sightPhrases: analysisResult.highlight_phrases.sight ?? [],
        soundPhrases: analysisResult.highlight_phrases.sound ?? [],
        touchPhrases: analysisResult.highlight_phrases.touch ?? [],
        smellPhrases: analysisResult.highlight_phrases.smell ?? [],
        tastePhrases: analysisResult.highlight_phrases.taste ?? [],
        sightAnalysis: analysisResult.analysis_chain_of_thought.sight ?? '',
        soundAnalysis: analysisResult.analysis_chain_of_thought.sound ?? '',
        touchAnalysis: analysisResult.analysis_chain_of_thought.touch ?? '',
        smellAnalysis: analysisResult.analysis_chain_of_thought.smell ?? '',
        tasteAnalysis: analysisResult.analysis_chain_of_thought.taste ?? '',
      },
    });

    return NextResponse.json({
      id: savedAnalysis.id,
      ...analysisResult
    });

  } catch (error: any) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { error: `Analysis failed: ${error?.message ?? 'Unknown error'}` },
      { status: 500 }
    );
  }
}
