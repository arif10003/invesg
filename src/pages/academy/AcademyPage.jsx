import React from 'react';
import { LearningLayout, Hero, Section, FeatureGrid, Editorial, ProgramGrid, CallToAction, Action, TextLink, CheckList, useCopy, inquiryLink } from '../../components/learning/LearningComponents';
import { pageContent, ui, categories, audiences, methodology, pair } from '../../data/learningContent';
import { academyPrograms } from '../../data/academyPrograms';

const c = pageContent.academy;
function Content() {
  const t = useCopy();
  return <>
    <Hero eyebrow={ui.academy} title={c.title} description={c.description}><Action to={inquiryLink('Academy training proposal')}>{t(ui.proposal)}</Action><Action secondary to="/academy/programs">{t(ui.explore)}</Action></Hero>
    <div className="learning-shell"><FeatureGrid strip items={categories.map(item => ({ ...item, href: item.id === 'institutional' ? '/academy/corporate' : `/academy/programs?category=${item.id}`, cta: ui.explore }))} /></div>
    <Editorial eyebrow={pair('Why invesg Academy', 'Mengapa invesg Academy')} title={c.why} text={c.whyText} image="academyAnalysis"><TextLink to="/academy/approach">{t(ui.approach)}</TextLink></Editorial>
    <Section eyebrow={pair('Our learning programs', 'Program pembelajaran kami')} title={c.featured} action={<TextLink to="/academy/programs">{t(ui.all)}</TextLink>}><ProgramGrid programs={academyPrograms.filter(program => program.featured)} /></Section>
    <Editorial dark eyebrow={ui.corporate} title={c.tailoredTitle} text={c.tailoredText} image="academyInstitutional" reverse><Action to="/academy/corporate">{t(ui.corporate)}</Action></Editorial>
    <Section title={pair('Learning for People and Organizations', 'Pembelajaran untuk Individu dan Organisasi')}><div className="learning-two-column"><CheckList items={audiences} /><div className="learning-panel"><h3>{t(pair('Connected to Your Context', 'Terhubung dengan Konteks Anda'))}</h3><p>{t(c.tailoredText)}</p><TextLink to="/academy/corporate">{t(ui.proposal)}</TextLink></div></div></Section>
    <Section title={ui.approach} action={<TextLink to="/academy/approach">{t(ui.learn)}</TextLink>}><FeatureGrid items={methodology} /></Section>
    <CallToAction title={c.final} to={inquiryLink('Academy training proposal')} />
  </>;
}
export default function AcademyPage() { return <LearningLayout title={c.title} description={c.description}><Content /></LearningLayout>; }
