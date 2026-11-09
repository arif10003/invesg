import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { academyPrograms, filterPrograms } from '../src/data/academyPrograms.js';
import { getApplicationState, getLearningLabEmail, learningLab } from '../src/data/learningLab.js';
import { labJourney, labApplicationMaterials, labNiceToHave } from '../src/data/learningLabContent.js';
import { eligibility } from '../src/data/learningContent.js';
import { resolveContactContext, getContactContextSummary } from '../src/data/contactContext.js';
import { learningImages, programPhotoKeys } from '../src/data/learningImages.js';

test('photographic sets have local responsive assets and distinct program images', async () => {
  assert.notEqual(learningImages.academyWorkshop.src, learningImages.joinPeople.src);
  assert.equal(new Set(Object.values(programPhotoKeys)).size, academyPrograms.length);
  for (const program of academyPrograms) {
    assert.equal(program.image, learningImages[program.photoKey].src);
  }
  for (const image of Object.values(learningImages)) {
    assert.match(image.src, /^\/assets\/learning\/(academy|join)\/.+-1280\.webp$/);
    assert.ok(image.alt.en.length > 20 && image.alt.id.length > 20);
    for (const variant of image.srcSet.split(', ')) {
      const [src, width] = variant.split(' ');
      const buffer = await readFile(new URL(`../public${src}`, import.meta.url));
      assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', src);
      assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', src);
      assert.ok(buffer.length < 450000, `${src} must stay below 450 KB`);
      assert.ok(['640w', '1280w'].includes(width));
    }
  }
});

test('catalog search combines topics, audience, category, and locale', () => {
  assert.equal(filterPrograms('   ').length, academyPrograms.length);
  assert.ok(filterPrograms('decision-makers').some(program => program.slug === 'esg-as-a-lens'));
  assert.deepEqual(filterPrograms('water', 'institutional').map(program => program.slug), ['water-security']);
  assert.equal(filterPrograms('water', 'executive').length, 0);
  assert.equal(filterPrograms('a topic that does not exist').length, 0);
  assert.ok(filterPrograms('ketahanan', 'all', 'id').some(program => program.slug === 'climate-risk-resilience'));
});

test('applications are closed to submission until an open state has a safe configured URL', () => {
  assert.equal(getApplicationState().status, 'coming-soon');
  for (const status of ['coming-soon', 'closed', 'unknown']) assert.equal(getApplicationState({ status, applicationUrl: 'https://example.org/apply' }).applicationUrl, null);
  for (const applicationUrl of [null, '', 'javascript:alert(1)', '//example.org', 'https://', 'https://?missing-host', '/\\example.org/apply', '/\n/apply', 'https://user:password@example.org/apply']) assert.equal(getApplicationState({ status: 'open', applicationUrl }).applicationUrl, null);
  assert.equal(getApplicationState({status:'open',applicationUrl:'https://example.org/apply'}).applicationUrl, 'https://example.org/apply');
  assert.equal(getApplicationState({status:'open',applicationUrl:'/contact#contact-form'}).applicationUrl, '/contact#contact-form');
  assert.match(getApplicationState({ ...learningLab, status: 'open', applicationUrl: 'https://' }).applicationUrl, /^mailto:the\.invesg@gmail\.com\?/);
});

test('Learning Lab email applications require a confirmed open state', () => {
  const unconfirmed = getApplicationState();
  assert.equal(unconfirmed.applicationUrl, null);
  assert.equal(new URL(unconfirmed.inquiryUrl).pathname, 'the.invesg@gmail.com');
  assert.match(new URL(unconfirmed.inquiryUrl).searchParams.get('subject'), /inquiry/);
  const open = getApplicationState({ ...learningLab, status: 'open' });
  assert.equal(new URL(open.applicationUrl).pathname, 'the.invesg@gmail.com');
  assert.equal(new URL(open.applicationUrl).searchParams.get('subject'), 'Research & Editorial Learning Program – Full Name');
  assert.equal(getApplicationState({ ...learningLab, status: 'closed' }).applicationUrl, null);
  for (const applicationEmail of ['a@example.com?bcc=other@example.com', 'a@example.com\r\nBcc:other@example.com', 'not-an-email']) {
    assert.equal(getLearningLabEmail({ applicationEmail }), null);
    assert.equal(getApplicationState({ status: 'open', applicationEmail }).applicationUrl, null);
  }
});

test('Learning Lab preserves the agreed learning journey and inclusive application requirements', () => {
  assert.equal(labJourney.length, 3);
  for (const month of labJourney) {
    for (const locale of ['en', 'id']) {
      assert.match(month.text[locale], /Instagram/);
      assert.match(month.text[locale], /LinkedIn/);
    }
  }
  for (const month of labJourney.slice(0,2)) assert.match(month.text.en, /400–800/);
  assert.match(labJourney[2].text.en, /three participants collaboratively/);
  assert.match(eligibility.map(item => item.en).join(' '), /secondary or vocational school/);
  assert.equal(labNiceToHave.length, 2);
  assert.equal(labApplicationMaterials.filter(material => material.required).length, 2);
  assert.equal(labApplicationMaterials[2].required, false);
});

test('known learning inquiries prefill context while arbitrary URL content is discarded', () => {
  const topic = `Program inquiry: ${academyPrograms[0].title.en}`;
  const context = resolveContactContext(new URLSearchParams({source:'contact',topic}));
  assert.equal(context.values.topic, topic);
  assert.equal(getContactContextSummary(context).rows[0][1], topic);
  assert.deepEqual(resolveContactContext(new URLSearchParams('source=contact&topic=untrusted')).values, {});
});

test('new page resources render in both languages with valid internal destinations', async () => {
  const { createServer } = await import('vite');
  const React = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { MemoryRouter, Routes, Route } = await import('react-router-dom');
  const server = await createServer({ server:{middlewareMode:true}, appType:'custom' });
  const previousWindow = globalThis.window;
  const previousStorage = globalThis.sessionStorage;
  const pages = [
    ['/academy','academy/AcademyPage'], ['/academy/programs','academy/AcademyProgramsPage'],
    ...academyPrograms.map(program => [`/academy/programs/${program.slug}`,'academy/AcademyProgramDetailPage']),
    ['/academy/corporate','academy/AcademyCorporatePage'], ['/academy/approach','academy/AcademyApproachPage'],
    ['/join-us','join/JoinUsPage'], ['/join-us/careers','join/CareersPage'],
    ['/join-us/collaboration','join/CollaborationPage'], ['/join-us/learning-lab','join/LearningLabPage'],
    ['/join-us/learning-lab/research-editorial','join/ResearchEditorialPage'],
    ['/join-us/learning-lab/apply','join/LearningLabApplyPage'],
  ];
  const knownPaths = new Set(['/login', '/signup', '/account/verify-email', '/account/recovery', '/account/reset-password', '/', '/about','/solutions','/sustainability','/opportunity','/insights','/insights/media','/contact', ...pages.map(([path])=>path), ...academyPrograms.map(program=>`/academy/programs/${program.slug}`)]);
  try {
    for (const locale of ['en','id']) {
      globalThis.sessionStorage = { getItem:()=>locale };
      for (const [path,module] of pages) {
        globalThis.window = { location:{pathname:path} };
        const { default: Page } = await server.ssrLoadModule(`/src/pages/${module}.jsx`);
        const route = module.endsWith('AcademyProgramDetailPage') ? '/academy/programs/:slug' : path;
        const html=renderToString(React.createElement(MemoryRouter,{initialEntries:[path]},React.createElement(Routes,null,React.createElement(Route,{path:route,element:React.createElement(Page)}))));
        assert.equal((html.match(/<h1[ >]/g)||[]).length, 1, `${path} (${locale}) must have one H1`);
        assert.match(html,new RegExp(`lang="${locale}"`));
        assert.doesNotMatch(html,/undefined|NaN/);
        if (path === '/join-us/learning-lab') {
          for (const id of ['explore','how-it-works','program','journey','who-can-join','what-you-gain','application','faqs']) assert.ok(html.includes(`id="${id}"`));
          assert.equal((html.match(/<details>/g) || []).length, 9);
          assert.match(html, /Strategic Insights for Sustainable Value\./);
          assert.match(html, /ESG is a Lens\./);
          assert.match(html, /Beyond Compliance\. Understanding Uncertainty\. Creating Sustainable Value\./);
        }
        if (path.includes('/learning-lab')) {
          const emails = [...html.matchAll(/href="(mailto:[^"]+)"/g)].map(match => new URL(match[1].replaceAll('&amp;','&')));
          assert.ok(emails.some(url => url.pathname === 'the.invesg@gmail.com'));
          assert.ok(emails.filter(url => url.pathname === 'the.invesg@gmail.com').every(url => /inquiry/.test(url.searchParams.get('subject'))));
          assert.doesNotMatch(html, /<form\b[^>]*action=["'][^"']*apply/i);
        }
        for (const photo of html.matchAll(/<img[^>]*class="learning-photo[^"]*"[^>]*src="([^"]+)"/g)) {
          assert.ok(photo[1].includes(path.startsWith('/academy') ? '/learning/academy/' : '/learning/join/'), `${path} must use its own photographic set`);
          await access(new URL(`../public${photo[1]}`, import.meta.url));
        }
        for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
          const destination = new URL(match[1].replaceAll('&amp;','&'),'https://invesg.co');
          if (destination.pathname.startsWith('/assets/')) { await access(new URL(`../public${destination.pathname}`,import.meta.url)); continue; }
          assert.ok(knownPaths.has(destination.pathname),`Unknown destination ${destination.pathname} on ${path}`);
        }
      }
    }
    const { default: Detail } = await server.ssrLoadModule('/src/pages/academy/AcademyProgramDetailPage.jsx');
    const invalid = renderToString(React.createElement(MemoryRouter,{initialEntries:['/academy/programs/missing']},React.createElement(Routes,null,React.createElement(Route,{path:'/academy/programs/:slug',element:React.createElement(Detail)}))));
    assert.match(invalid,/Page not found/);
    const { LabApplication } = await server.ssrLoadModule('/src/components/join/LearningLabSections.jsx');
    for (const status of ['open', 'closed']) {
      const html = renderToString(React.createElement(MemoryRouter, null, React.createElement(LabApplication, { state: getApplicationState({ ...learningLab, status }) })));
      assert.equal(html.includes('Apply by Email'), status === 'open');
      assert.equal(html.includes(encodeURIComponent(learningLab.applicationSubject)), status === 'open');
      assert.doesNotMatch(html, /<input[^>]+type="file"/);
    }
  } finally { globalThis.window=previousWindow; globalThis.sessionStorage=previousStorage; await server.close(); }
});
