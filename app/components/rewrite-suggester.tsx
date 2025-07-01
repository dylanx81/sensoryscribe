
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Lightbulb, RefreshCw, ArrowRight, Target, TrendingUp } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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

export function RewriteSuggester() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<RewriteResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRewriteRequest = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/task/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType: 'rewrite_suggester',
          text: text.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate rewrite suggestions')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSenseColor = (sense: string) => {
    const colors = {
      sight: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      sound: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      touch: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      smell: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      taste: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    }
    return colors[sense as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Rewrite Suggester
          </CardTitle>
          <CardDescription>
            Get AI-powered suggestions to enhance the sensory details in your prose. 
            Enter your text below and receive specific rewrite recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your prose here... (minimum 100 characters for best results)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32 resize-none"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {text.length} characters
            </span>
            <Button 
              onClick={handleRewriteRequest}
              disabled={loading || text.length < 20}
              className="flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4" />
                  Get Suggestions
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert className="border-destructive">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          {/* Overall Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Areas to Strengthen</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.overallAnalysis.weakAreas.map((sense) => (
                      <Badge key={sense} variant="outline" className={getSenseColor(sense)}>
                        {sense}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Your Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.overallAnalysis.strengthAreas.map((sense) => (
                      <Badge key={sense} variant="default" className={getSenseColor(sense)}>
                        {sense}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">
                {results.overallAnalysis.improvementSummary}
              </p>
            </CardContent>
          </Card>

          {/* Rewrite Suggestions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Rewrite Suggestions</h3>
            
            {results.suggestions.map((suggestion, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Original Text */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Original:</h4>
                      <p className="text-sm bg-muted p-3 rounded-md">
                        {suggestion.original}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    
                    {/* Rewritten Text */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Suggested Rewrite:</h4>
                      <p className="text-sm bg-primary/10 p-3 rounded-md border-l-4 border-primary">
                        {suggestion.rewritten}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    {/* Explanation and Improved Senses */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">Improvement:</h4>
                        <p className="text-sm text-muted-foreground">
                          {suggestion.explanation}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.sensesImproved.map((sense) => (
                          <Badge 
                            key={sense} 
                            variant="secondary" 
                            className={`text-xs ${getSenseColor(sense)}`}
                          >
                            {sense}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
