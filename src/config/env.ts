interface Config {
  groq: {
    apiKey: string;
    model: string;
  };
  flux: {
    apiKey: string;
  };
}

export const config: Config = {
  groq: {
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    model: 'llama3-groq-70b-8192-tool-use-preview',
  },
  flux: {
    apiKey: import.meta.env.VITE_FLUX_API_KEY || '',
  },
};