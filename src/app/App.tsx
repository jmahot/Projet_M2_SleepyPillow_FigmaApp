import { useState, useEffect } from 'react';
import { Home, BarChart3, Clock, Lightbulb, Settings as SettingsIcon, Moon } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { HistoryList } from './components/HistoryList';
import { SessionDetail } from './components/SessionDetail';
import { Improvement } from './components/Improvement';
import { Settings } from './components/Settings';
import { generateMockSessions, mockSettings, mockAdvices, mockRealtimeData } from './data/mockData';
import { SleepSession, SleepSettings } from './types/sleep';
import { sessionsAPI, settingsAPI, advicesAPI, realtimeAPI, checkServerAvailability } from './services/api';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

type View = 'home' | 'dashboard' | 'history' | 'improvement' | 'settings';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSession, setSelectedSession] = useState<SleepSession | null>(null);
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [settings, setSettings] = useState<SleepSettings>(mockSettings);
  const [advices, setAdvices] = useState(mockAdvices);
  const [realtimeData, setRealtimeData] = useState(mockRealtimeData);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  // Charger les données au démarrage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    
    try {
      // Tester la connexion au serveur silencieusement
      const isServerAvailable = await checkServerAvailability();
      
      if (!isServerAvailable) {
        // Mode démo - pas de message d'erreur
        throw new Error('Server offline - using demo mode');
      }

      // Charger les sessions
      const fetchedSessions = await sessionsAPI.getAll();
      
      // Si aucune session n'existe, initialiser avec des données mockées
      if (fetchedSessions.length === 0) {
        setUseMockData(true);
        const mockSessions = generateMockSessions();
        setSessions(mockSessions);
        
        toast.info('Aucune donnée trouvée', {
          description: 'Utilisation de données de démonstration. Allez dans Paramètres pour importer des données.'
        });
      } else {
        setSessions(fetchedSessions);
        setUseMockData(false);
        toast.success('Données chargées depuis Supabase');
      }

      // Charger les paramètres
      const fetchedSettings = await settingsAPI.get();
      setSettings(fetchedSettings);

      // Charger les conseils
      const fetchedAdvices = await advicesAPI.getAll();
      if (fetchedAdvices.length > 0) {
        setAdvices(fetchedAdvices);
      }

      // Charger les données en temps réel
      const fetchedRealtime = await realtimeAPI.get();
      if (fetchedRealtime) {
        setRealtimeData(fetchedRealtime);
      }

    } catch (error) {
      // Mode démo silencieux - pas de logs d'erreur ni de notifications
      setSessions(generateMockSessions());
      setSettings(mockSettings);
      setAdvices(mockAdvices);
      setRealtimeData(mockRealtimeData);
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = (session: SleepSession) => {
    setSelectedSession(session);
  };

  const handleBackFromDetail = () => {
    setSelectedSession(null);
  };

  const handleUpdateSettings = async (newSettings: SleepSettings) => {
    try {
      if (useMockData) {
        // Mode démo - sauvegarde locale uniquement
        setSettings(newSettings);
        toast.success('Paramètres enregistrés (mode démo)');
        return;
      }
      
      const updated = await settingsAPI.update(newSettings);
      setSettings(updated);
      toast.success('Paramètres enregistrés avec succès');
    } catch (error) {
      // Fallback en local sans afficher d'erreur
      setSettings(newSettings);
      toast.success('Paramètres enregistrés (mode démo)');
    }
  };

  const renderContent = () => {
    // Si une session est sélectionnée, afficher les détails
    if (selectedSession) {
      return <SessionDetail session={selectedSession} onBack={handleBackFromDetail} />;
    }

    // Sinon, afficher la vue courante
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-8">
            {/* Hero section */}
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <Moon className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-4xl mb-4">Suivi de Sommeil</h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Analysez et améliorez la qualité de votre sommeil grâce à votre oreiller connecté
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Voir le tableau de bord
                </button>
                <button
                  onClick={() => setCurrentView('history')}
                  className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Historique
                </button>
              </div>
            </div>

            {/* Aperçu rapide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="bg-white border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('dashboard')}
              >
                <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Tableau de bord</h3>
                <p className="text-gray-600">
                  Visualisez vos statistiques et graphiques en temps réel
                </p>
              </div>

              <div 
                className="bg-white border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('history')}
              >
                <Clock className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Historique</h3>
                <p className="text-gray-600">
                  Consultez vos {sessions.length} nuits enregistrées
                </p>
              </div>

              <div 
                className="bg-white border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('improvement')}
              >
                <Lightbulb className="w-8 h-8 text-yellow-600 mb-3" />
                <h3 className="text-xl font-semibold mb-2">Conseils</h3>
                <p className="text-gray-600">
                  Obtenez des recommandations personnalisées
                </p>
              </div>
            </div>

            {/* Dernière nuit */}
            {sessions.length > 0 && (
              <div>
                <h2 className="text-2xl mb-4">Dernière nuit</h2>
                <div 
                  className="bg-white border-2 rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handleSelectSession(sessions[0])}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {new Date(sessions[0].date).toLocaleDateString('fr-FR', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </p>
                      <p className="text-lg font-semibold">
                        {sessions[0].bedTime} → {sessions[0].wakeTime}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-semibold ${
                      sessions[0].sleepQuality >= 80 ? 'bg-green-100 text-green-700' :
                      sessions[0].sleepQuality >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {sessions[0].sleepQuality}%
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Durée</p>
                      <p className="text-lg font-semibold">
                        {Math.floor(sessions[0].sleepDuration / 60)}h
                        {(sessions[0].sleepDuration % 60).toString().padStart(2, '0')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cycles</p>
                      <p className="text-lg font-semibold">{sessions[0].cycles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rythme cardiaque</p>
                      <p className="text-lg font-semibold">{sessions[0].heartRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mouvements</p>
                      <p className="text-lg font-semibold">{sessions[0].movements}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'dashboard':
        return <Dashboard recentSessions={sessions} realtimeData={realtimeData} />;

      case 'history':
        return <HistoryList sessions={sessions} onSelectSession={handleSelectSession} />;

      case 'improvement':
        return <Improvement advices={advices} recentSessions={sessions} />;

      case 'settings':
        return <Settings settings={settings} onUpdateSettings={handleUpdateSettings} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setCurrentView('home');
                setSelectedSession(null);
              }}
            >
              <Moon className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-semibold">SleepyPillow</span>
              {useMockData && (
                <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  Mode Démo
                </span>
              )}
            </div>

            <div className="flex gap-1">
              <button
                onClick={() => {
                  setCurrentView('home');
                  setSelectedSession(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'home' && !selectedSession
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Accueil</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setSelectedSession(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard' && !selectedSession
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('history');
                  setSelectedSession(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  (currentView === 'history' || selectedSession) && !selectedSession
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span className="hidden sm:inline">Historique</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('improvement');
                  setSelectedSession(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'improvement' && !selectedSession
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Lightbulb className="w-5 h-5" />
                <span className="hidden sm:inline">Conseils</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('settings');
                  setSelectedSession(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'settings' && !selectedSession
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SettingsIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Paramètres</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des données...</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>SleepyPillow - Suivi de sommeil connecté</p>
            <p className="mt-1">Données collectées via Wi-Fi/Bluetooth et stockées dans le cloud</p>
          </div>
        </div>
      </footer>

      {/* Toaster */}
      <Toaster />
    </div>
  );
}