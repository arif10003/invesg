import React from "react";
import { ArrowRight, BarChart3, Building2, Check, CircleDot, FileSearch, Leaf, Network, Scale, ShieldCheck, Target } from "lucide-react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import { usePageSeo } from "../utils/seo";
import "../styles/about.css";
import "../styles/about-refinement.css";
import "../styles/company-heroes.css";

const transformations = [
  ["Fragmented information", "Connected intelligence"],
  ["Periodic reporting", "Ongoing understanding"],
  ["Separate ESG activities", "Integrated decision support"],
  ["Static recommendations", "Practical action"],
  ["Compliance-only thinking", "Sustainable value creation"],
];

const principles = [
  [Network, "Everything Is Connected", "Climate, nature, communities, governance, finance, operations, technology, and markets continually shape one another."],
  [CircleDot, "ESG Is a Lens", "ESG helps organizations see relationships across a system. It is a way to understand context—not the final destination."],
  [Target, "Decisions Are the Outcome", "The purpose of intelligence is to clarify what matters, what may happen next, and what an organization should do."],
];

const approach = [
  ["01", "Understand", "Clarify the decision, business context, stakeholders, and evidence available."],
  ["02", "Connect", "Examine dependencies, impacts, risks, opportunities, and trade-offs across the system."],
  ["03", "Prioritize", "Identify what is material, decision-relevant, and practical for the organization."],
  ["04", "Act & Learn", "Translate insight into action, monitor what matters, and improve as conditions change."],
];

const expertise = [
  [Scale, "Sustainability Strategy", "Direction, material priorities, governance, roadmaps, and integration with business decisions."],
  [ShieldCheck, "Risk & Resilience", "Connected environmental, social, governance, operational, and value-chain risk."],
  [Leaf, "Climate & Nature", "Climate, carbon, energy, water, biodiversity, land, transition, and adaptation context."],
  [FileSearch, "Research & Assessment", "Evidence-led due diligence, policy and standards review, reporting readiness, and decision briefs."],
  [BarChart3, "Monitoring & Analytics", "Performance views, indicators, evidence structures, and repeatable decision-support workflows."],
  [Building2, "Projects & Investment", "Sustainability context for projects, financing, investment screening, and implementation readiness."],
];

function SectionHeading({ eyebrow, title, children, align = "left" }) {
  return <header className={`about-section-heading about-section-heading--${align}`}>{eyebrow && <span>{eyebrow}</span>}<h2>{title}</h2>{children && <p>{children}</p>}</header>;
}

export default function AboutPage() {
  usePageSeo({ title: "About INVESG | Decision Intelligence for Sustainable Value", description: "INVESG is a sustainability intelligence and advisory business helping organizations understand connected risks, opportunities, and decisions.", canonicalPath: "/about" });

  return (
    <main className="about-page">
      <Navbar activeNavItem="About" />

      <section className="about-hero about-shell company-hero" aria-labelledby="about-title">
        <div className="about-intro company-hero-copy">
          <span className="about-eyebrow">ABOUT INVESG</span>
          <h1 id="about-title"><span>Connecting Perspectives.</span><em>Creating Sustainable Value.</em></h1>
          <div className="about-rule" />
          <p>We connect knowledge, systems, and perspectives to help organizations navigate complexity and make better decisions.</p>
        </div>
        <picture className="about-hero-visual company-hero-artwork"><source media="(max-width: 760px)" srcSet="/assets/brand/invesg-about-lenses-small.webp" /><img src="/assets/brand/invesg-about-lenses.webp" width="1672" height="941" fetchPriority="high" alt="Layered transparent lenses connect nature, communities and governance across a sustainable landscape." /></picture>
      </section>

      <section className="about-value-propositions" aria-label="How we create value"><div className="about-shell">
        <article><h2>See the Bigger Picture</h2><p>Understand the connections across systems and stakeholders.</p></article>
        <article><h2>Make Sense of Complexity</h2><p>Assess risks, opportunities, and trade-offs.</p></article>
        <article><h2>Navigate Uncertainty</h2><p>Explore alternatives and implications for better decisions.</p></article>
        <article><h2>Create Lasting Impact</h2><p>Build resilience, drive growth, and deliver sustainable value.</p></article>
      </div></section>
      <section className="about-shell about-section about-identity">
        <SectionHeading eyebrow="Who we are" title="Decision Intelligence for Sustainable Value." />
        <p>INVESG is a sustainability intelligence and advisory business. We help organizations make sense of interconnected environmental, social, governance, financial, operational, and market factors, turning complexity into clearer insights and better strategic, investment, and operational decisions.</p>
        <p>Our role is to transform fragmented information into a clearer basis for strategy, investment, risk management, and action.</p>
        <strong>ESG is the lens. Better decisions are the outcome.</strong>
      </section>

      <section className="about-shell about-section why-section">
        <SectionHeading eyebrow="Why we exist" title="Complex decisions need connected understanding.">Organizations generate more information than ever, yet important decisions are still shaped by disconnected reports, changing requirements, competing priorities, and incomplete perspectives.</SectionHeading>
        <div className="why-layout">
          <div className="why-copy"><p>INVESG exists to bridge that gap.</p><p>Our purpose is to transform sustainability complexity into decision intelligence that enables confident action and long-term value.</p><p>We connect evidence, sustainability context, professional judgment, and the realities of an organization so decision-makers can see what matters and move forward with greater confidence.</p></div>
          <div className="transformation-list">{transformations.map(([from, to]) => <div key={from}><span>{from}</span><ArrowRight /><b>{to}</b></div>)}</div>
        </div>
      </section>

      <section className="about-shell about-section">
        <SectionHeading eyebrow="Our philosophy" title="ESG is a lens—not a checklist." align="center">We use an ESG lens to understand how different parts of a system interact and how those connections affect risk, opportunity, resilience, and value.</SectionHeading>
        <div className="about-principle-grid">
          {principles.map(([Icon, title, description]) => <article className="about-card about-principle-card" key={title}><span className="about-icon"><Icon /></span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="about-work-section">
        <div className="about-shell about-section">
          <SectionHeading eyebrow="How we work" title="From complexity to practical action.">Our approach begins with the decision—not a generic score or reporting template.</SectionHeading>
          <ol className="about-work-grid">{approach.map(([number, title, description]) => <li key={title}><span>{number}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
          <p className="about-method-note"><Check /> The depth and method of each engagement are adapted to the organization, decision, sector, geography, and available evidence.</p>
        </div>
      </section>

      <section className="about-shell about-section about-expertise">
        <SectionHeading eyebrow="Expertise & capabilities" title="Connected capabilities for sustainability decisions.">INVESG combines research, assessment, strategic advisory, and decision-support practices. Specific scope is defined around the client’s context and needs.</SectionHeading>
        <div className="about-expertise-grid">{expertise.map(([Icon, title, description]) => <article className="about-card" key={title}><span className="about-icon"><Icon /></span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="about-shell about-section about-trust">
        <div><span className="about-eyebrow">Why work with INVESG</span><h2>A disciplined way to see the bigger picture.</h2></div>
        <ul><li><b>Systems thinking</b><span>We examine relationships rather than treating each issue in isolation.</span></li><li><b>Evidence-led judgment</b><span>We distinguish verified evidence, assumptions, uncertainty, and context.</span></li><li><b>Decision focus</b><span>We connect analysis to the choice, action, or capability it needs to support.</span></li><li><b>Long-term perspective</b><span>We consider resilience and sustainable value alongside immediate priorities.</span></li></ul>
      </section>

      <section className="about-shell about-section about-publishing">
        <SectionHeading eyebrow="PUBLISHING & KNOWLEDGE DISSEMINATION" title="Connecting knowledge with wider perspectives." />
        <p>Alongside its sustainability intelligence, research, and advisory activities, invesg develops and publishes books and knowledge resources that make complex ideas accessible and relevant to practical decision-making.</p>
        <p>These publications bring together research, professional experience, and multidisciplinary perspectives to encourage critical thinking, deeper understanding, and the creation of sustainable value.</p>
        <p className="about-corporate-identity">invesg is the sustainability intelligence and advisory brand of PT INVESG NEXUS NITYA, an Indonesian company whose activities include book publishing.</p>
        <p className="about-publisher-name">Publisher: <strong>PT INVESG NEXUS NITYA</strong></p>
        <a href="/insights/books">Explore Books &amp; Publications <ArrowRight aria-hidden="true" /></a>
      </section>

      <section className="about-final-cta">
        <div className="about-shell"><h2>Better decisions begin with better understanding.</h2><p>Tell us what your organization is navigating and explore how INVESG can help bring the challenge into focus.</p><div><a className="about-primary-cta" href="/contact">Talk to INVESG <ArrowRight /></a><a className="about-secondary-cta" href="/solutions">Explore Solutions</a></div></div>
      </section>

      <SiteFooter />
    </main>
  );
}
