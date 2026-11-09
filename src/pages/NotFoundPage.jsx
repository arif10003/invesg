import React from "react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import { usePageSeo } from "../utils/seo";
import "../styles/intelligence-preview.css";

export default function NotFoundPage() {
  usePageSeo({ title: "Page Not Found | INVESG", description: "The requested INVESG page could not be found.", canonicalPath: window.location.pathname, robots: "noindex,follow" });
  return <main className="not-found-page"><Navbar activeNavItem="" /><section><span>404</span><h1>Page not found.</h1><p>The page may have moved, or the address may be incorrect.</p><div><a href="/">Return Home</a><a href="/solutions">Explore Solutions</a></div></section><SiteFooter /></main>;
}
