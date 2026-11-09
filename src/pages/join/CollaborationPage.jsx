import React from 'react';
import { LearningLayout, Hero, Section, FeatureGrid, Editorial, Action, useCopy, inquiryLink } from '../../components/learning/LearningComponents';
import { pageContent, ui, collaborationWays, pair } from '../../data/learningContent';
const c = pageContent.collaboration;
function Content() { const t=useCopy(); return <><Hero dark image="joinCollaboration" eyebrow={pair('Collaboration','Kolaborasi')} title={c.title} description={c.description}><Action to={inquiryLink('Collaboration inquiry')}>{t(ui.conversation)}</Action></Hero><Section title={c.ways}><FeatureGrid items={collaborationWays.map(item => ({...item, href:inquiryLink(item.title.en),cta:ui.conversation}))} /></Section><Editorial eyebrow={pair('Let’s explore together', 'Mari bereksplorasi bersama')} title={c.intro} text={c.text} image="joinPeople"><Action to={inquiryLink('Collaboration inquiry')}>{t(ui.conversation)}</Action></Editorial></>; }
export default function CollaborationPage() { return <LearningLayout section="join" title={c.title} description={c.description}><Content /></LearningLayout>; }
