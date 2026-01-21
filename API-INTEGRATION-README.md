# 🔌 Intégration API SleepyPillow

## ✅ Configuration terminée !

Votre application SleepyPillow est maintenant configurée pour récupérer les données directement depuis votre API externe **sans utiliser Supabase**.

---

## 🎯 URL de l'API

```
https://projet-m2-sleepypillow.onrender.com/sessions
```

L'application appelle automatiquement cette URL au démarrage pour charger toutes les sessions de sommeil.

---

## 📋 Comment ça fonctionne

### 1. **Au démarrage de l'application**

L'app fait un appel GET à votre API :
```javascript
GET https://projet-m2-sleepypillow.onrender.com/sessions
```

### 2. **Transformation automatique des données**

Le service API transforme automatiquement les données reçues vers le format attendu par l'application. Il supporte plusieurs formats :

**Format 1 - Tableau direct :**
```json
[
  {
    "id": "1",
    "date": "2026-01-20",
    "bedTime": "23:00",
    "wakeTime": "07:00",
    ...
  }
]
```

**Format 2 - Objet avec propriété `sessions` :**
```json
{
  "sessions": [
    { "id": "1", ... }
  ]
}
```

**Format 3 - Objet avec propriété `sleep_records` :**
```json
{
  "sleep_records": [
    { "id": "1", ... }
  ]
}
```

### 3. **Mapping des champs**

Le service API mappe automatiquement différents noms de champs :

| Champ de votre API | Champ SleepyPillow |
|-------------------|-------------------|
| `id` ou `_id` | `id` |
| `sleep_date` ou `date` | `date` |
| `bed_time` ou `bedTime` | `bedTime` |
| `wake_time` ou `wakeTime` | `wakeTime` |
| `total_duration` ou `duration` | `totalDuration` |
| `avg_heart_rate` ou `heart_rate` | `heartRate` |
| `sleep_quality_score` ou `quality` | `sleepQuality` |
| etc. | |

### 4. **Mode démo automatique**

Si l'API n'est pas disponible, l'application bascule automatiquement en **mode démo** avec 30 sessions simulées.

---

## 🔧 Fichiers modifiés

### `/src/app/services/api.ts`
- ✅ URL de l'API configurée : `https://projet-m2-sleepypillow.onrender.com`
- ✅ Suppression de toutes les références à Supabase
- ✅ Transformation automatique des données
- ✅ Mapping flexible des champs
- ✅ Gestion des erreurs avec fallback

### `/src/app/App.tsx`
- ✅ Suppression de l'import Supabase
- ✅ Message de succès : "Données chargées depuis l'API externe"
- ✅ Mode démo automatique si API indisponible

---

## 📊 Format de données attendu

### Structure minimale

Votre API doit retourner au minimum :

```json
[
  {
    "id": "unique-id",
    "date": "2026-01-20",
    "bedTime": "23:00",
    "wakeTime": "07:00",
    "totalDuration": 480
  }
]
```

### Structure complète

Pour toutes les fonctionnalités :

```json
[
  {
    "id": "session-1",
    "date": "2026-01-20",
    "bedTime": "23:00",
    "wakeTime": "07:00",
    "totalDuration": 480,
    "sleepDuration": 450,
    "phases": [
      {
        "phase": "light",
        "startTime": 0,
        "duration": 30
      },
      {
        "phase": "deep",
        "startTime": 30,
        "duration": 60
      }
    ],
    "movements": 12,
    "heartRate": 65,
    "respirationRate": 15,
    "sleepQuality": 85,
    "cycles": 5,
    "energyLevel": 8,
    "fatigueLevel": 3,
    "notes": "Bonne nuit"
  }
]
```

---

## 🎨 Exemples de réponses API supportées

### Exemple 1 : Format simple
```json
[
  {
    "id": "1",
    "date": "2026-01-20",
    "bed_time": "23:00",
    "wake_time": "07:00",
    "duration": 480,
    "quality": 85
  }
]
```
✅ **Fonctionne !** Les champs `bed_time`, `wake_time`, `duration`, `quality` sont automatiquement mappés.

### Exemple 2 : Format avec wrapper
```json
{
  "sessions": [
    {
      "id": "1",
      "sleep_date": "2026-01-20",
      "bedTime": "23:00",
      "wakeTime": "07:00",
      "total_duration": 480,
      "sleep_quality_score": 85
    }
  ]
}
```
✅ **Fonctionne !** La propriété `sessions` est détectée automatiquement.

### Exemple 3 : Format détaillé
```json
{
  "sleep_records": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "date": "2026-01-20",
      "bed_time": "23:00",
      "wake_time": "07:00",
      "total_duration_minutes": 480,
      "sleep_duration_minutes": 450,
      "avg_heart_rate": 65,
      "avg_respiration_rate": 15,
      "sleep_quality_score": 85,
      "sleep_cycles": 5,
      "movement_count": 12,
      "sleep_stages": [
        {
          "stage_type": "light",
          "start_time": 0,
          "duration_minutes": 30
        }
      ]
    }
  ]
}
```
✅ **Fonctionne !** Tous les formats de champs sont supportés.

---

## 🚀 Tester l'intégration

### 1. Vérifier que votre API est accessible

```bash
curl https://projet-m2-sleepypillow.onrender.com/sessions
```

Vous devriez recevoir un JSON avec vos sessions.

### 2. Lancer l'application

L'application se connectera automatiquement à votre API au démarrage.

### 3. Vérifier les données

- Si l'API fonctionne : Message "Données chargées depuis l'API externe" ✅
- Si l'API est indisponible : Badge "Mode Démo" dans la navbar ⚠️

---

## 🔍 Debugging

### L'API ne se charge pas ?

Ouvrez la console du navigateur (F12) et vérifiez :

```javascript
// Devrait afficher vos données
console.log('API Response:', data)

// En cas d'erreur
console.log('API externe non disponible, utilisation du mode démo')
```

### Timeout de l'API

Si votre API Render.com est en veille, le premier appel peut prendre 30-60 secondes.  
L'application a un timeout de **10 secondes**, donc elle basculera en mode démo pendant ce temps.

**Solution :** Faites un premier appel manuel pour réveiller l'API :
```bash
curl https://projet-m2-sleepypillow.onrender.com/sessions
```
Puis rafraîchissez l'application.

---

## 🎯 Endpoints supplémentaires (optionnels)

Si votre API supporte ces endpoints, ils seront utilisés automatiquement :

```
GET  /sessions          → Récupérer toutes les sessions
GET  /sessions/:id      → Récupérer une session spécifique
POST /sessions          → Créer une nouvelle session
PUT  /sessions/:id      → Mettre à jour une session
DELETE /sessions/:id    → Supprimer une session

GET  /settings          → Récupérer les paramètres utilisateur
PUT  /settings          → Mettre à jour les paramètres

GET  /advices           → Récupérer les conseils
POST /feedback          → Envoyer un feedback
GET  /realtime          → Récupérer les données temps réel
```

Si ces endpoints n'existent pas, l'application fonctionnera quand même avec uniquement `GET /sessions`.

---

## ✅ Résumé

- ✅ **API configurée** : `https://projet-m2-sleepypillow.onrender.com/sessions`
- ✅ **Pas de Supabase** : Tout fonctionne directement avec votre API
- ✅ **Transformation automatique** : Support de plusieurs formats JSON
- ✅ **Mapping flexible** : Les noms de champs sont convertis automatiquement
- ✅ **Mode démo intégré** : Fallback automatique si API indisponible
- ✅ **Timeout 10s** : Évite les attentes trop longues

---

**Votre application est prête à utiliser ! 🎉**

Si votre API retourne des données au format JSON avec au moins `id`, `date`, `bedTime`, `wakeTime`, l'application les affichera automatiquement.
