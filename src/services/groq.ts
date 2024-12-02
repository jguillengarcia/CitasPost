import Groq from 'groq-sdk';
import { config } from '../config/env';

if (!config.groq.apiKey) {
  throw new Error('Groq API key is not configured in environment variables');
}

const groq = new Groq({
  apiKey: config.groq.apiKey,
  dangerouslyAllowBrowser: true,
});

export async function generateQuotes(prompt: string): Promise<string[]> {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Eres un generador creativo de citas. Tu tarea es crear 10 citas originales, inspiradoras y altamente compartibles basadas en el tema o publicación proporcionada. Asegúrate de que cada cita sea concisa, impactante y significativa. Usa el carácter \'|\' para separarlas y evita numerarlas. Enfócate en lograr una mezcla de frases reflexivas, motivadoras y relevantes que conecten profundamente con el público. Ejemplos: - Tema: Crecimiento personal: "El cambio duele, pero quedarse inmóvil duele aún más." | "No busques perfección, busca progreso." | "Cada error es una página del libro de tu éxito." - Tema: Creatividad: "La creatividad no sigue reglas, crea las suyas propias." | "Imagina sin límites; solo así encontrarás lo imposible." | "El arte de innovar es el arte de soñar en voz alta."'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: "llama3-groq-70b-8192-tool-use-preview",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      stream: false
    });

    const content = chatCompletion.choices[0]?.message?.content || '';
    return content.split('|').map(quote => quote.trim()).filter(Boolean);
  } catch (error) {
    console.error('Error generating quotes:', error);
    throw new Error('No se pudieron generar las citas. Por favor, inténtalo de nuevo.');
  }
}