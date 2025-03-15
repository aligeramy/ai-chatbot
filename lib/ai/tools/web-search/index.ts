import { openai } from '@ai-sdk/openai';

/**
 * Creates a web search tool using OpenAI's web_search_preview
 * This tool allows the model to search the web for up-to-date information
 * 
 * @param options Configuration options for the web search
 * @returns The web search tool
 */
export const webSearch = (options?: {
  searchContextSize?: 'low' | 'medium' | 'high';
  userLocation?: {
    type: 'approximate';
    city: string;
    region: string;
  };
}) => {
  return {
    web_search_preview: openai.tools.webSearchPreview(options),
  };
}; 