import React from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeDollarSign, Binary, Building2, ChartNoAxesCombined, Check, ChevronDown, CloudSun, Compass, FileCheck2, GraduationCap, Handshake, Landmark, Leaf, MonitorCog, Network, PanelsTopLeft, RotateCcw, Search, SearchX, ShieldCheck, Sparkles, Users, WandSparkles } from "lucide-react";

const Icons = { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BadgeDollarSign, Binary, Building2, ChartNoAxesCombined, Check, ChevronDown, CloudSun, Compass, FileCheck2, GraduationCap, Handshake, Landmark, Leaf, MonitorCog, Network, PanelsTopLeft, RotateCcw, Search, SearchX, ShieldCheck, Sparkles, Users, WandSparkles };

const challenges = [
  { label: "Set ESG direction", groups: ["strategy", "risk"] },
  { label: "Meet regulatory obligations", groups: ["reporting", "nature"] },
  { label: "Act on climate and carbon", groups: ["climate", "finance"] },
  { label: "Assess a project or investment", groups: ["investment", "finance"] },
  { label: "Use sustainability data better", groups: ["digital", "intelligence"] },
  { label: "Build internal capability", groups: ["training", "managed"] },
];

export function SolutionDecisionTree({ services, industries, models, onSelect }) {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState({});
  const [results, setResults] = React.useState([]);
  const steps = [
    { key: "industry", title: "Which industry best describes you?", options: industries.filter((item) => item !== "All Industries") },
    { key: "challenge", title: "What are you trying to achieve?", options: challenges.map((item) => item.label) },
    { key: "model", title: "How would you like us to help?", options: models.filter((item) => item !== "All Models") },
  ];
  const choose = (value) => {
    const next = { ...answers, [steps[step].key]: value };
    setAnswers(next);
    if (step < 2) return setStep(step + 1);
    const groups = challenges.find((item) => item.label === next.challenge)?.groups || [];
    setResults(services.map((item) => ({ ...item, score: (item.industries.includes(next.industry) ? 3 : 0) + (groups.includes(item.solutionGroup) ? 5 : 0) + (item.deliveryModel === next.model ? 2 : 0) })).sort((a, b) => b.score - a.score).slice(0, 3));
    setStep(3);
  };
  const reset = () => { setStep(0); setAnswers({}); setResults([]); };
  return <section className="sfx-navigator"><div className="sfx-heading"><div><span>Solution Navigator</span><h2>Not sure where to start?</h2><p>Answer three focused questions and we'll guide you toward relevant starting points.</p></div><div className="sfx-progress">{[0, 1, 2].map((item) => <i className={item <= step ? "active" : ""} key={item} />)}</div></div><div className="sfx-nav-body">{step < 3 ? <div key={step}><b>Step {step + 1} of 3</b><h3>{steps[step].title}</h3><div>{steps[step].options.map((option) => <button key={option} onClick={() => choose(option)}>{option}<Icons.ArrowRight /></button>)}</div>{step > 0 && <button className="sfx-back" onClick={() => setStep(step - 1)}><Icons.ArrowLeft /> Back</button>}</div> : <div><b>Your recommended starting points</b><h3>Three solutions matched to your context.</h3><div className="sfx-recommendations">{results.map((item, index) => <button key={item.serviceCode} onClick={() => onSelect(item)}><span>{index === 0 ? "Best match" : item.deliveryModel}</span><h4>{item.serviceName}</h4><p>{item.description}</p><b>View in catalogue <Icons.ArrowDown /></b></button>)}</div><button className="sfx-back" onClick={reset}><Icons.RotateCcw /> Start again</button></div>}<aside><Icons.WandSparkles /><h3>Guidance, not guesswork.</h3><p>This navigator uses transparent decision rules and does not provide an automated assessment.</p><a href="/solutions">Explore Solutions <Icons.ArrowUpRight /></a></aside></div></section>;
}

export function SolutionGroups({ groups, active, onChange }) {
  return <section className="sfx-section"><div className="sfx-section-heading"><span>Solution groups</span><h2>Browse connected capabilities.</h2><p>Each group can stand alone or combine into an integrated response.</p></div><div className="sfx-group-grid">{groups.map((group, index) => { const Icon = Icons[group.icon] || Icons.Sparkles; return <button className={active === group.id ? "active" : ""} onClick={() => onChange(group.id)} key={group.id}><Icon /><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><p>{group.short}</p><b>{group.serviceCount} solutions <Icons.ArrowRight /></b></button>; })}</div></section>;
}

function CatalogueCard({ item, focused }) {
  const [open, setOpen] = React.useState(focused);
  React.useEffect(() => { if (focused) setOpen(true); }, [focused]);
  return <article className={`sfx-service-card ${focused ? "focused" : ""}`} id={`service-${item.serviceCode}`}><span>{item.serviceCode} · {item.deliveryModel}</span><h3>{item.serviceName}</h3><p>{item.description}</p><div className="sfx-service-meta"><span><Icons.Users /> {item.bestFor}</span><span><Icons.Building2 /> {item.industries.slice(0, 4).join(" · ")}</span></div><button onClick={() => setOpen(!open)} aria-expanded={open}>{open ? "Show less" : "View solution"}<Icons.ChevronDown className={open ? "rotate" : ""} /></button>{open && <div className="sfx-card-detail"><b>Key deliverables</b><ul>{item.deliverables.map((value) => <li key={value}><Icons.Check />{value}</li>)}</ul><div><a href={`/contact?source=solutions&service=${encodeURIComponent(item.serviceCode)}`}>Talk to an Expert <Icons.ArrowUpRight /></a><a href="/insights">Related insights</a></div></div>}</article>;
}

export function SolutionCatalogue({ services, groups, industries, models, activeGroup, setActiveGroup, focusedCode }) {
  const [query, setQuery] = React.useState("");
  const [industry, setIndustry] = React.useState("All Industries");
  const [model, setModel] = React.useState("All Models");
  const filtered = services.filter((item) => (activeGroup === "all" || item.solutionGroup === activeGroup) && (industry === "All Industries" || item.industries.includes(industry)) && (model === "All Models" || item.deliveryModel === model) && (!query || [item.serviceName, item.description, item.bestFor, ...item.deliverables].join(" ").toLowerCase().includes(query.toLowerCase())));
  return <section id="full-catalogue" className="sfx-section sfx-catalogue"><div className="sfx-section-heading"><span>Complete solution catalogue</span><h2>Find the precise capability you need.</h2><p>Search and filter every active service without losing the guided context above.</p></div><div className="sfx-filter-bar"><label className="sfx-search"><Icons.Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search PPKH, carbon, risk, dashboard..." /></label><label><span>Solution group</span><select value={activeGroup} onChange={(event) => setActiveGroup(event.target.value)}><option value="all">All solution groups</option>{groups.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label><label><span>Industry</span><select value={industry} onChange={(event) => setIndustry(event.target.value)}>{industries.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Delivery model</span><select value={model} onChange={(event) => setModel(event.target.value)}>{models.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="sfx-result-count">{filtered.length} matching solutions</div>{filtered.length ? <div className="sfx-service-grid">{filtered.map((item) => <CatalogueCard key={item.serviceCode} item={item} focused={focusedCode === item.serviceCode} />)}</div> : <div className="sfx-empty"><Icons.SearchX /><h3>No exact match yet.</h3><p>Try a broader filter or talk with us about your specific challenge.</p></div>}</section>;
}

export function WhyInvesg() {
  return <section className="sfx-section"><div className="sfx-section-heading"><span>Why INVESG</span><h2>More than advice. A better way to decide.</h2></div><div className="sfx-why">{[["Network", "Decision Intelligence", "Connect signals, risks, impacts, and trade-offs into a clear basis for action."], ["PanelsTopLeft", "Integrated Advisory", "Strategy, technical expertise, evidence, and implementation work as one system."], ["Binary", "Digital Solutions", "Make sustainability data accessible, repeatable, and decision-ready."], ["Handshake", "Long-term Partnership", "Build internal capability and momentum—not one-off dependency."]].map(([icon, title, text]) => { const Icon = Icons[icon]; return <article key={title}><Icon /><h3>{title}</h3><p>{text}</p></article>; })}</div></section>;
}
