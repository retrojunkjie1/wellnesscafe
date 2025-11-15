/**
 * OXFORD HOUSE DATA SCHEMA
 *
 * Defines the normalized data structure for Oxford House sober living homes
 * scraped from oxfordvacancies.com
 */

/**
 * Oxford House Record Schema
 * @typedef {Object} OxfordHouse
 * @property {string} id - Unique identifier (slugified house name + state)
 * @property {string} houseName - Name of the house
 * @property {string} gender - Gender served: 'M' (Men), 'W' (Women), 'MC' (Men + Children)
 * @property {string} city - City location
 * @property {string} state - State abbreviation (derived from context)
 * @property {string} phone - House phone number
 * @property {string} county - County name
 * @property {string} manager - Manager/contact name
 * @property {string} managerPhone - Manager's phone number
 * @property {string} meetingTime - House meeting schedule (e.g., "Sun 11:00pm")
 * @property {number} capacity - Total bed capacity
 * @property {number} vacancies - Current available beds
 * @property {Date} lastUpdated - Last updated timestamp from source
 * @property {Date} scrapedAt - When this record was scraped
 * @property {string} sourceUrl - Source URL (oxfordvacancies.com)
 * @property {boolean} hasVacancy - Quick filter flag (vacancies > 0)
 * @property {Object} address - Structured address
 * @property {string} address.city
 * @property {string} address.state
 * @property {string} address.county
 * @property {Object} contact - Contact information
 * @property {string} contact.housePhone
 * @property {string} contact.managerName
 * @property {string} contact.managerPhone
 * @property {Object} availability - Availability details
 * @property {number} availability.totalBeds
 * @property {number} availability.vacantBeds
 * @property {string} availability.meetingSchedule
 * @property {Date} availability.lastUpdated
 */

/**
 * Validates an Oxford House record
 * @param {Object} house - House data to validate
 * @returns {boolean} True if valid
 */
export function validateOxfordHouse(house) {
  if (!house) return false;

  // Required fields
  if (!house.houseName || typeof house.houseName !== "string") return false;
  if (!house.city || typeof house.city !== "string") return false;
  if (!house.gender || !["M", "W", "MC"].includes(house.gender)) return false;
  if (!house.county || typeof house.county !== "string") return false;

  // Numeric validations
  if (typeof house.capacity !== "number" || house.capacity < 0) return false;
  if (typeof house.vacancies !== "number" || house.vacancies < 0) return false;

  // Date validations
  if (house.lastUpdated && !(house.lastUpdated instanceof Date)) return false;
  if (house.scrapedAt && !(house.scrapedAt instanceof Date)) return false;

  return true;
}

/**
 * Normalizes raw scraped data into schema format
 * @param {Object} raw - Raw scraped data
 * @param {string} state - State abbreviation
 * @returns {OxfordHouse} Normalized house record
 */
export function normalizeOxfordHouse(raw, state = "unknown") {
  const houseName = String(raw.houseName || "").trim();
  const city = String(raw.city || "").trim();

  // Generate unique ID
  const id = generateHouseId(houseName, city, state);

  // Parse capacity and vacancies
  const capacity = parseInt(raw.capacity, 10) || 0;
  const vacancies = parseInt(raw.vacancies, 10) || 0;

  // Parse last updated date
  let lastUpdated = null;
  if (raw.lastUpdated) {
    try {
      lastUpdated = new Date(raw.lastUpdated);
      if (isNaN(lastUpdated.getTime())) lastUpdated = null;
    } catch (e) {
      lastUpdated = null;
    }
  }

  return {
    id,
    houseName,
    gender: String(raw.gender || "M").toUpperCase(),
    city,
    state: state.toUpperCase(),
    phone: cleanPhone(raw.phone),
    county: String(raw.county || "").trim(),
    manager: String(raw.manager || "").trim(),
    managerPhone: cleanPhone(raw.managerPhone),
    meetingTime: String(raw.meetingTime || "").trim(),
    capacity,
    vacancies,
    lastUpdated,
    scrapedAt: new Date(),
    sourceUrl: "https://oxfordvacancies.com",
    hasVacancy: vacancies > 0,

    // Structured nested data
    address: {
      city,
      state: state.toUpperCase(),
      county: String(raw.county || "").trim(),
    },

    contact: {
      housePhone: cleanPhone(raw.phone),
      managerName: String(raw.manager || "").trim(),
      managerPhone: cleanPhone(raw.managerPhone),
    },

    availability: {
      totalBeds: capacity,
      vacantBeds: vacancies,
      meetingSchedule: String(raw.meetingTime || "").trim(),
      lastUpdated: lastUpdated || new Date(),
    },
  };
}

/**
 * Generates a unique ID for a house
 * @param {string} name - House name
 * @param {string} city - City
 * @param {string} state - State
 * @returns {string} Unique ID
 */
export function generateHouseId(name, city, state) {
  const slug = `${name}-${city}-${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug;
}

/**
 * Cleans phone number to consistent format
 * @param {string} phone - Raw phone number
 * @returns {string} Cleaned phone number
 */
export function cleanPhone(phone) {
  if (!phone) return "";
  return String(phone).trim();
}

/**
 * Checks if data is stale (older than specified days)
 * @param {Date} lastUpdated - Last update timestamp
 * @param {number} maxDays - Maximum days before considered stale
 * @returns {boolean} True if stale
 */
export function isDataStale(lastUpdated, maxDays = 7) {
  if (!lastUpdated || !(lastUpdated instanceof Date)) return true;

  const now = new Date();
  const diffMs = now - lastUpdated;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays > maxDays;
}

/**
 * Formats availability status for display
 * @param {OxfordHouse} house - House record
 * @returns {string} Formatted status
 */
export function formatAvailabilityStatus(house) {
  if (!house) return "Unknown";

  const { vacancies, capacity } = house;

  if (vacancies === 0) return "Full";
  if (vacancies === 1) return "1 bed available";
  if (vacancies === capacity) return `${capacity} beds available (Empty)`;

  return `${vacancies} of ${capacity} beds available`;
}

/**
 * Groups houses by state
 * @param {OxfordHouse[]} houses - Array of houses
 * @returns {Object} Houses grouped by state
 */
export function groupByState(houses) {
  return houses.reduce((acc, house) => {
    const state = house.state || "unknown";
    if (!acc[state]) acc[state] = [];
    acc[state].push(house);
    return acc;
  }, {});
}

/**
 * Groups houses by city
 * @param {OxfordHouse[]} houses - Array of houses
 * @returns {Object} Houses grouped by city
 */
export function groupByCity(houses) {
  return houses.reduce((acc, house) => {
    const city = house.city || "unknown";
    if (!acc[city]) acc[city] = [];
    acc[city].push(house);
    return acc;
  }, {});
}

/**
 * Filters houses with vacancies
 * @param {OxfordHouse[]} houses - Array of houses
 * @returns {OxfordHouse[]} Houses with available beds
 */
export function filterWithVacancies(houses) {
  return houses.filter((h) => h.hasVacancy);
}

/**
 * Filters houses by gender
 * @param {OxfordHouse[]} houses - Array of houses
 * @param {string} gender - Gender filter ('M', 'W', 'MC')
 * @returns {OxfordHouse[]} Filtered houses
 */
export function filterByGender(houses, gender) {
  if (!gender) return houses;
  return houses.filter((h) => h.gender === gender.toUpperCase());
}

/**
 * Sorts houses by vacancy count (descending)
 * @param {OxfordHouse[]} houses - Array of houses
 * @returns {OxfordHouse[]} Sorted houses
 */
export function sortByVacancies(houses) {
  return [...houses].sort((a, b) => b.vacancies - a.vacancies);
}

/**
 * Searches houses by name or city
 * @param {OxfordHouse[]} houses - Array of houses
 * @param {string} query - Search query
 * @returns {OxfordHouse[]} Matching houses
 */
export function searchHouses(houses, query) {
  if (!query || !query.trim()) return houses;

  const searchTerm = query.toLowerCase().trim();

  return houses.filter((house) => {
    const nameMatch = house.houseName.toLowerCase().includes(searchTerm);
    const cityMatch = house.city.toLowerCase().includes(searchTerm);
    const countyMatch = house.county.toLowerCase().includes(searchTerm);

    return nameMatch || cityMatch || countyMatch;
  });
}

export default {
  validateOxfordHouse,
  normalizeOxfordHouse,
  generateHouseId,
  cleanPhone,
  isDataStale,
  formatAvailabilityStatus,
  groupByState,
  groupByCity,
  filterWithVacancies,
  filterByGender,
  sortByVacancies,
  searchHouses,
};
