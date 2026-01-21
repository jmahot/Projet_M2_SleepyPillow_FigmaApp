# ✅ Intégration API SleepyPillow - TERMINÉE

## 🎉 Configuration Complète !

Votre application SleepyPillow est maintenant **100% connectée à votre API externe**, sans Supabase.

---

## 📊 Résumé de l'intégration

### URL de l'API configurée
```
https://projet-m2-sleepypillow.onrender.com/sessions
```

### Ce qui fonctionne automatiquement

✅ **Au démarrage de l'application** : Appel GET vers `/sessions`  
✅ **Transformation automatique** : Supporte plusieurs formats JSON  
✅ **Mapping flexible** : Les noms de champs sont convertis automatiquement  
✅ **Mode démo intégré** : Fallback automatique si API indisponible (30 sessions simulées)  
✅ **Timeout géré** : 10 secondes max, puis bascule en mode démo  
✅ **Notifications** : Message de succès ou badge "Mode Démo"  

---

## 📁 Fichiers modifiés

### 1. `/src/app/services/api.ts`
- ✅ URL API configurée
- ✅ Suppression totale de Supabase
- ✅ Fonction `transformExternalSession()` pour mapper les données
- ✅ Support multi-formats : tableau direct, `{sessions:[]}`, `{sleep_records:[]}`
- ✅ Mapping automatique des champs : `bed_time` → `bedTime`, etc.

### 2. `/src/app/App.tsx`
- ✅ Suppression de l'import Supabase
- ✅ Message "Données chargées depuis l'API externe"
- ✅ Gestion silencieuse du mode démo

### 3. `/src/app/components/Settings.tsx`
- ✅ Suppression de la section "Intégration API externe" (inutile maintenant)
- ✅ Ajout d'une carte d'information sur la source des données
- ✅ Affichage de l'URL de l'API

---

## 🧪 Tester l'intégration

### Option 1 : Interface de test
Ouvrez le fichier `/test-api.html` dans votre navigateur pour :
- Tester la connexion à l'API
- Voir le temps de réponse
- Prévisualiser les données retournées
- Vérifier le nombre de sessions

### Option 2 : Ligne de commande
```bash
curl https://projet-m2-sleepypillow.onrender.com/sessions
```

### Option 3 : Dans l'application
1. Lancez l'app SleepyPillow
2. Regardez la console du navigateur (F12)
3. Si API OK : "Données chargées depuis l'API externe" ✅
4. Si API KO : Badge "Mode Démo" dans la navbar ⚠️

---

## 📖 Format des données supporté

### Formats acceptés automatiquement

**Format 1 - Tableau direct (recommandé)**
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

**Format 2 - Objet avec wrapper "sessions"**
```json
{
  "sessions": [...]
}
```

**Format 3 - Objet avec wrapper "sleep_records"**
```json
{
  "sleep_records": [...]
}
```

### Mapping des champs

| Votre API | SleepyPillow | Alternatives supportées |
|-----------|--------------|------------------------|
| `id` ou `_id` | `id` | - |
| `date` ou `sleep_date` | `date` | - |
| `bedTime` ou `bed_time` | `bedTime` | - |
| `wakeTime` ou `wake_time` | `wakeTime` | - |
| `totalDuration` ou `total_duration` ou `duration` | `totalDuration` | - |
| `sleepDuration` ou `sleep_duration` | `sleepDuration` | - |
| `heartRate` ou `avg_heart_rate` ou `heart_rate` | `heartRate` | - |
| `sleepQuality` ou `sleep_quality_score` ou `quality` | `sleepQuality` | - |
| `cycles` ou `sleep_cycles` | `cycles` | - |
| `phases` ou `sleep_stages` | `phases` | - |

**Toutes ces variations sont reconnues automatiquement !** 🎯

---

## 🚀 Utilisation

### Démarrage normal
1. Lancez votre application SleepyPillow
2. L'app appelle automatiquement `https://projet-m2-sleepypillow.onrender.com/sessions`
3. Les données s'affichent instantanément

### Si l'API Render.com est en veille
1. **Premier appel** : Timeout après 10s → Mode démo activé
2. **Solution** : Attendez 30-60s que l'API se réveille
3. **Rafraîchissez** la page (F5)
4. Les données devraient maintenant se charger

### Mode démonstration
Si l'API est indisponible :
- Badge "Mode Démo" affiché
- 30 sessions simulées réalistes
- Toutes les fonctionnalités disponibles
- Aucune erreur réseau affichée

---

## 🎯 Points importants

### ✅ Avantages de cette architecture
- **Simplicité** : Aucune configuration Supabase nécessaire
- **Direct** : Appels API directs depuis le frontend
- **Flexible** : Supporte plusieurs formats JSON
- **Robuste** : Mode démo automatique en cas d'erreur
- **Rapide** : Pas de serveur intermédiaire

### ⚠️ Points d'attention
- **CORS** : Votre API doit autoriser les requêtes depuis n'importe quelle origine
- **Timeout** : Si l'API met plus de 10s, mode démo activé
- **Render veille** : Le premier appel peut échouer, réessayez après 1 minute

---

## 📚 Documentation complète

- **[API-INTEGRATION-README.md](./API-INTEGRATION-README.md)** : Guide complet
- **[test-api.html](./test-api.html)** : Outil de test interactif
- **[/src/app/services/api.ts](./src/app/services/api.ts)** : Code source du service

---

## 🐛 Dépannage

### L'API ne se charge pas
**Cause** : API Render.com en veille  
**Solution** : Appelez l'API manuellement une fois, puis rafraîchissez l'app
```bash
curl https://projet-m2-sleepypillow.onrender.com/sessions
# Attendez 10-20 secondes
# Puis rafraîchissez l'application
```

### Erreur CORS
**Cause** : L'API bloque les requêtes cross-origin  
**Solution** : Ajoutez les headers CORS côté serveur
```javascript
res.setHeader('Access-Control-Allow-Origin', '*')
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
```

### Données non affichées
**Cause** : Format JSON non reconnu  
**Solution** : Vérifiez la console (F12) et ajustez `transformExternalSession()` dans `api.ts`

### Toujours en mode démo
**Cause** : Timeout de l'API
**Solution** :
1. Testez l'API avec curl ou test-api.html
2. Vérifiez que l'URL est correcte
3. Augmentez le timeout dans api.ts si nécessaire

---

## ✨ Fonctionnalités bonus

### Auto-refresh (optionnel)
Pour recharger les données toutes les 5 minutes :
```typescript
// Dans App.tsx
useEffect(() => {
  const interval = setInterval(loadData, 5 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

### Bouton de synchronisation manuelle (optionnel)
```typescript
<Button onClick={loadData}>
  Actualiser les données
</Button>
```

---

## 🎉 C'est tout !

Votre application est **prête à fonctionner** !

**Prochaines étapes :**
1. ✅ Testez avec [test-api.html](./test-api.html)
2. ✅ Lancez l'application SleepyPillow
3. ✅ Vérifiez que les données s'affichent
4. ✅ Profitez de votre app de suivi de sommeil !

---

**Questions ? Problèmes ?**  
Consultez la console du navigateur (F12) pour les logs détaillés.

**Tout fonctionne ?**  
Bravo ! Votre app SleepyPillow est opérationnelle ! 🚀😴🌙
