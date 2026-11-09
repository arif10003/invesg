import React from 'react';
import { BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import BookCard from '../components/books/BookCard';
import { useBooks } from '../hooks/useBooks';
import { usePageSeo } from '../utils/seo';
import '../styles/insights.css';
import '../styles/books.css';
import '../styles/mvp-visual.css';

export function BookCatalog({ books }) {
  if (!books.length) return <div className="editorial-empty"><BookOpen aria-hidden="true" /><div><h2>Publications are in preparation.</h2><p>Approved books and publications will appear here when available.</p></div></div>;
  return <><BookCard book={books[0]} featured />{books.length > 1 && <section className="books-more"><h2>More Publications</h2><div className="books-grid">{books.slice(1).map(book => <BookCard key={book.slug} book={book} />)}</div></section>}</>;
}

export default function BooksPage() {
  const catalog = useBooks();
  usePageSeo({ title: 'Books & Publications | INVESG Insights', description: 'Explore INVESG books and publications on connections, uncertainty, decisions, and sustainable value.', canonicalPath: '/insights/books' });
  return <main className="insights-page books-page"><Navbar activeNavItem="Insights" /><div className="insights-shell books-shell"><nav className="books-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><a href="/insights">Insights</a><span>/</span><span aria-current="page">Books &amp; Publications</span></nav><header className="books-heading"><span className="books-kicker">INVESG Insights</span><h1>Books &amp; Publications</h1><p>Explore ideas in depth. See connections, examine uncertainty, and consider what makes value sustainable.</p></header><>{catalog.loading ? <p role="status">Loading publications…</p> : catalog.error ? <p role="alert">The book catalog could not be loaded. Please try again later.</p> : <BookCatalog books={catalog.books} />}</><aside className="books-editorial-note"><BookOpen aria-hidden="true" /><div><h2>Continue exploring</h2><p>Discover research, analysis, and perspectives across INVESG Insights.</p><a href="/insights">Explore Insights →</a></div></aside></div><SiteFooter /></main>;
}

import '../styles/visual-sprint.css';
