# 🌙 SleepyPillow - Sommeil Augmenté

> **Projet Transverse M2 Efrei 2026**
> Une station de monitoring biométrique invisible qui traduit vos nuits en données exploitables pour optimiser votre récupération.

---

## 📋 1. Problématique & Vision
Le projet s'appuie sur un constat de santé publique majeur :
* **1 personne sur 3** dort moins de 6 heures par nuit.
* **1 personne sur 5** souffre d'insomnie chronique.
* **Le problème actuel :** Les solutions existantes (montres ou applis passives) se limitent à un constat "après coup" avec une analyse souvent limitée.

**Notre mission :** Passer du simple constat à l'**action** en favorisant l'endormissement et en optimisant les cycles par une intervention au moment opportun.

---

## 🛠 2. Architecture Technique & Intégration API
L'écosystème SleepyPillow repose sur une architecture **API-First** robuste, conçue pour la performance et la résilience.

### 📡 Flux de Données
* **Source API (Render) :** Synchronisation haute fréquence via une API dédiée pour un suivi précis.
* **Architecture Hybride :** Gestion intelligente de la disponibilité. Si l'API rencontre un timeout ou une indisponibilité, le système bascule automatiquement sur une **Source Locale** (données de démonstration réalistes) pour garantir une expérience continue.
* **Transformation de données :** Un service de mapping dynamique permet d'unifier des formats variés (Fitbit, Withings, ou capteurs IoT personnalisés) vers le schéma de données SleepyPillow.

### 💻 Stack Logicielle
* **Frontend :** React 18, TypeScript, Tailwind CSS v4.
* **Visualisation :** Recharts (Analyse détaillée des phases REM, Profond et Léger).
* **Icons & UI :** Lucide React, Sonner (Système de notifications et feedbacks).

---

## ✨ 3. Logique Produit : Mesurer, Analyser, Agir
Conformément à notre concept de "Sommeil Augmenté", l'application suit un cycle itératif précis :

1.  **MESURER :** Captation via l'oreiller des fréquences cardiaques, des mouvements et de la pression.
2.  **ANALYSER :** Détection automatique de l'endormissement et estimation des cycles via notre moteur d'analyse.
3.  **AGIR :** Calcul du réveil optimal pour déclencher une vibration douce ou une lumière progressive durant une phase de sommeil léger.

---

## 🚀 4. Installation et Test

### Lancer l'environnement de développement
```bash
# Installation des dépendances
npm install

# Lancement du projet
npm run dev