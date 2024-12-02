import React, { useState } from 'react';
import { generateFluxImage } from '../services/flux';
import { Loader2 } from 'lucide-react';

interface AIImageGeneratorProps {
  text: string;
}

const TEXT_STYLES = [
  'Grafiti',
  'Neón',
  '3D',
  'Letras de oro',
  'Caligrafía',
  'Texto simple'
] as const;

type TextStyle = typeof TEXT_STYLES[number];

export function AIImageGenerator({ text }: AIImageGeneratorProps) {
  const [location, setLocation] = useState('');
  const [textStyle, setTextStyle] = useState<TextStyle>('Texto simple');
  const [editedText, setEditedText] = useState(text);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!location.trim()) return;

    const prompt = `${location} con el siguiente texto "${editedText}" escrito en estilo ${textStyle} integrado de manera natural en la escena`;
    
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
        <label htmlFor="edited-text" className="block text-sm font-medium text-gray-700 mb-2">
          Texto a incluir en la imagen
        </label>
        <textarea
          id="edited-text"
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-vertical min-h-[100px]"
          placeholder="Edita el texto que aparecerá en la imagen..."
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación del texto
        </label>
        <input
          id="location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Describe la ubicación (ej: valla publicitaria, pared de ladrillos)"
          className="w-full p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="text-style" className="block text-sm font-medium text-gray-700 mb-2">
          Estilo del texto
        </label>
        <select
          id="text-style"
          value={textStyle}
          onChange={(e) => setTextStyle(e.target.value as TextStyle)}
          className="w-full p-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          disabled={isLoading}
        >
          {TEXT_STYLES.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading || !location.trim() || !editedText.trim()}
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
            alt="Imagen generada con IA"
            className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}