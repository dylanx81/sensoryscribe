'use client';

interface FeedbackPanelProps {
  feedback?: string;
  isLoading?: boolean;
}

export default function FeedbackPanel({ feedback, isLoading = false }: FeedbackPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-white">AI Feedback</h3>
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-600 h-4 rounded"></div>
          <div className="animate-pulse bg-gray-600 h-4 rounded w-3/4"></div>
          <div className="animate-pulse bg-gray-600 h-4 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="font-semibold mb-2 text-white">AI Feedback</h3>
        <div className="text-gray-400 text-sm">
          <p>Submit your text to receive personalized suggestions for improving sensory details in your writing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="font-semibold mb-2 text-white">AI Feedback</h3>
      <div className="text-gray-200 text-sm leading-relaxed">
        <p>{feedback}</p>
      </div>
    </div>
  );
}