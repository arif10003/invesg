import React from "react";
import { ArrowDown, ArrowRight, Network, Search, Users } from "lucide-react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import SolutionsExplorer from "../components/solutions/SolutionsExplorer";
import { deliveryModels, industries, services, solutionGroups } from "../data/solutions";
import { SolutionCatalogue, SolutionGroups, WhyInvesg } from "../components/solutions/SolutionsExtendedSections";
import { usePageSeo } from "../utils/seo";
import ResponsiveHeroArtwork from '../components/brand/ResponsiveHeroArtwork';
import { approvedHeroAssets } from '../data/brandAssets';
import "../styles/solutions-finder.css";
import "../styles/solutions-extended.css";
import "../styles/solutions-explorer.css";
import '../styles/brand-heroes.css';

const popularSearches = ["PPKH", "ISSB", "GHG Inventory", "Mine Closure", "Climate Risk", "Carbon Market", "Water Security"];
const Icons = { ArrowDown, ArrowRight, Network, Search, Users };

export default function SolutionsFinderPage({ previewArtwork }) {
  const artwork = import.meta.env.DEV && previewArtwork ? previewArtwork : approvedHeroAssets.solutions;
  usePageSeo({ title: "Solutions Explorer | INVESG", description: "Explore organizational sustainability challenges and relevant INVESG advisory capabilities through a problem-led journey.", canonicalPath: "/solutions", image: approvedHeroAssets.solutions.desktop });
  const [query, setQuery] = React.useState("");
  const [searchNote, setSearchNote] = React.useState("");
  const [activeGroup, setActiveGroup] = React.useState("all");
  const [focusedCode, setFocusedCode] = React.useState("");

  const focusService = (service) => {
    setFocusedCode(service.serviceCode);
    setActiveGroup(service.solutionGroup);
    setSearchNote("");
    window.setTimeout(() => document.getElementById(`service-${service.serviceCode}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  const findService = (term) => {
    const normalized = term.trim().toLowerCase();
    if (!normalized) return;
    const found = services.find((item) => [item.serviceCode, item.serviceName, item.description, ...item.deliverables].join(" ").toLowerCase().includes(normalized));
    if (found) {
      focusService(found);
      setSearchNote(`Showing ${found.serviceName} in the service catalogue.`);
    } else {
      setSearchNote(`No exact service matched “${term.trim()}”. Try the Explorer or browse the full catalogue below.`);
      document.getElementById("solutions-explorer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const submitSearch = (event) => { event.preventDefault(); findService(query); };

  return <main className="sf-page">
    <Navbar activeNavItem="Solutions" onSearch={(value) => { setQuery(value); findService(value); }} />
    <div className="sf-shell">
      <section className={`sf-hero sx-hero brand-solutions-hero${artwork ? ' brand-solutions-hero--with-art' : ''}`}>
        <div className="sf-hero-main">
          <div className="brand-solutions-copy"><span className="sf-eyebrow">INVESG Solutions</span><h1>Explore the Challenge.<br /><em>Find a Way Forward.</em></h1><p>Understand the systems, dependencies, constraints, trade-offs, and possible pathways behind your challenge.</p><p className="brand-hero-message">Understand the challenge before choosing the solution.</p></div>
          {artwork && <ResponsiveHeroArtwork artwork={artwork} kind="solutions" />}
          <form className="sf-search" onSubmit={submitSearch}><Icons.Search /><input aria-label="Search INVESG services" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a service, topic, or requirement..." /><button type="submit" aria-label="Search services"><Icons.ArrowRight /></button></form>
          <div className="sf-popular"><b>Popular searches:</b>{popularSearches.map((item) => <button type="button" key={item} onClick={() => { setQuery(item); findService(item); }}>{item}</button>)}</div>
          {searchNote && <p className="sx-search-note" role="status">{searchNote}</p>}
          <ol className="brand-decision-stages" aria-label="Navigating a decision landscape"><li><b>Explore</b><span>Define the challenge and context.</span></li><li><b>Understand</b><span>Identify dependencies, risks, opportunities, and trade-offs.</span></li><li><b>Navigate</b><span>Consider alternatives and possible pathways forward.</span></li></ol>
        </div>
        <aside className="sx-hero-aside"><Icons.Network /><span>Problem-led exploration</span><h2>Start with what your organization is navigating.</h2><p>The Explorer provides structured prompts and transparent service mappings. It does not produce a score or replace a tailored assessment.</p><a href="#solutions-explorer">Open Solutions Explorer <Icons.ArrowDown /></a></aside>
      </section>

      <SolutionsExplorer services={services} onViewService={focusService} />

      <div id="solution-groups"><SolutionGroups groups={solutionGroups} active={activeGroup} onChange={(value) => { setActiveGroup(value); document.getElementById("full-catalogue")?.scrollIntoView({ behavior: "smooth" }); }} /></div>
      <SolutionCatalogue services={services} groups={solutionGroups} industries={industries} models={deliveryModels} activeGroup={activeGroup} setActiveGroup={setActiveGroup} focusedCode={focusedCode} />
      <WhyInvesg />
      <section className="sf-cta"><Icons.Users /><div><h2>Need to discuss a different challenge?</h2><p>Share the context with INVESG and begin with a focused conversation.</p></div><a href="/contact?source=solutions">Talk to INVESG <Icons.ArrowRight /></a></section>
    </div>
    <SiteFooter />
  </main>;
}
