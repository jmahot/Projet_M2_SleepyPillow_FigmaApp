# 🚀 Résumé : Intégration API dans SleepyPillow

## ✅ Ce qui a été implémenté

### 1. Backend (Serveur Supabase)

#### Nouveaux endpoints créés :

**📥 Synchronisation depuis API externe**
```
POST /make-server-c3b54980/sync-external-api
```
- Récupère des données depuis L'API
- Transforme automatiquement au format SleepyPillow
- Sauvegarde dans Supabase
- Retourne le nombre de sessions importées

**📡 Webhook temps réel (pour IoT)**
```
POST /make-server-c3b54980/webhook/realtime
```
- Reçoit des données en temps réel depuis un capteur
- Met à jour les statistiques en direct
- Supporte la validation par signature

#### Fonction de transformation
```typescript
transformExternalDataToSessions(externalData: any)
```
- Convertit le format de L'API vers SleepyPillow
- Facilement personnalisable selon votre source de données
- Gère les champs manquants avec des valeurs par défaut

### 2. Frontend (Interface utilisateur)

#### Service API (`/src/app/services/api.ts`)
```typescript
externalAPI.syncFromExternal(apiUrl, apiKey?)
```
- Appel simple pour synchroniser les données
- Gestion automatique des erreurs
- Type-safe avec TypeScript

#### Interface dans Paramètres
- Formulaire pour entrer l'URL et la clé API
- Bouton de synchronisation avec indicateur de chargement
- Documentation du format attendu
- Messages de succès/erreur clairs

---

## 📋 Comment utiliser

### Méthode 1 : Interface utilisateur (Simple)

1. **Allez dans Paramètres** → Descendez jusqu'à "Intégration API externe"
2. **Entrez l'URL de L'API** (ex: `https://api.mon-capteur.com/sleep-data`)
3. **Entrez la clé API** (si L'API nécessite une authentification)
4. **Cliquez sur "Synchroniser maintenant"**
5. **Attendez** la confirmation
6. **Les données apparaissent** automatiquement dans l'app

### Méthode 2 : Programmatique (Avancé)

```typescript
import { externalAPI } from '@/app/services/api';

const result = await externalAPI.syncFromExternal(
  'https://api.exemple.com/sleep-data',
  'ma-cle-api-optionnelle'
);

console.log(result.message); // "Successfully synced 3 sessions"
console.log(result.sessions); // [session1, session2, session3]
```

### Méthode 3 : Webhook IoT (Pour capteurs en temps réel)

Configurez votre capteur pour envoyer des POST à :
```
https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/webhook/realtime
```

Avec le payload :
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

---

## 📝 Format de données attendu

L'API doit retourner :

```json
{
  "sleep_records": [
    {
      "id": "unique-id",
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

**Fichier d'exemple complet** : `/exemple-api-sleep-data.json`

---

## 🔧 Personnalisation

### Adapter au format d'API

Si L'API a un format différent, modifiez la fonction dans `/supabase/functions/server/index.tsx` :

```typescript
function transformExternalDataToSessions(externalData: any) {
  // VOTRE LOGIQUE ICI
  // Exemple pour Fitbit, Withings, Oura, etc.
  
  return externalData.YOUR_FIELD.map((record: any) => ({
    id: record.YOUR_ID_FIELD,
    date: record.YOUR_DATE_FIELD,
    duration: record.YOUR_DURATION_FIELD,
    // ... mappez tous les champs
  }));
}
```

### Sécuriser avec des variables d'environnement

Ajoutez dans Supabase :
```
SLEEP_SENSOR_API_KEY=votre-cle-secrete
```

Le serveur l'utilisera automatiquement à la place de la clé fournie dans le formulaire.

---

## 🎯 Cas d'usage courants

### 1. Fitbit API
```typescript
// Transformer les données Fitbit
function transformExternalDataToSessions(externalData: any) {
  return externalData.sleep.map(record => ({
    id: record.logId,
    date: record.dateOfSleep,
    duration: record.duration / 60000, // ms → minutes
    quality: record.efficiency,
    // ...
  }));
}
```

### 2. Withings Sleep API
```typescript
// Transformer les données Withings
function transformExternalDataToSessions(externalData: any) {
  return externalData.body.series.map(record => ({
    id: `withings-${record.startdate}`,
    date: new Date(record.startdate * 1000).toISOString().split('T')[0],
    duration: (record.enddate - record.startdate) / 60,
    // ...
  }));
}
```

### 3. Capteur IoT personnalisé
```bash
# Depuis votre Raspberry Pi / Arduino
curl -X POST https://{projectId}.supabase.co/functions/v1/make-server-c3b54980/webhook/realtime \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {publicAnonKey}" \
  -H "X-User-Id: default-user" \
  -d '{
    "is_sleeping": true,
    "sleep_phase": "deep",
    "heart_rate": 58,
    "respiration_rate": 14
  }'
```

---

## 🐛 Dépannage rapide

| Erreur | Solution |
|--------|----------|
| "Server offline" | Le serveur Supabase n'est pas actif → Utilisez le mode démo |
| "API key required" | Ajoutez votre clé API dans le formulaire |
| "Failed to fetch" | Vérifiez l'URL et que l'API est accessible |
| "No sleep_records found" | Vérifiez le format JSON retourné par L'API |
| Données non affichées | Rechargez la page ou consultez les logs serveur |

---

## 📚 Fichiers créés/modifiés

### Backend
- `/supabase/functions/server/index.tsx` → Nouveaux endpoints + transformation

### Frontend
- `/src/app/services/api.ts` → Service `externalAPI`
- `/src/app/components/Settings.tsx` → Interface de synchronisation

### Documentation
- `/GUIDE-INTEGRATION-API.md` → Guide complet
- `/RESUME-INTEGRATION-API.md` → Ce fichier
- `/exemple-api-sleep-data.json` → Exemple de données

---

## ✨ Fonctionnalités clés

- ✅ Synchronisation manuelle depuis l'interface
- ✅ Support des clés API (Bearer token)
- ✅ Transformation automatique des données
- ✅ Webhook pour données en temps réel
- ✅ Gestion d'erreur robuste
- ✅ Mode démo si serveur indisponible
- ✅ Documentation complète avec exemples
- ✅ Format flexible et personnalisable

---

## 🎉 Prêt à utiliser !

L'Application SleepyPillow peut maintenant :
1. ✅ Se connecter à n'importe quelle API REST
2. ✅ Recevoir des données en temps réel par webhook
3. ✅ Transformer automatiquement les données
4. ✅ Sauvegarder dans Supabase
5. ✅ Afficher les données dans l'interface

**Pour tester dès maintenant** :
1. Activez le serveur Supabase (il se déploie automatiquement)
2. Allez dans Paramètres → Intégration API externe
3. Entrez l'URL d'une API de test
4. Cliquez sur "Synchroniser maintenant"

Ou utilisez le mode démo avec le bouton "Importer des données de démonstration" !

---

**Questions ?** Consultez le guide complet dans `/GUIDE-INTEGRATION-API.md`
