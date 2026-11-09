export const industries = [
  "All Industries",
  "Mining",
  "Energy",
  "Financial Services",
  "Infrastructure",
  "Manufacturing",
  "Agriculture",
  "Forestry",
  "Government",
  "Development Organizations",
  "Real Estate",
  "Technology",
  "Healthcare",
];

const groupMeta = {
  strategy: {
    title: "ESG Strategy & Sustainable Value",
    short: "Turn ESG ambition into a clear value-creation agenda.",
    icon: "Compass",
  },
  risk: {
    title: "Risk, Resilience & Governance",
    short: "See interconnected risks early and build resilient governance.",
    icon: "ShieldCheck",
  },
  climate: {
    title: "Climate, Carbon & Energy Transition",
    short: "Move from carbon accounting to a credible transition pathway.",
    icon: "CloudSun",
  },
  nature: {
    title: "Environment, Nature & Land Management",
    short: "Manage land, water, biodiversity, and environmental obligations.",
    icon: "Leaf",
  },
  investment: {
    title: "Project, Investment & Transaction Advisory",
    short: "Bring ESG intelligence into projects, investments, and deals.",
    icon: "Landmark",
  },
  finance: {
    title: "Sustainable Finance",
    short: "Structure finance that links capital with measurable outcomes.",
    icon: "BadgeDollarSign",
  },
  digital: {
    title: "Digital, ICT & SaaS Solutions",
    short: "Make sustainability data useful through practical digital tools.",
    icon: "MonitorCog",
  },
  intelligence: {
    title: "Intelligence, Research & Analytics",
    short: "Convert complex evidence into decision-ready intelligence.",
    icon: "ChartNoAxesCombined",
  },
  reporting: {
    title: "Reporting & Compliance",
    short: "Meet disclosure and regulatory needs with confidence.",
    icon: "FileCheck2",
  },
  training: {
    title: "Training & Capacity Building",
    short: "Build the internal capability to sustain change.",
    icon: "GraduationCap",
  },
  managed: {
    title: "Managed Advisory Services",
    short: "Add an embedded sustainability intelligence capability to your team.",
    icon: "Handshake",
  },
};

const all = industries.slice(1);
const service = (
  serviceCode,
  solutionGroup,
  serviceName,
  description,
  deliverables,
  bestFor,
  serviceIndustries,
  deliveryModel,
  relatedServices,
  priority = "Core",
) => ({
  serviceCode,
  solutionGroup,
  serviceName,
  description,
  deliverables,
  bestFor,
  industries: serviceIndustries,
  deliveryModel,
  relatedServices,
  priority,
  status: "Active",
});

export const services = [
  service("ESG-01", "strategy", "ESG Strategy & Roadmap", "A decision-led ESG strategy connected to enterprise priorities and value.", ["Materiality and baseline", "Strategic roadmap", "Governance and KPI framework"], "Leadership teams defining or resetting ESG direction", all, "Advisory", ["RRG-01", "RPT-02"]),
  service("ESG-02", "strategy", "Double Materiality Assessment", "Identify the sustainability impacts and financial issues that matter most.", ["Stakeholder evidence", "Impact and financial scoring", "Materiality matrix"], "Organizations preparing strategy or disclosure", all, "Assessment", ["ESG-01", "RPT-02"]),
  service("ESG-03", "strategy", "Sustainable Value Creation", "Translate sustainability drivers into resilient growth and operating choices.", ["Value driver map", "Opportunity portfolio", "Implementation cases"], "Boards, strategy, and transformation teams", all, "Advisory", ["INT-02", "FIN-01"]),

  service("RRG-01", "risk", "ESG Risk & Resilience Framework", "Connect environmental, social, and governance risks to enterprise decisions.", ["Risk taxonomy", "Scenario assessment", "Controls and response plan"], "Risk, audit, and executive teams", all, "Advisory", ["ESG-01", "CLM-02"]),
  service("RRG-02", "risk", "Governance & Policy Architecture", "Clarify decision rights, oversight, policies, and accountability.", ["Governance diagnostic", "Policy suite", "RACI and committee charter"], "Organizations scaling ESG governance", all, "Advisory", ["ESG-01", "RPT-01"]),
  service("RRG-03", "risk", "Social & Human Rights Due Diligence", "Detect and manage human-rights and community risks across operations and value chains.", ["Risk screening", "Stakeholder plan", "Mitigation and grievance roadmap"], "Operators, investors, and supply-chain teams", ["Mining", "Energy", "Infrastructure", "Manufacturing", "Agriculture", "Forestry", "Financial Services"], "Assessment", ["PRJ-01", "INT-01"]),

  service("CLM-01", "climate", "GHG Inventory & Decarbonization", "Build an auditable emissions baseline and practical reduction pathway.", ["Scope 1–3 inventory", "Hotspot analysis", "Decarbonization roadmap"], "Organizations beginning or improving climate action", all, "Assessment", ["CLM-03", "RPT-02"]),
  service("CLM-02", "climate", "Climate Risk & Scenario Analysis", "Understand physical and transition risk under plausible climate futures.", ["Hazard and exposure view", "Scenario analysis", "Adaptation priorities"], "Risk, asset, investment, and strategy teams", all, "Intelligence", ["RRG-01", "PRJ-01"]),
  service("CLM-03", "climate", "Energy Transition Strategy", "Prioritize credible energy, technology, and operational transition choices.", ["Energy baseline", "Transition options", "Investment roadmap"], "Energy-intensive organizations and asset owners", ["Mining", "Energy", "Infrastructure", "Manufacturing", "Real Estate", "Government"], "Advisory", ["CLM-01", "FIN-02"]),
  service("CLM-04", "climate", "Carbon Market Advisory", "Assess carbon-project feasibility and navigate market integrity requirements.", ["Eligibility screening", "Methodology review", "Commercial pathway"], "Project developers, landowners, and investors", ["Energy", "Agriculture", "Forestry", "Financial Services", "Government", "Development Organizations"], "Advisory", ["FIN-02", "INT-02"]),
  service("CLM-05", "climate", "Carbon Capture & CCUS Readiness", "Assess where carbon capture, utilisation, transport, and storage may be technically, environmentally, and commercially relevant.", ["Emissions-source screening", "Technology and infrastructure options", "Storage and integrity risk review", "Stage-gated readiness roadmap"], "Industrial operators, project developers, governments, lenders, and investors", ["Mining", "Energy", "Infrastructure", "Manufacturing", "Financial Services", "Government", "Development Organizations"], "Assessment", ["CLM-03", "PRJ-02", "INT-03"]),
  service("CLM-06", "climate", "Carbon Economic Value Assessment", "Model carbon-related value and exposure without treating uncertain credits or incentives as guaranteed returns.", ["Carbon cost and revenue scenarios", "Avoided-emissions value case", "Incentive and market pathway review", "Risk-adjusted decision model"], "Strategy, finance, investment, and project teams evaluating carbon-sensitive decisions", ["Mining", "Energy", "Infrastructure", "Manufacturing", "Agriculture", "Forestry", "Financial Services", "Government", "Development Organizations"], "Assessment", ["CLM-04", "CLM-05", "INT-03", "FIN-02"]),

  service("ENV-01", "nature", "PPKH / IPPKH Compliance", "End-to-end support for forest-area use approvals, obligations, and reporting.", ["Obligation register", "Revegetation plan", "Compliance reporting"], "Mining, energy, and infrastructure projects in forest areas", ["Mining", "Energy", "Infrastructure", "Forestry", "Government"], "Managed Service", ["ENV-02", "RPT-01"]),
  service("ENV-02", "nature", "Mine Closure & Rehabilitation", "Plan closure outcomes early and manage rehabilitation with evidence.", ["Closure strategy", "Cost and risk basis", "Monitoring framework"], "Mining operators and asset owners", ["Mining", "Financial Services", "Government"], "Advisory", ["ENV-01", "ENV-03"]),
  service("ENV-03", "nature", "Water Security & Stewardship", "Understand basin dependencies and prioritize operational water resilience.", ["Water balance", "Risk and dependency map", "Stewardship roadmap"], "Water-dependent operations and portfolios", ["Mining", "Energy", "Infrastructure", "Manufacturing", "Agriculture", "Forestry", "Real Estate"], "Assessment", ["CLM-02", "INT-02"]),
  service("ENV-04", "nature", "Biodiversity & Nature Strategy", "Identify nature-related dependencies, impacts, risks, and opportunities.", ["Nature baseline", "Priority locations", "TNFD-aligned action plan"], "Land-based businesses, projects, and investors", ["Mining", "Energy", "Infrastructure", "Agriculture", "Forestry", "Financial Services"], "Advisory", ["ENV-02", "RPT-02"]),

  service("PRJ-01", "investment", "ESG Due Diligence", "Surface material ESG risks, liabilities, and value levers before commitment.", ["Red-flag review", "Risk quantification", "Action conditions"], "Investors, lenders, developers, and transaction teams", ["Financial Services", "Mining", "Energy", "Infrastructure", "Real Estate", "Technology", "Healthcare"], "Assessment", ["RRG-03", "PRJ-02"]),
  service("PRJ-02", "investment", "Project ESG & Bankability Advisory", "Strengthen project readiness against lender, investor, and good-practice expectations.", ["Gap assessment", "Bankability roadmap", "Lender-ready evidence pack"], "Project sponsors and capital providers", ["Mining", "Energy", "Infrastructure", "Agriculture", "Real Estate", "Government"], "Advisory", ["PRJ-01", "FIN-02"]),
  service("PRJ-03", "investment", "ESG Integration for Investment", "Embed material ESG intelligence across screening, appraisal, and ownership.", ["Investment framework", "Scorecard", "Portfolio monitoring model"], "Funds, banks, and corporate investment teams", ["Financial Services", "Development Organizations", "Government"], "Advisory", ["FIN-01", "DIG-01"]),

  service("FIN-01", "finance", "Sustainable Finance Framework", "Define eligible activities, governance, and impact measures for sustainable capital.", ["Framework design", "Eligibility criteria", "Impact KPI set"], "Issuers, banks, and public institutions", ["Financial Services", "Government", "Development Organizations", "Energy", "Infrastructure", "Real Estate"], "Advisory", ["FIN-02", "RPT-02"]),
  service("FIN-02", "finance", "Green & Transition Finance Advisory", "Prepare credible green, social, sustainability, or transition financing.", ["Financing narrative", "Use-of-proceeds logic", "External-review readiness"], "Issuers, projects, and lenders", ["Financial Services", "Mining", "Energy", "Infrastructure", "Manufacturing", "Government"], "Advisory", ["CLM-03", "PRJ-02"]),

  service("DIG-01", "digital", "ESG Data & Performance Dashboard", "Bring fragmented ESG data into a decision-ready performance view.", ["Data model", "Executive dashboard", "Workflow and controls"], "Organizations outgrowing spreadsheets and manual reporting", all, "Digital Solution", ["RPT-02", "MAS-02"]),
  service("DIG-02", "digital", "Digital MRV Platform", "Digitize monitoring, reporting, and verification for projects and portfolios.", ["MRV architecture", "Field-to-dashboard workflow", "Audit trail"], "Carbon, nature, community, and compliance programs", ["Mining", "Energy", "Infrastructure", "Agriculture", "Forestry", "Government", "Development Organizations"], "Digital Solution", ["CLM-04", "ENV-02"]),
  service("DIG-03", "digital", "Custom Sustainability SaaS", "Design and build focused digital products for recurring sustainability decisions.", ["Product discovery", "Working platform", "Adoption roadmap"], "Enterprises and institutions with repeatable workflows", all, "Digital Solution", ["DIG-01", "INT-03"]),

  service("INT-01", "intelligence", "Policy & Regulatory Intelligence", "Track regulatory change and translate it into business implications.", ["Horizon scan", "Impact brief", "Action tracker"], "Legal, risk, strategy, and sustainability teams", all, "Intelligence", ["RPT-01", "MAS-01"]),
  service("INT-02", "intelligence", "Market & Opportunity Intelligence", "Find emerging sustainability markets, demand signals, and strategic openings.", ["Market landscape", "Opportunity sizing", "Entry options"], "Growth, investment, and strategy teams", all, "Intelligence", ["ESG-03", "CLM-04"]),
  service("INT-03", "intelligence", "Decision Analytics & Scenario Modelling", "Test choices, trade-offs, and uncertainty before committing resources.", ["Decision model", "Scenario set", "Executive decision brief"], "Complex projects, portfolios, and policy decisions", all, "Intelligence", ["RRG-01", "DIG-03"]),

  service("RPT-01", "reporting", "Regulatory Compliance Readiness", "Translate obligations into an accountable and auditable compliance system.", ["Requirements map", "Gap assessment", "Compliance action plan"], "Regulated organizations and projects", all, "Assessment", ["INT-01", "ENV-01"]),
  service("RPT-02", "reporting", "Sustainability & ISSB Reporting", "Build decision-useful disclosures aligned with relevant standards.", ["Reporting architecture", "Data and control plan", "Disclosure support"], "Organizations preparing annual or investor reporting", all, "Managed Service", ["ESG-02", "DIG-01"]),
  service("RPT-03", "reporting", "PROPER Performance Support", "Improve environmental performance evidence and readiness for PROPER assessment.", ["Performance diagnostic", "Evidence register", "Improvement roadmap"], "Indonesian operating companies", ["Mining", "Energy", "Manufacturing", "Agriculture", "Infrastructure"], "Managed Service", ["ENV-03", "RPT-01"]),

  service("TRN-01", "training", "Executive ESG & Decision Intelligence", "Equip leaders to make stronger decisions through an ESG lens.", ["Executive workshop", "Decision cases", "Leadership action note"], "Boards, executives, and senior decision-makers", all, "Training", ["ESG-01", "RRG-01"]),
  service("TRN-02", "training", "Practitioner Academy", "Build practical capability in carbon, reporting, risk, and sustainability delivery.", ["Modular curriculum", "Applied exercises", "Capability assessment"], "Sustainability, risk, finance, and operating teams", all, "Training", ["CLM-01", "RPT-02"]),

  service("MAS-01", "managed", "ESG Advisory Retainer", "On-demand senior advice and execution support as priorities evolve.", ["Advisory office hours", "Decision support", "Monthly action review"], "Organizations needing flexible specialist capacity", all, "Managed Service", ["ESG-01", "INT-01"]),
  service("MAS-02", "managed", "Managed ESG Intelligence Office", "An embedded capability for intelligence, performance, and executive reporting.", ["Intelligence cadence", "KPI management", "Executive briefs"], "Organizations building a sustained ESG operating rhythm", all, "Managed Service", ["DIG-01", "MAS-01"]),
];

export const solutionGroups = Object.entries(groupMeta).map(([id, meta]) => ({
  id,
  ...meta,
  serviceCount: services.filter((item) => item.solutionGroup === id).length,
}));

export const deliveryModels = ["All Models", ...new Set(services.map((item) => item.deliveryModel))];
