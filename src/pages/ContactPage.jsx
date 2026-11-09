import { useArticle } from '../hooks/useArticle';
import React from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Handshake, Mail, MessageCircle, Send, ShieldCheck, Sprout } from "lucide-react";
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import { getContactContextSummary, resolveContactContext } from "../data/contactContext";
import { trackEvent } from "../utils/analytics";
import { createSubmissionId, submitContactInquiry } from "../utils/contactApi";
import { usePageSeo } from "../utils/seo";
import "../styles/contact.css";
import "../styles/company-heroes.css";

const LINKEDIN_URL = "https://www.linkedin.com/company/invesg/";
const INSTAGRAM_URL = "https://www.instagram.com/the.invesg?igsh=MWVrdDZxcjA1bzR1NA==";
const INQUIRY_TYPES = ["Advisory or consulting", "Solutions and capabilities", "Research or Insights", "Partnership", "Media inquiry", "General inquiry"];
const CONTACT_INTENTS = [
  { label: 'Ask a Question', type: 'General inquiry', icon: MessageCircle, description: 'Questions about INVESG, insights, publications, or services.' },
  { label: 'Explore Collaboration', type: 'Partnership', icon: Handshake, description: 'Partnerships, joint research, projects, and institutional collaboration.' },
  { label: 'Discuss Your Challenge', type: 'Advisory or consulting', icon: Sprout, description: 'Sustainability, ESG, climate, investment, risk, or strategic decisions.' },
];

const initialForm = { full_name: "", email: "", organization: "", country: "", inquiry_type: "", message: "", consent_given: false, website: "" };

export default function ContactPage() {
  usePageSeo({ title: "Contact INVESG | Sustainability Intelligence & Advisory", description: "Discuss a sustainability challenge, opportunity, research topic, or advisory need with INVESG.", canonicalPath: "/contact" });
  const [searchParams] = useSearchParams();
  const requestedArticle=searchParams.get('source')==='insights'?searchParams.get('article'):null;
  const liveArticle=useArticle(requestedArticle).article;
  const context = React.useMemo(() => {const base=resolveContactContext(searchParams);return liveArticle?{...base,article:liveArticle,values:{article_slug:liveArticle.slug}}:base;}, [searchParams,liveArticle]);
  const contextSummary = React.useMemo(() => getContactContextSummary(context), [context]);
  const [form, setForm] = React.useState(initialForm);
  const [state, setState] = React.useState("idle");
  const [error, setError] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState({});
  const submissionId = React.useRef(createSubmissionId());

  React.useEffect(() => {
    trackEvent("contact_view", { source: context.source });
    if (context.source === "solutions") trackEvent("solutions_to_contact", { has_context: Boolean(contextSummary) });
    if (context.source === "insights") trackEvent("insights_to_contact", { has_context: Boolean(contextSummary) });
  }, [context.source, contextSummary]);

  React.useEffect(() => {
    if (!contextSummary) return;
    const contextText = contextSummary.rows.map(([label, value]) => `${label}: ${value}`).join("\n");
    setForm((current) => current.message ? current : { ...current, message: `${contextText}\n\nI would like to discuss how this applies to our organization.` });
  }, [contextSummary]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    if (state === "error") setState("idle");
  };

  const selectIntent = (type) => {
    update('inquiry_type', type);
    const field = document.getElementById('contact-inquiry-type');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    field?.focus({ preventScroll: true });
    document.getElementById('contact-form')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setError("");
    setFieldErrors({});
    trackEvent("contact_submit_attempt", { source: context.source, inquiry_type: form.inquiry_type });
    try {
      const payload = {
        ...form,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        organization: form.organization.trim() || null,
        country: form.country.trim() || null,
        message: form.message.trim(),
        source: context.source,
        context: context.values,
      };
      await submitContactInquiry(payload, { submissionId: submissionId.current });
      setState("success");
      trackEvent("contact_submit_success", { source: context.source, inquiry_type: form.inquiry_type });
    } catch (submissionError) {
      setState("error");
      setError(submissionError.message || "Delivery could not be confirmed. Please try again.");
      setFieldErrors(submissionError.fieldErrors || {});
      trackEvent("contact_submit_failure", { source: context.source, inquiry_type: form.inquiry_type, error_category: submissionError.code || "unknown" });
    }
  };

  return <main className="contact-page">
    <Navbar activeNavItem="Contact" />
    <section className="contact-hero contact-shell company-hero" aria-labelledby="contact-title">
      <div className="contact-intro company-hero-copy"><div className="contact-eyebrow">Contact Us<span aria-hidden="true" /></div><h1 id="contact-title">Let’s Start <span>a Conversation.</span></h1><p>Whether you’re exploring a challenge, considering an opportunity, or looking for strategic guidance, let’s connect and find a way forward.</p></div>
      <picture className="contact-artwork company-hero-artwork"><source media="(max-width: 760px)" srcSet="/assets/brand/invesg-contact-global-small.webp" /><img src="/assets/brand/invesg-contact-global.webp" width="1671" height="941" fetchPriority="high" alt="A gold magnifying lens reveals a sustainable landscape against a connected global map." /></picture>
      <div className="contact-intents" role="group" aria-label="Choose how to begin your inquiry">{CONTACT_INTENTS.map(({ label, type, icon: Icon, description }) => <button key={type} type="button" aria-pressed={form.inquiry_type === type} aria-controls="contact-form" onClick={() => selectIntent(type)} title={description}><Icon aria-hidden="true" /><span>{label}</span><small>{description}</small></button>)}</div>
    </section>

    <section id="contact-form" className="contact-shell contact-form-card">
      <div className="contact-form-intro"><h2>Tell us about<br /><span>your challenge</span></h2><div className="contact-rule" /><p>Provide enough context for our team to route and respond to your inquiry.</p><small><ShieldCheck />Please do not include passwords, financial account data, health information, or other sensitive personal information.</small></div>
      <form onSubmit={handleSubmit} noValidate>
        <input className="contact-honeypot" name="website" value={form.website} onChange={(event) => update("website", event.target.value)} tabIndex="-1" autoComplete="off" aria-hidden="true" />
        {contextSummary && <aside className="contact-context" aria-label="Inquiry context"><span>{contextSummary.eyebrow}</span><h3>{contextSummary.title}</h3><dl>{contextSummary.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p>You can edit the inquiry below before sending it.</p></aside>}
        <div className="contact-form-grid">
          <Field label="Name" required error={fieldErrors.full_name}><input required name="full_name" autoComplete="name" value={form.full_name} onChange={(event) => update("full_name", event.target.value)} /></Field>
          <Field label="Work email" required error={fieldErrors.email}><input required type="email" name="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} /></Field>
          <Field label="Organization"><input name="organization" autoComplete="organization" value={form.organization} onChange={(event) => update("organization", event.target.value)} /></Field>
          <Field label="Country"><input name="country" autoComplete="country-name" value={form.country} onChange={(event) => update("country", event.target.value)} /></Field>
        </div>
        <Field label="Inquiry type" required error={fieldErrors.inquiry_type}><select id="contact-inquiry-type" required name="inquiry_type" value={form.inquiry_type} onChange={(event) => update("inquiry_type", event.target.value)}><option value="">Select an inquiry type</option>{INQUIRY_TYPES.map((type) => <option key={type}>{type}</option>)}</select></Field>
        <Field label="Message" required error={fieldErrors.message}><span className="contact-textarea-wrap"><textarea required name="message" maxLength={1500} rows="7" value={form.message} onChange={(event) => update("message", event.target.value)} placeholder="Tell us about the decision, challenge, or opportunity you are navigating." /><small>{form.message.length}/1500</small></span></Field>
        <label className={`contact-consent ${fieldErrors.consent_given ? "has-error" : ""}`}><input required type="checkbox" name="consent_given" checked={form.consent_given} onChange={(event) => update("consent_given", event.target.checked)} /><span>I consent to INVESG processing this information to respond to my inquiry. *</span></label>
        {fieldErrors.consent_given && <small className="contact-field-error">{fieldErrors.consent_given}</small>}
        <button className="contact-submit" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Sending securely…" : "Send Inquiry"} <Send /></button>
        <div className="contact-status" aria-live="polite">
          {state === "success" && <p className="contact-success">Your inquiry was accepted by INVESG's inquiry service.</p>}
          {state === "error" && <p className="contact-error" role="alert">{error} <a href="mailto:hello@invesg.co">Email hello@invesg.co</a></p>}
        </div>
      </form>
    </section>
    <section className="contact-shell contact-options">
      <article className="contact-card"><span className="contact-icon"><Mail /></span><h2>General Inquiries</h2><p>For general questions, partnerships, or other inquiries.</p><div className="contact-card-action"><a href="mailto:hello@invesg.co"><Mail />hello@invesg.co</a><small>Email INVESG directly if the form is unavailable.</small></div></article>
      <article className="contact-card"><span className="contact-icon"><Sprout /></span><h2>Follow INVESG</h2><p>Stay connected with the latest insights, updates, and perspectives.</p><div className="contact-social-links"><a href={LINKEDIN_URL} target="_blank" rel="noreferrer"><b>in</b><span>LinkedIn Company Page</span><ArrowUpRight /></a><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer"><b>◎</b><span>Instagram @the.invesg</span><ArrowUpRight /></a></div></article>
    </section>

    <section className="contact-shell direct-contact"><span className="contact-icon"><MessageCircle /></span><div><h2>Prefer email?</h2><p>You can contact the INVESG team directly when the online form is unavailable.</p></div><a href="mailto:hello@invesg.co">Email INVESG <ArrowRight /></a></section>
    <SiteFooter />
  </main>;
}

function Field({ label, required = false, error, children }) {
  return <label className={error ? "has-error" : ""}>{label}{required ? " *" : ""}{children}{error && <small className="contact-field-error">{error}</small>}</label>;
}
