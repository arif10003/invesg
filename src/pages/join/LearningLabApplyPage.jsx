import React from 'react';
import { LearningLayout, Section, Breadcrumb, LearningIcon, TextLink, useCopy } from '../../components/learning/LearningComponents';
import { LabApplication } from '../../components/join/LearningLabSections';
import { ui } from '../../data/learningContent';
import { getApplicationState } from '../../data/learningLab';
import { labCopy } from '../../data/learningLabContent';

function Content({ state }) {
  const t = useCopy();
  return <div className="lab-page">
    <Breadcrumb items={[[ui.join, '/join-us'], [ui.lab, '/join-us/learning-lab'], [ui.application]]} />
    <Section><div className="learning-state"><span className="learning-icon"><LearningIcon name="calendar" /></span><span className="learning-status-label">{t(ui.lab)}</span><h1>{t(state.copy.title)}</h1><p>{t(state.copy.text)}</p></div></Section>
    <Section title={labCopy.application}><LabApplication state={state} /><aside className="learning-note">{t(labCopy.terms)}</aside><TextLink to="/join-us/learning-lab/research-editorial">{t(ui.research)}</TextLink></Section>
  </div>;
}
export default function LearningLabApplyPage() { const state=getApplicationState(); return <LearningLayout section="join" title={state.copy.title} description={state.copy.text}><Content state={state} /></LearningLayout>; }
