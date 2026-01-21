#!/usr/bin/env python3
"""
Exemple de script pour simuler un capteur de sommeil IoT
qui envoie des données en temps réel vers SleepyPillow
"""

import requests
import time
import random
from datetime import datetime

# ============ CONFIGURATION ============
# Remplacez ces valeurs par les vôtres
PROJECT_ID = "ubdbjosolrkzculoedtl"
PUBLIC_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZGJqb3NvbHJremN1bG9lZHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODE0NjksImV4cCI6MjA4MzQ1NzQ2OX0.7_W8NkMv60NqBvQKG13nFFwgvVDI_csm71pic7KKhQ4"
USER_ID = "default-user"

# URL du webhook
WEBHOOK_URL = f"https://{PROJECT_ID}.supabase.co/functions/v1/make-server-c3b54980/webhook/realtime"

# ======================================

class SleepSensor:
    """Simulateur de capteur de sommeil"""
    
    def __init__(self):
        self.is_sleeping = False
        self.sleep_start_time = None
        self.current_phase = "awake"
        self.elapsed_minutes = 0
        
    def simulate_heart_rate(self):
        """Simule une fréquence cardiaque réaliste"""
        if self.is_sleeping:
            if self.current_phase == "deep":
                return random.randint(50, 60)
            elif self.current_phase == "rem":
                return random.randint(60, 70)
            else:  # light
                return random.randint(58, 68)
        else:
            return random.randint(70, 85)
    
    def simulate_respiration(self):
        """Simule une fréquence respiratoire réaliste"""
        if self.is_sleeping:
            return random.randint(12, 16)
        else:
            return random.randint(16, 20)
    
    def simulate_movement(self):
        """Simule les mouvements"""
        if self.is_sleeping:
            if self.current_phase == "deep":
                return random.randint(0, 2)
            elif self.current_phase == "rem":
                return random.randint(1, 5)
            else:  # light
                return random.randint(3, 8)
        else:
            return random.randint(10, 20)
    
    def update_sleep_state(self):
        """Met à jour l'état de sommeil (simulation)"""
        current_hour = datetime.now().hour
        
        # Simulation: dort entre 23h et 7h
        if 23 <= current_hour or current_hour < 7:
            if not self.is_sleeping:
                self.is_sleeping = True
                self.sleep_start_time = datetime.now()
                self.elapsed_minutes = 0
                print("😴 Début du sommeil détecté")
            
            # Calculer le temps écoulé
            if self.sleep_start_time:
                elapsed = (datetime.now() - self.sleep_start_time).seconds // 60
                self.elapsed_minutes = elapsed
                
                # Simuler les phases de sommeil
                cycle_position = elapsed % 90  # Cycle de 90 minutes
                if cycle_position < 30:
                    self.current_phase = "light"
                elif cycle_position < 60:
                    self.current_phase = "deep"
                else:
                    self.current_phase = "rem"
        else:
            if self.is_sleeping:
                print("☀️ Réveil détecté")
            self.is_sleeping = False
            self.current_phase = "awake"
            self.elapsed_minutes = 0
    
    def get_data(self):
        """Retourne les données actuelles du capteur"""
        self.update_sleep_state()
        
        return {
            "is_sleeping": self.is_sleeping,
            "sleep_phase": self.current_phase,
            "heart_rate": self.simulate_heart_rate(),
            "respiration_rate": self.simulate_respiration(),
            "movement_count": self.simulate_movement(),
            "elapsed_minutes": self.elapsed_minutes
        }


def send_data_to_sleepypillow(data):
    """Envoie les données vers SleepyPillow"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {PUBLIC_ANON_KEY}",
        "X-User-Id": USER_ID
    }
    
    try:
        response = requests.post(WEBHOOK_URL, json=data, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Données envoyées avec succès: {result.get('message')}")
            return True
        else:
            print(f"❌ Erreur {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur réseau: {e}")
        return False


def main():
    """Fonction principale"""
    print("=" * 60)
    print("🌙 SIMULATEUR DE CAPTEUR DE SOMMEIL SLEEPYPILLOW")
    print("=" * 60)
    print(f"Endpoint: {WEBHOOK_URL}")
    print(f"User ID: {USER_ID}")
    print("=" * 60)
    print()
    
    sensor = SleepSensor()
    
    print("📡 Démarrage de la collecte de données...")
    print("Envoi de données toutes les 5 minutes")
    print("Appuyez sur Ctrl+C pour arrêter")
    print()
    
    iteration = 0
    
    try:
        while True:
            iteration += 1
            
            # Récupérer les données du capteur
            data = sensor.get_data()
            
            # Afficher les données
            print(f"\n[{datetime.now().strftime('%H:%M:%S')}] Itération #{iteration}")
            print(f"État: {'😴 Endormi' if data['is_sleeping'] else '☀️ Éveillé'}")
            print(f"Phase: {data['sleep_phase']}")
            print(f"Fréquence cardiaque: {data['heart_rate']} bpm")
            print(f"Respiration: {data['respiration_rate']} rpm")
            print(f"Mouvements: {data['movement_count']}")
            print(f"Temps écoulé: {data['elapsed_minutes']} minutes")
            
            # Envoyer vers SleepyPillow
            send_data_to_sleepypillow(data)
            
            # Attendre 5 minutes (ou 30 secondes pour les tests)
            # Changez 30 en 300 pour un intervalle de 5 minutes réel
            wait_time = 30  # secondes
            print(f"\n⏳ Attente de {wait_time} secondes avant le prochain envoi...")
            time.sleep(wait_time)
            
    except KeyboardInterrupt:
        print("\n\n🛑 Arrêt du simulateur de capteur")
        print("Merci d'avoir utilisé SleepyPillow Sensor Simulator!")


if __name__ == "__main__":
    main()
