import React from "react";
import { FeaturedIssueGrid, TopicExplorer } from "./SustainabilityIntelligenceComponents";
import { sustainabilityIssues, sustainabilityTopics } from "../../data/sustainabilityIntelligence";
import "../../styles/sustainability-intelligence.css";
import "../../styles/intelligence-collaboration.css";

export default function SustainabilityCollaboration(){
  return <section className="ic-extension si-page" aria-label="Expanded Sustainability Intelligence">
    <FeaturedIssueGrid issues={sustainabilityIssues.slice(0,12)}/>
    <TopicExplorer topics={sustainabilityTopics.slice(0,24)}/>
    <div className="ic-wide-cta"><div><span>Sustainability Intelligence</span><h2>Move from signal to issue-specific understanding.</h2><p>Explore drivers, ESG lenses, evidence, geographic exposure, risks, dependencies, trade-offs, related opportunities, and relevant solutions.</p></div><div><a href="/sustainability/issues/industrial-water-stress">View flagship issue</a><a href="/contact?source=sustainability">Request an assessment</a></div></div>
  </section>;
}
