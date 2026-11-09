import React from 'react';
import { LearningLayout, Hero, Section, Breadcrumb, Editorial, CallToAction, Action, useCopy } from '../../components/learning/LearningComponents';
import { LabProgramFacts, LabJourney, LabEligibility, LabBenefits, LabApplication, LabFaq } from '../../components/join/LearningLabSections';
import { pageContent, ui } from '../../data/learningContent';
import { labCopy } from '../../data/learningLabContent';
const c = pageContent.research;

function Content() {
  const t = useCopy();
  return <div className="lab-page">
    <Breadcrumb items={[[ui.join, '/join-us'], [ui.lab, '/join-us/learning-lab'], [ui.research]]} />
    <Hero image="joinResearch" eyebrow={ui.lab} title={c.title} description={c.description}>
      <Action to="/join-us/learning-lab/apply">{t(ui.application)}</Action>
      <Action secondary to="#learning-journey">{t(labCopy.how)}</Action>
    </Hero>
    <Section title={c.overview}><p className="lab-category">{t(labCopy.category)}</p><p className="learning-intro-text">{t(labCopy.programIntro)}</p><LabProgramFacts /></Section>
    <Section id="learning-journey" title={labCopy.journey}><LabJourney /></Section>
    <Editorial title={labCopy.writingTitle} text={labCopy.writingText} image="joinWriting" />
    <Section title={labCopy.mentoringTitle}><p className="learning-intro-text">{t(labCopy.mentoringText)}</p><LabBenefits /></Section>
    <Section title={labCopy.eligible}><LabEligibility /></Section>
    <Section id="application" title={labCopy.application}><LabApplication /><aside className="learning-note">{t(labCopy.terms)}</aside></Section>
    <Section id="faqs" title={labCopy.faq}><LabFaq /></Section>
    <CallToAction title={labCopy.closing} text={labCopy.closingText} to="/join-us/learning-lab/apply" label={labCopy.applicationDetails} />
  </div>;
}

export default function ResearchEditorialPage() {
  return <LearningLayout section="join" title={c.title} description={c.description}><Content /></LearningLayout>;
}
