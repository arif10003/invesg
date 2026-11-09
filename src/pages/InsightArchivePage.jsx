import { useInsights } from '../hooks/useInsights';
import { toInsightSlug } from '../data/insights';
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import InsightCard from "../components/insights/InsightCard";
import InsightPageState from "../components/insights/InsightPageState";
import { getInsightArchive } from "../data/insights";
import { usePageSeo } from "../utils/seo";
import "../styles/insights.css";
import "../styles/insight-detail.css";

export default function InsightArchivePage({ kind }) {
  const { slug } = useParams();
  const source = useInsights();
  const field=kind==='topics'?'topics':'sectors';
  const matching=source.articles.filter(article=>(article[field]||[]).some(value=>toInsightSlug(value)===slug));
  const name=matching.flatMap(article=>article[field]).find(value=>toInsightSlug(value)===slug);
  const approved=getInsightArchive(kind,slug);
  const archive=name?{name,articles:matching}:approved?{...approved,articles:matching}:null;
  const singular = kind === "topics" ? "Topic" : "Sector";
  const title = archive ? `${archive.name} Insights | INVESG` : `${singular} Not Found | INVESG`;
  const description = archive?.description || (archive ? `Published INVESG insights related to ${archive.name}.` : `The requested Insights ${singular.toLowerCase()} is not available.`);
  usePageSeo({ title, description, canonicalPath: `/insights/${kind}/${slug}` });
  if (source.loading) return <InsightPageState title="Loading archive…" message="Retrieving published Insights."/>;
  if (source.error) return <InsightPageState title="Archive unavailable." message="Please try again later."/>;
  if (!archive) return <InsightPageState eyebrow={`Insights ${singular}`} title={`${singular} not found.`} message={`This ${singular.toLowerCase()} archive is not currently available.`} />;
  return <main className="insights-page"><Navbar activeNavItem="Insights" /><section className="insights-shell archive-header"><nav aria-label="Breadcrumb"><a href="/insights">Insights</a><span>/</span><span>{singular}</span><span>/</span><span aria-current="page">{archive.name}</span></nav><span>Insights by {singular}</span><h1>{archive.name}</h1>{archive.description && <p>{archive.description}</p>}</section><section className="insights-shell archive-results">{archive.articles.length ? <div className="editorial-card-grid">{archive.articles.map((article) => <InsightCard article={article} key={article.slug} />)}</div> : <div className="editorial-empty"><div><h2>No published insights yet.</h2><p>This approved archive does not currently contain published articles.</p></div></div>}</section><SiteFooter /></main>;
}
