import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface QuoteInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

export function QuoteInput({ onGenerate, isLoading }: QuoteInputProps) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ingresa tu tema o publicación para generar citas..."
          className="w-full p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none min-h-[180px] text-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-lg text-lg font-medium"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Generando...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Generar</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}