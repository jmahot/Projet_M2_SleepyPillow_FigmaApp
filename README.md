# 🌙 SleepyPillow - Application de Suivi de Sommeil

Application React/TypeScript de suivi de sommeil connecté avec oreiller intelligent.

## 🚀 Démarrage rapide

### Lancer l'application
```bash
npm install
npm run dev
```

L'application se lance et charge automatiquement les données depuis votre API.

---

## 📡 Configuration API

### URL de l'API configurée
```
https://projet-m2-sleepypillow.onrender.com/sessions
```

Les données sont chargées automatiquement au démarrage de l'application.

---

## ✨ Fonctionnalités

### 📊 Dashboard
- Statistiques en temps réel
- Graphiques de tendances
- Scores de qualité de sommeil
- Historique des 7/30 derniers jours

### 📅 Historique
- Liste complète des sessions
- Filtres par période
- Vue détaillée par nuit
- Graphiques des phases de sommeil

### 💡 Amélioration
- Conseils personnalisés
- Suggestions de siestes optimales
- Analyse des tendances
- Recommandations adaptées

### ⚙️ Paramètres
- Objectifs de sommeil personnalisables
- Gestion des notifications
- Appareil connecté
- Import de données de démonstration

---

## 🔄 Modes de fonctionnement

### Mode Normal (API connectée)
✅ Données chargées depuis l'API externe  
✅ Synchronisation automatique  
✅ Message de confirmation

### Mode Démo (API indisponible)
⚠️ Badge "Mode Démo" affiché  
📦 30 sessions simulées réalistes  
🔄 Toutes les fonctionnalités disponibles

---

## 📋 Format des données API

### Exemple de réponse attendue
```json
[
  {
    "id": "session-1",
    "date": "2026-01-20",
    "bedTime": "23:00",
    "wakeTime": "07:00",
    "totalDuration": 480,
    "sleepDuration": 450,
    "sleepQuality": 85,
    "cycles": 5,
    "heartRate": 65,
    "respirationRate": 15,
    "movements": 12,
    "phases": [
      {
        "phase": "light|deep|rem|awake",
        "startTime": 0,
        "duration": 30
      }
    ]
  }
]
```

### Formats supportés
- Tableau direct : `[{...}]`
- Objet avec wrapper : `{sessions: [{...}]}`
- Format sleep_records : `{sleep_records: [{...}]}`

Le service API transforme automatiquement ces formats.

---

## 🧪 Tester l'API

### Outil de test interactif
Ouvrez `test-api.html` dans votre navigateur pour :
- Tester la connexion
- Voir le temps de réponse
- Prévisualiser les données
- Vérifier le nombre de sessions

### Ligne de commande
```bash
curl https://projet-m2-sleepypillow.onrender.com/sessions
```

---

## 🛠️ Stack Technique

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS v4
- **Charts** : Recharts
- **UI Components** : Shadcn/ui
- **Icons** : Lucide React
- **Notifications** : Sonner
- **Build** : Vite

---

## 📁 Structure du projet

```
/
├── src/
│   ├── app/
│   │   ├── components/      # Composants React
│   │   ├── services/        # Services API
│   │   ├── types/           # Types TypeScript
│   │   └── data/            # Données mockées
│   └── styles/              # Styles CSS
├── test-api.html            # Outil de test API
├── INTEGRATION-COMPLETE.md  # Documentation complète
└── API-INTEGRATION-README.md # Guide API détaillé
```

---

## 🐛 Dépannage

### L'API ne charge pas
**Problème** : L'API Render.com est en veille  
**Solution** :
1. Appelez l'API manuellement : `curl https://projet-m2-sleepypillow.onrender.com/sessions`
2. Attendez 30-60 secondes
3. Rafraîchissez l'application

### Mode démo activé
**Cause** : Timeout de l'API (> 10 secondes)  
**Solution** : L'API doit répondre en moins de 10 secondes

### Données non affichées
**Cause** : Format JSON non reconnu  
**Solution** : Vérifiez la console (F12) et consultez `/src/app/services/api.ts`

---

## 📚 Documentation

- **[INTEGRATION-COMPLETE.md](./INTEGRATION-COMPLETE.md)** : Documentation complète de l'intégration
- **[API-INTEGRATION-README.md](./API-INTEGRATION-README.md)** : Guide détaillé de l'API
- **[test-api.html](./test-api.html)** : Testeur d'API interactif

---

## ✅ Checklist

- [x] Application React fonctionnelle
- [x] Intégration API externe complète
- [x] Mode démo automatique
- [x] Transformation automatique des données
- [x] Interface utilisateur complète
- [x] Graphiques et statistiques
- [x] Responsive design
- [x] Gestion des erreurs robuste

---

## 🎯 Utilisation

1. **Lancez l'app** : `npm run dev`
2. **Vérifiez le chargement** : Regardez si les données s'affichent
3. **Explorez** : Dashboard, Historique, Conseils, Paramètres
4. **Testez** : Utilisez test-api.html pour vérifier l'API

---

## 🌟 Prochaines étapes

- Ajouter l'authentification utilisateur
- Implémenter le push de données vers l'API
- Ajouter des notifications push
- Créer des rapports PDF exportables
- Intégrer avec d'autres appareils connectés

---

**Développé avec ❤️ pour un meilleur sommeil** 😴🌙
