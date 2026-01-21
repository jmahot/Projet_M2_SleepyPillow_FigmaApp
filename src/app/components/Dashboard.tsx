import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Moon, Heart, Wind, Activity, Timer, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SleepSession, RealtimeData } from '../types/sleep';

interface DashboardProps {
  realtimeData?: RealtimeData;
  recentSessions: SleepSession[];
}

export function Dashboard({ realtimeData, recentSessions }: DashboardProps) {
  // Calculs des statistiques
  const avgSleepDuration = recentSessions.length > 0 
    ? Math.round(recentSessions.reduce((acc, s) => acc + s.sleepDuration, 0) / recentSessions.length)
    : 0;
  
  const avgQuality = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((acc, s) => acc + s.sleepQuality, 0) / recentSessions.length)
    : 0;
  
  const avgCycles = recentSessions.length > 0
    ? Math.round(recentSessions.reduce((acc, s) => acc + s.cycles, 0) / recentSessions.length * 10) / 10
    : 0;

  // Données pour le graphique des 7 derniers jours
  const last7Days = recentSessions.slice(0, 7).reverse().map(session => ({
    date: new Date(session.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    durée: Math.round(session.sleepDuration / 60 * 10) / 10,
    qualité: session.sleepQuality,
    cycles: session.cycles,
  }));

  // Répartition des phases de sommeil (moyenne)
  const phaseDistribution = recentSessions.length > 0 ? (() => {
    const totals = { light: 0, deep: 0, rem: 0, awake: 0 };
    recentSessions.slice(0, 7).forEach(session => {
      session.phases.forEach(phase => {
        totals[phase.phase] += phase.duration;
      });
    });
    return [
      { name: 'Léger', value: Math.round(totals.light / 7), color: '#93c5fd' },
      { name: 'Profond', value: Math.round(totals.deep / 7), color: '#3b82f6' },
      { name: 'REM', value: Math.round(totals.rem / 7), color: '#1d4ed8' },
      { name: 'Éveillé', value: Math.round(totals.awake / 7), color: '#e5e7eb' },
    ];
  })() : [];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre sommeil</p>
      </div>

      {/* Indicateurs en temps réel */}
      {realtimeData && realtimeData.isAsleep && (
        <Card className="border-blue-500 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
              Sommeil en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Phase actuelle</p>
                <p className="text-2xl capitalize">{
                  realtimeData.currentPhase === 'deep' ? 'Profond' :
                  realtimeData.currentPhase === 'light' ? 'Léger' :
                  realtimeData.currentPhase === 'rem' ? 'REM' : 'Éveillé'
                }</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durée</p>
                <p className="text-2xl">{formatDuration(realtimeData.elapsedTime)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rythme cardiaque</p>
                <p className="text-2xl">{realtimeData.heartRate} bpm</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cycles estimés</p>
                <p className="text-2xl">{realtimeData.estimatedCycles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Durée moyenne</CardTitle>
            <Moon className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{formatDuration(avgSleepDuration)}</div>
            <p className="text-xs text-gray-600 mt-1">7 derniers jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Qualité moyenne</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{avgQuality}%</div>
            <p className="text-xs text-gray-600 mt-1">Score de sommeil</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Cycles moyens</CardTitle>
            <Timer className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{avgCycles}</div>
            <p className="text-xs text-gray-600 mt-1">cycles/nuit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Rythme cardiaque</CardTitle>
            <Heart className="w-4 h-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {recentSessions.length > 0 
                ? Math.round(recentSessions.slice(0, 7).reduce((acc, s) => acc + s.heartRate, 0) / Math.min(7, recentSessions.length))
                : 0} bpm
            </div>
            <p className="text-xs text-gray-600 mt-1">Moyenne au repos</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution de la durée et qualité */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution du sommeil (7j)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="durée" stroke="#3b82f6" name="Durée (h)" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="qualité" stroke="#10b981" name="Qualité (%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition des phases */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des phases</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={phaseDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {phaseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cycles par nuit */}
        <Card>
          <CardHeader>
            <CardTitle>Cycles de sommeil</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cycles" fill="#8b5cf6" name="Cycles" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Corrélation énergie/fatigue */}
        <Card>
          <CardHeader>
            <CardTitle>Énergie et fatigue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentSessions.slice(0, 7).reverse().map(s => ({
                date: new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
                énergie: s.energyLevel || 0,
                fatigue: s.fatigueLevel || 0,
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="énergie" stroke="#10b981" name="Énergie" strokeWidth={2} />
                <Line type="monotone" dataKey="fatigue" stroke="#ef4444" name="Fatigue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
