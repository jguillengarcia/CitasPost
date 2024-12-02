import * as fal from '@fal-ai/serverless-client';
import { config } from '../config/env';

if (!config.flux.apiKey) {
  throw new Error('FLUX API key is not configured in environment variables');
}

fal.config({ credentials: config.flux.apiKey });

export async function generateFluxImage(prompt: string, text: string): Promise<string> {
  try {
    const result = await fal.subscribe('fal-ai/flux-pro/v1.1-ultra', {
      input: {
        prompt: `${prompt} con las palabras exactas "${text}" integradas de manera natural en la escena`,
        num_images: 1,
        aspect_ratio: '16:9',
        safety_tolerance: "2",
        output_format: "jpeg",
      },
    });

    if (!result.images?.[0]?.url) {
      throw new Error('No se pudo generar la imagen');
    }

    return result.images[0].url;
  } catch (error) {
    console.error('Error generating image with FLUX:', error);
    throw new Error('Error al generar la imagen con FLUX');
  }
}