import Anthropic from '@anthropic-ai/sdk';

const apiKey = process.env.ANTHROPIC_API_KEY || '';

export const anthropic = new Anthropic({
  apiKey,
  // Use browser-side only if explicitly requested, but usually server-side.
  // Since this is a client-side app, we might need a proxy.
  // But for now, we'll just initialize it.
  dangerouslyAllowBrowser: true, 
});
