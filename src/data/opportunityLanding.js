export const featuredOpportunities = [
  ["nickel-battery-supply-chain", "Nickel Battery Supply Chain", "From critical mineral supply to downstream battery manufacturing and circular recovery.", "High", "Scaling", 18, "30 Jul 2026", "BatteryCharging"],
  ["battery-recycling", "Battery Recycling", "Recover strategic materials while reducing lifecycle impacts and supply-chain dependency.", "Rising", "Developing", 22, "29 Jul 2026", "Recycle"],
  ["critical-minerals", "Critical Minerals", "Track resource, processing, policy, and demand signals across strategic minerals.", "High", "Scaling", 31, "28 Jul 2026", "Gem"],
  ["green-hydrogen", "Green Hydrogen", "Explore emerging production corridors, industrial demand, and enabling infrastructure.", "Rising", "Developing", 27, "27 Jul 2026", "Atom"],
  ["nature-based-solutions", "Nature-Based Solutions", "Identify credible restoration, resilience, and ecosystem-service opportunities.", "Rising", "Developing", 34, "26 Jul 2026", "Trees"],
  ["climate-finance", "Climate Finance", "Understand capital flows, financing instruments, policy support, and market gaps.", "High", "Scaling", 42, "25 Jul 2026", "Landmark"],
  ["carbon-markets", "Carbon Markets", "Monitor integrity standards, credit demand, pricing signals, project pathways, and regulation.", "Rising", "Developing", 39, "31 Jul 2026", "CloudSun"],
  ["carbon-capture-ccus", "Carbon Capture & CCUS", "Explore capture, transport, utilisation, storage, infrastructure, policy, and project-readiness signals.", "Rising", "Early Commercial", 28, "31 Jul 2026", "Factory"],
  ["carbon-economic-value", "Carbon Economic Value", "Assess how carbon cost, avoided emissions, incentives, credit potential, and transition exposure can affect value.", "Emerging", "Developing", 33, "31 Jul 2026", "CircleDollarSign"],
  ["water-reuse", "Water Reuse", "Discover technologies and operating models that turn water constraints into resilience.", "Emerging", "Early Commercial", 24, "23 Jul 2026", "Droplets"],
  ["energy-storage", "Energy Storage", "Follow storage technologies, project pipelines, grid needs, and policy momentum.", "High", "Scaling", 36, "22 Jul 2026", "BatteryMedium"],
  ["electric-mobility", "Electric Mobility", "Explore the connected mobility ecosystem across vehicles, charging, and infrastructure.", "High", "Scaling", 41, "21 Jul 2026", "BusFront"],
  ["low-carbon-mining", "Low Carbon Mining", "Assess renewable power, electrification, efficiency, and process innovation signals.", "Rising", "Developing", 16, "20 Jul 2026", "Pickaxe"],
  ["climate-adaptation", "Climate Adaptation", "Find resilience needs, investable responses, and enabling public-policy signals.", "Rising", "Developing", 45, "19 Jul 2026", "ShieldCheck"],
].map(([slug, title, description, momentum, maturity, countryCount, lastUpdated, icon]) => ({ slug, title, description, momentum, maturity, countryCount, lastUpdated, icon }));

export const sectors = [
  ["Mining & Metals", "Pickaxe"], ["Energy", "Zap"], ["Financial Services", "Landmark"],
  ["Manufacturing", "Factory"], ["Transportation", "Truck"], ["Water", "Droplets"],
  ["Agriculture", "Wheat"], ["Technology", "Cpu"], ["Infrastructure", "Building2"],
  ["Forestry", "Trees"], ["Healthcare", "HeartPulse"], ["Government", "Building"],
  ["Consumer Goods", "ShoppingBag"], ["Circular Economy", "Recycle"], ["Development Finance", "HandCoins"],
].map(([name, icon]) => ({ name, icon }));

export const regions = [
  ["Asia Pacific", "Connected manufacturing, energy transition, critical minerals, and fast-growing markets.", "APAC"],
  ["Europe", "Industrial decarbonisation, circularity, climate policy, and transition finance.", "EU"],
  ["North America", "Clean technology, incentives, energy systems, and resilient supply chains.", "NA"],
  ["Latin America", "Critical minerals, renewable energy, nature, agriculture, and resilient infrastructure.", "LATAM"],
  ["Africa", "Distributed energy, adaptation, climate finance, nature, and inclusive growth.", "AFR"],
  ["Middle East", "Energy transition, water security, green industry, and new capital platforms.", "MENA"],
].map(([name, description, code]) => ({ name, description, code }));

export const themes = [
  "Critical Minerals", "Energy Transition", "Climate Finance", "Carbon Markets", "Carbon Capture & CCUS", "Carbon Economic Value",
  "Circular Economy", "Nature-Based Solutions", "Water Security", "Climate Adaptation",
  "Biodiversity", "ESG Technology", "Digital MRV", "Electric Mobility",
  "Forest Restoration", "Blue Economy",
];

// Adapter boundary for Task 1. Replace this implementation with the future API client.
export async function searchOpportunityIndex({ query }) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return featuredOpportunities;
  return featuredOpportunities.filter((item) =>
    [item.title, item.description, item.momentum, item.maturity].join(" ").toLowerCase().includes(normalized),
  );
}
