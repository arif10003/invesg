import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import { usePageSeo } from "../utils/seo";
import {
  deliveryModels,
  industries,
  services,
  solutionGroups,
} from "../data/solutions";
import "../styles/solutions.css";

const reveal = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const challengeOptions = [
  { id: "strategy", label: "Set direction", groups: ["strategy", "risk"] },
  { id: "compliance", label: "Meet obligations", groups: ["reporting", "nature"] },
  { id: "climate", label: "Act on climate", groups: ["climate", "finance"] },
  { id: "investment", label: "Make an investment", groups: ["investment", "finance"] },
  { id: "data", label: "Use data better", groups: ["digital", "intelligence"] },
  { id: "capability", label: "Build capability", groups: ["training", "managed"] },
];

function GroupIcon({ name, size = 23 }) {
  const Icon = Icons[name] || Icons.Sparkles;
  return <Icon size={size} strokeWidth={1.7} />;
}

function Navigator({ onResults }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const steps = [
    { key: "industry", title: "Which industry best describes you?", options: industries.slice(1) },
    { key: "challenge", title: "What are you trying to achieve?", options: challengeOptions.map((x) => x.label) },
    { key: "model", title: "How would you like us to help?", options: deliveryModels.slice(1) },
  ];

  const choose = (value) => {
    const next = { ...answers, [steps[step].key]: value };
    setAnswers(next);
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    const selectedChallenge = challengeOptions.find((x) => x.label === next.challenge);
    const ranked = services
      .map((item) => ({
        ...item,
        score:
          (item.industries.includes(next.industry) ? 3 : 0) +
          (selectedChallenge?.groups.includes(item.solutionGroup) ? 4 : 0) +
          (item.deliveryModel === next.model ? 2 : 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    onResults(ranked);
    setStep(3);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
    onResults([]);
  };

  return (
    <div className="navigator-card">
      <div className="navigator-progress" aria-label={`Step ${Math.min(step + 1, 3)} of 3`}>
        {[0, 1, 2].map((item) => <span key={item} className={item <= step ? "active" : ""} />)}
      </div>
      {step < 3 ? (
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}>
            <span className="eyebrow">Step {step + 1} of 3</span>
            <h3>{steps[step].title}</h3>
            <div className="navigator-options">
              {steps[step].options.map((option) => (
                <button key={option} onClick={() => choose(option)}>
                  <span>{option}</span><Icons.ArrowRight size={16} />
                </button>
              ))}
            </div>
            {step > 0 && <button className="text-button" onClick={() => setStep(step - 1)}><Icons.ArrowLeft size={15} /> Back</button>}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="eyebrow">Your shortlist is ready</span>
          <h3>We found three strong starting points.</h3>
          <p>Recommendations are based on your industry, challenge, and preferred way of working.</p>
          <button className="secondary-button" onClick={reset}><Icons.RotateCcw size={15} /> Start again</button>
        </motion.div>
      )}
    </div>
  );
}

function ServiceCard({ item, recommended = false }) {
  const [open, setOpen] = React.useState(false);
  return (
    <motion.article layout className={`service-card ${recommended ? "recommended" : ""}`}>
      <div className="service-code">{item.serviceCode}{recommended && <span>Recommended</span>}</div>
      <h3>{item.serviceName}</h3>
      <p>{item.description}</p>
      <div className="service-meta">
        <span><Icons.Users size={15} />{item.bestFor}</span>
        <span><Icons.BriefcaseBusiness size={15} />{item.deliveryModel}</span>
      </div>
      <button className="service-expand" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? "Show less" : "View solution"} <Icons.ChevronDown className={open ? "rotated" : ""} size={17} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="service-detail" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <h4>Key deliverables</h4>
            <ul>{item.deliverables.map((d) => <li key={d}><Icons.Check size={14} />{d}</li>)}</ul>
            <h4>Related solutions</h4>
            <div className="related">{item.relatedServices.map((r) => <span key={r}>{r}</span>)}</div>
            <div className="card-actions">
              <a href="/contact">Talk to an Expert <Icons.ArrowUpRight size={15} /></a>
              <button>Learn More</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function SolutionsPage() {
  usePageSeo({ title: "INVESG Solutions Catalogue", description: "Browse INVESG sustainability advisory, assessment, research, strategy, and decision-support capabilities.", canonicalPath: "/solutions/explore" });
  const [query, setQuery] = React.useState("");
  const [industry, setIndustry] = React.useState("All Industries");
  const [model, setModel] = React.useState("All Models");
  const [group, setGroup] = React.useState("All Solutions");
  const [recommendations, setRecommendations] = React.useState([]);

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    return services.filter((item) => {
      const searchable = [item.serviceCode, item.serviceName, item.description, item.bestFor, ...item.deliverables].join(" ").toLowerCase();
      return (!term || searchable.includes(term)) &&
        (industry === "All Industries" || item.industries.includes(industry)) &&
        (model === "All Models" || item.deliveryModel === model) &&
        (group === "All Solutions" || item.solutionGroup === group);
    });
  }, [query, industry, model, group]);

  const scrollToSolutions = () => document.getElementById("solution-library")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="solutions-page">
      <Navbar activeNavItem="Solutions" onSearch={(value) => { setQuery(value); scrollToSolutions(); }} />

      <section className="solutions-hero">
        <div className="solutions-shell hero-grid">
          <motion.div initial="hidden" animate="visible" variants={reveal} className="solutions-hero-copy">
            <span className="eyebrow">Sustainability intelligence, applied</span>
            <h1>Solutions for<br /><em>Better Decisions.</em></h1>
            <p>Helping organizations navigate ESG, risk, climate, investment, and sustainability challenges through evidence-based intelligence and practical solutions.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={scrollToSolutions}>Explore Solutions <Icons.ArrowDown size={17} /></button>
              <a className="secondary-button" href="/decision-navigator">Use Decision Navigator <Icons.WandSparkles size={17} /></a>
            </div>
            <div className="hero-proof"><Icons.Network size={18} /> Powered by the invesg Decision Intelligence Framework.</div>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
            <img src="/assets/esg-hero.png" alt="A connected landscape representing integrated sustainability decisions" />
            <div className="lens-card">
              <Icons.ScanSearch size={25} />
              <b>See the whole system.</b>
              <p>Connect risk, opportunity, impact, and value before you act.</p>
            </div>
            <div className="signal-pill"><span /> Intelligence → decision → action</div>
          </motion.div>
        </div>
      </section>

      <section id="navigator" className="navigator-section">
        <div className="solutions-shell navigator-grid">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <span className="eyebrow">Solution Navigator</span>
            <h2>Not sure where to start?</h2>
            <p>Answer a few questions and we’ll guide you to the most relevant solutions. No jargon. No endless catalogue.</p>
            <div className="navigator-note"><Icons.Sparkles size={18} /><span><b>Designed for clarity.</b><br />A focused decision tree today, ready for intelligence-assisted recommendations tomorrow.</span></div>
          </motion.div>
          <Navigator onResults={setRecommendations} />
        </div>
        {recommendations.length > 0 && (
          <div className="solutions-shell recommendation-grid">
            {recommendations.map((item) => <ServiceCard key={item.serviceCode} item={item} recommended />)}
          </div>
        )}
      </section>

      <section className="solutions-shell browse-section">
        <div className="section-heading">
          <span className="eyebrow">Browse our capabilities</span>
          <h2>One challenge. Multiple connected solutions.</h2>
          <p>Explore focused capabilities that work individually or as an integrated decision system.</p>
        </div>
        <div className="group-grid">
          {solutionGroups.map((item, index) => (
            <motion.button
              key={item.id}
              className={group === item.id ? "group-card selected" : "group-card"}
              onClick={() => { setGroup(item.id); scrollToSolutions(); }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 4) * 0.05 }}
            >
              <span className="group-icon"><GroupIcon name={item.icon} /></span>
              <span className="group-count">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.short}</p>
              <span className="group-link">{item.serviceCount} solutions <Icons.ArrowRight size={16} /></span>
            </motion.button>
          ))}
        </div>
      </section>

      <section id="solution-library" className="library-section">
        <div className="solutions-shell">
          <div className="library-heading">
            <div><span className="eyebrow">Explore solutions</span><h2>Find the right starting point.</h2></div>
            <span>{filtered.length} solution{filtered.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="filter-bar">
            <label className="solution-search"><Icons.Search size={19} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search PPKH, carbon, investor, risk, dashboard..." /></label>
            <label><span>Solution</span><select value={group} onChange={(e) => setGroup(e.target.value)}><option>All Solutions</option>{solutionGroups.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
            <label><span>Industry</span><select value={industry} onChange={(e) => setIndustry(e.target.value)}>{industries.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label><span>Delivery model</span><select value={model} onChange={(e) => setModel(e.target.value)}>{deliveryModels.map((x) => <option key={x}>{x}</option>)}</select></label>
            {(query || group !== "All Solutions" || industry !== "All Industries" || model !== "All Models") && (
              <button className="clear-filters" onClick={() => { setQuery(""); setGroup("All Solutions"); setIndustry("All Industries"); setModel("All Models"); }}>Clear</button>
            )}
          </div>
          {filtered.length ? (
            <motion.div layout className="service-grid">
              <AnimatePresence>{filtered.map((item) => <ServiceCard key={item.serviceCode} item={item} />)}</AnimatePresence>
            </motion.div>
          ) : (
            <div className="empty-state"><Icons.SearchX size={34} /><h3>No exact match yet.</h3><p>Try a broader term or speak with us about your specific challenge.</p><a href="/contact">Talk to an Expert</a></div>
          )}
        </div>
      </section>

      <section className="solutions-shell why-section">
        <div className="section-heading"><span className="eyebrow">Why invesg</span><h2>More than advice. A better way to decide.</h2></div>
        <div className="why-grid">
          {[
            [Icons.Network, "Decision Intelligence", "We connect signals, systems, risks, and trade-offs into a clear basis for action."],
            [Icons.PanelsTopLeft, "Integrated Advisory", "Strategy, technical expertise, research, and implementation work as one system."],
            [Icons.Binary, "Digital Solutions", "Useful tools make evidence accessible, repeatable, and decision-ready."],
            [Icons.Handshake, "Long-term Partnership", "We stay close to the decision, building capability and momentum over time."],
          ].map(([Icon, title, text]) => <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="solutions-shell final-cta">
        <div><span className="eyebrow">Still unsure?</span><h2>Let’s make the challenge clearer.</h2><p>Talk with our experts about the decision in front of you.</p></div>
        <div><a className="primary-button" href="/contact">Book Consultation <Icons.ArrowUpRight size={17} /></a><a className="secondary-button" href="/contact">Contact Us</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
