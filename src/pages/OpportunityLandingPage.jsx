import React from "react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import { featuredOpportunities, regions, searchOpportunityIndex, sectors, themes } from "../data/opportunityLanding";
import { CTASection, FeaturedOpportunityGrid, OpportunityHero, OpportunityJourneyPreview, RegionGrid, SectorGrid, ThemeGrid } from "../components/opportunity/OpportunityLandingComponents";
import "../styles/opportunity-landing.css";

export default function OpportunityLandingPage() {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState(featuredOpportunities);
  const [submittedQuery, setSubmittedQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const runSearch = async (searchQuery) => {
    setLoading(true);
    try {
      const nextResults = await searchOpportunityIndex({ query: searchQuery });
      setResults(nextResults);
      setSubmittedQuery(searchQuery.trim());
      document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
    } finally { setLoading(false); }
  };

  const handleSearch = (event) => {
    event?.preventDefault();
    runSearch(query);
  };

  const browse = (target) => {
    const section = target === "Trending" ? "featured" : target === "Country" ? "region" : target.toLowerCase();
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  return <main className="opportunity-landing">
    <Navbar activeNavItem="Opportunity Intelligence" onSearch={(value) => { setQuery(value); runSearch(value); }} />
    <OpportunityHero query={query} setQuery={setQuery} onSearch={handleSearch} loading={loading} onBrowse={browse}/>
    <FeaturedOpportunityGrid items={results} searchTerm={submittedQuery}/>
    <SectorGrid items={sectors}/>
    <RegionGrid items={regions}/>
    <ThemeGrid items={themes}/>
    <OpportunityJourneyPreview/>
    <CTASection/>
    <SiteFooter/>
  </main>;
}
