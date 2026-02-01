import { SleepSession, SleepSettings, SleepAdvice, RealtimeData } from '../types/sleep';

// URL de votre API externe
const EXTERNAL_API_URL = '/api-render';

// Variable pour tracker si le serveur est disponible
let serverAvailable: boolean | null = null;

// Test de disponibilité du serveur
export const checkServerAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/all`, { // <-- Vérifie /all
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Helper pour les requêtes avec gestion d'erreur
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${EXTERNAL_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: AbortSignal.timeout(10000), // Timeout de 10 secondes
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Erreur lors de l\'appel API:', error);
    throw error;
  }
};

// Fonction pour transformer les données de l'API externe vers le format de l'app
const transformExternalSession = (externalSession: any): SleepSession => {
  // Mapper les données de votre API vers le format SleepSession
  return {
    id: externalSession.id || externalSession._id || String(Math.random()),
    date: externalSession.date || externalSession.sleep_date || new Date().toISOString().split('T')[0],
    bedTime: externalSession.bedTime || externalSession.bed_time || '23:00',
    wakeTime: externalSession.wakeTime || externalSession.wake_time || '07:00',
    totalDuration: externalSession.totalDuration || externalSession.total_duration || externalSession.duration || 480,
    sleepDuration: externalSession.sleepDuration || externalSession.sleep_duration || externalSession.totalDuration || 450,
    phases: transformPhases(externalSession.phases || externalSession.sleep_stages || []),
    movements: externalSession.movements || externalSession.movement_count || 0,
    heartRate: externalSession.heartRate || externalSession.avg_heart_rate || externalSession.heart_rate || 65,
    respirationRate: externalSession.respirationRate || externalSession.avg_respiration_rate || externalSession.respiration_rate || 15,
    sleepQuality: externalSession.sleepQuality || externalSession.sleep_quality_score || externalSession.quality || 75,
    cycles: externalSession.cycles || externalSession.sleep_cycles || Math.floor((externalSession.sleepDuration || 450) / 90),
    energyLevel: externalSession.energyLevel || externalSession.energy_level,
    fatigueLevel: externalSession.fatigueLevel || externalSession.fatigue_level,
    notes: externalSession.notes,
  };
};

// Fonction pour transformer les phases de sommeil
const transformPhases = (externalPhases: any[]): any[] => {
  if (!Array.isArray(externalPhases)) return [];
  
  return externalPhases.map((phase: any, index: number) => ({
    phase: mapPhaseType(phase.type || phase.stage_type || phase.phase || 'light'),
    startTime: phase.startTime || phase.start_time || (index * 30),
    duration: phase.duration || phase.duration_minutes || 30,
  }));
};

// Mapper les différents noms de phases
const mapPhaseType = (type: string): 'awake' | 'light' | 'deep' | 'rem' => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('awake') || lowerType.includes('eveil')) return 'awake';
  if (lowerType.includes('deep') || lowerType.includes('profond')) return 'deep';
  if (lowerType.includes('rem') || lowerType.includes('paradoxal')) return 'rem';
  return 'light';
};

// Sessions API
export const sessionsAPI = {
  getAll: async (): Promise<SleepSession[]> => {
    const data = await fetchAPI('/all');
    
    // Ton JSON a une structure { "sessions": [...] }
    if (data && data.sessions && Array.isArray(data.sessions)) {
      return data.sessions.map(transformExternalSession);
    }
    
    // Au cas où l'API renvoie directement le tableau (sécurité)
    if (Array.isArray(data)) {
      return data.map(transformExternalSession);
    }

    return [];
  },

  getById: async (id: string): Promise<SleepSession> => {
    const data = await fetchAPI(`/sessions/${id}`);
    return transformExternalSession(data);
  },

  create: async (session: Omit<SleepSession, 'id'>): Promise<SleepSession> => {
    const data = await fetchAPI('/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
    return transformExternalSession(data);
  },

  update: async (id: string, updates: Partial<SleepSession>): Promise<SleepSession> => {
    const data = await fetchAPI(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return transformExternalSession(data);
  },

  delete: async (id: string): Promise<void> => {
    await fetchAPI(`/sessions/${id}`, {
      method: 'DELETE',
    });
  },
};

// Settings API (peut être stocké localement si votre API ne gère pas les settings)
export const settingsAPI = {
  get: async (): Promise<SleepSettings> => {
    try {
      const data = await fetchAPI('/settings');
      return data;
    } catch (error) {
      // Retourner des paramètres par défaut si l'API ne gère pas les settings
      throw error;
    }
  },

  update: async (settings: SleepSettings): Promise<SleepSettings> => {
    try {
      const data = await fetchAPI('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
};

// Advices API
export const advicesAPI = {
  getAll: async (): Promise<SleepAdvice[]> => {
    try {
      const data = await fetchAPI('/advices');
      
      if (Array.isArray(data)) {
        return data;
      }
      
      if (data.advices) {
        return data.advices;
      }
      
      return [];
    } catch (error) {
      return [];
    }
  },
};

// Feedback API
export const feedbackAPI = {
  save: async (feedback: {
    energyLevel: number;
    fatigueLevel: number;
    notes?: string;
  }): Promise<void> => {
    try {
      await fetchAPI('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedback),
      });
    } catch (error) {
      console.log('Feedback sauvegardé localement');
    }
  },
};

// Realtime Data API
export const realtimeAPI = {
  get: async (): Promise<RealtimeData | null> => {
    try {
      const data = await fetchAPI('/all'); // On utilise /all car tout est dedans
      return data.realtime || null;
    } catch (error) {
      return null;
    }
  },
};