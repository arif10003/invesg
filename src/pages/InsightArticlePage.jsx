import { useArticle } from '../hooks/useArticle';
import { useInsights } from '../hooks/useInsights';
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import ArticleDetail from "../components/insights/ArticleDetail";
import InsightPageState from "../components/insights/InsightPageState";
import { getInsightArticle, getRelatedInsightArticles, getVerifiedInsightAuthor } from "../data/insights";
import { services } from "../data/solutions";
import { usePageSeo } from "../utils/seo";
import "../styles/insights.css";
import "../styles/insight-detail.css";

export default function InsightArticlePage() {
  const { slug } = useParams();
  const {article,loading,error} = useArticle(slug);
  const collection = useInsights();
  const author = article?.authorSlug ? getVerifiedInsightAuthor(article.authorSlug) : null;
  const reviewer = article?.reviewerSlug ? getVerifiedInsightAuthor(article.reviewerSlug) : null;
  const relatedInsights = collection.articles.filter(item=>item.slug!==slug && item.topics.some(topic=>article?.topics?.includes(topic))).slice(0,3);
  const relatedSolutions = article?.relatedSolutionCodes?.length ? article.relatedSolutionCodes.map((code) => services.find((service) => service.serviceCode === code)).filter(Boolean) : [];
  const title = article ? `${article.title} | INVESG Insights` : "Insight Not Found | INVESG";
  const description = article?.seoDescription || article?.excerpt || "The requested INVESG insight is not available.";
  const structuredArticle = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: `${window.location.origin}/insights/${article.slug}`,
    ...(author ? { author: { "@type": "Person", name: author.name, url: `${window.location.origin}/insights/authors/${author.slug}` } } : {}),
    ...(article.coverImage ? { image: article.coverImage.startsWith("http") ? article.coverImage : `${window.location.origin}${article.coverImage}` } : {}),
  } : null;
  usePageSeo({ title, description, canonicalPath: article ? `/insights/${article.slug}` : `/insights/${slug}`, image: article?.coverImage, article: structuredArticle, robots: article ? "index,follow" : "noindex,follow" });

  if (loading) return <InsightPageState title="Loading Insight…" message="Retrieving the published article."/>;
  if (error) return <InsightPageState title="Insight unavailable." message="Please try again later."/>;
  if (!article) return <InsightPageState title="Insight not found." message="This article is not published or the address may be incorrect." />;
  return <main className="insights-page"><Navbar activeNavItem="Insights" /><ArticleDetail article={article} author={author} reviewer={reviewer} relatedInsights={relatedInsights} relatedSolutions={relatedSolutions} /><SiteFooter /></main>;
}

import '../styles/visual-sprint.css';
