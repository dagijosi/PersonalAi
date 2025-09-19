import React, { useEffect, useState } from 'react';
import { useNoteStore } from '../store/useNoteStore';
import { fetchAISummary } from '../api/ai';
import { FiLoader, FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const NoteSummary: React.FC = () => {
  const { notes } = useNoteStore();
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    const generateWeeklySummary = async () => {
      setIsLoading(true);
      setError(null);
      setSummary(null);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weeklyNotesContent = notes
        .filter(note => new Date(note.createdAt) >= oneWeekAgo)
        .map(note => `Title: ${note.title}\nContent: ${note.content}`)
        .join('\n\n---\n\n');

      if (!weeklyNotesContent) {
        setSummary("No notes from the last week to summarize.");
        setIsLoading(false);
        return;
      }

      try {
        const aiSummary = await fetchAISummary(weeklyNotesContent);
        setSummary(aiSummary);
      } catch (err) {
        console.error("Error generating weekly note summary:", err);
        setError("Failed to generate weekly summary. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    generateWeeklySummary();
  }, [notes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4 bg-[--color-card] rounded-lg shadow-sm mb-6">
        <FiLoader className="animate-spin mr-2 text-[--color-primary]" />
        <p className="text-[--color-card-foreground]">Generating weekly notes summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-red-100 rounded-lg shadow-sm mb-6">
        <FiInfo className="mr-2 text-red-500" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="p-4 bg-[--color-card] rounded-lg shadow-sm mb-6 border border-[--color-border]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-[--color-primary]">Weekly Notes Summary</h2>
        {summary && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-[--color-primary] hover:text-[--color-primary-foreground] hover:bg-[--color-primary] p-1 rounded-full transition-colors duration-200"
            aria-expanded={!isCollapsed}
            aria-controls="note-summary-content"
          >
            {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
          </button>
        )}
      </div>
      <div
        id="note-summary-content"
        className={`overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-h-0' : 'max-h-full'}`}
      >
        <p className="text-[--color-card-foreground] text-sm space-y-1 pt-2 whitespace-pre-wrap">
          {summary.trim().replace(/\*\*/g, '')}
        </p>
      </div>
      {isCollapsed && summary && (
        <div className="text-center mt-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="text-[--color-primary] text-sm hover:underline"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteSummary;