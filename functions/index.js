// Load .env only in local development (not during Firebase deployment)
if(process.env.NODE_ENV !== "production"){
  try{
    require("dotenv").config();
  }catch(e){
    console.warn("dotenv not available:",e.message);
  }
}

const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Stripe - lazy initialization to avoid errors if secret not set
const getStripe = ()=>{
  const secret = process.env.STRIPE_SECRET;
  if(!secret){
    throw new Error("STRIPE_SECRET environment variable not set");
  }
  return require("stripe")(secret);
};
const {routeLLM} = require("./aiProviders");
const {rememberTextForUser} = require("./aiMemory");
const aiBrain = require("./aiBrain");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * ============================================================
 * CREATE CHECKOUT SESSION (CALLABLE)
 * ============================================================
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to create a checkout session."
    );
  }

  const uid = context.auth.uid;
  const email = context.auth.token.email;
  const priceId = data.priceId;

  if (!priceId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing priceId.");
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://wellnesscafe.net/aurora?status=success",
      cancel_url: "https://wellnesscafe.net/upgrade?status=cancelled",
      customer_email: email,
      metadata: { firebaseUid: uid },
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    throw new functions.https.HttpsError("internal", "Unable to create checkout session.");
  }
});


/**
 * ============================================================
 * STRIPE WEBHOOK HANDLER
 * ============================================================
 */
exports.handleStripeWebhook = functions.https.onRequest((req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const firebaseUid = session.metadata?.firebaseUid;

    if (firebaseUid) {
      db.collection("users")
        .doc(firebaseUid)
        .set(
          {
            isPremium: true,
            updatedAt: new Date(),
          },
          { merge: true }
        )
        .then(() => console.log(`✔ Premium enabled for user ${firebaseUid}`))
        .catch((err) => console.error("Error updating user:", err));
    }
  }

  res.json({ received: true });
});


/**
 * ============================================================
 * OXFORD HOUSE SCRAPER FUNCTIONS
 * ============================================================
 * Temporarily commented out - uses deprecated functions.pubsub.schedule
 * TODO: Migrate to Firebase Functions v2+ scheduler API
 */
// const oxfordHouseFunctions = require("./scrapeOxfordHouses");
// exports.scrapeOxfordHousesScheduled = oxfordHouseFunctions.scrapeOxfordHousesScheduled;
// exports.scrapeOxfordHousesManual = oxfordHouseFunctions.scrapeOxfordHousesManual;
// exports.getOxfordScrapingStatus = oxfordHouseFunctions.getOxfordScrapingStatus;

/**
 * ============================================================
 * NEWS PROXY
 * ============================================================
 */
exports.newsProxy = require("./newsProxy");
/**
 * ============================================================
 * AI BRAIN ENDPOINTS
 * ============================================================
 */
// Text + planning (SessionPlan + Templates)
exports.aiSession = functions.https.onRequest((req, res) => {
  return aiBrain.handleSessionRequest(req, res);
});

// Media router (video / tts / stt / images) – scaffolding for later
exports.aiMedia = functions.https.onRequest((req, res) => {
  return aiBrain.handleMediaRequest(req, res);
});

/**
 * ============================================================
 * MULTIMEDIA HELPERS
 * ============================================================
 */

// ElevenLabs (voice generation)
const generateElevenLabsAudio = async(text)=>{
  const key = process.env.ELEVEN_KEY;
  if(!key){throw new Error("ELEVEN_KEY missing");}

  const body = {
    text,
    voice:"Rachel",
    model_id:"eleven_multilingual_v2"
  };

  const resp = await fetch("https://api.elevenlabs.io/v1/text-to-speech",{
    method:"POST",
    headers:{
      "xi-api-key":key,
      "Content-Type":"application/json"
    },
    body:JSON.stringify(body)
  });

  if(!resp.ok){
    const t = await resp.text();
    throw new Error(`ElevenLabs ${resp.status}: ${t}`);
  }

  const audio = await resp.arrayBuffer();
  const base64 = Buffer.from(audio).toString("base64");
  return `data:audio/mp3;base64,${base64}`;
};

// Deepgram (transcription)
const deepgramTranscribe = async(audioBase64)=>{
  const key = process.env.DEEPGRAM_KEY;
  if(!key){throw new Error("DEEPGRAM_KEY missing");}

  const resp = await fetch("https://api.deepgram.com/v1/listen",{
    method:"POST",
    headers:{
      "Authorization":`Token ${key}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      audio:audioBase64
    })
  });

  if(!resp.ok){
    const t = await resp.text();
    throw new Error(`Deepgram ${resp.status}: ${t}`);
  }

  const data = await resp.json();
  return data.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
};

// Runway ML (video generation)
const runwayVideo = async(prompt)=>{
  const key = process.env.RUNWAY_KEY;
  if(!key){throw new Error("RUNWAY_KEY missing");}

  const resp = await fetch("https://api.runwayml.com/v1/videos",{
    method:"POST",
    headers:{
      "Authorization":`Bearer ${key}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      prompt,
      model:"gen-2"
    })
  });

  if(!resp.ok){
    const t = await resp.text();
    throw new Error(`Runway ${resp.status}: ${t}`);
  }

  const data = await resp.json();
  return data.output_url || data.url || "";
};

// Midjourney (image generation)
const midjourneyImage = async(prompt)=>{
  const key = process.env.MIDJOURNEY_KEY;
  if(!key){throw new Error("MIDJOURNEY_KEY missing");}

  const resp = await fetch("https://api.midjourneyapi.io/v2/imagine",{
    method:"POST",
    headers:{
      "Authorization":`Bearer ${key}`,
      "Content-Type":"application/json"
    },
    body:JSON.stringify({prompt})
  });

  if(!resp.ok){
    const t = await resp.text();
    throw new Error(`Midjourney ${resp.status}: ${t}`);
  }

  const data = await resp.json();
  return data.imageUrl || data.url || "";
};

/**
 * ============================================================
 * WELLNESSCAFE AI BRAIN
 * Single entry for multi-agent orchestration
 * ============================================================
 *
 * POST /aiBrain
 * {
 *   task: "session_plan" | "provider_help" | "news_summary" | "free_chat" | "templates" | "generate_audio" | "transcribe_audio" | "generate_video" | "generate_image",
 *   userId: "uid-or-anonymous",
 *   remember: true|false,
 *   provider: "fireworks"|"openai"|"groq",
 *   payload: {...}
 * }
 */
exports.aiBrain = functions.https.onRequest(async(req,res)=>{
  try{
    if(req.method !== "POST"){
      return res.status(405).send("Use POST");
    }

    const {task,userId,remember,provider,payload} = req.body || {};

    // ============================================================
    // MULTIMEDIA ROUTES
    // ============================================================
    if(task === "generate_audio"){
      const audioUrl = await generateElevenLabsAudio(payload?.text || payload?.message || "");
      return res.json({ok:true, audioUrl});
    }

    if(task === "transcribe_audio"){
      const transcript = await deepgramTranscribe(payload?.audioBase64 || "");
      return res.json({ok:true, transcript});
    }

    if(task === "generate_video"){
      const videoUrl = await runwayVideo(payload?.prompt || payload?.message || "");
      return res.json({ok:true, videoUrl});
    }

    if(task === "generate_image"){
      const imgUrl = await midjourneyImage(payload?.prompt || payload?.message || "");
      return res.json({ok:true, imgUrl});
    }

    // ============================================================
    // TEXT-BASED AI ROUTES
    // ============================================================

    // 1) Build system prompt based on task
    let systemPrompt = "You are WELLNESSCAFE AI, a wise, direct, trauma-informed wellness guide. You blend ancient traditions with modern recovery science. You challenge people with love, never glamorize substances, and always prioritize safety.";

    if(task === "session_plan"){
      systemPrompt += " Design a short, structured wellness session (3-6 steps) using check-ins, breathwork, grounding and reflection. Return clear JSON schema when requested.";
    }else if(task === "provider_help"){
      systemPrompt += " Help the user understand what kind of wellness provider or modality might fit their situation, and suggest next steps in simple language.";
    }else if(task === "news_summary"){
      systemPrompt += " Summarize wellness-related news in calm, non-alarmist language, focusing on what is actionable and supportive.";
    }else if(task === "templates"){
      systemPrompt += " Generate 6 personalized wellness session templates. Return a JSON array with: id, title, summary, minutes, steps (number), level, icon, intent. Make them diverse and helpful.";
    }

    // 2) Build user message
    const userMsg = payload?.message || "Help me with a wellness session.";

    const messages = [
      {role:"user",content:userMsg}
    ];

    // 3) LLM call (Fireworks/OpenAI/Groq)
    const llmResult = await routeLLM({
      task,
      provider,
      fast: task === "news_summary",
      systemPrompt,
      messages
    });

    const replyText = llmResult.text || "";

    // 4) Optional long-term memory
    if(remember && userId){
      try{
        await rememberTextForUser({
          userId,
          topic: task || "general",
          text: `User: ${userMsg}\nAssistant: ${replyText}`
        });
      }catch(memErr){
        console.warn("Memory error:",memErr);
      }
    }

    return res.json({
      ok:true,
      task,
      provider:llmResult.provider,
      reply:replyText
    });
  }catch(err){
    console.error("aiBrain error:",err);
    return res.status(500).json({
      ok:false,
      error:err.message || "AI error"
    });
  }
});
