import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

const fade = { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" } };
const IconByName = ({ name, size = 22 }) => { const Icon = Icons[name] || Icons.Sparkles; return <Icon size={size} strokeWidth={1.7} />; };

export function SearchBar({ value, onChange, onSubmit, loading = false }) {
  return <form className="oi-search" onSubmit={onSubmit} role="search">
    <Icons.Search size={21} />
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search opportunity, technology, sector, country, policy..." aria-label="Search opportunity intelligence" />
    <button type="submit" disabled={loading}>{loading ? "Searching…" : "Search"}<Icons.ArrowRight size={16} /></button>
  </form>;
}

export function OpportunityHero({ query, setQuery, onSearch, loading, onBrowse }) {
  return <section className="oi-hero"><div className="oi-shell oi-hero-grid">
    <motion.div {...fade} className="oi-hero-copy"><span className="oi-eyebrow">Opportunity Intelligence</span><h1>Discover where<br/><em>sustainable value</em><br/>is emerging.</h1><p>Explore opportunities through market intelligence, sustainability insights, technology trends, policies, research, reports, and investment signals.</p><strong>Understand opportunities before making decisions.</strong><SearchBar value={query} onChange={setQuery} onSubmit={onSearch} loading={loading} /><div className="oi-browse"><span>OR</span><small>Browse by</small>{["Sector", "Region", "Country", "Theme", "Trending"].map((item) => <button key={item} onClick={() => onBrowse(item)}>{item}</button>)}</div></motion.div>
    <motion.div className="oi-hero-orbit" initial={{opacity:0,scale:.97}} animate={{opacity:1,scale:1}} transition={{duration:.7}} aria-hidden="true"><div className="oi-orbit oi-orbit-one"/><div className="oi-orbit oi-orbit-two"/><div className="oi-globe"><Icons.Globe2/><b>Signals become visible<br/>when connections are clear.</b></div>{[["TrendingUp","Market"],["Landmark","Policy"],["Lightbulb","Technology"],["BookOpen","Research"],["ChartNoAxesCombined","Investment"]].map(([icon,label],i)=><div key={label} className={`oi-signal oi-signal-${i+1}`}><IconByName name={icon} size={17}/><span>{label}</span></div>)}</motion.div>
  </div></section>;
}

export function OpportunityCard({ item }) {
  return <motion.article layout className="oi-opportunity-card" whileHover={{ y: -5 }}><div className="oi-card-top"><span className="oi-card-icon"><IconByName name={item.icon}/></span><span className={`oi-momentum oi-${item.momentum.toLowerCase()}`}>{item.momentum} momentum</span></div><h3>{item.title}</h3><p>{item.description}</p><div className="oi-card-facts"><span><b>{item.maturity}</b> maturity</span><span><b>{item.countryCount}</b> countries</span></div><div className="oi-card-footer"><small>Updated {item.lastUpdated}</small><a href={`/opportunities/${item.slug}`}>Explore <Icons.ArrowUpRight size={15}/></a></div></motion.article>;
}

export function FeaturedOpportunityGrid({ items, searchTerm }) {
  return <section id="featured" className="oi-section oi-shell"><div className="oi-section-head"><div><span className="oi-eyebrow">Featured opportunities</span><h2>{searchTerm ? `Results for “${searchTerm}”` : "Signals worth exploring now."}</h2></div><p>Curated opportunity themes with meaningful momentum across markets, policy, technology, and investment.</p></div>{items.length ? <motion.div layout className="oi-featured-grid">{items.map(item=><OpportunityCard key={item.slug} item={item}/>)}</motion.div>:<div className="oi-empty"><Icons.SearchX/><h3>No matching opportunities yet.</h3><p>Try a broader technology, sector, country, policy, or theme.</p></div>}</section>;
}

export function SectorCard({ item }) { return <a className="oi-sector-card" href={`/opportunity/indonesia?sector=${encodeURIComponent(item.name)}`}><span><IconByName name={item.icon}/></span><h3>{item.name}</h3><Icons.ArrowUpRight size={16}/></a>; }
export function SectorGrid({ items }) { return <section id="sector" className="oi-section oi-shell"><div className="oi-section-head"><div><span className="oi-eyebrow">Browse by sector</span><h2>Start with the system you know.</h2></div><p>Explore transition opportunities through an industry lens, then connect them across value chains.</p></div><div className="oi-sector-grid">{items.map(item=><SectorCard key={item.name} item={item}/>)}</div></section>; }

export function RegionCard({ item, index }) { return <motion.a {...fade} transition={{delay:(index%3)*.06}} className="oi-region-card" href={`/opportunity/${item.code.toLowerCase()}`}><span>{item.code}</span><h3>{item.name}</h3><p>{item.description}</p><b>Explore region <Icons.ArrowRight size={15}/></b></motion.a>; }
export function RegionGrid({ items }) { return <section id="region" className="oi-section oi-region-section"><div className="oi-shell"><div className="oi-section-head"><div><span className="oi-eyebrow">Browse by region</span><h2>Opportunity has a geography.</h2></div><p>Context changes what is possible. Compare signals through market, policy, infrastructure, and sustainability conditions.</p></div><div className="oi-region-grid">{items.map((item,index)=><RegionCard key={item.name} item={item} index={index}/>)}</div></div></section>; }

export function ThemeCard({ name }) { return <a className="oi-theme-card" href={`#featured?theme=${encodeURIComponent(name)}`}><span>{name}</span><Icons.ArrowUpRight size={15}/></a>; }
export function ThemeGrid({ items }) { return <section id="theme" className="oi-section oi-shell"><div className="oi-section-head"><div><span className="oi-eyebrow">Browse by theme</span><h2>Follow the forces shaping change.</h2></div><p>Trace connected opportunity themes across sectors, technologies, markets, and regions.</p></div><div className="oi-theme-grid">{items.map(item=><ThemeCard key={item} name={item}/>)}</div></section>; }

export function OpportunityJourneyPreview() { const stages=[["Radio","Signal"],["Sparkles","Opportunity"],["ScanSearch","Assessment"],["Blocks","Project"],["Landmark","Investment"],["Leaf","Sustainable Value"]]; return <section className="oi-section oi-journey"><div className="oi-shell"><div className="oi-section-head"><div><span className="oi-eyebrow">The opportunity journey</span><h2>From early signal to sustainable value.</h2></div><p>Intelligence helps teams understand what is changing, assess what it means, and decide what deserves deeper work.</p></div><div className="oi-journey-track">{stages.map(([icon,label],index)=><React.Fragment key={label}><div className="oi-journey-stage"><span><IconByName name={icon}/></span><b>{String(index+1).padStart(2,"0")}</b><h3>{label}</h3></div>{index<stages.length-1&&<Icons.ArrowRight className="oi-journey-arrow"/>}</React.Fragment>)}</div><p className="oi-disclaimer"><Icons.Info size={15}/> Opportunity intelligence supports exploration and assessment. It is not an investment recommendation.</p></div></section>; }

export function CTASection() { return <section className="oi-shell oi-cta"><div><span className="oi-eyebrow">Need deeper insights?</span><h2>Bring your opportunity into focus.</h2><p>Want a tailored assessment for your project, company, or investment opportunity?</p></div><div><a className="oi-primary" href="/contact?source=opportunity">Request a Custom Opportunity Assessment <Icons.ArrowUpRight size={17}/></a><a className="oi-secondary" href="/contact?source=opportunity">Talk to an INVESG Expert</a></div></section>; }
