import React from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowLeft, ArrowRight, CircleDot, Info, Link2, Network, Scale, SearchX, ShieldAlert, TrendingUp } from "lucide-react";
import { explorerChallenges, explorerSectors, getExplorerChallenge, getExplorerRecommendations } from "../../data/solutionExplorer";

const Icons = { ArrowDown, ArrowLeft, ArrowRight, CircleDot, Info, Link2, Network, Scale, SearchX, ShieldAlert, TrendingUp };

const steps = ["Challenge", "Context", "Connections", "Implications", "Approaches"];

function ListPanel({ icon: Icon, title, items }) {
  return <article className="sx-list-panel"><Icon /><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

export default function SolutionsExplorer({ services, onViewService }) {
  const [params, setParams] = useSearchParams();
  const parsedStep = Number(params.get("step") || 1);
  const requestedStep = Number.isFinite(parsedStep) ? parsedStep : 1;
  const challenge = getExplorerChallenge(params.get("challenge"));
  const sector = params.get("sector") || "";
  const selectedServiceCode = params.get("service") || "";
  const step = challenge ? Math.min(5, Math.max(2, requestedStep)) : 1;
  const recommendations = getExplorerRecommendations(challenge, sector, services);
  const selectedService = recommendations.find((item) => item.serviceCode === selectedServiceCode) || recommendations[0];

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => value ? next.set(key, String(value)) : next.delete(key));
    setParams(next);
  };

  const chooseChallenge = (id) => update({ challenge: id, step: 2, sector: "", service: "" });
  const goBack = () => {
    if (step === 2) update({ challenge: "", step: 1, sector: "", service: "" });
    else update({ step: step - 1, service: step === 5 ? "" : selectedServiceCode });
  };
  const goNext = () => update({ step: Math.min(5, step + 1) });
  const contactHref = selectedService
    ? `/contact?source=solutions&challenge=${encodeURIComponent(challenge.id)}&sector=${encodeURIComponent(sector)}&service=${encodeURIComponent(selectedService.serviceCode)}`
    : "/contact?source=solutions";

  return <section id="solutions-explorer" className="sx-explorer" aria-labelledby="solutions-explorer-title">
    <header className="sx-header">
      <div><span>Solutions Explorer</span><h2 id="solutions-explorer-title">Start with the challenge—not a service list.</h2><p>Explore potential connections and possible approaches. This tool provides guidance, not a formal risk assessment or definitive conclusion.</p></div>
      <ol aria-label="Explorer progress">{steps.map((label, index) => <li key={label} className={step === index + 1 ? "active" : step > index + 1 ? "complete" : ""}><span>{index + 1}</span><b>{label}</b></li>)}</ol>
    </header>

    <div className="sx-stage" aria-live="polite">
      {step === 1 && <div className="sx-challenge-step"><span className="sx-kicker">Step 1 of 5</span><h3>What challenge are you navigating?</h3><p>Choose the closest starting point. You can return and change it at any time.</p><div className="sx-challenge-grid">{explorerChallenges.map((item) => { const Icon = Icons[item.icon] || Icons.CircleDot; return <button type="button" key={item.id} onClick={() => chooseChallenge(item.id)}><Icon /><span><b>{item.title}</b><small>{item.summary}</small></span><Icons.ArrowRight /></button>; })}</div></div>}

      {step === 2 && challenge && <div className="sx-context-step"><span className="sx-kicker">Step 2 of 5 · Explore the challenge</span><h3>{challenge.title}</h3><p className="sx-lead">{challenge.summary}</p><label><span>Which sector best describes your context?</span><select value={sector} onChange={(event) => update({ sector: event.target.value, service: "" })}><option value="">Select a sector (optional)</option>{explorerSectors.map((item) => <option key={item}>{item}</option>)}</select><small>Sector context helps order the recommendations. It does not create a score or assessment.</small></label></div>}

      {step === 3 && challenge && <div><span className="sx-kicker">Step 3 of 5 · Understand the connections</span><h3>What may shape this challenge?</h3><p className="sx-lead">The relevant system will vary by organization and location. These prompts help frame the questions worth exploring.</p><div className="sx-panel-grid"><ListPanel icon={Icons.Network} title="Connected systems" items={challenge.systems} /><ListPanel icon={Icons.Link2} title="Key dependencies" items={challenge.dependencies} /><ListPanel icon={Icons.Scale} title="Trade-offs to consider" items={challenge.tradeoffs} /></div></div>}

      {step === 4 && challenge && <div><span className="sx-kicker">Step 4 of 5 · Explore implications</span><h3>Potential risks and opportunities</h3><p className="sx-lead">These are considerations for further investigation—not conclusions about your organization.</p><div className="sx-implication-grid"><ListPanel icon={Icons.ShieldAlert} title="Potential risks" items={challenge.potentialRisks} /><ListPanel icon={Icons.TrendingUp} title="Potential opportunities" items={challenge.potentialOpportunities} /></div><aside className="sx-context-note"><Icons.Info /><p>Materiality depends on sector, geography, business model, project stage, stakeholder context, and evidence. INVESG would validate these factors before recommending action.</p></aside></div>}

      {step === 5 && challenge && <div><span className="sx-kicker">Step 5 of 5 · Possible approaches</span><h3>Relevant INVESG capabilities</h3><p className="sx-lead">The following services are mapped explicitly to this challenge{sector ? ` and ordered for ${sector}` : ""}. A conversation can determine the right scope and combination.</p>{recommendations.length ? <div className="sx-recommendation-grid">{recommendations.map((service, index) => <article key={service.serviceCode} className={selectedService?.serviceCode === service.serviceCode ? "selected" : ""}><label><input type="radio" name="recommended-service" value={service.serviceCode} checked={selectedService?.serviceCode === service.serviceCode} onChange={() => update({ service: service.serviceCode })} /><span className="sx-service-rank">{index === 0 ? "Recommended starting point" : service.deliveryModel}</span><h4>{service.serviceName}</h4><p>{service.description}</p><span className="sx-sector-fit">{sector ? service.sectorRelevant ? `Relevant to ${sector}` : "Cross-sector supporting capability" : service.bestFor}</span></label><button type="button" onClick={() => onViewService(service)}>View service details <Icons.ArrowDown /></button></article>)}</div> : <div className="sx-empty"><Icons.SearchX /><h4>No mapped service is currently available.</h4><p>Discuss the challenge directly with INVESG so the team can understand your context.</p></div>}</div>}
    </div>

    {step > 1 && <footer className="sx-actions"><button type="button" className="sx-back" onClick={goBack}><Icons.ArrowLeft /> Back</button><div>{step < 5 ? <button type="button" className="sx-next" onClick={goNext}>Continue <Icons.ArrowRight /></button> : <><a className="sx-discuss" href={contactHref}>Discuss Your Challenge <Icons.ArrowRight /></a><button type="button" className="sx-restart" onClick={() => update({ challenge: "", sector: "", service: "", step: 1 })}>Start again</button></>}</div></footer>}
  </section>;
}
