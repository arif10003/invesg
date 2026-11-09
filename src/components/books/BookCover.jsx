import React from 'react';
import BookImage from './BookImage';
import { productCoverArtwork } from '../../data/brandAssets';

export default function BookCover({ book, eager = false }) {
  return <div className="book-cover"><BookImage src={productCoverArtwork(book.slug, book.cover)} alt={`${book.title}${book.author ? ` by ${book.author}` : ''} - book artwork`} loading={eager ? 'eager' : 'lazy'} /></div>;
}
