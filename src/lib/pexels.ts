
import type { PexelsResponse, PexelsPhoto } from '@/types/pexels';

const PEXELS_API_URL = 'https://api.pexels.com/v1';
// This is a fallback key and should ideally not be used in production if a proper key is set via .env.local
const FALLBACK_API_KEY_CONSTANT = "lc7gpWWi2bcrekjM32zdi1s68YDYmEWMeudlsDNNMVEicIIke3G8Iamw";
const PLACEHOLDER_TEXT_PATTERN = /your_actual_pexels_api_key/i;

function getApiKey(): string | null {
  const context = typeof window === 'undefined' ? 'Server' : 'Client';
  let apiKey: string | undefined;

  if (context === 'Server') {
    apiKey = process.env.PEXELS_API_KEY;
  } else {
    // Client-side: next.config.js maps PEXELS_API_KEY to NEXT_PUBLIC_PEXELS_API_KEY
    apiKey = process.env.NEXT_PUBLIC_PEXELS_API_KEY;
  }

  // Check 1: Is the environment variable API key valid and not a placeholder?
  if (apiKey && apiKey.trim() !== "" && !PLACEHOLDER_TEXT_PATTERN.test(apiKey)) {
    return apiKey;
  }

  // Check 2: If env var is not valid, log a warning (dev only) and try the hardcoded FALLBACK_API_KEY_CONSTANT.
  const envKeyName = context === 'Server' ? 'PEXELS_API_KEY' : 'NEXT_PUBLIC_PEXELS_API_KEY';
  let problem = "missing or placeholder";
  if (apiKey && apiKey.trim() === "") problem = "empty";
  else if (apiKey && PLACEHOLDER_TEXT_PATTERN.test(apiKey)) problem = "a placeholder";
  
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[lib/pexels ${context}] Environment variable ${envKeyName} is ${problem}. Attempting to use hardcoded fallback PEXELS API key.`);
  }
  
  if (FALLBACK_API_KEY_CONSTANT && FALLBACK_API_KEY_CONSTANT.trim() !== "" && !PLACEHOLDER_TEXT_PATTERN.test(FALLBACK_API_KEY_CONSTANT)) {
    return FALLBACK_API_KEY_CONSTANT;
  }

  console.error(`[lib/pexels ${context}] Critical: No valid PEXELS_API_KEY found. Both environment variable and hardcoded fallback are invalid or missing. API calls will likely fail or use mock data.`);
  return null;
}

async function fetchPexelsAPI<T>(endpoint: string, cacheOption: RequestCache = 'no-store'): Promise<T | null> {
  const apiKeyToUse = getApiKey();

  if (!apiKeyToUse) {
    const context = typeof window === 'undefined' ? 'Server' : 'Client';
    const errorMessage = `[${context}] Pexels API key is not configured or available. Cannot make API calls. Ensure ${context === 'Server' ? 'PEXELS_API_KEY' : 'NEXT_PUBLIC_PEXELS_API_KEY'} is set in your .env.local file. Displaying mock data or failing.`;
    console.error(errorMessage);
    return null;
  }

  try {
    const response = await fetch(`${PEXELS_API_URL}${endpoint}`, {
      headers: {
        Authorization: apiKeyToUse,
      },
      cache: cacheOption, 
    });

    if (!response.ok) {
      let errorBodyText = "Could not read error body from Pexels API response.";
      try {
        errorBodyText = await response.text();
      } catch (textError) {
        // Non-critical
      }
      const detailedErrorMessage = `Pexels API Error: ${response.status} ${response.statusText}. Endpoint: ${PEXELS_API_URL}${endpoint}. Key Used: ${apiKeyToUse.substring(0,5)}... . Response: ${errorBodyText.substring(0, 200)}`;
      console.error(detailedErrorMessage);
      return null;
    }

    const responseText = await response.text();
    try {
      return JSON.parse(responseText) as T;
    } catch (jsonError) {
      console.error(`Pexels API Error: Failed to parse JSON response. Endpoint: ${PEXELS_API_URL}${endpoint}. Status: ${response.status}. Response: ${responseText.substring(0,500)}`, jsonError);
      return null;
    }

  } catch (error) {
    console.error(`Failed to fetch from Pexels API. Endpoint: ${PEXELS_API_URL}${endpoint}. Error:`, error);
    return null;
  }
}

export async function getCuratedPhotos(page: number = 1, perPage: number = 20): Promise<PexelsResponse | null> {
  // Curated photos can be cached more aggressively if desired, e.g. 'default' or 'force-cache'
  return fetchPexelsAPI<PexelsResponse>(`/curated?page=${page}&per_page=${perPage}`, 'default');
}

export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 20,
  orientation?: 'landscape' | 'portrait' | 'square'
): Promise<PexelsResponse | null> {
  let endpoint = `/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
  if (orientation) {
    endpoint += `&orientation=${orientation}`;
  }
  // Searches are typically dynamic, so 'no-store' is often appropriate
  return fetchPexelsAPI<PexelsResponse>(endpoint, 'no-store');
}

export async function getPhotoById(id: string): Promise<PexelsPhoto | null> {
  // Specific photo data might not change often, consider 'default'
  return fetchPexelsAPI<PexelsPhoto>(`/photos/${id}`, 'default');
}

