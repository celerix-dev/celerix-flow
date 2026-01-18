import { getClientID } from '@/utils/persona';

export const storageService = {
  async save<T>(key: string, data: T): Promise<void> {
    try {
      console.log(`Saving ${key} to Celerix Flow backend...`);
      const path = key === 'KANBAN' ? '/api/kanban' : `/api/store/${key}`;

      if (path) {
        const response = await fetch(path, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Client-ID': getClientID(),
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
           throw new Error(`Failed to save ${key}: ${response.statusText}`);
        }
      } else {
        console.warn(`Storage: key ${key} not explicitly handled by flow API yet`);
      }
    } catch (e) {
      console.error(`Failed to save ${key}`, e);
      throw e;
    }
  },

  async load<T>(key: string): Promise<T | null> {
    try {
      console.log(`Loading ${key} from Celerix Flow backend...`);
      const path = key === 'KANBAN' ? '/api/kanban' : `/api/store/${key}`;

      if (path) {
        const response = await fetch(path, {
          headers: {
            'X-Client-ID': getClientID(),
          },
        });
        if (response.ok) {
          const text = await response.text();
          try {
            return JSON.parse(text);
          } catch (e) {
            console.error(`Failed to parse JSON for ${key}. Body:`, text.substring(0, 100));
            return null;
          }
        }
        if (response.status === 404) {
           return null;
        }
      }
      return null;
    } catch (e) {
      console.error(`Failed to load ${key}:`, e);
      throw e;
    }
  }
};
