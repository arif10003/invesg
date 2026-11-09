import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import InsightCard from "../components/insights/InsightCard";
import InsightPageState from "../components/insights/InsightPageState";
import { getPublishedInsightArticles, getVerifiedInsightAuthor } from "../data/insights";
import { usePageSeo } from "../utils/seo";
import "../styles/insights.css";
import "../styles/insight-detail.css";

export default function InsightAuthorPage() {
  const { slug } = useParams();
  const author = getVerifiedInsightAuthor(slug);
  const articles = author ? getPublishedInsightArticles().filter((article) => article.authorSlug === author.slug) : [];
  const title = author ? `${author.name} | INVESG Insights` : "Author Not Found | INVESG";
  const description = author?.bio || "The requested verified INVESG author profile is not available.";
  usePageSeo({ title, description, canonicalPath: `/insights/authors/${slug}`, image: author?.image });
  if (!author) return <InsightPageState eyebrow="Insights Author" title="Author not found." message="This author profile is not verified or is not currently published." />;
  return <main className="insights-page"><Navbar activeNavItem="Insights" /><header className="insights-shell author-profile">{author.image && <img src={author.image} alt={author.name} />}<div><span>Verified author</span><h1>{author.name}</h1>{author.role && <b>{author.role}</b>}<p>{author.bio}</p></div></header><section className="insights-shell archive-results"><header><span>Published work</span><h2>Insights by {author.name}</h2></header>{articles.length ? <div className="editorial-card-grid">{articles.map((article) => <InsightCard article={article} key={article.slug} />)}</div> : <div className="editorial-empty"><div><h3>No published articles.</h3><p>This verified profile does not currently have published editorial work.</p></div></div>}</section><SiteFooter /></main>;
}
