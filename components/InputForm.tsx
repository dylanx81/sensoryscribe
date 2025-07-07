'use client';

import { useState } from 'react';

interface InputFormProps {
  onAnalyze: (data: {
    text: string;
    genre: string;
    sense: string;
  }) => void;
  isLoading?: boolean;
}

export default function InputForm({ onAnalyze, isLoading = false }: InputFormProps) {
  const [text, setText] = useState('');
  const [genre, setGenre] = useState('');
  const [sense, setSense] = useState('All Senses');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && genre) {
      onAnalyze({ text, genre, sense });
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-white">Input Panel</h2>
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
        
        <button 
          type="submit"
          disabled={isLoading || !text.trim() || !genre}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Sensory Details'}
        </button>
      </form>
    </div>
  );
}