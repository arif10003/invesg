import { getBook } from '../api/books';
import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SiteFooter from '../components/SiteFooter';
import InsightPageState from '../components/insights/InsightPageState';
import BookCover from '../components/books/BookCover';
import BookPurchasePanel from '../components/books/BookPurchasePanel';
import BookDescription from '../components/books/BookDescription';
import { useBooks } from '../hooks/useBooks';
import { usePageSeo } from '../utils/seo';
import '../styles/insights.css';
import '../styles/insight-detail.css';
import '../styles/books.css';
import '../styles/mvp-visual.css';

export function BookDetailContent({ book }) {
  return <div className="book-detail-layout book-detail-layout--purchase">
    <div className="book-detail-art"><BookCover book={book} eager /></div>
    <header className="book-detail-copy book-detail-heading"><span className="books-kicker">{book.edition}</span><h1>{book.title}</h1><p className="book-subtitle">{book.subtitle}</p><p className="book-byline">By {book.author}<br />Published by {book.publisher}</p></header>
    <BookPurchasePanel book={book} />
    <article className="book-detail-copy book-detail-body"><dl className="book-publication-metadata"><div><dt>Publisher</dt><dd>{book.publisher}</dd></div>{book.displayFormat && <div><dt>Format</dt><dd>{book.displayFormat}</dd></div>}{book.language && <div><dt>Language</dt><dd>{book.language}</dd></div>}{book.isbn && <div><dt>ISBN</dt><dd>{book.isbn}</dd></div>}</dl><BookDescription book={book} /><section className="book-author"><h2>About the author</h2><p><strong>{book.author}</strong><br />{book.authorBio}</p></section></article>
  </div>;
}

export default function BookDetailPage({ previewSlug }) {
  const { slug: routeSlug } = useParams();
  const slug = import.meta.env.DEV && previewSlug ? previewSlug : routeSlug;
  const isPreview=import.meta.env.DEV && Boolean(previewSlug);
  const live=useBooks(slug,{enabled:!isPreview});
  const {book,loading,error}=isPreview?{book:getBook(slug),loading:false,error:null}:live;
  usePageSeo({ title: book ? `${book.title} | INVESG Books` : 'Publication Not Found | INVESG', description: book?.shortDescription || 'The requested publication is not available.', canonicalPath: `/insights/books/${encodeURIComponent(slug)}`, robots: book ? 'index,follow' : 'noindex,follow' });
  if (loading) return <InsightPageState eyebrow="Books & Publications" title="Loading publication…" message="Retrieving the current catalog entry." />;
  if (error) return <InsightPageState eyebrow="Books & Publications" title="Catalog unavailable." message="Please try again later." />;
  if (!book) return <InsightPageState eyebrow="Books & Publications" title="Publication not found." message="This publication is not available or the address may be incorrect." />;
  return <main className="insights-page books-page"><Navbar activeNavItem="Insights" /><div className="insights-shell books-shell"><nav className="books-breadcrumb" aria-label="Breadcrumb"><a href="/insights">Insights</a><span>/</span><a href="/insights/books">Books &amp; Publications</a><span>/</span><span aria-current="page">{book.title}</span></nav><BookDetailContent book={book} /><a className="books-back" href="/insights/books">← All Books &amp; Publications</a></div><SiteFooter /></main>;
}

import '../styles/visual-sprint.css';
