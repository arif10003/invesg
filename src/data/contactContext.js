import { getInsightArticle } from "./insights.js";
import { getOpportunityBySlug } from "./opportunityDetail.js";
import { explorerSectors, getExplorerChallenge } from "./solutionExplorer.js";
import { services } from "./solutions.js";
import { getSustainabilityIssue } from "./sustainabilityIntelligence.js";
import { academyPrograms } from './academyPrograms.js';

const learningTopics = new Set(['Academy training proposal', 'Corporate and institutional training proposal', 'General careers inquiry', 'Collaboration inquiry', 'Research Collaboration', 'Projects and Initiatives', 'Knowledge Exchange', 'Learning Lab cohort inquiry', ...academyPrograms.flatMap(program => [`Training proposal: ${program.title.en}`, `Program inquiry: ${program.title.en}`])]);

const allowedSources = new Set(["contact", "solutions", "insights", "sustainability", "opportunity"]);

export function resolveContactContext(searchParams) {
  const requestedSource = searchParams.get("source") || "contact";
  const source = allowedSources.has(requestedSource) ? requestedSource : "contact";
  if (source === "solutions") {
    const challenge = getExplorerChallenge(searchParams.get("challenge") || "");
    const service = services.find((item) => item.serviceCode === searchParams.get("service")) || null;
    const sectorValue = searchParams.get("sector") || "";
    const sector = explorerSectors.includes(sectorValue) ? sectorValue : "";
    return { source, challenge, service, sector, values: { challenge_id: challenge?.id || null, service_id: service?.serviceCode || null, sector: sector || null } };
  }
  if (source === "insights") {
    const article = getInsightArticle(searchParams.get("article") || "");
    return { source, article, values: { article_slug: article?.slug || null } };
  }
  if (source === "sustainability") {
    const issue = getSustainabilityIssue(searchParams.get("issue") || "");
    return { source, issue, values: { issue_slug: issue?.slug || null } };
  }
  if (source === "opportunity") {
    const opportunity = getOpportunityBySlug(searchParams.get("opportunity") || "");
    return { source, opportunity, values: { opportunity_slug: opportunity?.slug || null } };
  }
  const topic = source === 'contact' && learningTopics.has(searchParams.get('topic')) ? searchParams.get('topic') : null;
  return { source: "contact", ...(topic ? { topic } : {}), values: topic ? { topic } : {} };
}

export function getContactContextSummary(context) {
  if (context.topic) return { eyebrow: 'From invesg Academy & Join Us', title: 'Your inquiry', rows: [['Topic', context.topic]] };
  if (context.article) return { eyebrow: "From INVESG Insights", title: "Discuss this topic", rows: [["Insight", context.article.title]] };
  if (context.issue) return { eyebrow: "From Sustainability Intelligence", title: "Discuss this issue", rows: [["Issue", context.issue.title]] };
  if (context.opportunity) return { eyebrow: "From Opportunity Intelligence", title: "Discuss this opportunity", rows: [["Opportunity", context.opportunity.title]] };
  const rows = [["Challenge", context.challenge?.title], ["Sector", context.sector], ["Service", context.service?.serviceName]].filter(([, value]) => value);
  if (rows.length) return { eyebrow: "From Solutions Explorer", title: "Your selected context", rows };
  return null;
}
