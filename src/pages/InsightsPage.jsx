import { useBooks } from '../hooks/useBooks';
import { usePageContent } from '../hooks/usePageContent';
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, SearchX, FileText, Scale, Compass } from "lucide-react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import FeaturedInsight from "../components/insights/FeaturedInsight";
import InsightCard from "../components/insights/InsightCard";
import InsightFilters from "../components/insights/InsightFilters";
import SocialMediaSection from "../components/insights/SocialMediaSection";
import { insightContentTypes, socialChannels } from "../data/insights";
import { usePageSeo } from "../utils/seo";
import "../styles/insights.css";
import { useInsights } from "../hooks/useInsights";

import BookSpotlight from "../components/insights/BookSpotlight";
import BookCover from "../components/books/BookCover";
import BookPurchaseButton from "../components/books/BookPurchaseButton";
import { getBook } from "../api/books";
import "../styles/books.css";
import "../styles/mvp-visual.css";

const editorialCategories = [
  { id: "brief", title: "INVESG Briefs", description: "Concise interpretation of developments that matter.", Icon: FileText },
  { id: "analysis", title: "Policy Analysis", description: "Evidence, policy context, and implications for decisions.", Icon: Scale },
  { id: "perspective", title: "Perspectives", description: "Considered viewpoints on uncertainty and sustainable value.", Icon: Compass },
];

const unique = (values) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));

function EditorialEmpty({ filtered, title }) {
  return <div className="editorial-empty"><SearchX /><div><h3>{filtered ? `No ${title.toLowerCase()} match these filters.` : `${title} will be published here.`}</h3><p>{filtered ? "Try a broader search or clear one of the selected filters." : "No reviewed INVESG editorial articles are currently published in this collection."}</p></div></div>;
}

function EditorialCollection({ eyebrow, title, description, articles, filtered }) {
  return <section className="editorial-section insights-shell">
    <header className="editorial-section-head"><div><span>{eyebrow}</span><h2>{title}</h2>{description && <p>{description}</p>}</div></header>
    {articles.length ? <div className="editorial-card-grid">{articles.map((article) => <InsightCard key={article.slug} article={article} />)}</div> : <EditorialEmpty filtered={filtered} title={title} />}
  </section>;
}

export default function InsightsPage({ previewData }) {
  const cms=usePageContent('insights',{enabled:!(import.meta.env.DEV && previewData)});
  usePageSeo({ title: cms?.seo_title || "Insights | INVESG", description: cms?.seo_description || "Research, analysis, and informed perspectives on sustainability, risk, opportunity, and long-term value.", canonicalPath: "/insights", image: "/assets/esg-hero.png" });
  const featuredBook=useBooks("esg-is-a-lens",{enabled:!(import.meta.env.DEV && previewData)});
  const book = import.meta.env.DEV && previewData ? getBook("esg-is-a-lens") : featuredBook.book;
  const [searchParams, setSearchParams] = useSearchParams();
  const source = useInsights({enabled:!(import.meta.env.DEV && previewData)});
  const { articles: publishedArticles, spotlight, loading: articlesLoading, error: articlesError, retry } = (import.meta.env.DEV && previewData) || source;
  const filters = {
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || "all",
    topic: searchParams.get("topic") || "",
    sector: searchParams.get("sector") || "",
    geography: searchParams.get("geography") || "",
  };

  const options = React.useMemo(() => ({
    topics: unique(publishedArticles.flatMap((article) => article.topics || [])),
    sectors: unique(publishedArticles.flatMap((article) => article.sectors || [])),
    geographies: unique(publishedArticles.flatMap((article) => article.geographies || [])),
  }), [publishedArticles]);

  const counts = React.useMemo(() => Object.fromEntries(insightContentTypes.map((type) => [type.id, type.id === "all" ? publishedArticles.length : publishedArticles.filter((article) => article.contentType === type.id).length])), [publishedArticles]);

  const filteredArticles = React.useMemo(() => {
    const query = filters.q.trim().toLowerCase();
    return publishedArticles.filter((article) => {
      const searchable = [article.title, article.excerpt, article.subtitle, ...(article.topics || []), ...(article.sectors || []), ...(article.geographies || [])].filter(Boolean).join(" ").toLowerCase();
      return (!query || searchable.includes(query))
        && (filters.type === "all" || article.contentType === filters.type)
        && (!filters.topic || article.topics?.includes(filters.topic))
        && (!filters.sector || article.sectors?.includes(filters.sector))
        && (!filters.geography || article.geographies?.includes(filters.geography));
    });
  }, [filters.geography, filters.q, filters.sector, filters.topic, filters.type, publishedArticles]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && !(key === "type" && value === "all")) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };
  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    for (const key of ["q", "type", "topic", "sector", "geography"]) next.delete(key);
    setSearchParams(next);
  };
  const hasActiveFilters = Boolean(filters.q || filters.type !== "all" || filters.topic || filters.sector || filters.geography);
  const featuredDestinations = new Set(spotlight.map(item => item.destination));
  const latest = filteredArticles.filter(article => hasActiveFilters || !featuredDestinations.has(article.href)).slice(0, 6);
  const perspectives = filteredArticles.filter(article => article.contentType === "perspective" && !latest.includes(article) && (hasActiveFilters || !featuredDestinations.has(article.href)));

  return <main className="insights-page insights-page--refined">
    <Navbar activeNavItem="Insights" />

    <header className="insights-shell insights-masthead"><div><span className="lens-eyebrow">Knowledge &amp; perspectives</span><h1>{cms?.hero_title || "INVESG Insights"}</h1></div><p>{cms?.hero_subtitle || <>Research, analysis, and informed perspectives.<br />See the connections behind better decisions.</>}</p></header>
    {!spotlight.length && book ? <section className="insights-shell editorial-spotlight" aria-label="Featured editorial publication"><header className="spotlight-heading"><span>Featured editorial</span><span>01 / 01</span></header><div className="spotlight-stage"><BookSpotlight book={book} embedded /></div></section> : <FeaturedInsight items={spotlight} />}

    <nav className="insights-shell editorial-pathways" aria-label="Core editorial categories">{editorialCategories.map(({ id, title, description, Icon }) => <button key={id} type="button" aria-pressed={filters.type === id} onClick={() => updateFilter("type", id)}><Icon aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span><ArrowRight className="pathway-arrow" aria-hidden="true" /></button>)}</nav>

    <InsightFilters contentTypes={insightContentTypes} filters={filters} options={options} counts={counts} collectionHref="/insights/books" onChange={updateFilter} onClear={clearFilters} />

    {articlesLoading ? <section className="insights-shell editorial-state" role="status"><span className="editorial-loader" /><h2>Loading published insights…</h2></section>
      : articlesError ? <section className="insights-shell editorial-state editorial-state--error" role="alert"><h2>Published insights could not be loaded.</h2><p>Please try again later or explore INVESG’s official channels below.</p><button type="button" onClick={retry}>Try again</button></section>
        : publishedArticles.length === 0 && !hasActiveFilters ? <section className="insights-shell insights-editorial-intro"><div><span className="lens-eyebrow">Research &amp; perspectives</span><h2>Latest Insights</h2><p>Our next editorial publications are in preparation. In the meantime, explore selected perspectives from INVESG official channels below.</p></div><a href="#social-media-title">Explore our channels <ArrowRight aria-hidden="true" /></a></section> : <>
          <div id="insights-results" className="insights-results" aria-live="polite"><EditorialCollection eyebrow="Latest research & interpretation" title="Latest Insights" description="Concise interpretation and deeper examination of connected sustainability and business issues." articles={latest} filtered={hasActiveFilters} /></div>
          {perspectives.length > 0 && <EditorialCollection eyebrow="Thought leadership" title="Perspectives" description="Reasoned viewpoints on uncertainty, decision-making, resilience, and sustainable value." articles={perspectives} filtered={hasActiveFilters} />}
        </>}

    {book && <section className="insights-shell publication-discovery" aria-labelledby="books-preview-title"><a className="publication-discovery-art" href={`/insights/books/${book.slug}`} aria-label={`Explore ${book.title}`}><BookCover book={book} /></a><div><span className="lens-eyebrow">Read in depth</span><h2 id="books-preview-title">Books &amp; Publications</h2><p>Explore the relationships between people, nature, governance, and the decisions we make.</p><div className="book-purchase-actions"><BookPurchaseButton book={book} /><a className="publication-discovery-link" href="/insights/books">Explore Books &amp; Publications <ArrowRight aria-hidden="true" /></a></div></div><BookOpen className="publication-discovery-icon" aria-hidden="true" /></section>}

    <SocialMediaSection channels={socialChannels} collectionHref="/insights/media" />

    <section className="insights-shell insights-editorial-cta"><div><span>From insight to action</span><h2>Explore what this means for your organization.</h2><p>Connect the topic with your strategic, operational, investment, or sustainability context.</p></div><div><a href="/solutions">Explore Solutions <ArrowRight /></a><a href="/contact?source=insights">Talk to INVESG</a></div></section>
    <SiteFooter />
  </main>;
}

import '../styles/visual-sprint.css';

import '../styles/insights-acceptance.css';
