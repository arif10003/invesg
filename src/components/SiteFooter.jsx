import React from "react";
import "../styles/footer-copyright.css";
import BrandLogo from "./BrandLogo";
import { InstagramIcon, LinkedinIcon } from "./Navbar";

export default function SiteFooter() {
  return <footer id="contact" className="wrap footer">
    <div><a className="brand-logo-link" href="/" aria-label="INVESG home"><BrandLogo placement="footer" /></a><p>ESG as a Lens.<br />Strategic insights for<br />sustainable value.</p><div className="foot-social"><a href="https://www.linkedin.com/company/invesg/" target="_blank" rel="noreferrer" aria-label="INVESG on LinkedIn"><LinkedinIcon size={21} /></a><a href="https://www.instagram.com/the.invesg?igsh=MWVrdDZxcjA1bzR1NA==" target="_blank" rel="noreferrer" aria-label="INVESG on Instagram"><InstagramIcon size={21} /></a></div></div>
    <div><b>Platform</b><a href="/sustainability">Sustainability Intelligence Preview</a><a href="/opportunity">Opportunity Intelligence Preview</a><a href="/insights">Insights</a><a href="/solutions">Solutions</a></div>
    <div><b>Academy</b><a href="/academy">invesg Academy</a><a href="/academy/programs">Learning Programs</a><a href="/academy/corporate">Corporate Training</a><a href="/academy/approach">Learning Approach</a></div>
    <div><b>Company</b><a href="/about">About INVESG</a><a href="/about">Our Approach</a><a href="/contact?source=contact">Work with INVESG</a><a href="/contact">Contact Us</a></div>
    <div className="newsletter"><b>Join Us</b><a href="/join-us">Explore Pathways</a><a href="/join-us/careers">Careers</a><a href="/join-us/learning-lab">Learning Lab</a><a href="/join-us/collaboration">Collaboration</a><a href="/insights/media">Social &amp; Media</a></div>
    <small className="footer-copyright">© 2026 invesg · PT INVESG NEXUS NITYA. All rights reserved.</small>
  </footer>;
}
