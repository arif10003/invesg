import bookArtwork from './bookArtwork.json' with { type: 'json' };
// Approved editorial copy. Commercial data is intentionally absent until the
// multi-title backend contract is available; this is not a live sale record.
export const books = [{
  id: 'esg-is-a-lens', slug: 'esg-is-a-lens', status: 'published',
  title: 'ESG is a Lens', subtitle: 'Understanding Uncertainty. Creating Sustainable Value.',
  author: 'Arif R. Darana', publisher: 'PT INVESG NEXUS NITYA', language: 'English', displayFormat: 'Digital E-book (PDF)', edition: 'Digital e-book',
  headline: 'See the connections behind your decisions.',
  cover: bookArtwork.covers['esg-is-a-lens'], coverLayout: 'flat',
  shortDescription: 'ESG is a Lens explores how connections between environmental conditions, people, and governance shape our decisions. Through real-world cases, illustrations, and practical questions, it helps readers understand uncertainty, examine risks and opportunities, and consider what makes value sustainable—in business, investment, and everyday life.',
  description: [
    'A promising investment may depend on a fragile supply chain. A growing service may become harder for some people to use. What looks like progress can change when we understand the conditions behind it.',
    'ESG is a Lens offers a practical way to examine what a decision depends on, who and what it affects, and what it makes possible next.',
    "Through real-world cases, clear illustrations, and questions for reflection, Arif R. Darana explores how environmental conditions, people's capabilities, and governance shape choices across business, investment, organizations, and everyday life. The book moves from seeing connections and following consequences to understanding uncertainty, managing risk, building resilience, and developing opportunities we can act on.",
    'At its heart is a question: what makes value sustainable? A good result today matters, but so does the capacity to keep improving as conditions change—and how benefits and burdens are shared.',
    'Written as a thinking companion, the book invites you to bring your experience, test assumptions, weigh alternatives, and learn from what follows. It helps you make better-informed decisions while keeping your own judgment in the conversation.',
  ],
  closing: 'You do not need an ESG job title to begin seeing differently.',
  authorBio: 'Founder invesg.',
  fileFormat: null, commerce: null,
}];
