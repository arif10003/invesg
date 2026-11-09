import React from "react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import SocialMediaSection from "../components/insights/SocialMediaSection";
import { socialChannels } from "../data/insights";
import { usePageSeo } from "../utils/seo";
import "../styles/insights.css";
import "../styles/insight-detail.css";

export default function InsightMediaPage() {
  usePageSeo({ title: "Social & Media | INVESG Insights", description: "Selected Instagram, LinkedIn, and media publications from INVESG’s official channels.", canonicalPath: "/insights/media" });
  return <main className="insights-page"><Navbar activeNavItem="Insights" /><header className="insights-shell archive-header"><nav aria-label="Breadcrumb"><a href="/insights">Insights</a><span>/</span><span aria-current="page">Social &amp; Media</span></nav><span>INVESG Insights</span><h1>Social &amp; Media</h1><p>Selected publications from INVESG’s official social channels.</p></header><SocialMediaSection channels={socialChannels} /><SiteFooter /></main>;
}
