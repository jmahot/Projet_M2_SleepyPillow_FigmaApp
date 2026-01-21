import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Settings as SettingsIcon, Moon, Bell, Palette, Wifi, Download } from 'lucide-react';
import { SleepSettings } from '../types/sleep';
import { useState } from 'react';
import { sessionsAPI } from '../services/api';
import { generateMockSessions } from '../data/mockData';
import { toast } from 'sonner';

interface SettingsProps {
  settings: SleepSettings;
  onUpdateSettings: (settings: SleepSettings) => void;
}

export function Settings({ settings, onUpdateSettings }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<SleepSettings>(settings);
  const [isImporting, setIsImporting] = useState(false);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    // Afficher une notification de succès
    console.log('Paramètres sauvegardés:', localSettings);
  };

  const updateSetting = <K extends keyof SleepSettings>(key: K, value: SleepSettings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleImportMockData = async () => {
    try {
      setIsImporting(true);
      const mockSessions = generateMockSessions();
      
      // Importer les 10 dernières sessions
      const sessionsToImport = mockSessions.slice(0, 10);
      
      let successCount = 0;
      for (const session of sessionsToImport) {
        try {
          await sessionsAPI.create(session);
          successCount++;
        } catch (error) {
          console.error('Error importing session:', error);
        }
      }
      
      toast.success(`${successCount} sessions de démonstration importées avec succès`);
      
      // Recharger la page pour afficher les nouvelles données
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error importing mock data:', error);
      toast.error('Erreur lors de l\'importation des données de démonstration');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Paramètres</h1>
        <p className="text-gray-600">Personnalisez votre expérience de suivi du sommeil</p>
      </div>

      {/* Objectifs de sommeil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Objectifs de sommeil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="targetCycles" className="mb-2 block">
                Nombre de cycles cible
              </Label>
              <Input
                id="targetCycles"
                type="number"
                min="3"
                max="7"
                value={localSettings.targetCycles}
                onChange={(e) => updateSetting('targetCycles', parseInt(e.target.value))}
              />
              <p className="text-xs text-gray-600 mt-1">
                Recommandé: 5 cycles (7h30)
              </p>
            </div>

            <div>
              <Label htmlFor="targetBedTime" className="mb-2 block">
                Heure de coucher cible
              </Label>
              <Input
                id="targetBedTime"
                type="time"
                value={localSettings.targetBedTime}
                onChange={(e) => updateSetting('targetBedTime', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="targetWakeTime" className="mb-2 block">
                Heure de réveil cible
              </Label>
              <Input
                id="targetWakeTime"
                type="time"
                value={localSettings.targetWakeTime}
                onChange={(e) => updateSetting('targetWakeTime', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">
              Seuil de fatigue pour alertes: <span className="font-semibold">{localSettings.fatigueThreshold}/10</span>
            </Label>
            <Slider
              value={[localSettings.fatigueThreshold]}
              onValueChange={(value) => updateSetting('fatigueThreshold', value[0])}
              min={1}
              max={10}
              step={1}
            />
            <p className="text-xs text-gray-600 mt-1">
              Vous recevrez une alerte si votre fatigue dépasse ce seuil
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications et rappels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableNotifications" className="cursor-pointer">
                Activer les notifications
              </Label>
              <p className="text-sm text-gray-600">
                Recevoir des rappels pour le coucher et le réveil
              </p>
            </div>
            <Switch
              id="enableNotifications"
              checked={localSettings.enableNotifications}
              onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableSmartAlarm" className="cursor-pointer">
                Réveil intelligent
              </Label>
              <p className="text-sm text-gray-600">
                Vous réveiller au meilleur moment du cycle de sommeil
              </p>
            </div>
            <Switch
              id="enableSmartAlarm"
              checked={localSettings.enableSmartAlarm}
              onCheckedChange={(checked) => updateSetting('enableSmartAlarm', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Apparence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Apparence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="theme" className="mb-2 block">
              Thème de l'application
            </Label>
            <Select value={localSettings.theme} onValueChange={(value: any) => updateSetting('theme', value)}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="auto">Automatique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Appareil connecté */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Appareil connecté
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="connectedDevice" className="mb-2 block">
              Capteur actuel
            </Label>
            <Select 
              value={localSettings.connectedDevice} 
              onValueChange={(value) => updateSetting('connectedDevice', value)}
            >
              <SelectTrigger id="connectedDevice">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Smart Pillow v2">Smart Pillow v2</SelectItem>
                <SelectItem value="Smart Pillow Pro">Smart Pillow Pro</SelectItem>
                <SelectItem value="Sleep Band">Sleep Band</SelectItem>
                <SelectItem value="Sleep Tracker Mat">Sleep Tracker Mat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Wifi className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">Appareil connecté</p>
                <p className="text-sm text-blue-700 mt-1">
                  {localSettings.connectedDevice} • Connexion Wi-Fi active
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Tester la connexion
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Les questions de feedback vous sont posées quotidiennement pour affiner vos recommandations.
            Elles incluent vos niveaux d'énergie et de fatigue aux moments clés de la journée.
          </p>
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">Questions actuelles:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Niveau d'énergie au réveil (1-10)</li>
              <li>• Niveau de fatigue en milieu de journée (1-10)</li>
              <li>• Notes optionnelles sur la qualité du sommeil</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Info API */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Wifi className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-2">Source des données</p>
              <p className="text-sm text-blue-700">
                Les données de sommeil sont automatiquement chargées depuis votre API externe :<br />
                <code className="bg-white px-2 py-1 rounded text-xs mt-1 inline-block">
                  https://projet-m2-sleepypillow.onrender.com/sessions
                </code>
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Si l'API est indisponible, l'application bascule automatiquement en mode démonstration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleSave} size="lg">
          Enregistrer les paramètres
        </Button>
        <Button variant="outline" size="lg" onClick={() => setLocalSettings(settings)}>
          Réinitialiser
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleImportMockData}
          disabled={isImporting}
        >
          <Download className="w-4 h-4 mr-2" />
          {isImporting ? 'Importation...' : 'Importer des données de démonstration'}
        </Button>
      </div>
    </div>
  );
}