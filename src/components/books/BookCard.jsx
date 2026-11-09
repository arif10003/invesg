import React from 'react';
import { ArrowRight } from 'lucide-react';
import BookCover from './BookCover';
import BookDescription from './BookDescription';
import BookPurchaseButton from './BookPurchaseButton';

export default function BookCard({ book, featured = false }) {
  const detailUrl = `/insights/books/${book.slug}`;
  return <article className={`book-card${featured ? ' book-card--featured' : ''}`}>
    <a className="book-card-art" href={detailUrl} aria-label={`Explore ${book.title}`}><BookCover book={book} eager={featured} /></a>
    <div className="book-card-copy"><span className="books-kicker">{book.edition}</span><h2><a className="book-card-title" href={detailUrl}>{book.title}</a></h2><p className="book-subtitle">{book.subtitle}</p><p className="book-byline">By {book.author}<br />Published by {book.publisher}</p><BookDescription book={{ description: [book.shortDescription || ''] }} />
      <div className="book-card-actions book-purchase-actions">
        <BookPurchaseButton book={book} />
        <a className="book-card-explore" href={detailUrl}>Explore Book <ArrowRight aria-hidden="true" /></a>
      </div>
    </div>
  </article>;
}
