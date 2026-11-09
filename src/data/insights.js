export const insightContentTypes = [
  { id: "all", label: "All" },
  { id: "brief", label: "Briefs" },
  { id: "analysis", label: "Policy Analysis" },
  { id: "perspective", label: "Perspectives" },
];

// Only reviewed, published records with a valid detail-route href belong here.
// Development concepts and example articles must not be added as published content.
export const insightArticles = [];

// Curated approved public records: id, contentType, title, excerpt, image,
// destination, ctaLabel, displayOrder, status. Never include private PDF URLs.
export const insightSpotlight = [];

// Author pages are available only when a verified record is explicitly added.
export const insightAuthors = [];

// Optional editorial taxonomy records allow an archive to exist before it has
// articles. Keep empty until a topic or sector has been editorially approved.
export const insightTaxonomies = {
  topics: [],
  sectors: [],
};

export const socialChannels = {
  linkedin: {
    label: "LinkedIn",
    channelUrl: "https://www.linkedin.com/company/invesg/",
    posts: [
      {
        id: "li-energy-transition",
        title: "Energy Transition: Progress, Challenges, and What Comes Next",
        summary: "A decision-focused perspective on policy, investment, infrastructure, and market development in the energy transition.",
        topic: "Energy Transition",
        image: "/assets/explore-strip.png",
        imagePosition: "0% center",
        sourceUrl: "https://www.linkedin.com/company/invesg/",
      },
      {
        id: "li-nature",
        title: "Nature-based Solutions: More Than Just Carbon",
        summary: "Exploring the connections between biodiversity, communities, resilience, and long-term value.",
        topic: "Nature & Biodiversity",
        image: "/assets/esg-hero.png",
        imagePosition: "center",
        sourceUrl: "https://www.linkedin.com/company/invesg/",
      },
      {
        id: "li-minerals",
        title: "Critical Minerals and the New Global Supply Chain",
        summary: "How critical minerals are reshaping industries and creating interconnected strategic risks and opportunities.",
        topic: "Critical Minerals",
        image: "/assets/explore-strip.png",
        imagePosition: "66.666% center",
        sourceUrl: "https://www.linkedin.com/company/invesg/",
      },
      {
        id: "li-standards",
        title: "Standards Intelligence: Turning Requirements into Decisions",
        summary: "A practical view of how evolving disclosure standards can support strategy instead of remaining a reporting exercise.",
        topic: "Reporting & Disclosure",
        image: "/assets/explore-strip.png",
        imagePosition: "100% center",
        sourceUrl: "https://www.linkedin.com/company/invesg/",
      },
    ],
  },
  instagram: {
    label: "Instagram",
    channelUrl: "https://www.instagram.com/the.invesg?igsh=MWVrdDZxcjA1bzR1NA==",
    posts: [
      {
        id: "ig-risk-connections",
        title: "Risks Rarely Arrive Alone",
        summary: "Why risk management must recognize the interconnected effects beneath a single disruption.",
        topic: "Risk & Resilience",
        image: "/assets/insights/instagram-risk-connections.jpg",
        imagePosition: "center",
        sourceUrl: "https://www.instagram.com/the.invesg/p/DbKYYfJkc8_/",
      },
      {
        id: "ig-uncertainty",
        title: "Uncertainty Rarely Comes from One Source",
        summary: "How disruption moves through interconnected systems and reshapes decisions far beyond its origin.",
        topic: "Systems Thinking",
        image: "/assets/insights/instagram-uncertainty-systems.jpg",
        imagePosition: "center",
        sourceUrl: "https://www.instagram.com/the.invesg/p/DbAF2g6kRZq/",
      },
      {
        id: "ig-esg-lens-reel",
        title: "ESG Helps Us See the Bigger Picture",
        summary: "A short perspective on ESG as a lens for navigating uncertainty and enabling better decisions.",
        topic: "ESG as a Lens",
        image: "/assets/insights/instagram-esg-lens-reel.jpg",
        imagePosition: "center",
        type: "video",
        sourceUrl: "https://www.instagram.com/the.invesg/reel/Da2TZahurQ8/",
      },
    ],
  },
};

export function getPublishedInsightArticles(records = insightArticles) {
  return records
    .filter((article) => article.status === "published" && article.slug)
    .map((article) => ({ ...article, href: article.href || `/insights/${article.slug}` }));
}

export const toInsightSlug = (value = "") => value
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

export function getInsightArticle(slug) {
  return getPublishedInsightArticles().find((article) => article.slug === slug) || null;
}

export function getVerifiedInsightAuthor(slug) {
  return insightAuthors.find((author) => author.slug === slug && author.verified === true) || null;
}

export function getInsightArchive(kind, slug) {
  const field = kind === "topics" ? "topics" : "sectors";
  const configured = insightTaxonomies[kind]?.find((item) => item.slug === slug);
  const articles = getPublishedInsightArticles().filter((article) => (article[field] || []).some((value) => toInsightSlug(value) === slug));
  if (!configured && articles.length === 0) return null;
  return { name: configured?.name || articles.flatMap((article) => article[field] || []).find((value) => toInsightSlug(value) === slug), description: configured?.description || "", articles };
}

export function getRelatedInsightArticles(article, limit = 3) {
  if (!article) return [];
  const published = getPublishedInsightArticles().filter((candidate) => candidate.slug !== article.slug);
  const explicitOrder = article.relatedInsightSlugs || [];
  return published
    .map((candidate) => {
      const explicitIndex = explicitOrder.indexOf(candidate.slug);
      const overlap = (field) => (article[field] || []).filter((value) => (candidate[field] || []).includes(value)).length;
      return { candidate, explicitIndex, score: overlap("topics") * 3 + overlap("sectors") * 2 + overlap("geographies") };
    })
    .filter(({ explicitIndex, score }) => explicitIndex >= 0 || score > 0)
    .sort((a, b) => {
      if (a.explicitIndex >= 0 || b.explicitIndex >= 0) return (a.explicitIndex < 0 ? 999 : a.explicitIndex) - (b.explicitIndex < 0 ? 999 : b.explicitIndex);
      return b.score - a.score;
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
