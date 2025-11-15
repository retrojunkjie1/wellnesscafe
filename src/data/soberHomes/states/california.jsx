const data = {
  state: "California",
  code: "CA",
  category: "Sober Living Homes",
  homes: [
    // ── Southern California: LA / OC / Inland Empire ─────────────────────────
    {
      name: "LA Sober Living Coalition Homes",
      city: "Los Angeles",
      type: "Sober Living Home",
      subCategory: "Certified / 12-Step",
      description:
        "Network of inspected sober living environments across LA County.",
      apply: "Contact coalition home directly; some accept MAT.",
      contact: "https://lasoberlivingcoalition.org",
    },
    {
      name: "Clare|Matrix – Transitional Recovery Housing",
      city: "Santa Monica",
      type: "Transitional Housing",
      subCategory: "Co-Occurring / Low-Income",
      description:
        "Step-down housing for clients exiting Clare|Matrix treatment.",
      apply: "Referral from Clare|Matrix.",
      contact: "https://www.clarematrix.org",
    },
    {
      name: "The Salvation Army – Bell Shelter / LA Metro",
      city: "Los Angeles",
      type: "Transitional / Recovery Housing",
      subCategory: "Men & Women",
      description:
        "Large-scale recovery and housing program; sober environment.",
      apply: "Call local Salvation Army intake.",
      contact: "https://socal.salvationarmy.org",
    },
    {
      name: "Orange County Recovery Residences (multiple operators)",
      city: "Costa Mesa / Newport Beach / Santa Ana",
      type: "Sober Living Home",
      subCategory: "Private / 12-Step / MAT-Friendly (varies)",
      description:
        "High-density recovery housing region serving OC treatment centers.",
      apply: "Call operator directly; verify licensing.",
      contact: "OC recovery directories",
    },
    // ── Women / Family ─────────────────────────
    {
      name: "Prototypes – Women’s Center Transitional Housing",
      city: "Pomona / LA County",
      type: "Women & Children Recovery Housing",
      subCategory: "Pregnant / Parenting",
      description:
        "Substance use treatment with associated housing for women and children.",
      apply: "Apply through Prototypes intake.",
      contact: "https://www.prototypes.org",
    },
    {
      name: "JRH – Sober Living for Women",
      city: "San Diego",
      type: "Sober Living Home",
      subCategory: "Women",
      description: "Structured recovery home for women in San Diego.",
      apply: "Call house directly.",
      contact: "Local SD recovery listing",
    },
    // ── Reentry / Justice ─────────────────────────
    {
      name: "Amity Foundation – Community Reintegration Campus",
      city: "Los Angeles",
      type: "Halfway / Reentry Housing",
      subCategory: "Justice-Involved / SUD",
      description:
        "Highly respected reentry program with sober, therapeutic housing.",
      apply: "Referral from CDCR/parole or call intake.",
      contact: "https://www.amityfdn.org",
    },
    {
      name: "CDCR – Contracted Transitional Housing Providers",
      city: "Statewide (LA, Bay Area, Central Valley)",
      type: "Reentry / Sober Housing",
      subCategory: "Court/DOC",
      description:
        "Sober/transitional homes serving people on parole/probation.",
      apply: "Through parole agent or CDCR reentry.",
      contact: "https://www.cdcr.ca.gov",
    },
    // ── Veterans ─────────────────────────
    {
      name: "VA Greater Los Angeles – GPD & HUD-VASH Recovery Housing",
      city: "Los Angeles / West LA",
      type: "Veterans Recovery Housing",
      subCategory: "GPD / SUD / MH",
      description: "Short-term supportive sober housing for veterans.",
      apply: "Through VA GLA social work.",
      contact: "https://www.va.gov/greater-los-angeles-health-care/",
    },
    // ── Northern California / Bay Area ─────────────────────────
    {
      name: "Epiphany Center – Women’s Recovery & Housing",
      city: "San Francisco",
      type: "Women & Children Transitional Housing",
      subCategory: "Family Recovery",
      description:
        "Residential treatment with attached housing for women and their children.",
      apply: "Apply via Epiphany Center.",
      contact: "https://theepiphanycenter.org",
    },
    {
      name: "Options Recovery Services – Sober Living",
      city: "Berkeley / Oakland",
      type: "Sober Living Home",
      subCategory: "Low-Income / Community-Based",
      description:
        "Affordable sober housing tied to Options outpatient services.",
      apply: "Contact Options intake.",
      contact: "https://optionsrecoveryservices.org",
    },
    // ── Central Valley ─────────────────────────
    {
      name: "Fresno Rescue Mission – Recovery Housing",
      city: "Fresno",
      type: "Faith-Based Transitional Housing",
      subCategory: "Men",
      description: "Long-term recovery program with housing.",
      apply: "Apply at mission.",
      contact: "https://fresnorm.org",
    },
  ],
};

export default data;
