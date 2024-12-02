import React, { useState } from 'react';
import { Quote } from '../types';
import { Check, Edit2, Save } from 'lucide-react';

interface QuoteListProps {
  quotes: Quote[];
  selectedQuote: Quote | null;
  onSelectQuote: (quote: Quote) => void;
  onUpdateQuote: (id: string, text: string) => void;
}

export function QuoteList({ quotes, selectedQuote, onSelectQuote, onUpdateQuote }: QuoteListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (quote: Quote) => {
    setEditingId(quote.id);
    setEditText(quote.text);
  };

  const handleSave = (id: string) => {
    if (editText.trim()) {
      onUpdateQuote(id, editText.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className={`p-4 rounded-lg border transition-all ${
            selectedQuote?.id === quote.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800'
          }`}
        >
          {editingId === quote.id ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border rounded-lg resize-none h-32 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                autoFocus
              />
              <button
                onClick={() => handleSave(quote.id)}
                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <button
                onClick={() => onSelectQuote(quote)}
                className="flex-grow text-left text-sm dark:text-white"
              >
                {quote.text}
              </button>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleEdit(quote)}
                  className="p-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {selectedQuote?.id === quote.id && (
                  <Check className="w-5 h-5 text-blue-500" />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}