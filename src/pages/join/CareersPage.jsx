import React from 'react';
import { LearningLayout, Hero, Section, FeatureGrid, CallToAction, Action, useCopy, inquiryLink } from '../../components/learning/LearningComponents';
import { pageContent, ui, values, pair } from '../../data/learningContent';
import { opportunities } from '../../data/opportunities';
const c = pageContent.careers;
function Content() { const t=useCopy(); return <><Hero dark image="joinCareers" eyebrow={pair('Careers', 'Karier')} title={c.title} description={c.description}><Action to="#opportunities">{t(c.openings)}</Action></Hero><Section title={c.values}><FeatureGrid items={values} /></Section><Section id="opportunities" title={c.openings}>{opportunities.length ? <FeatureGrid items={opportunities} /> : <div className="learning-empty"><h2>{t(c.empty)}</h2><p>{t(c.emptyText)}</p><Action to={inquiryLink('General careers inquiry')}>{t(ui.contact)}</Action></div>}</Section><CallToAction title={pageContent.lab.title} text={pageContent.lab.description} to="/join-us/learning-lab" label={ui.exploreLab} /></>; }
export default function CareersPage() { return <LearningLayout section="join" title={c.title} description={c.description}><Content /></LearningLayout>; }
