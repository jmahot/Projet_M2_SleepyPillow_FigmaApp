// Types pour l'application de suivi de sommeil

export interface SleepPhase {
  phase: 'awake' | 'light' | 'deep' | 'rem';
  startTime: number; // en minutes depuis le début
  duration: number; // en minutes
}

export interface SleepSession {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  totalDuration: number; // en minutes
  sleepDuration: number; // temps réellement endormi
  phases: SleepPhase[];
  movements: number;
  heartRate: number; // moyenne
  respirationRate: number; // moyenne
  sleepQuality: number; // score sur 100
  cycles: number;
  energyLevel?: number; // 1-10
  fatigueLevel?: number; // 1-10
  notes?: string;
}

export interface SleepSettings {
  targetCycles: number;
  targetBedTime: string;
  targetWakeTime: string;
  enableNotifications: boolean;
  enableSmartAlarm: boolean;
  theme: 'light' | 'dark' | 'auto';
  fatigueThreshold: number; // 1-10
  connectedDevice: string;
}

export interface SleepAdvice {
  id: string;
  title: string;
  description: string;
  category: 'bedtime' | 'wake' | 'nap' | 'lifestyle' | 'environment';
  priority: 'high' | 'medium' | 'low';
}

export interface RealtimeData {
  isAsleep: boolean;
  currentPhase: 'awake' | 'light' | 'deep' | 'rem';
  heartRate: number;
  respirationRate: number;
  movements: number;
  elapsedTime: number; // en minutes
  estimatedCycles: number;
}
