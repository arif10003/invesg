import React from 'react';
import { useParams } from 'react-router-dom';
import NotFoundPage from '../NotFoundPage';
import { LearningLayout, Hero, Section, Breadcrumb, FeatureGrid, CheckList, ProgramGrid, CallToAction, Action, useCopy, inquiryLink } from '../../components/learning/LearningComponents';
import { ui, pair } from '../../data/learningContent';
import { academyPrograms, getAcademyProgram } from '../../data/academyPrograms';

function Content({ program }) {
  const t = useCopy(), contact = inquiryLink(`Training proposal: ${program.title.en}`);
  return <><Breadcrumb items={[[ui.academy,'/academy'],[ui.programs,'/academy/programs'],[program.title]]} />
    <Hero eyebrow={ui.academy} compact image={program.photoKey} title={program.title} description={program.summary}><Action to={contact}>{t(ui.proposal)}</Action><Action secondary to={inquiryLink(`Program inquiry: ${program.title.en}`)}>{t(ui.inquire)}</Action></Hero>
    <div className="learning-shell"><FeatureGrid strip items={[
      {title:ui.audience,text:program.audience[0],icon:'users'},
      {title:pair('Format','Format'),text:pair('Workshop or tailored learning series','Lokakarya atau rangkaian pembelajaran khusus'),icon:'book'},
      {title:pair('Duration','Durasi'),text:ui.tailored,icon:'calendar'},
      {title:pair('Availability','Ketersediaan'),text:ui.indicative,icon:'globe'},
    ]} /></div>
    <Section><div className="learning-two-column"><div><h2>{t(ui.overview)}</h2><p>{t(program.overview)}</p><h2>{t(ui.audience)}</h2><CheckList items={program.audience} /></div><aside className="learning-panel"><h2>{t(ui.outcomes)}</h2><CheckList items={program.learningOutcomes} /></aside></div></Section>
    <Section><div className="learning-two-column"><div><h2>{t(ui.topics)}</h2><ol className="learning-numbered">{program.indicativeTopics.map((topic,i) => <li key={i}>{t(topic)}</li>)}</ol></div><div><h2>{t(ui.delivery)}</h2><CheckList items={program.deliveryOptions} /><p className="learning-note">{t(ui.tailored)}</p></div></div></Section>
    <CallToAction title={pair('Interested in This Program?', 'Tertarik dengan Program Ini?')} text={ui.catalogNote} to={contact} />
    <Section title={ui.related}><ProgramGrid programs={academyPrograms.filter(item => item.slug !== program.slug).sort((a,b) => Number(b.category === program.category)-Number(a.category === program.category)).slice(0,3)} /></Section>
  </>;
}
export default function AcademyProgramDetailPage() { const { slug } = useParams(); const program = getAcademyProgram(slug); if (!program) return <NotFoundPage />; return <LearningLayout title={program.title} description={program.summary}><Content program={program} /></LearningLayout>; }
