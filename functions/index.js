const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe = require("stripe")(functions.config().stripe.secret);

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
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event;

  try {
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
 */
const oxfordHouseFunctions = require("./scrapeOxfordHouses");
exports.scrapeOxfordHousesScheduled = oxfordHouseFunctions.scrapeOxfordHousesScheduled;
exports.scrapeOxfordHousesManual = oxfordHouseFunctions.scrapeOxfordHousesManual;
exports.getOxfordScrapingStatus = oxfordHouseFunctions.getOxfordScrapingStatus;

/**
 * ============================================================
 * NEWS PROXY
 * ============================================================
 */
exports.newsProxy = require("./newsProxy");
/**
 * ============================================================
 * AI SESSION GENERATOR
 * - mode: "session"    → returns a single sessionPlan
 * - mode: "templates"  → returns 6 personalized templates
 * ============================================================
 */
exports.aiSession = functions.https.onRequest(async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed. Use POST.");
    }

    const {mode, intent, mood, duration, userId, timeOfDay} = req.body || {};

    // Very simple personalization hooks for now
    const safeIntent = intent || "calm_anxiety";
    const safeMood = mood || "neutral";
    const safeDuration = duration || 5;
    const safeUserId = userId || "anonymous";
    const safeTimeOfDay = timeOfDay || "any";

    // Mode 1: return 6 AI-style templates for the Templates page
    if (mode === "templates") {
      // In the future this is where we'll use Firestore + real LLM calls
      const templates = [
        {
          id: `ai-${safeUserId}-1`,
          intent: "quick_reset",
          title: "5-Minute Nervous System Reset",
          summary: "Fast grounding sequence tuned for your current state.",
          minutes: 5,
          moodTarget: safeMood,
          level: "Beginner",
          icon: "😊",
          steps: 3
        },
        {
          id: `ai-${safeUserId}-2`,
          intent: "sleep_prep",
          title: "Quick Sleep Wind-Down",
          summary: "Breath and body awareness to help you drop into rest.",
          minutes: 8,
          moodTarget: "restless",
          level: "Beginner",
          icon: "😴",
          steps: 2
        },
        {
          id: `ai-${safeUserId}-3`,
          intent: "morning_reset",
          title: "Morning Energy + Intention",
          summary: "Activate your body, then lock in a clean intention.",
          minutes: 7,
          moodTarget: "low_energy",
          level: "All Levels",
          icon: "🌅",
          steps: 3
        },
        {
          id: `ai-${safeUserId}-4`,
          intent: "craving_wave",
          title: "Ride The Craving Wave",
          summary: "Urge surfing micro-session for intense cravings.",
          minutes: 6,
          moodTarget: "triggered",
          level: "All Levels",
          icon: "🌊",
          steps: 3
        },
        {
          id: `ai-${safeUserId}-5`,
          intent: "grounding",
          title: "Body Scan Grounding",
          summary: "Slow body scan to drop out of looping thoughts.",
          minutes: 10,
          moodTarget: "anxious",
          level: "Intermediate",
          icon: "🧘‍♂️",
          steps: 4
        },
        {
          id: `ai-${safeUserId}-6`,
          intent: "reflection",
          title: "End-Of-Day Reset",
          summary: "Close your day with gentle reflection and release.",
          minutes: 9,
          moodTarget: safeMood,
          level: "All Levels",
          icon: "🌙",
          steps: 3
        }
      ];

      return res.status(200).send({
        sessionPlan: {
          mode: "templates",
          userId: safeUserId,
          timeOfDay: safeTimeOfDay,
          templates
        }
      });
    }

    // Mode 2: default single-session plan (used by SessionDemoPage)
    const mockSessionPlan = {
      title: "AI Generated Wellness Session",
      intent: safeIntent,
      mood: safeMood,
      duration: safeDuration,
      steps: [
        {type: "CHECK_IN", title: "Start Here"},
        {type: "BREATH", pattern: "4-4-6"},
        {type: "MEDITATION", script: "You are safe."}
      ]
    };

    return res.status(200).send({sessionPlan: mockSessionPlan});
  } catch (err) {
    console.error("AI Session Error:", err);
    return res.status(500).send({error: "Internal Server Error"});
  }
});
