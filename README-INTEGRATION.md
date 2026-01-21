# SleepyPillow - Application de Suivi de Sommeil 🌙

Application web de suivi de sommeil connectée à un oreiller intelligent, développée avec React, TypeScript, Tailwind CSS et Supabase.

## 🚀 Fonctionnalités

### ✅ Implémentées

- **Dashboard principal** avec visualisation en temps réel
  - Statistiques moyennes (durée, qualité, cycles, rythme cardiaque)
  - Graphiques d'évolution sur 7 jours
  - Répartition des phases de sommeil (léger, profond, REM)
  - Corrélation énergie/fatigue

- **Historique des nuits**
  - Liste complète des sessions de sommeil
  - Filtres par période (jour/semaine/mois)
  - Détails complets pour chaque nuit avec graphiques

- **Détail de session**
  - Graphique des phases de sommeil
  - Statistiques détaillées (mouvements, respiration, efficacité)
  - Feedback utilisateur enregistré

- **Amélioration du sommeil**
  - Calcul du nombre optimal de cycles basé sur les données
  - Suggestions de siestes personnalisées
  - Conseils catégorisés par priorité
  - Feedback quotidien (énergie/fatigue)

- **Paramètres personnalisables**
  - Objectifs de cycles, horaires de coucher/réveil
  - Notifications et réveil intelligent
  - Seuil de fatigue pour alertes
  - Sélection du capteur connecté
  - Import de données de démonstration

### 🔌 Intégration Supabase

L'application utilise Supabase pour la persistance des données :

#### Backend (Hono Server)
- `/make-server-c3b54980/sessions` - CRUD des sessions de sommeil
- `/make-server-c3b54980/settings` - Gestion des paramètres utilisateur
- `/make-server-c3b54980/feedback` - Sauvegarde des feedbacks
- `/make-server-c3b54980/advices` - Récupération des conseils
- `/make-server-c3b54980/realtime` - Données en temps réel

#### Structure des données (KV Store)
```
session:{userId}:{sessionId} -> SleepSession
settings:{userId} -> SleepSettings
feedback:{userId}:{feedbackId} -> Feedback
advice:{userId}:{adviceId} -> SleepAdvice
realtime:{userId} -> RealtimeData
```

## 📦 Architecture

```
/src/app/
  ├── App.tsx                 # Composant principal avec navigation
  ├── types/sleep.ts          # Types TypeScript
  ├── data/mockData.ts        # Données de démonstration
  ├── services/api.ts         # API client pour Supabase
  └── components/
      ├── Dashboard.tsx       # Tableau de bord
      ├── HistoryList.tsx     # Liste des sessions
      ├── SessionDetail.tsx   # Détail d'une session
      ├── Improvement.tsx     # Conseils et feedback
      └── Settings.tsx        # Paramètres
/supabase/functions/server/
  └── index.tsx               # Serveur Hono avec routes API
```

## 🔧 Utilisation

### Premier lancement
1. L'application charge automatiquement les données depuis Supabase
2. Si aucune donnée n'existe, des données de démonstration sont affichées
3. Utilisez le bouton "Importer des données de démonstration" dans les Paramètres pour peupler Supabase

### Connexion de l'oreiller
1. Allez dans Paramètres
2. Sélectionnez votre modèle de capteur
3. Les données seront collectées via Wi-Fi/Bluetooth et envoyées à l'API REST

### Ajouter un feedback
1. Allez dans "Conseils"
2. Cliquez sur "Ajouter un feedback"
3. Renseignez vos niveaux d'énergie et de fatigue
4. Les données sont sauvegardées dans Supabase

## 🔐 Sécurité

⚠️ **Important** : Figma Make n'est pas conçu pour des données de santé sensibles en production.

Pour une utilisation en production avec de vraies données médicales :
- Migrez vers une infrastructure conforme RGPD
- Ajoutez l'authentification utilisateur (Supabase Auth)
- Implémentez le chiffrement des données sensibles
- Conformité HIPAA si nécessaire (USA)

## 🎨 Personnalisation

### Thèmes
Choix entre clair, sombre ou automatique dans les Paramètres.

### Objectifs
Personnalisez vos cycles cibles, horaires et seuils d'alerte.

## 📱 Responsive Design

L'application est entièrement responsive et fonctionne sur :
- Desktop
- Tablette
- Mobile

## 🚀 Évolutions futures

- **Authentification utilisateur** avec Supabase Auth
- **Synchronisation multi-appareils**
- **Notifications push** pour rappels de coucher/réveil
- **Modules premium**
  - Enceinte Bluetooth pour musique relaxante
  - Réveil en douceur avec sons naturels
- **Analyses avancées**
  - Machine learning pour prédictions
  - Corrélations avec activité physique/alimentation
- **Export de données** (PDF, CSV)
- **Intégration avec autres services** (Apple Health, Google Fit)

## 📊 Graphiques et Visualisations

Utilise **Recharts** pour :
- Graphiques linéaires (évolution dans le temps)
- Graphiques en barres (cycles, répartition des phases)
- Graphiques en aires (progression des phases)
- Graphiques circulaires (pourcentages)

## 🛠️ Technologies

- **Frontend** : React 18, TypeScript
- **Styling** : Tailwind CSS v4
- **Backend** : Supabase (Hono Server)
- **Charts** : Recharts
- **Icons** : Lucide React
- **Notifications** : Sonner
- **UI Components** : Radix UI

## 📝 Notes

- Les données sont stockées dans le cloud Supabase (KV Store)
- Aucune donnée locale sur l'appareil
- Les données mockées peuvent être importées à tout moment pour les tests
- L'ID utilisateur est actuellement statique (`default-user`) - à remplacer par une vraie authentification
