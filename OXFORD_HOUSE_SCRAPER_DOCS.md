# Oxford House Scraper - Complete Documentation

## Overview

Automated web scraping system for Oxford House vacancy data from oxfordvacancies.com. Keeps sober living homes directory fresh with real-time availability information.

## Architecture

### Components

1. **Data Schema** (`src/schemas/oxfordHouseSchema.js`)

   - Normalized data structure for Oxford House records
   - Validation and transformation functions
   - Helper utilities for filtering, sorting, searching

2. **Cloud Functions** (`functions/scrapeOxfordHouses.js`)

   - Web scraper using axios + cheerio
   - Scheduled daily runs at 2 AM EST
   - Manual trigger endpoint for on-demand scraping
   - Status/metadata endpoint

3. **Frontend Integration** (`src/Views/SoberHomesState.jsx`)
   - Displays Oxford Houses alongside traditional sober homes
   - Real-time vacancy indicators
   - Data freshness warnings
   - Advanced filtering (gender, vacancies only, city)

## Data Schema

### Oxford House Record Structure

```javascript
{
  id: "house-name-city-state",           // Unique identifier
  houseName: "Abbey Road",                // House name
  gender: "M",                            // M, W, or MC (Men + Children)
  city: "Corpus Christi",                 // City location
  state: "TX",                            // State abbreviation
  phone: "(361) 334-1097",                // House phone
  county: "Nueces",                       // County name
  manager: "Robert M.",                   // Manager name
  managerPhone: "(361) 885-1289",         // Manager phone
  meetingTime: "Mon 8:00pm",              // House meeting schedule
  capacity: 8,                            // Total beds
  vacancies: 2,                           // Available beds
  lastUpdated: Timestamp,                 // When data was last updated on source
  scrapedAt: Timestamp,                   // When we scraped this data
  sourceUrl: "https://oxfordvacancies.com",
  hasVacancy: true,                       // Quick filter flag

  // Structured nested data
  address: {
    city: "Corpus Christi",
    state: "TX",
    county: "Nueces"
  },

  contact: {
    housePhone: "(361) 334-1097",
    managerName: "Robert M.",
    managerPhone: "(361) 885-1289"
  },

  availability: {
    totalBeds: 8,
    vacantBeds: 2,
    meetingSchedule: "Mon 8:00pm",
    lastUpdated: Timestamp
  }
}
```

## Cloud Functions

### 1. Scheduled Scraper

**Function Name:** `scrapeOxfordHousesScheduled`

**Trigger:** Pub/Sub schedule (daily at 2 AM EST)

**Schedule:** `0 2 * * *` (cron format)

**What it does:**

- Fetches oxfordvacancies.com homepage
- Parses HTML table with house listings
- Extracts all house data (name, gender, city, phone, county, manager, capacity, vacancies, etc.)
- Normalizes and validates data
- Saves to Firestore:
  - `oxfordHouses/{houseId}` - Main collection
  - `soberHomes/{state}/homes/{houseId}` - State-specific sub-collections
- Updates scraping metadata with stats

**Deploy:**

```bash
cd functions
npm install
firebase deploy --only functions:scrapeOxfordHousesScheduled
```

### 2. Manual Trigger

**Function Name:** `scrapeOxfordHousesManual`

**Trigger:** HTTPS POST request

**Endpoint:** `https://us-central1-[project-id].cloudfunctions.net/scrapeOxfordHousesManual`

**Usage:**

```bash
curl -X POST https://us-central1-[project-id].cloudfunctions.net/scrapeOxfordHousesManual
```

**Response:**

```json
{
  "success": true,
  "message": "Scraping completed successfully",
  "results": {
    "timestamp": "2025-11-11T10:30:00Z",
    "totalHouses": 1234,
    "housesWithVacancies": 456,
    "statesProcessed": 48,
    "success": true
  }
}
```

### 3. Status Endpoint

**Function Name:** `getOxfordScrapingStatus`

**Trigger:** HTTPS GET request

**Endpoint:** `https://us-central1-[project-id].cloudfunctions.net/getOxfordScrapingStatus`

**Usage:**

```bash
curl https://us-central1-[project-id].cloudfunctions.net/getOxfordScrapingStatus
```

**Response:**

```json
{
  "success": true,
  "metadata": {
    "lastScraped": "2025-11-11T02:00:00Z",
    "totalHouses": 1234,
    "housesWithVacancies": 456,
    "statesProcessed": 48,
    "stateBreakdown": {
      "TN": 45,
      "TX": 67,
      "FL": 89,
      ...
    },
    "success": true
  }
}
```

## Frontend Features

### SoberHomesState Component Updates

**New State Variables:**

```javascript
const [oxfordHouses, setOxfordHouses] = useState([]);
const [scrapingMetadata, setScrapingMetadata] = useState(null);
const [showOnlyVacancies, setShowOnlyVacancies] = useState(false);
const [genderFilter, setGenderFilter] = useState("");
```

**Data Freshness Indicator:**

- Green banner: Data scraped within last 7 days
- Yellow banner: Data older than 7 days (stale warning)
- Shows last scraped timestamp
- Displays total houses and vacancy counts

**Enhanced Filtering:**

- **Gender Filter:** Men, Women, Men + Children
- **Vacancy Filter:** Show only houses with available beds
- **City Filter:** Filter by specific cities
- **Search:** Search across name, city, county

**Oxford House Card Display:**

- Blue left border to distinguish from regular homes
- "Oxford House" badge
- Vacancy status with color coding (green = available, red = full)
- Gender, capacity, meeting time
- House and manager contact info
- Last updated timestamp

## Firestore Structure

```
oxfordHouses (collection)
  ├── {houseId} (document)
  │   ├── houseName: string
  │   ├── gender: string
  │   ├── city: string
  │   ├── state: string
  │   ├── vacancies: number
  │   └── ... (full schema)

soberHomes (collection)
  ├── {state} (document)
  │   └── homes (sub-collection)
  │       └── {houseId} (document)
  │           └── ... (same schema)

scrapingMetadata (collection)
  └── oxfordHouses (document)
      ├── lastScraped: Timestamp
      ├── totalHouses: number
      ├── housesWithVacancies: number
      ├── statesProcessed: number
      ├── stateBreakdown: object
      └── success: boolean
```

## Deployment Guide

### Step 1: Deploy Cloud Functions

```bash
cd /Users/mouthcouture/Documents/GitHub/Wellcafeland/functions

# Install dependencies (already done)
npm install

# Deploy all new functions
firebase deploy --only functions:scrapeOxfordHousesScheduled,functions:scrapeOxfordHousesManual,functions:getOxfordScrapingStatus
```

### Step 2: Set Up Cloud Scheduler (First Time Only)

The scheduled function automatically creates a Cloud Scheduler job on first deploy. Verify in Firebase Console:

1. Go to Google Cloud Console
2. Navigate to Cloud Scheduler
3. Look for job: `firebase-schedule-scrapeOxfordHousesScheduled-us-central1`
4. Confirm schedule: `0 2 * * *` (2 AM daily EST)

### Step 3: Initial Manual Scrape

Trigger first scrape manually to populate data:

```bash
# Get your project ID
firebase projects:list

# Trigger manual scrape
curl -X POST https://us-central1-[YOUR-PROJECT-ID].cloudfunctions.net/scrapeOxfordHousesManual
```

### Step 4: Deploy Frontend

```bash
cd /Users/mouthcouture/Documents/GitHub/Wellcafeland

# Build React app
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Step 5: Update Firestore Security Rules

Ensure rules allow reading Oxford House data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Oxford Houses - public read
    match /oxfordHouses/{houseId} {
      allow read: if true;
      allow write: if false; // Only Cloud Functions can write
    }

    // Sober homes by state - public read
    match /soberHomes/{state}/homes/{houseId} {
      allow read: if true;
      allow write: if false;
    }

    // Scraping metadata - public read
    match /scrapingMetadata/{docId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

## Testing

### Test Manual Scraper

```bash
# Trigger scrape
curl -X POST https://us-central1-[PROJECT-ID].cloudfunctions.net/scrapeOxfordHousesManual

# Check status
curl https://us-central1-[PROJECT-ID].cloudfunctions.net/getOxfordScrapingStatus
```

### Test Frontend Integration

1. Navigate to: `https://[your-app].web.app/resources/soberLivingHomes/tennessee`
2. Verify:
   - ✅ Data freshness indicator appears at top
   - ✅ Oxford Houses display with blue border
   - ✅ Vacancy filter works
   - ✅ Gender filter works
   - ✅ Contact buttons work (Call House, Call Manager)
   - ✅ Last updated timestamp shows for each house

### Test Scheduled Function

Wait for scheduled run (2 AM EST) or check logs:

```bash
firebase functions:log --only scrapeOxfordHousesScheduled
```

## Monitoring & Maintenance

### Check Scraping Logs

```bash
# View all function logs
firebase functions:log

# Filter for scraper logs
firebase functions:log --only scrapeOxfordHousesScheduled
```

### Monitor Data Freshness

- Frontend shows warning if data > 7 days old
- Check scraping metadata document in Firestore
- Set up Cloud Monitoring alerts for function failures

### Update County-to-State Mapping

The scraper includes a basic county-to-state mapping. To improve accuracy:

1. Edit `functions/scrapeOxfordHouses.js`
2. Update `inferStateFromCounty()` function
3. Add more county mappings
4. Redeploy: `firebase deploy --only functions:scrapeOxfordHousesScheduled`

### Handle Scraping Errors

If scraping fails:

1. Check function logs for errors
2. Verify oxfordvacancies.com is accessible
3. Check if website HTML structure changed
4. Update cheerio selectors if needed
5. Redeploy functions

## Cost Estimates

### Cloud Functions

- **Scheduled runs:** 30 invocations/month (daily) × ~30 seconds = ~$0.05/month
- **Manual triggers:** Negligible (occasional use)
- **Status endpoint:** Negligible (read-only, fast)

### Firestore

- **Storage:** ~1.5 MB (1,500 houses × 1 KB each) = Free tier
- **Reads:** ~10,000/month from users = Free tier
- **Writes:** ~1,500/day (one per house) × 30 days = ~45,000/month = Free tier

**Total estimated cost: $0-5/month** (well within Firebase free tier)

## Performance Optimization

### Scraper

- ✅ Batch Firestore writes (500 ops per batch)
- ✅ Efficient HTML parsing with cheerio
- ✅ Error handling with retry logic
- ✅ Timeout protection (30 seconds)

### Frontend

- ✅ Efficient Firestore queries (state-specific sub-collections)
- ✅ Client-side filtering and pagination
- ✅ Lazy loading of house data
- ✅ Cached scraping metadata

## Future Enhancements

### Phase 2 (Planned)

1. **Email Alerts:** Notify users when vacancies open in their area
2. **Favorite Houses:** Let users save and track specific houses
3. **Historical Data:** Track vacancy trends over time
4. **Multi-Source Aggregation:** Scrape additional sober living directories
5. **Admin Dashboard:** View scraping stats, trigger manual scrapes, monitor errors
6. **Change Detection:** Only update changed records to reduce writes
7. **Geolocation:** Add lat/long for map visualization
8. **Reviews:** Allow users to rate and review Oxford Houses

### Phase 3 (Future)

1. **AI Recommendations:** Match users to best-fit houses based on preferences
2. **Real-time Notifications:** Push notifications for new vacancies
3. **Booking Integration:** Allow users to contact or apply directly
4. **Mobile App:** Native iOS/Android apps
5. **SMS Alerts:** Text message notifications for vacancies

## Troubleshooting

### "No Oxford Houses showing up"

1. Check if scraper has run: Call `/getOxfordScrapingStatus`
2. Trigger manual scrape: Call `/scrapeOxfordHousesManual`
3. Check Firestore data exists in `oxfordHouses` collection
4. Verify frontend is querying correct collection

### "Data freshness indicator not showing"

1. Check if `scrapingMetadata/oxfordHouses` document exists
2. Verify frontend is fetching metadata
3. Check browser console for errors

### "Gender/vacancy filters not working"

1. Verify `isOxfordHouse` flag is set on records
2. Check filter logic in `SoberHomesState.jsx`
3. Ensure schema has `gender` and `hasVacancy` fields

### "Scheduled scraper not running"

1. Check Cloud Scheduler job exists
2. Verify job is enabled
3. Check function logs for errors
4. Confirm Pub/Sub topic exists

## Support & Contact

For issues or questions:

- Check function logs: `firebase functions:log`
- Review Firestore security rules
- Verify API endpoints are accessible
- Contact development team

---

**Last Updated:** November 11, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
