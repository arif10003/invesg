import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function InsightCard({ article, variant = "standard" }) {
  if (!article?.href) return null;
  return <a className={`editorial-card editorial-card--${variant}`} href={article.href}>
    {article.coverImage && <img src={article.coverImage} alt={article.coverAlt || ""} loading="lazy" decoding="async" />}
    <div>
      <span>{article.contentTypeLabel || article.contentType}</span>
      <h3>{article.title}</h3>
      {article.excerpt && <p>{article.excerpt}</p>}
      <footer>{article.readingTime && <small>{article.readingTime}</small>}<b>Read insight <ArrowUpRight /></b></footer>
    </div>
  </a>;
}
