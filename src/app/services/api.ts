import { projectId, publicAnonKey } from '/utils/supabase/info';
import { SleepSession, SleepSettings, SleepAdvice, RealtimeData } from '../types/sleep';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c3b54980`;

// Variable pour tracker si le serveur est disponible
let serverAvailable: boolean | null = null;

// Test de disponibilité du serveur
export const checkServerAvailability = async (): Promise<boolean> => {
  if (serverAvailable !== null) {
    return serverAvailable;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(3000), // Timeout de 3 secondes
    });
    serverAvailable = response.ok;
    return serverAvailable;
  } catch (error) {
    serverAvailable = false;
    return false;
  }
};

// Helper pour les requêtes avec gestion d'erreur améliorée
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  // Vérifier d'abord si le serveur est disponible
  const isAvailable = await checkServerAvailability();
  if (!isAvailable) {
    throw new Error('Server offline');
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Id': 'default-user',
        ...options.headers,
      },
      signal: AbortSignal.timeout(5000), // Timeout de 5 secondes
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Ne pas logger les erreurs réseau
    throw error;
  }
};

// Sessions API
export const sessionsAPI = {
  getAll: async (): Promise<SleepSession[]> => {
    const data = await fetchAPI('/sessions');
    return data.sessions;
  },

  getById: async (id: string): Promise<SleepSession> => {
    const data = await fetchAPI(`/sessions/${id}`);
    return data.session;
  },

  create: async (session: Omit<SleepSession, 'id'>): Promise<SleepSession> => {
    const data = await fetchAPI('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
    return data.session;
  },

  update: async (id: string, updates: Partial<SleepSession>): Promise<SleepSession> => {
    const data = await fetchAPI(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.session;
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/sessions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Settings API
export const settingsAPI = {
  get: async (): Promise<SleepSettings> => {
    const data = await fetchAPI('/settings');
    return data.settings;
  },

  update: async (settings: SleepSettings): Promise<SleepSettings> => {
    const data = await fetchAPI('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return data.settings;
  },
};

// Advices API
export const advicesAPI = {
  getAll: async (): Promise<SleepAdvice[]> => {
    const data = await fetchAPI('/advices');
    return data.advices;
  },
};

// Feedback API
export const feedbackAPI = {
  save: async (feedback: {
    energyLevel: number;
    fatigueLevel: number;
    notes?: string;
  }): Promise<void> => {
    await fetchAPI('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },
};

// Realtime Data API
export const realtimeAPI = {
  get: async (): Promise<RealtimeData | null> => {
    try {
      const data = await fetchAPI('/realtime');
      return data.realtimeData;
    } catch (error) {
      throw error;
    }
  },
};

// External API Integration
export const externalAPI = {
  // Synchroniser les données depuis une API externe
  syncFromExternal: async (apiUrl: string, apiKey?: string): Promise<{ 
    message: string; 
    sessions: SleepSession[] 
  }> => {
    const data = await fetchAPI('/sync-external-api', {
      method: 'POST',
      body: JSON.stringify({ apiUrl, apiKey }),
    });
    return data;
  },
  
  // Webhook pour recevoir des données en temps réel (utilisé par l'appareil IoT)
  // Note: Cette fonction n'est pas utilisée directement dans le frontend
  // mais documente l'endpoint disponible pour les appareils externes
  webhookEndpoint: `${API_BASE_URL}/webhook/realtime`,
};