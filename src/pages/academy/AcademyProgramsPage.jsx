import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { LearningLayout, Hero, Section, ProgramGrid, CallToAction, useCopy, useLearningLocale, inquiryLink } from '../../components/learning/LearningComponents';
import { pageContent, ui, categories, pair } from '../../data/learningContent';
import { filterPrograms } from '../../data/academyPrograms';

const c = pageContent.catalog;
function Content() {
  const t = useCopy(), locale = useLearningLocale();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = categories.some(item => item.id === params.get('category')) ? params.get('category') : 'all';
  const programs = filterPrograms(query, category, locale);
  const update = (key, value) => { const next = new URLSearchParams(params); if (!value || value === 'all') next.delete(key); else next.set(key, value); setParams(next, { replace: true, preventScrollReset: true }); };
  return <><Hero dark compact image="academyScenario" eyebrow={ui.academy} title={c.title} description={c.description} />
    <Section className="learning-catalog"><div className="learning-filter-bar"><label className="learning-search"><Search aria-hidden="true" /><input type="search" aria-label={t(ui.search)} placeholder={t(ui.search)} value={query} onChange={event => update('q', event.target.value)} /></label><div className="learning-filters" role="group" aria-label={t(ui.programs)}>{[{id:'all',title:ui.allCategories}, ...categories].map(item => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => update('category', item.id)}>{t(item.title)}</button>)}</div></div>
      <p className="learning-result-count" role="status" aria-live="polite">{programs.length} {t(ui.results)}</p>
      {programs.length ? <ProgramGrid programs={programs} /> : <div className="learning-empty"><h2>{t(ui.noResults)}</h2><button className="learning-reset" onClick={() => setParams({})}>{t(ui.reset)}</button></div>}
      <aside className="learning-note">{t(ui.catalogNote)}</aside>
    </Section><CallToAction title={pair('Need a Customized Program?', 'Butuh Program Khusus?')} text={pageContent.academy.tailoredText} to="/academy/corporate" label={ui.corporate} />
  </>;
}
export default function AcademyProgramsPage() { return <LearningLayout title={c.title} description={c.description}><Content /></LearningLayout>; }
