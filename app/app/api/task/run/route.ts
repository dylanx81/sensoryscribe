
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export const dynamic = 'force-dynamic'

interface RewriteSuggestion {
  original: string
  rewritten: string
  explanation: string
  sensesImproved: string[]
}

interface RewriteResponse {
  suggestions: RewriteSuggestion[]
  overallAnalysis: {
    weakAreas: string[]
    strengthAreas: string[]
    improvementSummary: string
  }
}

// Load research data
function loadResearchData() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'sensory_writing_research.json')
    const data = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading research data:', error)
    return null
  }
}

// Analyze text for sensory content (simplified version)
function analyzeSensoryContent(text: string) {
  const senses = {
    sight: 0,
    sound: 0,
    touch: 0,
    smell: 0,
    taste: 0
  }

  // Simple keyword-based analysis
  const sightWords = ['see', 'look', 'watch', 'observe', 'glance', 'stare', 'bright', 'dark', 'color', 'light', 'shadow', 'visible', 'appear', 'view', 'glimpse']
  const soundWords = ['hear', 'listen', 'sound', 'noise', 'whisper', 'shout', 'music', 'voice', 'echo', 'silence', 'bang', 'crash', 'hum', 'buzz', 'ring']
  const touchWords = ['feel', 'touch', 'smooth', 'rough', 'soft', 'hard', 'warm', 'cold', 'texture', 'pressure', 'grip', 'caress', 'brush', 'stroke']
  const smellWords = ['smell', 'scent', 'aroma', 'fragrance', 'odor', 'perfume', 'stench', 'whiff', 'sniff', 'inhale', 'sweet', 'bitter', 'fresh']
  const tasteWords = ['taste', 'flavor', 'sweet', 'sour', 'bitter', 'salty', 'spicy', 'delicious', 'mouth', 'tongue', 'swallow', 'chew', 'bite']

  const textLower = text.toLowerCase()
  
  sightWords.forEach(word => {
    const matches = (textLower.match(new RegExp(word, 'g')) || []).length
    senses.sight += matches
  })
  
  soundWords.forEach(word => {
    const matches = (textLower.match(new RegExp(word, 'g')) || []).length
    senses.sound += matches
  })
  
  touchWords.forEach(word => {
    const matches = (textLower.match(new RegExp(word, 'g')) || []).length
    senses.touch += matches
  })
  
  smellWords.forEach(word => {
    const matches = (textLower.match(new RegExp(word, 'g')) || []).length
    senses.smell += matches
  })
  
  tasteWords.forEach(word => {
    const matches = (textLower.match(new RegExp(word, 'g')) || []).length
    senses.taste += matches
  })

  return senses
}

// Generate rewrite suggestions using research data
async function generateRewriteSuggestions(text: string): Promise<RewriteResponse> {
  const researchData = loadResearchData()
  if (!researchData) {
    throw new Error('Could not load research data')
  }

  const sensoryAnalysis = analyzeSensoryContent(text)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  // Identify weak senses (below threshold)
  const threshold = 1
  const weakSenses = Object.entries(sensoryAnalysis)
    .filter(([sense, count]) => count < threshold)
    .map(([sense]) => sense)
  
  const strongSenses = Object.entries(sensoryAnalysis)
    .filter(([sense, count]) => count >= threshold)
    .map(([sense]) => sense)

  // If no weak senses, target all senses for improvement
  const targetSenses = weakSenses.length > 0 ? weakSenses : ['sight', 'sound', 'touch', 'smell', 'taste']

  const suggestions: RewriteSuggestion[] = []

  // Generate 3-4 specific rewrite suggestions
  const selectedSentences = sentences.slice(0, Math.min(4, sentences.length))
  
  for (let i = 0; i < selectedSentences.length && suggestions.length < 4; i++) {
    const sentence = selectedSentences[i].trim()
    if (sentence.length < 10) continue // Skip very short sentences
    
    const targetSense = targetSenses[i % targetSenses.length]
    
    let rewritten = sentence
    let explanation = `Enhanced ${targetSense} details for more immersive writing.`
    
    // Apply specific improvements based on the target sense
    switch (targetSense) {
      case 'sight':
        rewritten = addVisualDetails(sentence)
        explanation = `Added visual details like lighting, colors, and movement to make the scene more vivid.`
        break
      case 'sound':
        rewritten = addSoundDetails(sentence)
        explanation = `Incorporated auditory elements to create a richer soundscape.`
        break
      case 'touch':
        rewritten = addTactileDetails(sentence)
        explanation = `Added tactile sensations and textures to make the experience more tangible.`
        break
      case 'smell':
        rewritten = addOlfactoryDetails(sentence)
        explanation = `Included scent descriptions to evoke stronger emotional responses.`
        break
      case 'taste':
        rewritten = addTasteDetails(sentence)
        explanation = `Added taste elements to create a more immersive sensory experience.`
        break
    }
    
    suggestions.push({
      original: sentence,
      rewritten: rewritten,
      explanation: explanation,
      sensesImproved: [targetSense]
    })
  }

  return {
    suggestions,
    overallAnalysis: {
      weakAreas: weakSenses,
      strengthAreas: strongSenses,
      improvementSummary: `Focus on enhancing ${weakSenses.join(', ')} details. Your ${strongSenses.join(', ')} descriptions are already strong.`
    }
  }
}

// Helper functions to add sensory details
function addVisualDetails(sentence: string): string {
  const visualEnhancements = [
    ' bathed in golden afternoon light that cast long shadows,',
    ' illuminated by pale morning sunlight filtering through nearby windows,',
    ' shrouded in darkness that seemed to swallow details,',
    ' where bright colors danced in the shifting light,',
    ' revealed by the dim glow that painted everything in muted tones,'
  ]
  const enhancement = visualEnhancements[Math.floor(Math.random() * visualEnhancements.length)]
  return sentence.replace(/\.$/, '') + enhancement
}

function addSoundDetails(sentence: string): string {
  const soundEnhancements = [
    ' accompanied by the soft whisper of wind through leaves,',
    ' while distant voices echoed faintly in the background,',
    ' as footsteps clicked rhythmically against hard surfaces,',
    ' with the gentle hum of hidden machinery,',
    ' amid the rhythmic tapping of rain on nearby surfaces,'
  ]
  const enhancement = soundEnhancements[Math.floor(Math.random() * soundEnhancements.length)]
  return sentence.replace(/\.$/, '') + enhancement
}

function addTactileDetails(sentence: string): string {
  const tactileEnhancements = [
    ' while rough textures scraped against exposed skin,',
    ' as smooth surfaces felt surprisingly cool to the touch,',
    ' with warmth radiating from nearby heated surfaces,',
    ' where soft fabric yielded under gentle pressure,',
    ' as cold metal sent shivers through sensitive fingertips,'
  ]
  const enhancement = tactileEnhancements[Math.floor(Math.random() * tactileEnhancements.length)]
  return sentence.replace(/\.$/, '') + enhancement
}

function addOlfactoryDetails(sentence: string): string {
  const smellEnhancements = [
    ' while the air carried hints of jasmine and morning dew,',
    ' as a faint aroma of fresh coffee lingered nearby,',
    ' with the scent of rain on hot pavement filling the air,',
    ' where sweet fragrance drifted from hidden flowers,',
    ' as the musty smell of old books pervaded the space,'
  ]
  const enhancement = smellEnhancements[Math.floor(Math.random() * smellEnhancements.length)]
  return sentence.replace(/\.$/, '') + enhancement
}

function addTasteDetails(sentence: string): string {
  const tasteEnhancements = [
    ' while the metallic taste of anxiety lingered,',
    ' as unexpected sweetness seemed to coat the tongue,',
    ' with a bitter aftertaste that refused to fade,',
    ' where the salty tang of ocean air was unmistakable,',
    ' as rich, complex flavors burst across the palate,'
  ]
  const enhancement = tasteEnhancements[Math.floor(Math.random() * tasteEnhancements.length)]
  return sentence.replace(/\.$/, '') + enhancement
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { taskType, text } = body

    if (!taskType || !text) {
      return NextResponse.json(
        { error: 'taskType and text are required' },
        { status: 400 }
      )
    }

    if (taskType === 'rewrite_suggester') {
      const result = await generateRewriteSuggestions(text)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Unsupported task type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in task/run:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
