import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-c3b54980/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== SLEEPYPILLOW API ROUTES =====

// Get all sleep sessions for a user
app.get("/make-server-c3b54980/sessions", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const sessions = await kv.getByPrefix(`session:${userId}:`);
    
    // Sort by date (most recent first)
    const sortedSessions = sessions
      .map(s => s.value)
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return c.json({ sessions: sortedSessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return c.json({ error: "Failed to fetch sessions" }, 500);
  }
});

// Get a specific sleep session
app.get("/make-server-c3b54980/sessions/:id", async (c) => {
  try {
    const sessionId = c.req.param("id");
    const userId = c.req.header("X-User-Id") || "default-user";
    const session = await kv.get(`session:${userId}:${sessionId}`);
    
    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }
    
    return c.json({ session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return c.json({ error: "Failed to fetch session" }, 500);
  }
});

// Create a new sleep session
app.post("/make-server-c3b54980/sessions", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const body = await c.req.json();
    
    const sessionId = body.id || crypto.randomUUID();
    const session = {
      ...body,
      id: sessionId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`session:${userId}:${sessionId}`, session);
    
    return c.json({ session, message: "Session created successfully" }, 201);
  } catch (error) {
    console.error("Error creating session:", error);
    return c.json({ error: "Failed to create session" }, 500);
  }
});

// Update a sleep session
app.put("/make-server-c3b54980/sessions/:id", async (c) => {
  try {
    const sessionId = c.req.param("id");
    const userId = c.req.header("X-User-Id") || "default-user";
    const body = await c.req.json();
    
    const existingSession = await kv.get(`session:${userId}:${sessionId}`);
    if (!existingSession) {
      return c.json({ error: "Session not found" }, 404);
    }
    
    const updatedSession = {
      ...existingSession,
      ...body,
      id: sessionId,
      updatedAt: new Date().toISOString(),
    };
    
    await kv.set(`session:${userId}:${sessionId}`, updatedSession);
    
    return c.json({ session: updatedSession, message: "Session updated successfully" });
  } catch (error) {
    console.error("Error updating session:", error);
    return c.json({ error: "Failed to update session" }, 500);
  }
});

// Delete a sleep session
app.delete("/make-server-c3b54980/sessions/:id", async (c) => {
  try {
    const sessionId = c.req.param("id");
    const userId = c.req.header("X-User-Id") || "default-user";
    
    await kv.del(`session:${userId}:${sessionId}`);
    
    return c.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting session:", error);
    return c.json({ error: "Failed to delete session" }, 500);
  }
});

// Get user settings
app.get("/make-server-c3b54980/settings", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const settings = await kv.get(`settings:${userId}`);
    
    if (!settings) {
      // Return default settings
      return c.json({
        settings: {
          targetCycles: 5,
          targetBedTime: "23:00",
          targetWakeTime: "07:00",
          enableNotifications: true,
          enableSmartAlarm: true,
          theme: "auto",
          fatigueThreshold: 6,
          connectedDevice: "Smart Pillow v2",
        }
      });
    }
    
    return c.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return c.json({ error: "Failed to fetch settings" }, 500);
  }
});

// Update user settings
app.put("/make-server-c3b54980/settings", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const body = await c.req.json();
    
    await kv.set(`settings:${userId}`, body);
    
    return c.json({ settings: body, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    return c.json({ error: "Failed to update settings" }, 500);
  }
});

// Get user advices
app.get("/make-server-c3b54980/advices", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const advices = await kv.getByPrefix(`advice:${userId}:`);
    
    return c.json({ advices: advices.map(a => a.value) });
  } catch (error) {
    console.error("Error fetching advices:", error);
    return c.json({ error: "Failed to fetch advices" }, 500);
  }
});

// Save feedback
app.post("/make-server-c3b54980/feedback", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const body = await c.req.json();
    
    const feedbackId = crypto.randomUUID();
    const feedback = {
      ...body,
      id: feedbackId,
      userId,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`feedback:${userId}:${feedbackId}`, feedback);
    
    return c.json({ feedback, message: "Feedback saved successfully" }, 201);
  } catch (error) {
    console.error("Error saving feedback:", error);
    return c.json({ error: "Failed to save feedback" }, 500);
  }
});

// Get realtime data (mock for now - would come from IoT device)
app.get("/make-server-c3b54980/realtime", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const realtimeData = await kv.get(`realtime:${userId}`);
    
    if (!realtimeData) {
      return c.json({
        realtimeData: {
          isAsleep: false,
          currentPhase: "awake",
          heartRate: 0,
          respirationRate: 0,
          movements: 0,
          elapsedTime: 0,
          estimatedCycles: 0,
        }
      });
    }
    
    return c.json({ realtimeData });
  } catch (error) {
    console.error("Error fetching realtime data:", error);
    return c.json({ error: "Failed to fetch realtime data" }, 500);
  }
});

// ===== INTEGRATION API EXTERNE =====

// Sync data from external API (ex: capteur de sommeil)
app.post("/make-server-c3b54980/sync-external-api", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const { apiUrl, apiKey } = await c.req.json();
    
    // Récupérer la clé API depuis les variables d'environnement (plus sécurisé)
    const externalApiKey = Deno.env.get("SLEEP_SENSOR_API_KEY") || apiKey;
    
    if (!externalApiKey) {
      return c.json({ error: "API key is required" }, 400);
    }
    
    console.log(`🔄 Fetching data from external API: ${apiUrl}`);
    
    // Appel à l'API externe
    const response = await fetch(apiUrl, {
      headers: {
        "Authorization": `Bearer ${externalApiKey}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status} ${response.statusText}`);
    }
    
    const externalData = await response.json();
    console.log(`✅ Received data from external API:`, externalData);
    
    // Transformer les données de l'API vers le format SleepyPillow
    const transformedSessions = transformExternalDataToSessions(externalData);
    
    // Sauvegarder les sessions dans Supabase
    let savedCount = 0;
    for (const session of transformedSessions) {
      const sessionId = session.id || crypto.randomUUID();
      await kv.set(`session:${userId}:${sessionId}`, {
        ...session,
        id: sessionId,
        syncedAt: new Date().toISOString(),
      });
      savedCount++;
    }
    
    console.log(`✅ Saved ${savedCount} sessions from external API`);
    
    return c.json({ 
      message: `Successfully synced ${savedCount} sessions`,
      sessions: transformedSessions 
    });
  } catch (error) {
    console.error("❌ Error syncing external API:", error);
    return c.json({ 
      error: `Failed to sync external API: ${error.message}` 
    }, 500);
  }
});

// Webhook endpoint for real-time data from IoT device
app.post("/make-server-c3b54980/webhook/realtime", async (c) => {
  try {
    const userId = c.req.header("X-User-Id") || "default-user";
    const body = await c.req.json();
    
    // Valider le webhook (optionnel: vérifier une signature)
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    const signature = c.req.header("X-Webhook-Signature");
    
    if (webhookSecret && signature !== webhookSecret) {
      return c.json({ error: "Invalid webhook signature" }, 401);
    }
    
    console.log(`📡 Received realtime data from IoT device for user ${userId}`);
    
    // Transformer les données du webhook vers le format RealtimeData
    const realtimeData = {
      isAsleep: body.is_sleeping || false,
      currentPhase: body.sleep_phase || "awake",
      heartRate: body.heart_rate || 0,
      respirationRate: body.respiration_rate || 0,
      movements: body.movement_count || 0,
      elapsedTime: body.elapsed_minutes || 0,
      estimatedCycles: Math.floor((body.elapsed_minutes || 0) / 90),
      lastUpdated: new Date().toISOString(),
    };
    
    // Sauvegarder les données en temps réel
    await kv.set(`realtime:${userId}`, realtimeData);
    
    return c.json({ 
      message: "Realtime data updated successfully",
      data: realtimeData 
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return c.json({ 
      error: `Failed to process webhook: ${error.message}` 
    }, 500);
  }
});

// Helper function: Transform external API data to SleepyPillow format
function transformExternalDataToSessions(externalData: any) {
  // Exemple de transformation - adaptez selon le format de votre API
  // Supposons que l'API renvoie un tableau d'objets "sleep_records"
  
  if (!externalData.sleep_records || !Array.isArray(externalData.sleep_records)) {
    console.warn("⚠️ No sleep_records found in external data");
    return [];
  }
  
  return externalData.sleep_records.map((record: any) => {
    // Transformer les phases de sommeil
    const phases = (record.sleep_stages || []).map((stage: any) => ({
      type: stage.stage_type, // "light", "deep", "rem", "awake"
      duration: stage.duration_minutes,
      startTime: stage.start_time,
    }));
    
    return {
      id: record.id || crypto.randomUUID(),
      date: record.sleep_date,
      bedTime: record.bed_time,
      wakeTime: record.wake_time,
      duration: record.total_duration_minutes,
      quality: record.sleep_quality_score || 0,
      cycles: record.sleep_cycles || 0,
      phases: phases,
      avgHeartRate: record.avg_heart_rate || 70,
      avgRespiration: record.avg_respiration_rate || 16,
      movements: record.movement_count || 0,
      deepSleepDuration: record.deep_sleep_minutes || 0,
      remDuration: record.rem_sleep_minutes || 0,
      lightSleepDuration: record.light_sleep_minutes || 0,
      awakenings: record.awakening_count || 0,
      temperature: record.room_temperature,
      humidity: record.room_humidity,
      noise: record.noise_level,
    };
  });
}

Deno.serve(app.fetch);