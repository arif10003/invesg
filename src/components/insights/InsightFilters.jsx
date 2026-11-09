import React from "react";
import { Search, X } from "lucide-react";

export default function InsightFilters({ contentTypes, filters, options, counts, collectionHref, onChange, onClear }) {
  const hasTaxonomy = options.topics.length || options.sectors.length || options.geographies.length;
  const hasActiveFilters = Boolean(filters.q || filters.type !== "all" || filters.topic || filters.sector || filters.geography);
  return <section className="insight-filter-shell insights-shell" aria-label="Filter insights">
    <label className="insight-search"><Search /><span className="sr-only">Search insights</span><input type="search" value={filters.q} onChange={(event) => onChange("q", event.target.value)} placeholder="Search published insights..." /></label>
    <div className="insight-type-filters" aria-label="Content type filters">{contentTypes.map((type) => <button type="button" key={type.id} aria-pressed={filters.type === type.id} onClick={() => onChange("type", type.id)}>{type.label}<span>{counts[type.id] || 0}</span></button>)}{collectionHref && <a className="insight-books-filter" href={collectionHref}>Books &amp; Publications</a>}</div>
    {hasTaxonomy && <div className="insight-taxonomy-filters">
      {options.topics.length > 0 && <label><span>Topic</span><select value={filters.topic} onChange={(event) => onChange("topic", event.target.value)}><option value="">All topics</option>{options.topics.map((item) => <option key={item}>{item}</option>)}</select></label>}
      {options.sectors.length > 0 && <label><span>Sector</span><select value={filters.sector} onChange={(event) => onChange("sector", event.target.value)}><option value="">All sectors</option>{options.sectors.map((item) => <option key={item}>{item}</option>)}</select></label>}
      {options.geographies.length > 0 && <label><span>Geography</span><select value={filters.geography} onChange={(event) => onChange("geography", event.target.value)}><option value="">All geographies</option>{options.geographies.map((item) => <option key={item}>{item}</option>)}</select></label>}
    </div>}
    {hasActiveFilters && <button className="insight-clear-filters" type="button" onClick={onClear}><X /> Clear filters</button>}
  </section>;
}
