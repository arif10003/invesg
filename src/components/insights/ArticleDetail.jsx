import React from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import InsightCard from "./InsightCard";
import ArticleBody from "./ArticleBody";
import PublicationTools from "./PublicationTools";
import { publicLink } from "../../utils/publication";
import { articleSectionId } from "../../utils/articlePublication";
import "../../styles/article-acceptance.css";
import { toInsightSlug } from "../../data/insights";

const sectionDefinitions = [
  ["whatHappened", "What Happened"],
  ["whyItMatters", "Why It Matters"],
  ["connections", "The Connections"],
  ["risksOpportunities", "Risks & Opportunities"],
  ["whatToWatch", "What to Watch Next"],
];

export default function ArticleDetail({ article, author, reviewer, relatedInsights = [], relatedSolutions = [] }) {
  const typeLabel = article.contentTypeLabel || article.contentType;
  const outline = (article.body || []).map((block, index) => ({ block, index })).filter(({ block }) => block?.type === "heading" && block.level !== 3);
  return <div className="article-detail--review">
    <article className="article-shell">
      <nav className="article-breadcrumb" aria-label="Breadcrumb"><a href="/insights">Insights</a><span>/</span><span>{typeLabel}</span><span>/</span><span aria-current="page">{article.title}</span></nav>
      <header className="article-header">
        <div className="article-taxonomy"><span>{typeLabel}</span>{(article.topics || []).map((topic) => <a key={topic} href={`/insights/topics/${article.topicSlugs?.[topic] || toInsightSlug(topic)}`}>{topic}</a>)}</div>
        <h1>{article.title}</h1>
        {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
        <div className="article-byline">
          {author && <a href={publicLink(author.href) || `/insights/authors/${author.slug}`}><UserRound /> <span><small>Author</small><b>{author.name}</b></span></a>}
          {!author && article.authorName && <span><UserRound/><span><small>Author</small><b>{article.authorName}</b></span></span>}
          {reviewer && <span><UserRound /><span><small>Reviewed by</small><b>{reviewer.name}</b></span></span>}
          {article.publishedAt && <span><CalendarDays /><span><small>Published</small><time dateTime={article.publishedAt}>{article.publishedLabel || article.publishedAt}</time></span></span>}
          {article.updatedAt && <span><CalendarDays /><span><small>Updated</small><time dateTime={article.updatedAt}>{article.updatedLabel || article.updatedAt}</time></span></span>}
          {article.readingTime && <span><Clock3 /><span><small>Reading time</small><b>{article.readingTime}</b></span></span>}
        </div>
      </header>

      <div className="article-layout">
        <div className="article-content">
          {article.keyTakeaways?.length > 0 && <section className="article-takeaways" aria-labelledby="key-takeaways"><h2 id="key-takeaways">Key Takeaways</h2><ul>{article.keyTakeaways.map((item) => <li key={item}>{item}</li>)}</ul></section>}
          {article.executiveSummary && <section className="article-executive-summary" aria-label="Executive summary"><h2>Executive Summary</h2><ArticleBody value={article.executiveSummary} headingPrefix="article-summary" /></section>}
      {article.coverImage && <figure className="article-cover"><img src={article.coverImage} alt={article.coverAlt || ""} />{article.coverCaption && <figcaption>{article.coverCaption}</figcaption>}</figure>}
          {article.canRead===false && <section className="commerce-notice"><h2>Member article</h2><p>Sign in with a verified email to read this publication.</p><a href={`/login?${new URLSearchParams({returnTo:`/insights/${article.slug}`})}`}>Sign in</a></section>}
          {article.body?.length > 0 ? <section className="article-structured-body" aria-label="Article body"><ArticleBody value={article.body} /></section> : sectionDefinitions.map(([key, heading]) => article.sections?.[key] ? <section id={key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)} key={key}><h2>{heading}</h2><ArticleBody value={article.sections[key]} headingPrefix={`article-${key}`} /></section> : null)}
          {article.references?.length > 0 && <section id="references" className="article-references"><h2>References &amp; Sources</h2><ol>{article.references.map((reference) => <li key={reference.url || reference.title}>{publicLink(reference.url) ? <a href={publicLink(reference.url)} target="_blank" rel="noreferrer">{reference.title} <ArrowUpRight /></a> : <span>{reference.title}</span>}{reference.publisher && <small>{reference.publisher}</small>}</li>)}</ol></section>}
        </div>
        <aside className="article-tools-column" aria-label="Publication actions and article navigation"><PublicationTools article={article} author={author} />
        {outline.length > 1 && <nav className="article-outline" aria-label="In this article"><h2>In this article</h2><ol>{outline.map(({ block, index }) => <li key={index}><a href={`#${articleSectionId(index)}`}>{block.text}</a></li>)}</ol>{article.references?.length > 0 && <a href="#references">References &amp; Sources</a>}</nav>}
        {Boolean(article.topics?.length || article.sectors?.length || article.geographies?.length) && <section className="article-sidebar" aria-label="Article context"><h2>Article context</h2>{article.topics?.length > 0 && <div><b>Topics</b>{article.topics.map((item) => <span key={item}>{item}</span>)}</div>}{article.sectors?.length > 0 && <div><b>Sectors</b>{article.sectors.map((item) => <span key={item}>{item}</span>)}</div>}{article.geographies?.length > 0 && <div><b>Geographies</b>{article.geographies.map((item) => <span key={item}>{item}</span>)}</div>}</section>}
        </aside>
      </div>
    </article>

    {relatedInsights.length > 0 && <section className="insights-shell article-related"><header><span>Continue exploring</span><h2>Related Insights</h2></header><div className="editorial-card-grid">{relatedInsights.map((item) => <InsightCard article={item} key={item.slug} />)}</div></section>}
    {relatedSolutions.length > 0 && <section className="insights-shell article-related"><header><span>From insight to action</span><h2>Related Solutions</h2></header><div className="article-solution-grid">{relatedSolutions.map((solution) => <a key={solution.serviceCode} href={`/solutions?service=${solution.serviceCode}`}><span>{solution.serviceCode} · {solution.deliveryModel}</span><h3>{solution.serviceName}</h3><p>{solution.description}</p><b>Explore solution <ArrowRight /></b></a>)}</div></section>}
    <section className="insights-shell article-cta"><div><span>Discuss this topic</span><h2>Explore what this means for your organization.</h2><p>Bring the evidence, implications, and decisions into your specific context.</p></div><a href={`/contact?source=insights&article=${encodeURIComponent(article.slug)}`}>Discuss This Topic with INVESG <ArrowRight /></a></section>
  </div>;
}
