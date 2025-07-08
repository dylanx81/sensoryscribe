'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  getWeakSenses, 
  getSenseDisplayName, 
  shouldOfferSuggestions,
  RewriteSuggestion 
} from '@/lib/rewriteUtils';
import { Copy, Wand2, Check, Loader2 } from 'lucide-react';

interface RewriteSuggestionsProps {
  originalText: string;
  genre: string;
  radarScores: {
    sight: number;
    sound: number;
    touch: number;
    taste: number;
    smell: number;
  };
}

export default function RewriteSuggestions({ 
  originalText, 
  genre, 
  radarScores 
}: RewriteSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Record<string, RewriteSuggestion>>({});
  const [loadingSense, setLoadingSense] = useState<string | null>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState(false);

  const weakSenses = getWeakSenses(radarScores);
  const shouldShow = shouldOfferSuggestions(radarScores);

  if (!shouldShow) {
    return null;
  }

  const generateSuggestion = async (targetSense: string, currentScore: number) => {
    setLoadingSense(targetSense);
    
    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText,
          genre,
          targetSense,
          currentScore
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const suggestion: RewriteSuggestion = await response.json();
      setSuggestions(prev => ({ ...prev, [targetSense]: suggestion }));
    } catch (error) {
      console.error('Error generating suggestion:', error);
    } finally {
      setLoadingSense(null);
    }
  };

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, itemId]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const generateAllSuggestions = async () => {
    for (const { sense: weakSense, score } of weakSenses) {
      if (!suggestions[weakSense]) {
        await generateSuggestion(weakSense, score);
      }
    }
  };

  if (!showSuggestions) {
    return (
      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-200 mb-1">
                ✨ Rewrite Suggestions Available
              </h3>
              <p className="text-xs text-gray-400">
                {weakSenses.length} sense{weakSenses.length !== 1 ? 's' : ''} could be enhanced: {' '}
                {weakSenses.map(({ sense }) => getSenseDisplayName(sense)).join(', ')}
              </p>
            </div>
            <Button
              onClick={() => setShowSuggestions(true)}
              variant="outline"
              size="sm"
              className="bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Enhance Writing
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-200 flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Rewrite Suggestions
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={generateAllSuggestions}
              disabled={loadingSense !== null}
              variant="outline"
              size="sm"
              className="bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500"
            >
              Generate All
            </Button>
            <Button
              onClick={() => setShowSuggestions(false)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-200 hover:bg-gray-600"
            >
              ✕
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Enhance weak senses with vivid rewritten sentences
        </p>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={weakSenses[0]?.sense} className="w-full">
          <TabsList className="grid w-full grid-cols-auto bg-gray-600 mb-4">
            {weakSenses.map(({ sense, score }) => (
              <TabsTrigger
                key={sense}
                value={sense}
                className="text-xs data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
              >
                {getSenseDisplayName(sense)} ({score}/10)
              </TabsTrigger>
            ))}
          </TabsList>

          {weakSenses.map(({ sense, score }) => (
            <TabsContent key={sense} value={sense} className="space-y-4">
              {!suggestions[sense] ? (
                <div className="text-center py-8">
                  <Button
                    onClick={() => generateSuggestion(sense, score)}
                    disabled={loadingSense === sense}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loadingSense === sense ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Generate {getSenseDisplayName(sense)} Suggestions
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Explanation */}
                  <div className="bg-gray-600 rounded-lg p-3">
                    <h4 className="font-medium text-gray-200 mb-2">Enhancement Strategy</h4>
                    <p className="text-sm text-gray-300 mb-2">{suggestions[sense].explanation}</p>
                    <p className="text-xs text-gray-400 italic">{suggestions[sense].improvement}</p>
                  </div>

                  {/* Before/After Comparisons */}
                  {suggestions[sense].originalSentences.map((original, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-xs font-medium text-red-300 mb-1">Before:</h5>
                            <p className="text-sm text-gray-200">{original}</p>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(original, `original-${sense}-${index}`)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-200 ml-2"
                          >
                            {copiedItems.has(`original-${sense}-${index}`) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-xs font-medium text-green-300 mb-1">Enhanced:</h5>
                            <p className="text-sm text-gray-200">{suggestions[sense].rewrittenSentences[index]}</p>
                          </div>
                          <Button
                            onClick={() => copyToClipboard(suggestions[sense].rewrittenSentences[index], `rewritten-${sense}-${index}`)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-200 ml-2"
                          >
                            {copiedItems.has(`rewritten-${sense}-${index}`) ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Copy All Button */}
                  <div className="pt-2">
                    <Button
                      onClick={() => {
                        const allRewritten = suggestions[sense].rewrittenSentences.join('\n\n');
                        copyToClipboard(allRewritten, `all-${sense}`);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full bg-gray-600 border-gray-500 text-gray-200 hover:bg-gray-500"
                    >
                      {copiedItems.has(`all-${sense}`) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Copied All Enhanced Sentences!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy All Enhanced Sentences
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}