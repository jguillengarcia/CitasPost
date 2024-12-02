import React, { useState } from 'react';
import { Quote } from './types';
import { QuoteInput } from './components/QuoteInput';
import { QuoteList } from './components/QuoteList';
import { ImageCustomizer } from './components/ImageCustomizer';
import { ThemeToggle } from './components/ThemeToggle';
import { generateQuotes } from './services/groq';
import { generateUniqueId } from './lib/utils';

export default function App() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');

  const handleGenerateQuotes = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);
    try {
      const generatedQuotes = await generateQuotes(prompt);
      setQuotes(
        generatedQuotes.map((text) => ({
          id: generateUniqueId(),
          text,
        }))
      );
      setSelectedQuote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error inesperado');
      setQuotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateQuotes = () => {
    if (lastPrompt) {
      handleGenerateQuotes(lastPrompt);
    }
  };

  const handleDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    link.download = 'cita-imagen.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-400 italic">
            Creado por Jorge Guillén
          </p>
          <ThemeToggle />
        </div>
        
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 text-transparent bg-clip-text">
              ¿Qué harías si un solo post pudiera generar 10 piezas de contenido para tus redes?
            </h1>
          </div>

          <QuoteInput onGenerate={handleGenerateQuotes} isLoading={isLoading} />

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {quotes.length > 0 && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Selecciona una cita para personalizarla
                </h2>
                <button
                  onClick={handleRegenerateQuotes}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Volver a Generar
                </button>
              </div>

              <QuoteList
                quotes={quotes}
                selectedQuote={selectedQuote}
                onSelectQuote={setSelectedQuote}
                onUpdateQuote={(id, text) => {
                  setQuotes(quotes.map(q => q.id === id ? { ...q, text } : q));
                  if (selectedQuote?.id === id) {
                    setSelectedQuote({ ...selectedQuote, text });
                  }
                }}
              />

              {selectedQuote && (
                <section className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Personaliza tu Imagen
                  </h2>
                  <ImageCustomizer quote={selectedQuote.text} onDownload={handleDownload} />
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}