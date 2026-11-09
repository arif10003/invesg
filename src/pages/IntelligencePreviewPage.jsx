import React from "react";
import { ArrowRight, Compass, Eye, Layers3 } from "lucide-react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import { usePageSeo } from "../utils/seo";
import "../styles/intelligence-preview.css";

const previews = {
  sustainability: {
    nav: "Sustainability Intelligence",
    eyebrow: "Capability preview · In development",
    title: "Sustainability Intelligence",
    description: "A future evidence-led capability for connecting sustainability issues, locations, sectors, dependencies, risks, opportunities, and response options.",
    future: "The planned experience will help decision-makers explore verified evidence in context—not generate universal scores or automated conclusions.",
    items: ["Connect issues across environmental, social, governance, and business systems", "Explore location- and sector-specific context", "Trace evidence, dependencies, trade-offs, and possible responses"],
    source: "sustainability",
  },
  opportunity: {
    nav: "Opportunity Intelligence",
    eyebrow: "Capability preview · In development",
    title: "Opportunity Intelligence",
    description: "A future research capability for understanding emerging markets, transition opportunities, enabling conditions, and sustainability implications.",
    future: "The planned experience will bring verified market, policy, investment, technology, and sustainability evidence into a connected decision context.",
    items: ["Explore emerging opportunity themes and value chains", "Understand enabling conditions and material constraints", "Connect opportunity signals with relevant risks and advisory support"],
    source: "opportunity",
  },
};

export default function IntelligencePreviewPage({ type }) {
  const preview = previews[type];
  usePageSeo({ title: `${preview.title} Preview | INVESG`, description: preview.description, canonicalPath: `/${type === "sustainability" ? "sustainability" : "opportunity"}`, robots: "index,follow" });
  return <main className="intelligence-preview-page">
    <Navbar activeNavItem={preview.nav} />
    <section className="preview-hero"><div className="preview-shell"><div><span>{preview.eyebrow}</span><h1>{preview.title}</h1><p>{preview.description}</p><div className="preview-actions"><a href={`/contact?source=${preview.source}`}>Register Interest <ArrowRight /></a><a href={`/contact?source=${preview.source}`}>Discuss Your Needs</a></div></div><aside><Eye /><b>Preview status</b><p>This capability is being developed. No live intelligence feed, paid AI analysis, or automated assessment is currently offered on this page.</p></aside></div></section>
    <section className="preview-shell preview-value"><header><span>Future value proposition</span><h2>Designed to support better-informed decisions.</h2><p>{preview.future}</p></header><div>{preview.items.map((item, index) => <article key={item}>{index === 0 ? <Layers3 /> : index === 1 ? <Compass /> : <Eye />}<h3>{item}</h3></article>)}</div></section>
    <section className="preview-shell preview-notice"><div><span>Need support now?</span><h2>INVESG's advisory team can discuss your current needs.</h2><p>The advisory conversation is available today even while the digital intelligence capability remains in development.</p></div><a href={`/contact?source=${preview.source}`}>Talk to INVESG <ArrowRight /></a></section>
    <SiteFooter />
  </main>;
}
