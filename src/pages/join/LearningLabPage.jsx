import React from 'react';
import { LearningLayout, Hero, Section, FeatureGrid, Editorial, CallToAction, Action, useCopy } from '../../components/learning/LearningComponents';
import { LabSectionNav, LabLearningExperience, LabProgramFacts, LabJourney, LabEligibility, LabBenefits, LabApplication, LabFaq } from '../../components/join/LearningLabSections';
import { pageContent, ui, pair } from '../../data/learningContent';
import { labCopy, labThemes } from '../../data/learningLabContent';

function Content() {
  const t = useCopy();
  return <div className="lab-page">
    <Hero image="joinLab" eyebrow={ui.lab} title={pageContent.lab.title} description={labCopy.hero}>
      <Action to="/join-us/learning-lab/research-editorial">{t(ui.exploreProgram)}</Action>
      <Action secondary to="#how-it-works">{t(labCopy.how)}</Action>
    </Hero>
    <LabSectionNav />
    <div id="why-learning-lab"><Editorial eyebrow={pair('Why Learning Lab?', 'Mengapa Learning Lab?')} title={labCopy.why} text={labCopy.whyText} image="joinWriting"><strong className="lab-brand-line">Strategic Insights for Sustainable Value.</strong></Editorial></div>
    <Section id="explore" title={labCopy.themes}>
      <p className="learning-intro-text">{t(labCopy.themesIntro)}</p>
      <div className="lab-topic-grid"><FeatureGrid items={labThemes} /></div>
    </Section>
    <Section id="how-it-works" title={labCopy.experience}><LabLearningExperience /></Section>
    <Section id="program" eyebrow={labCopy.featured} title={ui.research}>
      <p className="lab-category">{t(labCopy.category)}</p>
      <p className="learning-intro-text">{t(labCopy.programIntro)}</p>
      <LabProgramFacts />
      <div className="learning-actions"><Action to="/join-us/learning-lab/research-editorial">{t(ui.exploreProgram)}</Action><Action secondary to="/join-us/learning-lab/apply">{t(ui.application)}</Action></div>
    </Section>
    <Section id="journey" title={labCopy.journey}><LabJourney /></Section>
    <Section id="who-can-join" title={labCopy.eligible}><LabEligibility /></Section>
    <Section id="what-you-gain" title={labCopy.gains}><LabBenefits /></Section>
    <Section id="application" title={labCopy.application}><LabApplication /></Section>
    <Section id="faqs" title={labCopy.faq}><LabFaq /></Section>
    <CallToAction title={labCopy.closing} text={labCopy.closingText} to="/join-us/learning-lab/apply" label={labCopy.applicationDetails} />
    <p className="learning-shell lab-brand-signature">Beyond Compliance. Understanding Uncertainty. Creating Sustainable Value.</p>
  </div>;
}

export default function LearningLabPage() {
  return <LearningLayout section="join" title={ui.lab} description={labCopy.hero}><Content /></LearningLayout>;
}
