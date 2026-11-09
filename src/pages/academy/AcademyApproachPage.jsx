import React from 'react';
import { LearningLayout, Hero, Section, Editorial, FeatureGrid, CallToAction, Action, useCopy } from '../../components/learning/LearningComponents';
import { pageContent, ui, principles, methodology } from '../../data/learningContent';
const c = pageContent.approach;
function Content() { const t=useCopy(); return <><Hero dark compact image="academyScenario" eyebrow={ui.academy} title={c.title} description={c.description}><Action to="/academy/programs">{t(ui.explore)}</Action></Hero><Editorial title={c.intro} text={c.text} image="academyFacilitation" /><Section title={ui.approach}><FeatureGrid items={principles} /></Section><Section title={pageContent.corporate.process}><FeatureGrid items={methodology} /></Section><CallToAction title={pageContent.academy.tailoredTitle} text={pageContent.academy.tailoredText} to="/academy/corporate" label={ui.corporate} /></>; }
export default function AcademyApproachPage() { return <LearningLayout title={c.title} description={c.description}><Content /></LearningLayout>; }
