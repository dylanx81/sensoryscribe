import Anthropic from '@anthropic-ai/sdk';

export interface RewriteRequest {
  originalText: string;
  genre: string;
  targetSense: string;
  currentScore: number;
}

export interface RewriteSuggestion {
  sense: string;
  originalSentences: string[];
  rewrittenSentences: string[];
  explanation: string;
  improvement: string;
}

export interface RewriteResponse {
  suggestions: RewriteSuggestion[];
  overallImprovement: string;
}

export async function generateRewriteSuggestions(
  request: RewriteRequest,
  apiKey: string
): Promise<RewriteSuggestion> {
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  const prompt = `You are an expert fiction editor specializing in sensory writing enhancement. Your task is to rewrite specific parts of the provided text to strengthen the ${request.targetSense} sense while maintaining the story's flow and style.

ORIGINAL TEXT:
"""
${request.originalText}
"""

GENRE: ${request.genre}
TARGET SENSE: ${request.targetSense}
CURRENT ${request.targetSense.toUpperCase()} SCORE: ${request.currentScore}/10

TASK: Enhance the ${request.targetSense} sensory details in this text.

Please provide your response in the following JSON format:

{
  "sense": "${request.targetSense}",
  "originalSentences": ["sentence1", "sentence2"],
  "rewrittenSentences": ["enhanced_sentence1", "enhanced_sentence2"],
  "explanation": "Brief explanation of what sensory elements were added",
  "improvement": "How this enhances the ${request.genre} genre specifically"
}

INSTRUCTIONS:
1. Identify 2-3 sentences that lack ${request.targetSense} details or could be enhanced
2. Rewrite them to include vivid, specific ${request.targetSense} sensory details
3. Maintain the original story's tone, style, and meaning
4. Make enhancements feel natural and integrated, not forced
5. Focus on ${request.genre}-appropriate sensory details

SENSE-SPECIFIC GUIDELINES:

SIGHT: Add colors, lighting, shapes, movement, expressions, visual textures, shadows, contrasts
SOUND: Include specific noises, volume levels, pitch, rhythm, echoes, silence, musical qualities  
TOUCH: Describe textures, temperatures, pressure, vibrations, pain, comfort, physical contact
TASTE: Add flavors (sweet, salty, bitter, sour, umami), aftertastes, food descriptions, metaphorical tastes
SMELL: Include specific scents, intensity, associations, pleasant/unpleasant odors, atmospheric smells

GENRE CONSIDERATIONS:
- Romance: Sensory details should enhance intimacy and emotional connection
- Thriller: Use sensory elements to build tension and danger
- Fantasy: Create otherworldly sensory experiences 
- Horror: Sensory details should create unease and atmospheric dread
- Literary Fiction: Sensory elements should reflect character psychology
- Mystery: Sensory clues should support investigation and atmosphere
- Science Fiction: Invent unique sensory experiences for futuristic/alien settings

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
    const suggestion = JSON.parse(responseText) as RewriteSuggestion;
    
    return suggestion;
  } catch (error) {
    console.error('Error generating rewrite suggestions:', error);
    throw new Error('Failed to generate rewrite suggestions');
  }
}

// Identify weak senses (scores below 6) for suggestion generation
export function getWeakSenses(scores: {
  sight: number;
  sound: number;
  touch: number;
  taste: number;
  smell: number;
}): Array<{ sense: string; score: number }> {
  const senseEntries = Object.entries(scores)
    .filter(([, score]) => score < 6)
    .map(([sense, score]) => ({ sense, score }))
    .sort((a, b) => a.score - b.score); // Sort by weakest first

  return senseEntries;
}

// Get sense display name with emoji
export function getSenseDisplayName(sense: string): string {
  const senseNames: Record<string, string> = {
    sight: '👁️ Sight',
    sound: '👂 Sound', 
    touch: '✋ Touch',
    taste: '👅 Taste',
    smell: '👃 Smell'
  };
  
  return senseNames[sense] || sense;
}

// Check if rewrite suggestions should be offered
export function shouldOfferSuggestions(scores: {
  sight: number;
  sound: number;
  touch: number;
  taste: number;
  smell: number;
}): boolean {
  const weakSenses = getWeakSenses(scores);
  return weakSenses.length > 0;
}

// Get improvement priority order for senses
export function getSensesPriorityOrder(scores: {
  sight: number;
  sound: number;
  touch: number;
  taste: number;
  smell: number;
}): string[] {
  return Object.entries(scores)
    .sort(([,a], [,b]) => a - b) // Sort by score ascending (weakest first)
    .map(([sense]) => sense);
}