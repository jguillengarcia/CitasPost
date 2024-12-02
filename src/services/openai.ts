import OpenAI from 'openai';
import { config } from '../config/env';

if (!config.openai.apiKey) {
  throw new Error('OpenAI API key is not configured in environment variables');
}

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
  dangerouslyAllowBrowser: true,
});

export async function generateQuotes(prompt: string): Promise<string[]> {
  try {
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: [
        {
          role: 'system',
          content: 'You are a creative quote generator. Generate 10 unique, inspiring, and shareable quotes based on the given topic or post. Each quote should be concise and meaningful. Separate quotes with "|" character. Recuerda: no enumeres las citas.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content || '';
    return content.split('|').map(quote => quote.trim()).filter(Boolean);
  } catch (error) {
    console.error('Error generating quotes:', error);
    throw new Error('Failed to generate quotes. Please try again.');
  }
}