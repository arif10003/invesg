import React from "react";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Navbar from "../Navbar";
import SiteFooter from "../SiteFooter";

export default function InsightPageState({ title, message, eyebrow = "Insights" }) {
  return <main className="insights-page">
    <Navbar activeNavItem="Insights" />
    <section className="insights-shell insight-page-state"><FileQuestion /><span>{eyebrow}</span><h1>{title}</h1><p>{message}</p><a href="/insights"><ArrowLeft /> Back to Insights</a></section>
    <SiteFooter />
  </main>;
}
