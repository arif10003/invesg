import React from 'react';
import { FeatureGrid, CheckList, LearningIcon, TextLink, useCopy, inquiryLink } from '../learning/LearningComponents';
import { eligibility, ui, pair } from '../../data/learningContent';
import { labSpecifications, getApplicationState, applicationLabels } from '../../data/learningLab';
import { labCopy, labExperience, labJourney, participantProfile, labNiceToHave, labGains, labApplicationMaterials, labFaqs } from '../../data/learningLabContent';
import '../../styles/learning-lab.css';

export function LabSectionNav() {
  const t = useCopy();
  const sections = [['why-learning-lab', pair('Why Learning Lab?', 'Mengapa Learning Lab?')], ['explore', labCopy.themes], ['program', pair('The Program', 'Program')], ['who-can-join', labCopy.eligible], ['application', pair('Application', 'Pendaftaran')], ['faqs', pair('FAQs', 'FAQ')]];
  return <nav className="learning-shell lab-section-nav" aria-label={t(pair('On this page', 'Pada halaman ini'))}>{sections.map(([id, label]) => <a key={id} href={`#${id}`}>{t(label)}</a>)}</nav>;
}

export function LabLearningExperience() {
  const t = useCopy();
  return <><p className="learning-intro-text">{t(labCopy.iterative)}</p><ul className="lab-learning-cycle">{labExperience.map((step, index) => <li key={index}><span className="learning-icon"><LearningIcon name={step.icon} /></span><h3>{t(step.title)}</h3><p>{t(step.text)}</p></li>)}</ul></>;
}

export function LabProgramFacts() {
  return <div className="lab-program-facts"><FeatureGrid items={labSpecifications} /></div>;
}

export function LabJourney() {
  const t = useCopy();
  return <><ol className="lab-journey">{labJourney.map((month, index) => <li key={index}><article className="lab-month"><span className="lab-month-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{t(month.title)}</h3><span className="lab-label">{t(labCopy.planned)}</span><p>{t(month.text)}</p><h4>{t(labCopy.emphasis)}</h4><CheckList items={month.emphasis} /></article></li>)}</ol><aside className="learning-note lab-outputs"><h3>{t(labCopy.outputsTitle)}</h3><p>{t(labCopy.outputsText)}</p></aside></>;
}

export function LabEligibility() {
  const t = useCopy();
  return <><div className="learning-two-column"><div className="learning-panel"><h3>{t(labCopy.eligibilityTitle)}</h3><CheckList items={eligibility} /><p>{t(labCopy.noPrerequisites)}</p></div><div><h3>{t(labCopy.profileTitle)}</h3><CheckList items={participantProfile} /></div></div><aside className="lab-nice-to-have"><h3>{t(labCopy.niceTitle)}</h3><p>{t(labCopy.niceText)}</p><CheckList items={labNiceToHave} /></aside></>;
}

export function LabBenefits() {
  const t = useCopy();
  return <><div className="lab-topic-grid"><FeatureGrid items={labGains} /></div><aside className="learning-note lab-publication"><h3>{t(labCopy.publicationTitle)}</h3><p>{t(labCopy.publicationText)}</p><TextLink to="/insights">{t(labCopy.insights)}</TextLink></aside></>;
}

export function LabApplication({ state = getApplicationState() }) {
  const t = useCopy();
  const isEmailApplication = state.applicationUrl?.startsWith('mailto:');
  return <div className="lab-application-layout"><div><p className="learning-intro-text">{t(labCopy.materialsIntro)}</p><ol className="lab-materials">{labApplicationMaterials.map((material, index) => <li key={index}><span className="lab-material-number" aria-hidden="true">0{index + 1}</span><div><h3>{t(material.title)}</h3><p>{t(material.text)}</p></div></li>)}</ol><dl className="lab-email-details">{state.applicationEmail && <div><dt>{t(labCopy.emailLabel)}</dt><dd>{state.applicationEmail}</dd></div>}<div><dt>{t(labCopy.subjectLabel)}</dt><dd><code>{state.applicationSubject}</code></dd></div></dl><p className="lab-help">{t(labCopy.subjectHint)}</p></div><aside className="learning-panel lab-application-status"><span className={`lab-status-badge lab-status-badge--${state.status}`}>{t(state.copy.title)}</span><h3>{t(applicationLabels.updates)}</h3><p>{t(state.copy.text)}</p>{state.status === 'open' && state.applicationUrl && <a className="learning-action" href={state.applicationUrl}>{t(isEmailApplication ? labCopy.apply : applicationLabels.apply)}</a>}{state.status === 'open' && !state.applicationUrl && <p className="learning-note">{t(applicationLabels.unavailable)}</p>}{state.inquiryUrl ? <a className="learning-text-link" href={state.inquiryUrl}>{t(labCopy.inquiry)}</a> : <TextLink to={inquiryLink('Learning Lab cohort inquiry')}>{t(ui.contact)}</TextLink>}<p className="lab-help">{t(applicationLabels.updateText)}</p></aside></div>;
}

export function LabFaq() {
  const t = useCopy();
  return <div className="lab-faq">{labFaqs.map((faq, index) => <details key={index}><summary>{t(faq.question)}</summary><div><p>{t(faq.answer)}</p></div></details>)}</div>;
}
