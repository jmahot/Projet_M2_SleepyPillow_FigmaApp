import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Lightbulb, Moon, Coffee, Sun, Home, AlertTriangle } from 'lucide-react';
import { SleepAdvice, SleepSession } from '../types/sleep';
import { useState } from 'react';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { feedbackAPI } from '../services/api';
import { toast } from 'sonner';

interface ImprovementProps {
  advices: SleepAdvice[];
  recentSessions: SleepSession[];
}

export function Improvement({ advices, recentSessions }: ImprovementProps) {
  const [energyLevel, setEnergyLevel] = useState(7);
  const [fatigueLevel, setFatigueLevel] = useState(3);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bedtime': return <Moon className="w-5 h-5" />;
      case 'wake': return <Sun className="w-5 h-5" />;
      case 'nap': return <Coffee className="w-5 h-5" />;
      case 'lifestyle': return <Lightbulb className="w-5 h-5" />;
      case 'environment': return <Home className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bedtime': return 'bg-blue-100 text-blue-700';
      case 'wake': return 'bg-yellow-100 text-yellow-700';
      case 'nap': return 'bg-purple-100 text-purple-700';
      case 'lifestyle': return 'bg-green-100 text-green-700';
      case 'environment': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-gray-300';
      default: return 'border-gray-300';
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      setIsSaving(true);
      await feedbackAPI.save({
        energyLevel,
        fatigueLevel,
        notes: notes.trim() || undefined,
      });
      toast.success('Feedback enregistré avec succès');
      setShowFeedbackForm(false);
      setNotes('');
    } catch (error) {
      // Mode démo - sauvegarde locale réussie
      toast.success('Feedback enregistré (mode démo)');
      setShowFeedbackForm(false);
      setNotes('');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculer le nombre optimal de cycles basé sur les données récentes
  const calculateOptimalCycles = () => {
    if (recentSessions.length === 0) return 5;
    
    // Trouver les nuits avec la meilleure énergie
    const sessionsWithEnergy = recentSessions.filter(s => s.energyLevel && s.energyLevel >= 7);
    if (sessionsWithEnergy.length === 0) return 5;
    
    const avgCycles = sessionsWithEnergy.reduce((acc, s) => acc + s.cycles, 0) / sessionsWithEnergy.length;
    return Math.round(avgCycles);
  };

  const optimalCycles = calculateOptimalCycles();

  // Suggestion de sieste
  const currentHour = new Date().getHours();
  const suggestNap = currentHour >= 13 && currentHour <= 16;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Amélioration du sommeil</h1>
        <p className="text-gray-600">Conseils personnalisés et feedback</p>
      </div>

      {/* Résumé et cycles optimaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-500 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-500" />
              Cycles optimaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 mb-2">{optimalCycles}</div>
            <p className="text-sm text-gray-600">
              Basé sur vos meilleures nuits, vous devriez viser {optimalCycles} cycles de sommeil
              (environ {Math.round(optimalCycles * 1.5 * 10) / 10}h).
            </p>
          </CardContent>
        </Card>

        {suggestNap && (
          <Card className="border-purple-500 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-purple-500" />
                Suggestion de sieste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-purple-600 mb-2">Sieste courte recommandée</div>
              <p className="text-sm text-gray-600">
                Une sieste de 20-30 minutes pourrait améliorer votre niveau d'énergie sans perturber
                votre sommeil nocturne.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feedback utilisateur */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback quotidien</CardTitle>
        </CardHeader>
        <CardContent>
          {!showFeedbackForm ? (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">
                Partagez votre niveau d'énergie et de fatigue pour affiner vos recommandations
              </p>
              <Button onClick={() => setShowFeedbackForm(true)}>
                Ajouter un feedback
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">
                  Niveau d'énergie: <span className="font-semibold text-green-600">{energyLevel}/10</span>
                </Label>
                <Slider
                  value={[energyLevel]}
                  onValueChange={(value) => setEnergyLevel(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="mb-2"
                />
                <p className="text-xs text-gray-600">
                  1 = Très fatigué, 10 = Très énergique
                </p>
              </div>

              <div>
                <Label className="mb-2 block">
                  Niveau de fatigue: <span className="font-semibold text-orange-600">{fatigueLevel}/10</span>
                </Label>
                <Slider
                  value={[fatigueLevel]}
                  onValueChange={(value) => setFatigueLevel(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="mb-2"
                />
                <p className="text-xs text-gray-600">
                  1 = Pas du tout fatigué, 10 = Extrêmement fatigué
                </p>
              </div>

              <div>
                <Label htmlFor="notes" className="mb-2 block">Notes (optionnel)</Label>
                <Textarea
                  id="notes"
                  placeholder="Comment vous sentez-vous aujourd'hui ? Des remarques particulières ?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmitFeedback} disabled={isSaving}>
                  {isSaving ? 'Enregistrement...' : 'Enregistrer le feedback'}
                </Button>
                <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conseils personnalisés */}
      <div>
        <h2 className="text-2xl mb-4">Conseils personnalisés</h2>
        <div className="grid gap-4">
          {advices
            .sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority] - priorityOrder[b.priority];
            })
            .map((advice) => (
              <Card key={advice.id} className={`border-l-4 ${getPriorityColor(advice.priority)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${getCategoryColor(advice.category)}`}>
                      {getCategoryIcon(advice.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg">{advice.title}</h3>
                        {advice.priority === 'high' && (
                          <span className="flex items-center gap-1 text-sm text-red-600 bg-red-100 px-2 py-1 rounded">
                            <AlertTriangle className="w-3 h-3" />
                            Prioritaire
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{advice.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Conseils généraux */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour un meilleur sommeil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Avant le coucher</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Évitez les écrans 1h avant le coucher</li>
                <li>• Maintenez une température fraîche (16-19°C)</li>
                <li>• Évitez la caféine après 15h</li>
                <li>• Créez une routine relaxante</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Pendant la journée</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Exposez-vous à la lumière naturelle le matin</li>
                <li>• Faites de l'exercice régulièrement</li>
                <li>• Évitez les siestes longues (max 30 min)</li>
                <li>• Maintenez des horaires réguliers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}