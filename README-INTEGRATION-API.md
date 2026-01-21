# 📡 Intégration API - SleepyPillow

## 🎯 Vue d'ensemble

SleepyPillow peut maintenant se connecter à des API externes pour importer des données de sommeil depuis :
- 🏃 Fitbit, Withings, Oura, Garmin, etc.
- 🛏️ Capteurs de sommeil personnalisés
- 📱 Appareils IoT (Raspberry Pi, Arduino, ESP32)
- 🌐 N'importe quelle API REST retournant des données de sommeil

---

## 🚀 Démarrage rapide (3 étapes)

### Étape 1 : Accéder à l'interface
1. Ouvrez SleepyPillow
2. Allez dans **Paramètres** (icône d'engrenage)
3. Descendez jusqu'à la section **"Intégration API externe"**

### Étape 2 : Configurer votre API
```
URL de l'API : https://api.mon-capteur.com/sleep-data
Clé API (optionnelle) : votre-cle-si-necessaire
```

### Étape 3 : Synchroniser
Cliquez sur **"Synchroniser maintenant"** et c'est fait ! ✅

---

## 📚 Documentation complète

### 📖 Guides disponibles

| Fichier | Description |
|---------|-------------|
| **[GUIDE-INTEGRATION-API.md](./GUIDE-INTEGRATION-API.md)** | Guide complet avec tous les détails techniques |
| **[RESUME-INTEGRATION-API.md](./RESUME-INTEGRATION-API.md)** | Résumé rapide de l'implémentation |
| **README-INTEGRATION-API.md** | Ce fichier - Vue d'ensemble |

### 📄 Exemples fournis

| Fichier | Description |
|---------|-------------|
| **[exemple-api-sleep-data.json](./exemple-api-sleep-data.json)** | Exemple de données JSON à retourner |
| **[exemple-capteur-iot.py](./exemple-capteur-iot.py)** | Script Python pour simuler un capteur IoT |

---

## 🔌 Deux modes d'intégration

### Mode 1 : Synchronisation manuelle (Pull)
Vous appelez l'API externe pour récupérer les données

```
Votre App → Serveur SleepyPillow → API Externe → Supabase
```

**Usage :**
- Import périodique de données historiques
- Synchronisation manuelle depuis Fitbit, Withings, etc.
- Récupération de données en lot

### Mode 2 : Webhook temps réel (Push)
L'appareil envoie les données automatiquement

```
Capteur IoT → Serveur SleepyPillow → Supabase → Votre App
```

**Usage :**
- Monitoring en temps réel pendant le sommeil
- Mise à jour automatique toutes les 5-10 minutes
- Capteurs personnalisés (Raspberry Pi, Arduino)

---

## 📋 Format de données

### Ce que votre API doit retourner

```json
{
  "sleep_records": [
    {
      "id": "session-123",
      "sleep_date": "2026-01-20",
      "bed_time": "23:30",
      "wake_time": "07:00",
      "total_duration_minutes": 450,
      "sleep_quality_score": 85,
      "sleep_cycles": 5,
      "sleep_stages": [
        {
          "stage_type": "light|deep|rem|awake",
          "duration_minutes": 180,
          "start_time": "23:30"
        }
      ],
      "avg_heart_rate": 65,
      "avg_respiration_rate": 15
    }
  ]
}
```

**Champs obligatoires :**
- `sleep_records` (array)
- `sleep_date`, `bed_time`, `wake_time`
- `total_duration_minutes`

**Champs optionnels :**
- `sleep_quality_score`, `sleep_cycles`
- `sleep_stages`, `avg_heart_rate`
- Tous les autres champs seront utilisés s'ils sont disponibles

Voir **[exemple-api-sleep-data.json](./exemple-api-sleep-data.json)** pour un exemple complet.

---

## 🛠️ Endpoints créés

### 1. Synchronisation depuis API externe
```http
POST https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/sync-external-api
Content-Type: application/json
Authorization: Bearer {publicAnonKey}

{
  "apiUrl": "https://api.exemple.com/sleep-data",
  "apiKey": "optional-api-key"
}
```

**Réponse :**
```json
{
  "message": "Successfully synced 3 sessions",
  "sessions": [...]
}
```

### 2. Webhook temps réel
```http
POST https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/webhook/realtime
Content-Type: application/json
Authorization: Bearer {publicAnonKey}
X-User-Id: default-user

{
  "is_sleeping": true,
  "sleep_phase": "deep",
  "heart_rate": 58,
  "respiration_rate": 14,
  "movement_count": 3,
  "elapsed_minutes": 180
}
```

---

## 💻 Utilisation programmatique

### Depuis votre code TypeScript

```typescript
import { externalAPI } from '@/app/services/api';

// Synchroniser les données
const result = await externalAPI.syncFromExternal(
  'https://api.exemple.com/sleep-data',
  'ma-cle-api'
);

console.log(result.message); // "Successfully synced X sessions"
```

### Depuis un capteur Python

```python
import requests

url = "https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/webhook/realtime"
headers = {
    "Authorization": "Bearer {publicAnonKey}",
    "Content-Type": "application/json",
    "X-User-Id": "default-user"
}
data = {
    "is_sleeping": True,
    "sleep_phase": "deep",
    "heart_rate": 58,
    "respiration_rate": 14
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

Voir **[exemple-capteur-iot.py](./exemple-capteur-iot.py)** pour un exemple complet.

---

## 🎨 Personnalisation

### Adapter à votre format d'API

Si votre API a un format différent, modifiez la fonction de transformation dans :  
`/supabase/functions/server/index.tsx`

```typescript
function transformExternalDataToSessions(externalData: any) {
  // Exemple pour Fitbit
  if (externalData.sleep) {
    return externalData.sleep.map(record => ({
      id: record.logId,
      date: record.dateOfSleep,
      duration: record.duration / 60000, // ms → minutes
      quality: record.efficiency,
      // ... vos mappages personnalisés
    }));
  }
  
  // Format par défaut SleepyPillow
  return externalData.sleep_records.map(/* ... */);
}
```

---

## 🔐 Sécurité

### Clés API
- ✅ Stockez les clés sensibles dans les variables d'environnement Supabase
- ✅ Utilisez `SLEEP_SENSOR_API_KEY` pour la clé de votre API
- ✅ Les clés ne sont jamais exposées au frontend

### Webhook signature (optionnelle)
```typescript
// Variables d'environnement Supabase
WEBHOOK_SECRET=votre-secret-partage

// Header requis dans les webhooks
X-Webhook-Signature: votre-secret-partage
```

---

## ✅ Checklist d'intégration

Avant de commencer :
- [ ] Mon API retourne un JSON valide
- [ ] Le format correspond au schéma attendu (ou je vais le transformer)
- [ ] J'ai ma clé API si nécessaire
- [ ] Le serveur Supabase est activé

Pour tester :
- [ ] J'ai entré l'URL dans les Paramètres
- [ ] J'ai cliqué sur "Synchroniser maintenant"
- [ ] Les données s'affichent dans l'app
- [ ] Aucune erreur dans la console

---

## 🐛 Dépannage

### "Server offline"
➡️ Le serveur Supabase n'est pas encore actif  
**Solution :** Utilisez le mode démo en attendant

### "API key is required"
➡️ Votre API nécessite une authentification  
**Solution :** Ajoutez votre clé dans le champ "Clé API"

### "Failed to fetch"
➡️ L'URL n'est pas accessible  
**Solution :** Vérifiez l'URL et que l'API est publique

### Données non affichées
➡️ Le format n'est pas reconnu  
**Solution :** Vérifiez les logs du serveur et adaptez `transformExternalDataToSessions`

---

## 📊 Exemples de sources de données

### APIs publiques populaires

| Service | API | Documentation |
|---------|-----|---------------|
| **Fitbit** | `https://api.fitbit.com/1.2/user/-/sleep/...` | [Docs](https://dev.fitbit.com/build/reference/web-api/sleep/) |
| **Withings** | `https://wbsapi.withings.net/v2/sleep` | [Docs](https://developer.withings.com/api-reference/#tag/sleep) |
| **Oura** | `https://api.ouraring.com/v2/usercollection/sleep` | [Docs](https://cloud.ouraring.com/v2/docs) |

### Capteurs personnalisés

- **Raspberry Pi** avec capteurs de fréquence cardiaque
- **Arduino** avec accéléromètre pour détecter les mouvements
- **ESP32** avec capteurs multiples (température, humidité, bruit)

Voir **[exemple-capteur-iot.py](./exemple-capteur-iot.py)** pour un simulateur complet.

---

## 🎉 Vous êtes prêt !

Votre application SleepyPillow peut maintenant :
- ✅ Se connecter à n'importe quelle API REST
- ✅ Recevoir des données en temps réel
- ✅ Transformer automatiquement les formats
- ✅ Sauvegarder et afficher les données

**Pour aller plus loin :**
1. Lisez le [GUIDE-INTEGRATION-API.md](./GUIDE-INTEGRATION-API.md) pour tous les détails
2. Testez avec [exemple-api-sleep-data.json](./exemple-api-sleep-data.json)
3. Lancez [exemple-capteur-iot.py](./exemple-capteur-iot.py) pour simuler un capteur

---

**Questions ? Bugs ?** Consultez la documentation complète ou vérifiez les logs du serveur Supabase.

**Bonne intégration ! 🚀😴**
