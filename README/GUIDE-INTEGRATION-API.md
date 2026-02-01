# 📡 Guide d'intégration API pour SleepyPillow

Ce guide explique comment intégrer des données depuis une API externe (capteur de sommeil, Fitbit, Withings, Oura, etc.) dans la application SleepyPillow.

---

## 🎯 Méthodes d'intégration

### Option 1 : Via le serveur Supabase (Recommandé ✅)

**Avantages :**
- Sécurisé : les clés API restent côté serveur
- Transformation des données centralisée
- Gestion des erreurs robuste
- Support CORS intégré

**Endpoint créé :** 
```
POST https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/sync-external-api
```

---

## 📝 Étapes d'intégration

### 1. Préparer l'API externe

Votre API doit retourner un JSON au format suivant :

```json
{
  "sleep_records": [
    {
      "id": "session-unique-id",
      "sleep_date": "2026-01-20",
      "bed_time": "23:30",
      "wake_time": "07:00",
      "total_duration_minutes": 450,
      "sleep_quality_score": 85,
      "sleep_cycles": 5,
      "sleep_stages": [
        {
          "stage_type": "light",
          "duration_minutes": 180,
          "start_time": "23:30"
        },
        {
          "stage_type": "deep",
          "duration_minutes": 120,
          "start_time": "01:30"
        },
        {
          "stage_type": "rem",
          "duration_minutes": 90,
          "start_time": "03:30"
        }
      ],
      "avg_heart_rate": 65,
      "avg_respiration_rate": 15,
      "movement_count": 12,
      "deep_sleep_minutes": 120,
      "rem_sleep_minutes": 90,
      "light_sleep_minutes": 180,
      "awakening_count": 2,
      "room_temperature": 19.5,
      "room_humidity": 45,
      "noise_level": 25
    }
  ]
}
```

### 2. Utiliser l'interface utilisateur

1. Allez dans **Paramètres** → Section **Intégration API externe**
2. Entrez l'URL de l'API
3. Entrez la clé API (optionnelle si l'API est publique)
4. Cliquez sur **Synchroniser maintenant**

### 3. Utiliser l'API programmatiquement

```typescript
import { externalAPI } from '@/app/services/api';

// Synchroniser les données
try {
  const result = await externalAPI.syncFromExternal(
    'https://api.exemple.com/sleep-data',
    'la-cle-api-optionnelle'
  );
  
  console.log(result.message); // "Successfully synced X sessions"
  console.log(result.sessions); // Tableau des sessions importées
} catch (error) {
  console.error('Erreur de synchronisation:', error);
}
```

---

## 🔧 Configuration du serveur

### Modifier la fonction de transformation

Le serveur transforme automatiquement vos données au format SleepyPillow. 
Si l'API a un format différent, modifiez la fonction `transformExternalDataToSessions` dans `/supabase/functions/server/index.tsx` :

```typescript
function transformExternalDataToSessions(externalData: any) {
  // Exemple pour une API Fitbit
  if (!externalData.sleep || !Array.isArray(externalData.sleep)) {
    return [];
  }
  
  return externalData.sleep.map((record: any) => ({
    id: record.logId,
    date: record.dateOfSleep,
    bedTime: record.startTime,
    wakeTime: record.endTime,
    duration: record.duration / 60000, // Convertir ms en minutes
    quality: (record.efficiency / 100) * 100, // Score de qualité
    cycles: Math.floor(record.duration / (90 * 60 * 1000)),
    // ... autres mappages
  }));
}
```

### Sécuriser avec une clé API

Pour plus de sécurité, stockez la clé API dans les variables d'environnement Supabase :

1. Ajoutez la variable d'environnement dans Supabase :
   ```
   SLEEP_SENSOR_API_KEY=la-cle-secrete
   ```

2. Le serveur utilisera automatiquement cette clé en priorité

---

## 🔄 Webhook temps réel (pour capteurs IoT)

Pour les appareils qui envoient des données en temps réel :

### Endpoint webhook :
```
POST https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/webhook/realtime
```

### Headers requis :
```
Content-Type: application/json
Authorization: Bearer {publicAnonKey}
X-User-Id: {userId}
X-Webhook-Signature: {signature-optionnelle}
```

### Format du payload :
```json
{
  "is_sleeping": true,
  "sleep_phase": "deep",
  "heart_rate": 58,
  "respiration_rate": 14,
  "movement_count": 3,
  "elapsed_minutes": 180
}
```

### Configurer la appareil IoT :

1. Configurez l'appareil pour envoyer des POST HTTP vers l'endpoint webhook
2. Incluez les headers requis
3. Envoyez les données toutes les 5-10 minutes pour un suivi en temps réel

---

## 🔐 Sécurité

### Authentification Bearer

Si l'API nécessite une authentification, le serveur enverra automatiquement :

```
Authorization: Bearer {la-cle-api}
```

### Signature de webhook (optionnelle)

Pour valider les webhooks, ajoutez un secret :

```typescript
// Dans Supabase, ajoutez la variable d'environnement :
WEBHOOK_SECRET=la-secret-partage

// L'appareil IoT doit envoyer :
X-Webhook-Signature: la-secret-partage
```

---

## 📋 Exemples d'intégration

### Exemple 1 : API REST simple

```bash
# Votre API externe
curl https://api.sleeptracker.com/sessions \
  -H "Authorization: Bearer YOUR_API_KEY"

# Réponse attendue au format SleepyPillow
{
  "sleep_records": [ ... ]
}
```

### Exemple 2 : Transformation d'une API Withings

```typescript
// Modifier transformExternalDataToSessions pour Withings :
function transformExternalDataToSessions(externalData: any) {
  if (!externalData.body?.series) return [];
  
  return externalData.body.series.map((record: any) => ({
    id: `withings-${record.startdate}`,
    date: new Date(record.startdate * 1000).toISOString().split('T')[0],
    duration: (record.enddate - record.startdate) / 60,
    quality: record.sleep_score || 0,
    // ... mapper les autres champs
  }));
}
```

### Exemple 3 : Capteur IoT en temps réel

```python
# Script Python pour envoyer des données depuis un Raspberry Pi
import requests
import time

WEBHOOK_URL = "https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/webhook/realtime"
API_KEY = "{publicAnonKey}"

def send_sleep_data(heart_rate, respiration, is_sleeping):
    payload = {
        "is_sleeping": is_sleeping,
        "sleep_phase": "deep" if is_sleeping else "awake",
        "heart_rate": heart_rate,
        "respiration_rate": respiration,
        "movement_count": 0,
        "elapsed_minutes": 120
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
        "X-User-Id": "default-user"
    }
    
    response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
    print(f"Status: {response.status_code}")

# Boucle de collecte de données
while True:
    heart_rate = read_heart_rate_sensor()
    respiration = read_respiration_sensor()
    is_sleeping = detect_sleep_state()
    
    send_sleep_data(heart_rate, respiration, is_sleeping)
    time.sleep(300)  # Envoyer toutes les 5 minutes
```

---

## 🐛 Dépannage

### Erreur : "Server offline"
- Le serveur Supabase n'est pas encore actif
- En mode démo, utilisez "Importer des données de démonstration"

### Erreur : "API key is required"
- Ajoutez la clé API dans le formulaire
- Ou configurez `SLEEP_SENSOR_API_KEY` dans les variables d'environnement

### Erreur : "Failed to fetch"
- Vérifiez que l'URL de l'API est correcte
- Assurez-vous que l'API est accessible publiquement
- Vérifiez les permissions CORS de l'API

### Données non affichées
- Vérifiez le format JSON retourné par l'API
- Consultez les logs du serveur dans Supabase
- Vérifiez la fonction de transformation `transformExternalDataToSessions`

---

## ✅ Checklist d'intégration

- [ ] L'API externe retourne un JSON valide
- [ ] Le format correspond au schéma attendu
- [ ] La clé API est configurée (si nécessaire)
- [ ] Le serveur Supabase est actif
- [ ] La fonction de transformation est adaptée
- [ ] Les données s'affichent correctement dans l'app

---

## 📚 Ressources

- [Documentation Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Format des données SleepyPillow](/src/app/types/sleep.ts)
- [Code serveur](/supabase/functions/server/index.tsx)
- [Service API frontend](/src/app/services/api.ts)

---

**Besoin d'aide ?** Consultez la section "Intégration API externe" dans les Paramètres de l'application pour voir le format attendu et tester la synchronisation.
