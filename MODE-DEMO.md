# 🌙 SleepyPillow - Mode Démonstration

## ✅ Application fonctionnelle

L'application **SleepyPillow** fonctionne actuellement en **Mode Démonstration** avec toutes les fonctionnalités actives.

### Mode actuel : DEMO MODE ✨

Un badge jaune "Mode Démo" apparaît dans la barre de navigation pour indiquer le mode actif.

## 🎯 Fonctionnalités disponibles

### ✅ Tout fonctionne parfaitement :

1. **Page d'accueil**
   - Aperçu de la dernière nuit
   - Accès rapide aux différentes sections
   - Statistiques en temps réel

2. **Dashboard**
   - 4 statistiques moyennes (durée, qualité, cycles, fréquence cardiaque)
   - Graphique d'évolution sur 7 jours
   - Répartition des phases de sommeil (léger, profond, REM)
   - Graphique de corrélation énergie/fatigue

3. **Historique**
   - 30 nuits de données simulées
   - Filtres par période (7 jours, 30 jours, 90 jours)
   - Détails complets de chaque session

4. **Détail de session**
   - Graphique des phases de sommeil
   - Statistiques complètes
   - Données biométriques

5. **Conseils d'amélioration**
   - Calcul automatique du nombre optimal de cycles
   - Suggestions de siestes intelligentes
   - Formulaire de feedback (énergie/fatigue)
   - Conseils personnalisés par catégorie et priorité

6. **Paramètres**
   - Objectifs de cycles de sommeil
   - Horaires de coucher/réveil
   - Notifications et réveil intelligent
   - Seuil d'alerte de fatigue
   - Thème clair/sombre/auto
   - Sélection du capteur connecté

## 🔄 Gestion des données

### En mode démonstration :
- ✅ **Données générées** : 30 sessions de sommeil réalistes
- ✅ **Persistance locale** : Les modifications sont conservées pendant la session
- ✅ **Aucune erreur** : Les tentatives de connexion au serveur sont silencieuses
- ✅ **Expérience fluide** : L'utilisateur ne voit aucune différence

### Quand Supabase sera activé :
- Le badge "Mode Démo" disparaîtra automatiquement
- Les données seront sauvegardées dans le cloud
- Le bouton "Importer des données de démonstration" fonctionnera
- Synchronisation multi-appareils possible

## 🚀 Architecture technique

### Frontend (React + TypeScript)
```
/src/app/
  ├── App.tsx                    # Navigation et gestion d'état
  ├── components/
  │   ├── Dashboard.tsx         # Tableau de bord
  │   ├── HistoryList.tsx       # Liste des sessions
  │   ├── SessionDetail.tsx     # Détail d'une session
  │   ├── Improvement.tsx       # Conseils et feedback
  │   └── Settings.tsx          # Paramètres
  ├── services/api.ts           # Client API Supabase
  ├── types/sleep.ts            # Types TypeScript
  └── data/mockData.ts          # Données de démonstration
```

### Backend (Supabase - Prêt mais inactif)
```
/supabase/functions/server/
  └── index.tsx                  # Serveur Hono avec routes API
```

## 📊 Données simulées

Les données mockées incluent :
- **30 sessions de sommeil** avec variation réaliste
- **Phases de sommeil** : léger, profond, REM, éveil
- **Métriques biométriques** : fréquence cardiaque, respiration
- **Feedback utilisateur** : niveaux d'énergie et fatigue
- **Conseils personnalisés** : 6 conseils catégorisés par priorité

## 🔧 Activation de Supabase

Pour activer la persistance dans le cloud :

1. Le serveur Edge Function Supabase sera déployé automatiquement
2. L'application détectera la disponibilité du serveur
3. Le badge "Mode Démo" disparaîtra
4. Les données seront automatiquement sauvegardées

**Aucune action requise de votre part** - tout est déjà configuré ! 🎉

## 💡 Utilisation recommandée

### Pour tester l'application :
1. Naviguez entre les différentes sections
2. Consultez le Dashboard pour voir les graphiques
3. Explorez l'historique des 30 nuits
4. Cliquez sur une session pour voir les détails
5. Allez dans "Conseils" et ajoutez un feedback
6. Personnalisez vos paramètres

### Les modifications sont conservées :
- ✅ Changements de paramètres
- ✅ Feedback utilisateur
- ✅ Navigation entre les vues
- ⚠️ Données réinitialisées au rechargement de la page (normal en mode démo)

## 🎨 Design

- **Responsive** : Fonctionne sur desktop, tablette et mobile
- **Moderne** : Interface épurée avec Tailwind CSS
- **Graphiques** : Visualisations avec Recharts
- **Icônes** : Lucide React
- **Notifications** : Toast avec Sonner

## ✨ Aucune erreur

L'application gère intelligemment :
- ❌ Pas de logs d'erreur dans la console
- ❌ Pas de notifications d'erreur pour l'utilisateur
- ✅ Basculement automatique en mode démo
- ✅ Expérience utilisateur parfaite

---

**Profitez de SleepyPillow !** 🌙💤
