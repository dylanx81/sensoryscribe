'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { saveDraft, getLatestDraft, getDrafts, formatDraftDate, SensoryDraft, canUseApp } from '@/lib/localStorage';

interface InputFormProps {
  onAnalyze: (data: {
    text: string;
    genre: string;
    sense: string;
  }) => void;
  isLoading?: boolean;
  onDraftLoaded?: (draft: SensoryDraft) => void;
}

export default function InputForm({ onAnalyze, isLoading = false, onDraftLoaded }: InputFormProps) {
  const [text, setText] = useState('');
  const [genre, setGenre] = useState('');
  const [sense, setSense] = useState('All Senses');
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState<SensoryDraft[]>([]);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && genre) {
      onAnalyze({ text, genre, sense });
    }
  };

  const handleSaveDraft = () => {
    if (!text.trim() || !genre) {
      setSaveMessage('Please enter text and select a genre before saving.');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    const success = saveDraft({ text, genre, sense });
    if (success) {
      setSaveMessage('Draft saved successfully!');
      setDrafts(getDrafts()); // Refresh drafts list
    } else {
      setSaveMessage('Failed to save draft. Please try again.');
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleLoadDraft = (draft: SensoryDraft) => {
    setText(draft.text);
    setGenre(draft.genre);
    setSense(draft.sense);
    setShowDrafts(false);
    
    // If the draft has analysis results, load them too
    if (draft.analysis && onDraftLoaded) {
      onDraftLoaded(draft);
    }

    setSaveMessage('Draft loaded successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleLoadLatest = () => {
    const latest = getLatestDraft();
    if (latest) {
      handleLoadDraft(latest);
    } else {
      setSaveMessage('No saved drafts found.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Input Panel</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleLoadLatest}
            disabled={isLoading}
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
          >
            Load Latest
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowDrafts(!showDrafts)}
            disabled={isLoading}
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
          >
            All Drafts ({drafts.length})
          </Button>
        </div>
      </div>

      {/* Save/Load Message */}
      {saveMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          saveMessage.includes('success') 
            ? 'bg-green-900 border border-green-700 text-green-200'
            : 'bg-yellow-900 border border-yellow-700 text-yellow-200'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Drafts List */}
      {showDrafts && (
        <div className="mb-4 bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-300 mb-2">Saved Drafts</h3>
          {drafts.length === 0 ? (
            <p className="text-sm text-gray-400">No saved drafts yet.</p>
          ) : (
            <div className="space-y-2">
              {drafts.map((draft, index) => (
                <div
                  key={draft.timestamp}
                  className="flex justify-between items-start p-2 bg-gray-600 rounded cursor-pointer hover:bg-gray-500 transition-colors"
                  onClick={() => handleLoadDraft(draft)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">
                      {draft.text.slice(0, 50)}...
                    </p>
                    <p className="text-xs text-gray-400">
                      {draft.genre} • {draft.sense} • {formatDraftDate(draft.timestamp)}
                    </p>
                  </div>
                  <div className="ml-2 text-xs text-gray-400">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-64 p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Paste your fiction text here for sensory analysis..."
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            {text.length} characters
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre
            </label>
            <select 
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Genre</option>
              <option value="Romance">Romance</option>
              <option value="Thriller">Thriller</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Horror">Horror</option>
              <option value="Literary Fiction">Literary Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Science Fiction">Science Fiction</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Focus Sense
            </label>
            <select 
              value={sense}
              onChange={(e) => setSense(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All Senses">All Senses</option>
              <option value="Sight">Sight</option>
              <option value="Sound">Sound</option>
              <option value="Touch">Touch</option>
              <option value="Taste">Taste</option>
              <option value="Smell">Smell</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading || !text.trim() || !genre || !canUseApp()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
          >
            {isLoading ? 'Analyzing...' : !canUseApp() ? 'Usage Limit Reached' : 'Analyze Sensory Details'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
          >
            Save Draft
          </Button>
        </div>
      </form>
    </div>
  );
}