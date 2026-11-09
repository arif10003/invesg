import React from 'react';
import { LearningLayout, Hero, Section, FeatureGrid, Editorial, CallToAction, Action, useCopy } from '../../components/learning/LearningComponents';
import { pageContent, ui, pathways, values, pair } from '../../data/learningContent';
const c = pageContent.join;
function Content() { const t=useCopy(); return <>
  <Hero image="joinPeople" eyebrow={ui.join} title={c.title} description={c.description}><Action to="#pathways">{t(pair('Explore Opportunities', 'Jelajahi Peluang'))}</Action></Hero>
  <Section id="pathways" title={pair('Be Part of What We Build', 'Jadilah Bagian dari yang Kami Bangun')}><FeatureGrid items={pathways} /></Section>
  <Editorial eyebrow={pair('Our people. Larger impact.', 'Manusia kami. Dampak lebih besar.')} title={c.intro} text={c.text} image="joinCollaboration" />
  <Section title={pair('Our Values and Working Philosophy', 'Nilai dan Filosofi Kerja Kami')}><FeatureGrid items={values} /></Section>
  <Editorial dark title={c.growth} text={c.growthText} image="joinWriting" reverse><Action to="/join-us/learning-lab">{t(ui.exploreLab)}</Action></Editorial>
  <CallToAction title={pageContent.collaboration.intro} text={pageContent.collaboration.text} to="/join-us/collaboration" label={ui.conversation} />
</>; }
export default function JoinUsPage() { return <LearningLayout section="join" title={c.title} description={c.description}><Content /></LearningLayout>; }
