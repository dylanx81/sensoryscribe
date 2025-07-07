import Anthropic from '@anthropic-ai/sdk';

export interface SensoryAnalysisRequest {
  text: string;
  genre: string;
  sense: string;
}

export interface SensoryAnalysisResponse {
  radar_scores: {
    sight: number;
    sound: number;
    touch: number;
    taste: number;
    smell: number;
  };
  feedback: string;
}

export async function analyzeSensoryDetails(
  request: SensoryAnalysisRequest,
  apiKey: string
): Promise<SensoryAnalysisResponse> {
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });
  const prompt = `You are an expert fiction editor specializing in sensory writing analysis. Analyze the following text for sensory details and provide constructive feedback.

TEXT TO ANALYZE:
"""
${request.text}
"""

GENRE: ${request.genre}
FOCUS SENSE: ${request.sense}

Please provide your analysis in the following JSON format:

{
  "radar_scores": {
    "sight": [score 1-10],
    "sound": [score 1-10], 
    "touch": [score 1-10],
    "taste": [score 1-10],
    "smell": [score 1-10]
  },
  "feedback": "[Single paragraph of writing suggestions specific to the genre and focus sense]"
}

SCORING CRITERIA (1-10 scale):
- 1-2: Minimal sensory details, mostly abstract or conceptual
- 3-4: Basic sensory details present but generic
- 5-6: Moderate sensory details with some specificity
- 7-8: Rich sensory details that enhance the narrative
- 9-10: Exceptional sensory immersion that serves the story

FEEDBACK GUIDELINES:
- Focus on how sensory details can enhance the ${request.genre} genre specifically
- ${request.sense !== 'All Senses' ? `Emphasize the ${request.sense} sense specifically` : 'Consider all five senses equally'}
- Provide specific, actionable suggestions
- Mention what's working well and what needs improvement
- Keep feedback to 100-150 words
- Be encouraging but constructive

GENRE-SPECIFIC CONSIDERATIONS:
- Romance: Sensory details should enhance emotional connection and intimacy
- Thriller: Use sensory cues to build tension and danger
- Fantasy: Sensory details aid worldbuilding and magical immersion
- Horror: Sensory elements should create atmosphere and dread
- Literary Fiction: Sensory details should serve character development and themes
- Mystery: Sensory clues should support plot development
- Science Fiction: Sensory details should enhance futuristic/alien environments

Return only the JSON response, no additional text.`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse the JSON response
    const analysis = JSON.parse(responseText) as SensoryAnalysisResponse;
    
    return analysis;
  } catch (error) {
    console.error('Error analyzing sensory details:', error);
    throw new Error('Failed to analyze sensory details');
  }
}