// VISUAL_SPRINT_FIXTURE_ONLY — imported exclusively by the DEV-only gallery.
// These are design specimens, not published reporting, users or entitlements.
import { books } from '../data/books';
export const previewBook = books[0];
export const previewAuthor = { name: 'Preview author', slug: 'preview-author', href: '/__preview?screen=article' };
export const previewArticles = [
  { slug: 'preview-brief', contentType: 'brief', contentTypeLabel: 'INVESG Brief · Preview', title: 'Seeing climate risk through connected systems', excerpt: 'A design specimen exploring how a concise brief can connect context, dependencies, and decisions.', coverImage: '/assets/learning/academy/climate-risk-1280.webp', coverAlt: 'Mountain landscape', readingTime: 'Preview · 6 min read' },
  { slug: 'preview-analysis', contentType: 'analysis', contentTypeLabel: 'Policy Analysis · Preview', title: 'From disclosure requirements to better questions', excerpt: 'An illustrative page layout for policy context, practical implications, and evidence.', coverImage: '/assets/learning/academy/analysis-1280.webp', coverAlt: 'Professional research workspace', readingTime: 'Preview · 8 min read' },
  { slug: 'preview-perspective', contentType: 'perspective', contentTypeLabel: 'Perspective · Preview', title: 'What makes a decision resilient?', excerpt: 'A visual specimen for a considered perspective on uncertainty and sustainable value.', coverImage: '/assets/learning/academy/systems-1280.webp', coverAlt: 'Interconnected landscape', readingTime: 'Preview · 5 min read' },
  { slug: 'preview-water', contentType: 'brief', contentTypeLabel: 'INVESG Brief | Preview', title: 'Water, resilience, and the choices ahead', excerpt: 'An isolated layout specimen for a short briefing. No reported findings or published claims.', coverImage: '/assets/learning/academy/water-1280.webp', coverAlt: 'Water landscape', readingTime: 'Preview | 4 min read' },
  { slug: 'preview-strategy', contentType: 'analysis', contentTypeLabel: 'Policy Analysis | Preview', title: 'Bringing context into strategic decisions', excerpt: 'A layout specimen connecting policy context with practical questions.', coverImage: '/assets/learning/academy/workshop-1280.webp', coverAlt: 'Collaborative workshop', readingTime: 'Preview | 7 min read' },
].map(item => ({ ...item, id: item.slug, href: `/__preview?screen=article&specimen=${item.slug}`, topics: [], sectors: [], geographies: [] }));
export const previewArticle = {
  ...previewArticles[0], subtitle: 'Illustrative editorial content for reviewing typography, structure, and reading comfort. Not a published INVESG article.',
  publishedAt: '2026-11-01', publishedLabel: '1 November 2026 (preview date)', citationNote: 'Development specimen; not a published article.',
  pdf: { available: true }, coverCaption: 'Design specimen — original project landscape asset.',
  executiveSummary: ['A useful reading experience makes relationships visible without overwhelming the reader. This specimen demonstrates a summary, body, figure, table and references. It makes no factual research claims.'],
  body: [
    { type: 'heading', text: '1. Begin with the wider context' },
    { type: 'paragraph', text: 'A decision sits within a network of dependencies. This illustrative paragraph shows the intended reading measure and spacing. A publication can explain the context first, then introduce the connections that matter for the question at hand.' },
    { type: 'heading', level: 3, text: 'Make the relationships visible' },
    { type: 'paragraph', text: 'The article layout supports intermediate headings, short explanations and visual evidence. On smaller screens, the reading column remains full width while publication actions move above it.' },
    { type: 'figure', src: '/assets/learning/academy/systems-1280.webp', alt: 'Landscape used to demonstrate a full-width editorial figure', caption: 'Figure 1. Illustrative visual placement, not research evidence.' },
    { type: 'heading', text: '2. Turn context into useful questions' },
    { type: 'table', caption: 'Illustrative framework — no empirical data', columns: ['Perspective', 'Question to explore', 'Decision context'], rows: [['Dependencies', 'What does this outcome rely on?', 'Resources and capabilities'], ['Consequences', 'Who or what could be affected?', 'Benefits and burdens'], ['Uncertainty', 'What could change?', 'Options and adaptation']] },
    { type: 'quote', text: 'A clear page helps the reader see connections and retain their own judgment.', attribution: 'Design specimen text' },
    { type: 'heading', text: '3. Leave room for judgment' },
    { type: 'paragraph', text: 'A finished article should close with useful implications and clearly identified sources. The related content below demonstrates a continuation of the editorial journey, rather than an interruption to reading.' },
  ], references: [{ title: 'Preview reference — return to INVESG Insights', url: '/insights', publisher: 'Layout specimen only' }],
};
export const previewSpotlight = [
  { id: 'approved-book', status: 'published', title: previewBook.title, destination: `/insights/books/${previewBook.slug}`, book: previewBook, displayOrder: 0 },
  ...previewArticles.slice(0, 2).map((article, index) => ({ id: article.id, status: 'published', title: article.title, contentTypeLabel: article.contentTypeLabel, image: article.coverImage, imageAlt: article.coverAlt, excerpt: article.excerpt, destination: article.href, ctaLabel: 'Open article preview', displayOrder: index + 1 })),
];
export const previewLibrary = {
  books: [{ ...previewBook, href: `/insights/books/${previewBook.slug}` }],
  saved: previewArticles.map(article => ({ ...article, available: true })),
  pdfs: [{ ...previewArticles[0], saved: true }, { ...previewArticles[1], saved: false }],
};
