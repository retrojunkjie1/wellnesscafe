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
 * EXISTING FUNCTIONS GO HERE
 * ============================================================
 */
exports.scrapeOxfordHousesScheduled = require("./scrapeOxfordHouses");
exports.newsProxy = require("./newsProxy");
