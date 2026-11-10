import React from 'react';
import { BookOpen } from 'lucide-react';
import { bookPrice } from '../../api/books';
import BookPurchaseButton from './BookPurchaseButton';

export default function BookPurchasePanel({ book }) {
  const price = bookPrice(book.commerce);
  return <section className="book-purchase" aria-labelledby="digital-edition-heading"><BookOpen aria-hidden="true"/><h2 id="digital-edition-heading">{book.comingSoon ? 'Coming Soon' : 'Digital edition'}</h2>{price && <p className="book-price">{price}</p>}<BookPurchaseButton book={book} label="Buy E-book" />{!book.comingSoon && <p className="book-access-note">Secure checkout.</p>}{book.displayFormat && <p className="book-access-note">{book.displayFormat}</p>}</section>;
}

