/**
 * OXFORD HOUSE SCRAPER
 *
 * Firebase Cloud Function to scrape Oxford House vacancy data from oxfordvacancies.com
 * Runs on schedule to keep data fresh
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

// Initialize admin if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Scrapes Oxford House vacancy data from oxfordvacancies.com
 * @returns {Promise<Object>} Scraping results with stats
 */
async function scrapeOxfordVacancies() {
  const url = "https://oxfordvacancies.com/Default.aspx";
  const results = {
    timestamp: new Date(),
    totalHouses: 0,
    housesWithVacancies: 0,
    statesProcessed: 0,
    errors: [],
    success: false,
  };

  try {
    console.log("Starting Oxford House scrape...");

    // Fetch the page
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      timeout: 30000, // 30 second timeout
    });

    console.log("Page fetched, parsing HTML...");

    // Parse HTML
    const $ = cheerio.load(response.data);

    // Find the main table with house data
    // Based on the webpage structure, houses are in table rows
    const houses = [];
    const stateMap = {};

    // Find all table rows (tr) that contain house data
    // The table has columns: Name, Gender, City, Phone, County, Manager, Manager Phone, Meeting Time, Capacity, Vacancies, etc.
    $("table tr").each((i, row) => {
      const $row = $(row);
      const cells = $row.find("td");

      // Skip header rows or empty rows
      if (cells.length < 10) return;

      try {
        // Extract data from each cell
        const houseName = $(cells[0]).text().trim();
        const gender = $(cells[1]).text().trim();
        const city = $(cells[2]).text().trim();
        const phone = $(cells[3]).text().trim();
        const county = $(cells[4]).text().trim();
        const manager = $(cells[5]).text().trim();
        const managerPhone = $(cells[6]).text().trim();
        const meetingTime = $(cells[7]).text().trim();
        const capacity = parseInt($(cells[8]).text().trim(), 10) || 0;
        const vacancies = parseInt($(cells[9]).text().trim(), 10) || 0;
        const lastUpdatedStr = $(cells[11]).text().trim(); // Last updated timestamp

        // Skip if no house name
        if (!houseName) return;

        // Parse last updated date
        let lastUpdated = null;
        if (lastUpdatedStr) {
          try {
            lastUpdated = new Date(lastUpdatedStr);
            if (isNaN(lastUpdated.getTime())) lastUpdated = new Date();
          } catch (e) {
            lastUpdated = new Date();
          }
        } else {
          lastUpdated = new Date();
        }

        // Determine state from city/county (would need mapping or inference)
        // For now, we'll infer from the county or use a lookup
        const state = inferStateFromCounty(county, city);

        const house = {
          id: generateHouseId(houseName, city, state),
          houseName,
          gender: gender.toUpperCase(),
          city,
          state,
          phone,
          county,
          manager,
          managerPhone,
          meetingTime,
          capacity,
          vacancies,
          lastUpdated: admin.firestore.Timestamp.fromDate(lastUpdated),
          scrapedAt: admin.firestore.Timestamp.fromDate(new Date()),
          sourceUrl: url,
          hasVacancy: vacancies > 0,

          // Structured data
          address: {
            city,
            state,
            county,
          },

          contact: {
            housePhone: phone,
            managerName: manager,
            managerPhone,
          },

          availability: {
            totalBeds: capacity,
            vacantBeds: vacancies,
            meetingSchedule: meetingTime,
            lastUpdated: admin.firestore.Timestamp.fromDate(lastUpdated),
          },
        };

        houses.push(house);

        // Track states
        if (!stateMap[state]) stateMap[state] = 0;
        stateMap[state]++;

        if (vacancies > 0) results.housesWithVacancies++;
      } catch (err) {
        console.error("Error parsing row:", err);
        results.errors.push(`Row ${i}: ${err.message}`);
      }
    });

    console.log(
      `Parsed ${houses.length} houses from ${
        Object.keys(stateMap).length
      } states`
    );

    // Save to Firestore
    const batch = db.batch();
    let batchCount = 0;
    const BATCH_LIMIT = 500;

    for (const house of houses) {
      // Save to main collection
      const docRef = db.collection("oxfordHouses").doc(house.id);
      batch.set(docRef, house, { merge: true });
      batchCount++;

      // Also save to state-specific sub-collection for faster queries
      const stateDocRef = db
        .collection("soberHomes")
        .doc(house.state.toLowerCase())
        .collection("homes")
        .doc(house.id);
      batch.set(stateDocRef, house, { merge: true });
      batchCount++;

      // Commit batch if limit reached
      if (batchCount >= BATCH_LIMIT) {
        await batch.commit();
        batchCount = 0;
        console.log(`Committed batch of ${BATCH_LIMIT} operations`);
      }
    }

    // Commit remaining
    if (batchCount > 0) {
      await batch.commit();
      console.log(`Committed final batch of ${batchCount} operations`);
    }

    // Save scraping metadata
    await db
      .collection("scrapingMetadata")
      .doc("oxfordHouses")
      .set({
        lastScraped: admin.firestore.Timestamp.fromDate(new Date()),
        totalHouses: houses.length,
        housesWithVacancies: results.housesWithVacancies,
        statesProcessed: Object.keys(stateMap).length,
        stateBreakdown: stateMap,
        success: true,
      });

    results.totalHouses = houses.length;
    results.statesProcessed = Object.keys(stateMap).length;
    results.success = true;

    console.log("Scraping completed successfully!");
    console.log(`Total houses: ${results.totalHouses}`);
    console.log(`Houses with vacancies: ${results.housesWithVacancies}`);
    console.log(`States processed: ${results.statesProcessed}`);

    return results;
  } catch (error) {
    console.error("Scraping error:", error);
    results.errors.push(error.message);
    results.success = false;

    // Log error to Firestore
    await db
      .collection("scrapingMetadata")
      .doc("oxfordHouses")
      .set(
        {
          lastScraped: admin.firestore.Timestamp.fromDate(new Date()),
          lastError: error.message,
          success: false,
        },
        { merge: true }
      );

    throw error;
  }
}

/**
 * Infers state from county and city
 * This is a simplified version - in production, use a comprehensive county->state mapping
 */
function inferStateFromCounty(county, city) {
  // State mapping based on common county names
  const countyStateMap = {
    // Tennessee
    Davidson: "TN",
    Shelby: "TN",
    Montgomery: "TN",

    // North Carolina
    Mecklenburg: "NC",
    Wake: "NC",
    Catawba: "NC",
    Craven: "NC",
    Rowan: "NC",

    // New Jersey
    Monmouth: "NJ",

    // Florida
    Orange: "FL",
    Marion: "FL",
    "St. Lucie": "FL",
    Nueces: "TX",

    // Texas
    Travis: "TX",
    Taylor: "TX",

    // Louisiana
    "Orleans Parish": "LA",
    "East Baton Rouge Parish": "LA",

    // Virginia
    Lynchburg: "VA",

    // Kansas
    Shawnee: "KS",

    // Iowa
    Woodbury: "IA",

    // Washington
    Snohomish: "WA",
    Clark: "WA",

    // New York
    Niagara: "NY",

    // Indiana
    Clark: "IN",

    // Mississippi
    Madison: "MS",

    // Default fallback
  };

  return countyStateMap[county] || "US"; // Default to US if unknown
}

/**
 * Generates unique house ID
 */
function generateHouseId(name, city, state) {
  const slug = `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug;
}

/**
 * Scheduled function - runs daily at 2 AM EST
 * Cloud Scheduler: 0 2 * * * (daily at 2 AM)
 */
exports.scrapeOxfordHousesScheduled = functions.pubsub
  .schedule("0 2 * * *")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    console.log("Scheduled Oxford House scraping triggered");
    try {
      const results = await scrapeOxfordVacancies();
      console.log("Scheduled scraping completed:", results);
      return results;
    } catch (error) {
      console.error("Scheduled scraping failed:", error);
      throw error;
    }
  });

/**
 * Manual trigger via HTTPS endpoint (authenticated)
 * URL: https://us-central1-<project-id>.cloudfunctions.net/scrapeOxfordHousesManual
 */
exports.scrapeOxfordHousesManual = functions.https.onRequest(
  async (req, res) => {
    // CORS
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "POST");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      // Optional: Add authentication check here
      // const token = req.headers.authorization?.split('Bearer ')[1];
      // await admin.auth().verifyIdToken(token);

      console.log("Manual scraping triggered via HTTPS");
      const results = await scrapeOxfordVacancies();

      return res.status(200).json({
        success: true,
        message: "Scraping completed successfully",
        results,
      });
    } catch (error) {
      console.error("Manual scraping failed:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

/**
 * Get scraping status and metadata
 */
exports.getOxfordScrapingStatus = functions.https.onRequest(
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Methods", "GET");
      res.set("Access-Control-Allow-Headers", "Content-Type");
      return res.status(204).send("");
    }

    try {
      const doc = await db
        .collection("scrapingMetadata")
        .doc("oxfordHouses")
        .get();

      if (!doc.exists) {
        return res.status(404).json({
          error: "No scraping data available",
          message: "Scraper has not run yet",
        });
      }

      const data = doc.data();

      return res.status(200).json({
        success: true,
        metadata: {
          lastScraped: data.lastScraped?.toDate(),
          totalHouses: data.totalHouses || 0,
          housesWithVacancies: data.housesWithVacancies || 0,
          statesProcessed: data.statesProcessed || 0,
          stateBreakdown: data.stateBreakdown || {},
          success: data.success || false,
          lastError: data.lastError || null,
        },
      });
    } catch (error) {
      console.error("Error fetching scraping status:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
