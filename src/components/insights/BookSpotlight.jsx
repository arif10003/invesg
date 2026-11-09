import React from 'react';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import BookImage from '../books/BookImage';
import BookPurchaseButton from '../books/BookPurchaseButton';
import { approvedBookPromotion } from '../../data/brandAssets';
import { bookPrice } from '../../api/books';

export default function BookSpotlight({ book, embedded = false }) {
  const Heading = embedded ? 'h2' : 'h1';
  const price = bookPrice(book.commerce);
  return <section className={embedded ? "lens-spotlight" : "insights-shell lens-spotlight"} aria-label="Featured book">
    <div className="lens-spotlight-copy"><span className="lens-eyebrow">Featured book</span><Heading className="lens-title">ESG is a <em>Lens.</em></Heading><h2>See the connections<br />behind your decisions.</h2><p>A practical guide to understanding uncertainty, navigating trade-offs, and creating sustainable value.</p><div className="book-purchase-actions"><a className="book-purchase-action" href={`/insights/books/${book.slug}`}>Explore the Book <ArrowRight aria-hidden="true" /></a><BookPurchaseButton book={book} label="Buy E-book" variant="text" /></div>{price && <span className="book-featured-price">{price}</span>}<span className="lens-author">By {book.author} <span>·</span> invesg publications</span></div>
    <a className="lens-spotlight-art" href={`/insights/books/${book.slug}`} aria-label={`Explore ${book.title}`}><div className="lens-art-orbit" aria-hidden="true" /><div className="book-promotion"><BookImage src={book.slug === 'esg-is-a-lens' ? approvedBookPromotion.src : book.cover} alt={book.slug === 'esg-is-a-lens' ? approvedBookPromotion.alt : `${book.title} by ${book.author}`} loading="eager" /></div><span className="lens-art-caption">A wider perspective.<br />A more thoughtful decision. <MoveUpRight aria-hidden="true" /></span></a>
  </section>;
}
