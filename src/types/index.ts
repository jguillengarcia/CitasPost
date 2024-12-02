export interface Quote {
  id: string;
  text: string;
}

export interface ImageFormat {
  id: string;
  name: string;
  width: number;
  height: number;
}

export interface TextPosition {
  x: number;
  y: number;
}

export interface BackgroundOption {
  type: 'color' | 'image';
  value: string;
}