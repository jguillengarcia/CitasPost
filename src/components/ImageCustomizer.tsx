import React, { useState, useRef, useCallback } from 'react';
import { ImageFormat, TextPosition, BackgroundOption } from '../types';
import { Download, AlignLeft, AlignCenter, AlignRight, RotateCw, Upload } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { cn } from '../lib/utils';
import { IMAGE_FORMATS, PRESET_COLORS, PRESET_IMAGES } from '../constants/image';

interface ImageCustomizerProps {
  quote: string;
  onDownload: (dataUrl: string) => void;
}

export function ImageCustomizer({ quote, onDownload }: ImageCustomizerProps) {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>(IMAGE_FORMATS[0]);
  const [background, setBackground] = useState<BackgroundOption>({ 
    type: 'image', 
    value: PRESET_IMAGES.naturaleza[0]
  });
  const [textPosition, setTextPosition] = useState<TextPosition>({ x: 50, y: 50 });
  const [fontSize, setFontSize] = useState(24);
  const [editedQuote, setEditedQuote] = useState(quote);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textIndent, setTextIndent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [textWidth, setTextWidth] = useState(300);
  const [isSelected, setIsSelected] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof PRESET_IMAGES>('naturaleza');
  const [customBackgroundColor, setCustomBackgroundColor] = useState('#1a365d');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const textRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const startTextPosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
      startPosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (e.target instanceof HTMLElement && e.target.classList.contains('rotate-handle')) {
      const rect = textRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        startPosRef.current = { x: angle, y: rotation };
      }
      return;
    }

    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startTextPosRef.current = { ...textPosition };
  }, [textPosition, rotation]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const containerRect = document.getElementById('quote-image')?.getBoundingClientRect();

      if (containerRect) {
        const deltaX = (dx / containerRect.width) * 100;
        const deltaY = (dy / containerRect.height) * 100;
        
        setTextPosition({
          x: Math.max(0, Math.min(100, startTextPosRef.current.x + deltaX)),
          y: Math.max(0, Math.min(100, startTextPosRef.current.y + deltaY)),
        });
      }
    }

    if (isResizing) {
      const dx = e.clientX - startPosRef.current.x;
      setTextWidth((prev) => Math.max(100, Math.min(800, prev + dx * 2)));
      startPosRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [isDragging, isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const handleDownload = async () => {
    const element = document.getElementById('quote-image');
    if (element) {
      try {
        const dataUrl = await htmlToImage.toPng(element);
        onDownload(dataUrl);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setBackground({ type: 'image', value: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {IMAGE_FORMATS.map((format) => (
          <button
            key={format.id}
            onClick={() => setSelectedFormat(format)}
            className={cn(
              "px-4 py-2 rounded-lg border-2",
              selectedFormat.id === format.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-white"
                : "border-gray-300 dark:border-gray-600 dark:text-gray-300"
            )}
          >
            {format.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fondo</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            {Object.keys(PRESET_IMAGES).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category as keyof typeof PRESET_IMAGES);
                  setBackground({ 
                    type: 'image', 
                    value: PRESET_IMAGES[category as keyof typeof PRESET_IMAGES][0] 
                  });
                }}
                className={cn(
                  "px-4 py-2 rounded-lg border-2",
                  selectedCategory === category
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-white"
                    : "border-gray-300 dark:border-gray-600 dark:text-gray-300"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {PRESET_IMAGES[selectedCategory].map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setBackground({ type: 'image', value: imageUrl })}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2",
                  background.type === 'image' && background.value === imageUrl
                    ? "border-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                )}
              >
                <img
                  src={imageUrl}
                  alt={`Fondo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color de Fondo</h3>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customBackgroundColor}
                  onChange={(e) => {
                    setCustomBackgroundColor(e.target.value);
                    setBackground({ type: 'color', value: e.target.value });
                  }}
                  className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">Seleccionar color</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subir Imagen</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-gray-300"
              >
                <Upload className="w-5 h-5" />
                <span>Subir imagen</span>
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color del Texto</h3>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">Seleccionar color</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Editar Texto</h3>
          <textarea
            value={editedQuote}
            onChange={(e) => setEditedQuote(e.target.value)}
            className="w-full p-4 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-vertical min-h-[100px]"
            placeholder="Edita tu cita aquí..."
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tamaño del Texto</h3>
          <input
            type="range"
            min="16"
            max="72"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alineación</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTextAlign('left')}
              className={cn(
                "p-2 rounded-lg border",
                textAlign === 'left' 
                  ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20" 
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              <AlignLeft className="w-5 h-5 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={cn(
                "p-2 rounded-lg border",
                textAlign === 'center' 
                  ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20" 
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              <AlignCenter className="w-5 h-5 dark:text-gray-300" />
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={cn(
                "p-2 rounded-lg border",
                textAlign === 'right' 
                  ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20" 
                  : "border-gray-300 dark:border-gray-600"
              )}
            >
              <AlignRight className="w-5 h-5 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div
          id="quote-image"
          style={{
            width: `${Math.min(500, selectedFormat.width)}px`,
            height: `${Math.min(500 * (selectedFormat.height / selectedFormat.width), selectedFormat.height)}px`,
            maxWidth: '100%',
            aspectRatio: `${selectedFormat.width} / ${selectedFormat.height}`,
            backgroundColor: background.type === 'color' ? background.value : undefined,
          }}
          className="relative overflow-hidden rounded-lg shadow-lg"
          onClick={() => setIsSelected(false)}
        >
          {background.type === 'image' && (
            <img
              src={background.value}
              alt="Fondo de la cita"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div
            ref={textRef}
            style={{
              left: `${textPosition.x}%`,
              top: `${textPosition.y}%`,
              fontSize: `${fontSize}px`,
              textAlign,
              transform: `translate(-50%, -50%) translateX(${textIndent}px) rotate(${rotation}deg)`,
              width: `${textWidth}px`,
              color: textColor,
            }}
            className={cn(
              "absolute p-6 font-bold shadow-text cursor-move select-none",
              isSelected && "outline outline-2 outline-blue-500"
            )}
            onMouseDown={handleMouseDown}
            onClick={(e) => {
              e.stopPropagation();
              setIsSelected(true);
            }}
          >
            {editedQuote}
            {isSelected && (
              <>
                <div
                  className="resize-handle absolute right-0 top-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-ew-resize transform translate-x-1/2 -translate-y-1/2"
                />
                <div
                  className="resize-handle absolute left-0 top-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-ew-resize transform -translate-x-1/2 -translate-y-1/2"
                />
                <div
                  className="rotate-handle absolute -top-6 left-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer transform -translate-x-1/2"
                >
                  <RotateCw className="w-4 h-4 text-white" />
                </div>
              </>
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-auto py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          Descargar Imagen
        </button>
      </div>
    </div>
  );
}