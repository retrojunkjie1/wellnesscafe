const data = {
  state: "Arizona",
  code: "AZ",
  category: "Sober Living Homes",
  homes: [
    // Canonical item shape example is documented below; actual entries may be simpler.
    // Peer & Certified Sober Homes
    {
      name: "Arizona Recovery Housing Association (AzRHA) Member Homes",
      city: "Statewide (Phoenix, Mesa, Tucson, Prescott)",
      type: "Sober Living Home",
      subCategory: "Certified / Peer-Based",
      description:
        "Network of Arizona-certified recovery homes meeting standards for safety and sobriety.",
      apply: "Browse member list on AzRHA site and contact homes directly.",
      contact: "https://azrha.org",
    },
    {
      name: "Oxford House Arizona (multiple)",
      city: "Phoenix / Glendale / Tucson / Prescott Valley",
      type: "Sober Living Home",
      subCategory: "Peer-Run, Low-Cost",
      description:
        "Resident-managed sober homes for men, women, and women with children.",
      apply: "Find an Arizona house on oxfordhouse.org.",
      contact: "https://www.oxfordhouse.org",
    },
    // Reentry / Justice
    {
      name: "Community Bridges Inc. (CBI) – Transitional Housing",
      city: "Phoenix / Mesa / Tucson",
      type: "Transitional Housing",
      subCategory: "Co-Occurring / MAT Friendly",
      description:
        "Step-down housing connected to CBI’s treatment and crisis services.",
      apply: "Referral from CBI program.",
      contact: "https://communitybridgesaz.org",
    },
    {
      name: "AZ Dept. of Corrections – Reentry & Sober Living Partners",
      city: "Phoenix metro",
      type: "Halfway / Reentry Housing",
      subCategory: "Justice-Involved",
      description:
        "Sober/transitional beds for people leaving ADC or probation.",
      apply: "Through reentry officer or supervision officer.",
      contact: "https://corrections.az.gov",
    },
    // Faith / Christian
    {
      name: "Dream Center Recovery Housing (Phoenix Dream Center)",
      city: "Phoenix",
      type: "Faith-Based Recovery Housing",
      subCategory: "Women / Trafficking Recovery / SUD",
      description: "Long-term residential recovery, includes sober housing.",
      apply: "Apply online; interview required.",
      contact: "https://www.phoenixdreamcenter.org",
    },
    {
      name: "Teen Challenge of Arizona – Aftercare Housing",
      city: "Phoenix / Tucson / Yuma",
      type: "Faith-Based Transitional Housing",
      subCategory: "Men & Women",
      description: "Christian discipleship program with sober housing phases.",
      apply: "Apply to Teen Challenge center first.",
      contact: "https://tcaz.org",
    },
    // Women / Family
    {
      name: "Maggie’s Place – Transitional Mother Housing",
      city: "Phoenix / Mesa",
      type: "Women & Children Housing",
      subCategory: "Pregnant / Parenting Women in Recovery",
      description:
        "Supportive sober residences for pregnant women and new mothers.",
      apply: "Apply on website; must meet program criteria.",
      contact: "https://www.maggiesplace.org",
    },
    {
      name: "House of Hope – Women’s Sober Living",
      city: "Tucson",
      type: "Sober Living Home",
      subCategory: "Women",
      description:
        "Structured sober housing for women leaving treatment or domestic violence.",
      apply: "Call intake; beds may be limited.",
      contact: "Local listing / 211 Arizona",
    },
    // Northern / Prescott
    {
      name: "Prescott Recovery Housing Collective",
      city: "Prescott / Prescott Valley",
      type: "Sober Living Home",
      subCategory: "12-Step Oriented",
      description:
        "Cluster of reputable sober homes serving the Prescott recovery community.",
      apply: "Contact homes directly or via local treatment centers.",
      contact: "https://yc4hope.org",
    },
    {
      name: "VA Northern Arizona Health Care System – Transitional Housing",
      city: "Prescott",
      type: "Veterans Recovery Housing",
      subCategory: "GPD / HUD-VASH",
      description:
        "Veterans’ sober/transitional beds connected to VA services.",
      apply: "Through VA social worker.",
      contact: "https://www.va.gov/northern-arizona-health-care/",
    },
  ],
};

export default data;
