import React, { useState } from 'react';
import { generateFluxImage } from '../services/flux';
import { Loader2 } from 'lucide-react';

interface FluxImageGeneratorProps {
  text: string;
}

export function FluxImageGenerator({ text }: FluxImageGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [editedText, setEditedText] = useState(text);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const imageUrl = await generateFluxImage(prompt, editedText);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la imagen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="quote-text" className="block text-sm font-medium text-gray-700 mb-2">
          Texto a incluir en la imagen
        </label>
        <textarea
          id="quote-text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-vertical min-h-[100px]"
          placeholder="Edita el texto que aparecerá en la imagen..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Describe el entorno donde quieres que aparezca el texto
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: Una pared de ladrillo blanco con luz natural..."
          className="w-full p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-vertical min-h-[100px]"
          disabled={isLoading}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !prompt.trim()}
        className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generando...
          </>
        ) : (
          'Generar Imagen'
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="mt-4">
          <img
            src={generatedImage}
            alt="Imagen generada"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}