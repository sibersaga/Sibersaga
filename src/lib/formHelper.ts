import fs from 'fs/promises';
import path from 'path';

export interface GoogleIntegrationConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  formId: string;
  formUrl: string;
  formPublicUrl: string;
  isActive: boolean;
}

const CONFIG_PATH = path.join(process.cwd(), 'src', 'data', 'googleIntegration.json');

// Read integration configuration
export async function readConfig(): Promise<GoogleIntegrationConfig> {
  try {
    const data = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading googleIntegration.json:', error);
    return {
      spreadsheetId: '',
      spreadsheetUrl: '',
      formId: '',
      formUrl: '',
      formPublicUrl: '',
      isActive: false
    };
  }
}

// Write integration configuration
export async function writeConfig(config: GoogleIntegrationConfig): Promise<boolean> {
  try {
    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing googleIntegration.json:', error);
    return false;
  }
}

// Fetch Google Form and parse field entry IDs
export async function parseFormEntryIds(formId: string): Promise<Record<string, string>> {
  const entryMap: Record<string, string> = {};
  try {
    const url = `https://docs.google.com/forms/d/e/${formId}/viewform`;
    console.log(`Fetching public Google Form from: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch form page: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Look for FB_PUBLIC_LOAD_DATA_
    const match = html.match(/FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);/);
    if (!match) {
      console.warn('Could not find FB_PUBLIC_LOAD_DATA_ in Google Form HTML');
      return entryMap;
    }
    
    const rawData = match[1].trim();
    const data = JSON.parse(rawData);
    
    // Items are at index 1 of the parsed FB_PUBLIC_LOAD_DATA_
    const items = data[1] || [];
    for (const item of items) {
      const itemTitle = item[1]; // Question title
      if (!itemTitle) continue;
      
      const info = item[4];
      if (!info || !info[0]) continue;
      
      const questionData = info[0];
      const entryContainer = questionData[4];
      if (entryContainer && entryContainer[0]) {
        const entryId = entryContainer[0][0];
        if (entryId) {
          entryMap[itemTitle.trim().toLowerCase()] = `entry.${entryId}`;
        }
      }
    }
    
    console.log(`Parsed form entry mapping:`, entryMap);
  } catch (err) {
    console.error('Error parsing Google Form HTML:', err);
  }
  return entryMap;
}

// Fuzzy find an entry key from the map based on title keywords
export function findEntryKey(entryMap: Record<string, string>, keywords: string[]): string | undefined {
  for (const [title, entry] of Object.entries(entryMap)) {
    if (keywords.some(kw => title.includes(kw))) {
      return entry;
    }
  }
  return undefined;
}
