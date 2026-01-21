import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Moon, Heart, Activity, TrendingUp, Calendar } from 'lucide-react';
import { SleepSession } from '../types/sleep';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface HistoryListProps {
  sessions: SleepSession[];
  onSelectSession: (session: SleepSession) => void;
}

export function HistoryList({ sessions, onSelectSession }: HistoryListProps) {
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    } else {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600 bg-green-50';
    if (quality >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getQualityLabel = (quality: number) => {
    if (quality >= 80) return 'Excellent';
    if (quality >= 60) return 'Bon';
    return 'Améliorable';
  };

  // Filtrer les sessions
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (filter === 'week') return daysDiff < 7;
    if (filter === 'month') return daysDiff < 30;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl mb-2">Historique du sommeil</h1>
          <p className="text-gray-600">{filteredSessions.length} nuit{filteredSessions.length > 1 ? 's' : ''} enregistrée{filteredSessions.length > 1 ? 's' : ''}</p>
        </div>
        
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les nuits</SelectItem>
            <SelectItem value="week">7 derniers jours</SelectItem>
            <SelectItem value="month">30 derniers jours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredSessions.map((session) => (
          <Card 
            key={session.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelectSession(session)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {/* Date et heure */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <h3 className="font-semibold capitalize">{formatDate(session.date)}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {session.bedTime} → {session.wakeTime}
                  </p>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Moon className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">Durée</p>
                    </div>
                    <p className="font-semibold">{formatDuration(session.sleepDuration)}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">Cycles</p>
                    </div>
                    <p className="font-semibold">{session.cycles}</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Heart className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">Cœur</p>
                    </div>
                    <p className="font-semibold">{session.heartRate} bpm</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <TrendingUp className="w-3 h-3 text-gray-500" />
                      <p className="text-xs text-gray-600">Qualité</p>
                    </div>
                    <p className={`font-semibold px-2 py-1 rounded-full text-sm ${getQualityColor(session.sleepQuality)}`}>
                      {session.sleepQuality}%
                    </p>
                  </div>
                </div>

                {/* Badge qualité */}
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getQualityColor(session.sleepQuality)}`}>
                    {getQualityLabel(session.sleepQuality)}
                  </span>
                </div>
              </div>

              {/* Feedback utilisateur si disponible */}
              {(session.energyLevel || session.fatigueLevel) && (
                <div className="mt-4 pt-4 border-t flex gap-6">
                  {session.energyLevel && (
                    <div className="text-sm">
                      <span className="text-gray-600">Énergie: </span>
                      <span className="font-semibold text-green-600">{session.energyLevel}/10</span>
                    </div>
                  )}
                  {session.fatigueLevel && (
                    <div className="text-sm">
                      <span className="text-gray-600">Fatigue: </span>
                      <span className="font-semibold text-orange-600">{session.fatigueLevel}/10</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredSessions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Moon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucune session de sommeil pour cette période</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
