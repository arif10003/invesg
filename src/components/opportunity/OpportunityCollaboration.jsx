import React from "react";
import { FeaturedOpportunityGrid, RegionGrid } from "./OpportunityLandingComponents";
import { featuredOpportunities, regions } from "../../data/opportunityLanding";
import "../../styles/opportunity-landing.css";
import "../../styles/intelligence-collaboration.css";

export default function OpportunityCollaboration(){
  return <section className="ic-extension opportunity-landing" aria-label="Expanded Opportunity Intelligence">
    <FeaturedOpportunityGrid items={featuredOpportunities} searchTerm=""/>
    <RegionGrid items={regions}/>
    <div className="ic-wide-cta"><div><span>Opportunity Intelligence</span><h2>Move from signal to project-specific assessment.</h2><p>Open a detailed opportunity record to explore market, investment, policy, technology, research, sustainability implications, and related INVESG solutions.</p></div><div><a href="/opportunities/nickel-battery-supply-chain">View flagship opportunity</a><a href="/decision-navigator">Use Decision Navigator</a></div></div>
  </section>;
}
