import { usePageContent } from '../hooks/usePageContent';
import React from "react";
import { ArrowRight, ArrowUpRight, BarChart3, FileSearch, Leaf, Network, Scale, ShieldCheck } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import Header from "../components/Header";
import SiteFooter from "../components/SiteFooter";
import { usePageSeo } from "../utils/seo";
import ResponsiveHeroArtwork from '../components/brand/ResponsiveHeroArtwork';
import { esgFactors } from '../components/brand/EsgSystemDiagram';
import { approvedHeroAssets } from '../data/brandAssets';
import "../styles.css";
import '../styles/brand-heroes.css';
import '../styles/home-hero.css';

const nav = ["Sustainability Intelligence", "Opportunity Intelligence", "Insights", "Solutions", "About", "Contact"];

const challenges = [
  { title: "Strategy & Direction", icon: Scale, color: "#007579", pos: "0%", href: "/solutions", lead: "Set priorities with greater clarity.", body: "Connect sustainability priorities with strategy, governance, risk, and long-term value creation." },
  { title: "Risk & Resilience", icon: ShieldCheck, color: "#001C44", pos: "33.333%", href: "/solutions", lead: "See how risks interact.", body: "Understand interconnected environmental, social, governance, operational, and financial exposure." },
  { title: "Climate & Nature", icon: Leaf, color: "#007579", pos: "66.666%", href: "/solutions", lead: "Navigate transition and dependency.", body: "Address climate, carbon, water, biodiversity, land, and nature-related decisions in context." },
  { title: "Reporting & Evidence", icon: FileSearch, color: "#001C44", pos: "100%", href: "/solutions", lead: "Turn requirements into action.", body: "Strengthen disclosure, compliance, evidence, performance monitoring, and decision-useful reporting." },
];

const capabilities = [
  [Network, "Decision Intelligence", "Connect signals, dependencies, risks, opportunities, and trade-offs before acting."],
  [Scale, "Strategic Advisory", "Translate sustainability complexity into practical priorities, governance, and action."],
  [FileSearch, "Research & Assessment", "Build a credible evidence base for projects, investments, policies, and reporting."],
  [BarChart3, "Monitoring & Analytics", "Organize material information into clear views that support ongoing decisions."],
];

const publishedInsights = [
  { title: "Risks Rarely Arrive Alone", topic: "Risk & Resilience", image: "/assets/insights/instagram-risk-connections.jpg", url: "https://www.instagram.com/the.invesg/p/DbKYYfJkc8_/" },
  { title: "Uncertainty Rarely Comes from One Source", topic: "Systems Thinking", image: "/assets/insights/instagram-uncertainty-systems.jpg", url: "https://www.instagram.com/the.invesg/p/DbAF2g6kRZq/" },
  { title: "ESG Helps Us See the Bigger Picture", topic: "ESG as a Lens", image: "/assets/insights/instagram-esg-lens-reel.jpg", url: "https://www.instagram.com/the.invesg/reel/Da2TZahurQ8/" },
];

export default function HomePage({ previewArtwork }) {
  const cms=usePageContent('home',{enabled:!(import.meta.env.DEV && previewArtwork)});
  const artwork = import.meta.env.DEV && previewArtwork ? previewArtwork : approvedHeroAssets.home;
  usePageSeo({ title: cms?.seo_title || "INVESG | Decision Intelligence for Sustainable Value", description: cms?.seo_description || "INVESG helps organizations understand connected sustainability challenges and make better strategic, investment, and operational decisions.", canonicalPath: "/", image: approvedHeroAssets.home.desktop });

  return (
    <main className="home-page">
      <Header activeNavItem="" navItems={nav} ctaText="Talk to INVESG" ctaLink="/contact" />

      <section className="hero home-hero brand-home-hero">
        <ResponsiveHeroArtwork artwork={artwork} />
        <div className="wrap brand-home-inner">
          <div className="hero-copy home-hero-copy">
            <span className="home-eyebrow">INVESG · Sustainability Intelligence &amp; Advisory</span>
            <h1>{cms?.hero_title ? <span>{cms.hero_title}</span> : <><span>Decision Intelligence</span><em>for Sustainable Value.</em></>}</h1>
            <p className="brand-home-description">{cms?.hero_subtitle || "Understand the connections between environmental, social, and governance factors to make better strategic, investment, and operational decisions."}</p>
            <p className="brand-hero-message">See the connections. Understand the implications. Make better decisions.</p>
            <div className="home-hero-actions">
              <a className="home-button home-button--primary" href="/solutions">Explore Solutions <ArrowRight /></a>
              <a className="home-button home-button--secondary" href="/insights">Discover Insights</a>
            </div>
            <a className="home-text-link" href="/contact">Talk to INVESG <ArrowUpRight /></a>
          </div>

        </div>
        <div className="wrap brand-esg-legend" aria-label="The ESG lens">
          {esgFactors.map(({ letter, title, description, Icon }) => <article key={letter}><Icon aria-hidden="true" /><div><strong>{letter} — {title}</strong><p>{description}</p></div></article>)}
          <p className="brand-system-note">Sustainable value is pursued through decisions, system responses, learning and adaptation.</p>
        </div>
      </section>

      <section className="wrap home-philosophy">
        <div className="venn" aria-hidden="true"><span /><span /><span /></div>
        <div className="home-philosophy-copy">
          <span className="home-eyebrow">Our perspective</span>
          <h2>Everything is connected.<br /><em>ESG is the lens.</em></h2>
          <p>Environmental, social, governance, financial, operational, and market forces do not move independently. Seeing their connections creates a stronger basis for decisions.</p>
        </div>
        <div className="home-philosophy-outcome"><b>Understand the system</b><ArrowRight /><b>Navigate uncertainty</b><ArrowRight /><b>Make better decisions</b></div>
      </section>

      <section id="explore" className="wrap explore home-section-heading">
        <span className="home-eyebrow">Explore challenges</span>
        <h2>Where does your organization need clarity?</h2>
        <p>Start with the challenge. Explore the capabilities that can help move it forward.</p>
        <div className="grid home-challenge-grid">
          {challenges.map(({ title, icon, color, pos, lead, body, href }) => <FeatureCard key={title} title={title} description={body} image="/assets/explore-strip.png" imagePosition={pos} href={href} icon={icon} theme={color} lead={lead} />)}
        </div>
      </section>

      <section className="home-capabilities">
        <div className="wrap">
          <header className="home-section-heading home-section-heading--light"><span className="home-eyebrow">Core capabilities</span><h2>From complexity to confident action.</h2><p>Research, advisory, and decision support designed to connect evidence with business context.</p></header>
          <div className="home-capability-grid">
            {capabilities.map(([Icon, title, description]) => <a href="/solutions" key={title}><Icon /><h3>{title}</h3><p>{description}</p><span>Explore capability <ArrowRight /></span></a>)}
          </div>
        </div>
      </section>

      <section className="wrap home-insights">
        <header className="home-section-heading home-section-heading--row"><div><span className="home-eyebrow">Featured insights</span><h2>Perspectives that connect the dots.</h2></div><a href="/insights">Discover all Insights <ArrowRight /></a></header>
        <div className="home-insight-grid">
          {publishedInsights.map((insight) => <a href={insight.url} target="_blank" rel="noreferrer" key={insight.url}><img src={insight.image} alt="" loading="lazy" decoding="async" /><div><span>Published on Instagram · {insight.topic}</span><h3>{insight.title}</h3><b>View publication <ArrowUpRight /></b></div></a>)}
        </div>
      </section>

      <section className="wrap home-about">
        <img src="/assets/esg-hero.png" alt="Forested mountains representing connected environmental and economic systems" loading="lazy" decoding="async" />
        <div><span className="home-eyebrow">About INVESG</span><h2>Clarity for decisions that shape long-term value.</h2><p>INVESG is a sustainability intelligence and advisory business. We connect research, professional expertise, and business context to help organizations understand risks, identify opportunities, and act with greater confidence.</p><ul><li>Systems thinking across sustainability and business</li><li>Evidence-led research and assessment</li><li>Decision-focused strategic advisory</li></ul><a className="home-button home-button--secondary" href="/about">About INVESG <ArrowRight /></a></div>
      </section>

      <section className="wrap home-contact-cta"><div><span className="home-eyebrow">Start a conversation</span><h2>Bring your challenge into focus.</h2><p>Tell us what your organization is navigating and explore how INVESG can help.</p></div><a className="home-button home-button--primary" href="/contact">Talk to INVESG <ArrowRight /></a></section>
      <SiteFooter />
    </main>
  );
}
