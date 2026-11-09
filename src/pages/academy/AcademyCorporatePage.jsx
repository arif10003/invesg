import React from 'react';
import { LearningLayout, Hero, Section, Editorial, CheckList, ProgramGrid, CallToAction, Action, useCopy, inquiryLink } from '../../components/learning/LearningComponents';
import { pageContent, ui, audiences } from '../../data/learningContent';
import { academyPrograms } from '../../data/academyPrograms';
const c = pageContent.corporate;
function Content() { const t = useCopy(); return <>
  <Hero dark image="academyInstitutional" eyebrow={ui.academy} title={c.title} description={c.description}><Action to={inquiryLink('Corporate and institutional training proposal')}>{t(ui.proposal)}</Action></Hero>
  <Editorial title={c.why} text={c.whyText} image="academyWorkshop" />
  <Section title={ui.audience}><CheckList items={audiences.filter((_,i) => i !== 1 && i !== 5)} /></Section>
  <Section title={c.focus}><ProgramGrid programs={academyPrograms.filter((_,i) => [0,3,4,5].includes(i))} /><aside className="learning-note">{t(ui.catalogNote)}</aside></Section>
  <Section title={c.process}><ol className="learning-numbered">{c.processSteps.map((step,i) => <li key={i}><h3>{t(step)}</h3></li>)}</ol></Section>
  <Editorial dark title={c.formats} text={c.formatsText} />
  <Section title={c.capabilities}><CheckList items={c.capabilityItems} /></Section>
  <CallToAction title={pageContent.academy.final} to={inquiryLink('Corporate and institutional training proposal')} />
</>; }
export default function AcademyCorporatePage() { return <LearningLayout title={c.title} description={c.description}><Content /></LearningLayout>; }
