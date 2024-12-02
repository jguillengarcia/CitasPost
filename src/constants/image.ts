import { ImageFormat } from '../types';

export const IMAGE_FORMATS: ImageFormat[] = [
  { id: 'square', name: '1:1', width: 1080, height: 1080 },
  { id: 'landscape', name: '16:9', width: 1920, height: 1080 },
  { id: 'portrait', name: '9:16', width: 1080, height: 1920 },
];

export const PRESET_COLORS = [
  '#1a365d', // Deep Blue
  '#2d3748', // Gray Blue
  '#742a2a', // Deep Red
  '#22543d', // Deep Green
  '#744210', // Deep Orange
  '#2a4365', // Royal Blue
  '#1a202c', // Almost Black
  '#702459', // Deep Purple
] as const;

export const PRESET_IMAGES = {
  naturaleza: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e'
  ],
  ciudad: [
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000',
    'https://images.unsplash.com/photo-1460472178825-e5240623afd5',
    'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b'
  ],
  abstracto: [
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
    'https://images.unsplash.com/photo-1550537687-c91072c4792d',
    'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7',
    'https://images.unsplash.com/photo-1558470598-a5dda9640f68'
  ],
  minimalista: [
    'https://images.unsplash.com/photo-1557683316-973673baf926',
    'https://images.unsplash.com/photo-1557683311-eac922347aa1',
    'https://images.unsplash.com/photo-1557682260-96773eb01377',
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85'
  ],
  motivacional: [
    'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc',
    'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5',
    'https://images.unsplash.com/photo-1488085061387-422e29b40080',
    'https://images.unsplash.com/photo-1497032205916-ac775f0649ae'
  ]
} as const;