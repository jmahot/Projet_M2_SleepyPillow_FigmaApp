import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, Moon, Heart, Wind, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SleepSession } from '../types/sleep';

interface SessionDetailProps {
  session: SleepSession;
  onBack: () => void;
}

export function SessionDetail({ session, onBack }: SessionDetailProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  // Préparer les données pour le graphique des phases
  const phaseChartData = session.phases.map((phase, index) => ({
    time: formatDuration(phase.startTime),
    phase: phase.phase === 'awake' ? 0 : 
           phase.phase === 'light' ? 1 : 
           phase.phase === 'rem' ? 2 : 3,
    phaseName: phase.phase === 'awake' ? 'Éveillé' :
               phase.phase === 'light' ? 'Léger' :
               phase.phase === 'rem' ? 'REM' : 'Profond',
    duration: phase.duration,
  }));

  // Statistiques par phase
  const phaseStats = {
    awake: session.phases.filter(p => p.phase === 'awake').reduce((acc, p) => acc + p.duration, 0),
    light: session.phases.filter(p => p.phase === 'light').reduce((acc, p) => acc + p.duration, 0),
    deep: session.phases.filter(p => p.phase === 'deep').reduce((acc, p) => acc + p.duration, 0),
    rem: session.phases.filter(p => p.phase === 'rem').reduce((acc, p) => acc + p.duration, 0),
  };

  const phaseStatsData = [
    { name: 'Éveillé', value: phaseStats.awake, color: '#e5e7eb' },
    { name: 'Léger', value: phaseStats.light, color: '#93c5fd' },
    { name: 'Profond', value: phaseStats.deep, color: '#3b82f6' },
    { name: 'REM', value: phaseStats.rem, color: '#1d4ed8' },
  ];

  const getQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-600';
    if (quality >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl capitalize">{formatDate(session.date)}</h1>
          <p className="text-gray-600">{session.bedTime} → {session.wakeTime}</p>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Moon className="w-4 h-4" />
              Durée totale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{formatDuration(session.sleepDuration)}</p>
            <p className="text-xs text-gray-600 mt-1">
              {formatDuration(session.totalDuration)} au lit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Qualité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl ${getQualityColor(session.sleepQuality)}`}>
              {session.sleepQuality}%
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {session.sleepQuality >= 80 ? 'Excellent' : session.sleepQuality >= 60 ? 'Bon' : 'Améliorable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Rythme cardiaque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{session.heartRate} bpm</p>
            <p className="text-xs text-gray-600 mt-1">Moyenne</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Cycles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{session.cycles}</p>
            <p className="text-xs text-gray-600 mt-1">cycles complets</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des phases */}
      <Card>
        <CardHeader>
          <CardTitle>Phases de sommeil</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={phaseChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis 
                ticks={[0, 1, 2, 3]}
                tickFormatter={(value) => 
                  value === 0 ? 'Éveillé' :
                  value === 1 ? 'Léger' :
                  value === 2 ? 'REM' : 'Profond'
                }
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold">{payload[0].payload.phaseName}</p>
                        <p className="text-sm text-gray-600">Début: {payload[0].payload.time}</p>
                        <p className="text-sm text-gray-600">Durée: {formatDuration(payload[0].payload.duration)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="stepAfter" 
                dataKey="phase" 
                stroke="#3b82f6" 
                fill="#93c5fd" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Répartition et métriques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Durée par phase */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des phases</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={phaseStatsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => formatDuration(value)}
                />
                <Bar dataKey="value" fill="#3b82f6">
                  {phaseStatsData.map((entry, index) => (
                    <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {phaseStatsData.map((stat) => (
                <div key={stat.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: stat.color }}
                  />
                  <div className="text-sm">
                    <span className="text-gray-600">{stat.name}: </span>
                    <span className="font-semibold">{formatDuration(stat.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Autres métriques */}
        <Card>
          <CardHeader>
            <CardTitle>Métriques détaillées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Mouvements</span>
              </div>
              <span className="font-semibold">{session.movements}</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Respiration</span>
              </div>
              <span className="font-semibold">{session.respirationRate} /min</span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Sommeil profond</span>
              </div>
              <span className="font-semibold">
                {formatDuration(phaseStats.deep)} ({Math.round(phaseStats.deep / session.sleepDuration * 100)}%)
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Sommeil REM</span>
              </div>
              <span className="font-semibold">
                {formatDuration(phaseStats.rem)} ({Math.round(phaseStats.rem / session.sleepDuration * 100)}%)
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Efficacité</span>
              </div>
              <span className="font-semibold">
                {Math.round(session.sleepDuration / session.totalDuration * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback utilisateur */}
      {(session.energyLevel || session.fatigueLevel || session.notes) && (
        <Card>
          <CardHeader>
            <CardTitle>Feedback utilisateur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.energyLevel && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Niveau d'énergie</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${session.energyLevel * 10}%` }}
                    />
                  </div>
                  <span className="font-semibold text-green-600">{session.energyLevel}/10</span>
                </div>
              </div>
            )}
            
            {session.fatigueLevel && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Niveau de fatigue</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${session.fatigueLevel * 10}%` }}
                    />
                  </div>
                  <span className="font-semibold text-orange-600">{session.fatigueLevel}/10</span>
                </div>
              </div>
            )}

            {session.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Notes</p>
                <p className="text-sm bg-gray-50 p-3 rounded">{session.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
