import { SleepSession, SleepSettings, SleepAdvice, RealtimeData } from '../types/sleep';

// Génération de données mockées pour l'historique
export const generateMockSessions = (): SleepSession[] => {
  const sessions: SleepSession[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const bedHour = 22 + Math.floor(Math.random() * 2);
    const bedMinute = Math.floor(Math.random() * 60);
    const wakeHour = 6 + Math.floor(Math.random() * 2);
    const wakeMinute = Math.floor(Math.random() * 60);
    
    const totalMinutes = (wakeHour * 60 + wakeMinute) - (bedHour * 60 + bedMinute) + (wakeHour < bedHour ? 24 * 60 : 0);
    const sleepMinutes = totalMinutes - Math.floor(Math.random() * 30 + 10);
    
    const cycles = Math.floor(sleepMinutes / 90);
    
    // Générer les phases de sommeil
    const phases = generateSleepPhases(sleepMinutes, cycles);
    
    sessions.push({
      id: `session-${i}`,
      date: date.toISOString().split('T')[0],
      bedTime: `${bedHour.toString().padStart(2, '0')}:${bedMinute.toString().padStart(2, '0')}`,
      wakeTime: `${wakeHour.toString().padStart(2, '0')}:${wakeMinute.toString().padStart(2, '0')}`,
      totalDuration: totalMinutes,
      sleepDuration: sleepMinutes,
      phases,
      movements: Math.floor(Math.random() * 50 + 10),
      heartRate: Math.floor(Math.random() * 10 + 55),
      respirationRate: Math.floor(Math.random() * 4 + 14),
      sleepQuality: Math.floor(Math.random() * 30 + 70),
      cycles,
      energyLevel: Math.floor(Math.random() * 3 + 7),
      fatigueLevel: Math.floor(Math.random() * 4 + 2),
    });
  }
  
  return sessions;
};

const generateSleepPhases = (totalMinutes: number, cycles: number) => {
  const phases: any[] = [];
  let currentTime = 0;
  
  // Période d'endormissement
  phases.push({
    phase: 'awake',
    startTime: currentTime,
    duration: Math.floor(Math.random() * 15 + 5),
  });
  currentTime += phases[phases.length - 1].duration;
  
  // Cycles de sommeil
  for (let i = 0; i < cycles; i++) {
    // Sommeil léger
    const lightDuration = Math.floor(Math.random() * 20 + 30);
    phases.push({
      phase: 'light',
      startTime: currentTime,
      duration: lightDuration,
    });
    currentTime += lightDuration;
    
    // Sommeil profond (plus au début de la nuit)
    const deepDuration = Math.floor(Math.random() * 15 + (i < 2 ? 20 : 10));
    phases.push({
      phase: 'deep',
      startTime: currentTime,
      duration: deepDuration,
    });
    currentTime += deepDuration;
    
    // REM (plus vers la fin de la nuit)
    const remDuration = Math.floor(Math.random() * 15 + (i > 2 ? 15 : 10));
    phases.push({
      phase: 'rem',
      startTime: currentTime,
      duration: remDuration,
    });
    currentTime += remDuration;
  }
  
  // Sommeil léger avant réveil
  if (currentTime < totalMinutes) {
    phases.push({
      phase: 'light',
      startTime: currentTime,
      duration: totalMinutes - currentTime,
    });
  }
  
  return phases;
};

export const mockSettings: SleepSettings = {
  targetCycles: 5,
  targetBedTime: '23:00',
  targetWakeTime: '07:00',
  enableNotifications: true,
  enableSmartAlarm: true,
  theme: 'auto',
  fatigueThreshold: 6,
  connectedDevice: 'Smart Pillow v2',
};

export const mockAdvices: SleepAdvice[] = [
  {
    id: '1',
    title: 'Horaire de coucher optimal',
    description: 'Basé sur vos données, vous devriez vous coucher vers 22:45 pour atteindre 5 cycles complets.',
    category: 'bedtime',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Sieste recommandée',
    description: 'Votre niveau d\'énergie est bas. Une sieste de 20 minutes vers 14:30 serait bénéfique.',
    category: 'nap',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Améliorer le sommeil profond',
    description: 'Votre sommeil profond est en dessous de la moyenne. Évitez les écrans 1h avant de dormir.',
    category: 'lifestyle',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Température de la chambre',
    description: 'Une température entre 16-19°C favorise un sommeil de qualité.',
    category: 'environment',
    priority: 'low',
  },
  {
    id: '5',
    title: 'Régularité du sommeil',
    description: 'Essayez de vous coucher et vous lever à heures fixes, même le week-end.',
    category: 'lifestyle',
    priority: 'medium',
  },
];

export const mockRealtimeData: RealtimeData = {
  isAsleep: true,
  currentPhase: 'deep',
  heartRate: 58,
  respirationRate: 15,
  movements: 3,
  elapsedTime: 245,
  estimatedCycles: 2,
};
