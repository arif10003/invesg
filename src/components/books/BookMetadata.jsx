import React from 'react';
import { publicLink } from '../../utils/publication';

export function BookPublicationMetadata({ book }) {
  const rows = [['Publisher', book.publisher], ['Format', book.displayFormat], ['Language', book.language], ['ISBN', book.isbn]];
  if (!rows.some(([, value]) => value)) return null;
  return <dl className="book-publication-metadata">{rows.filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}
export function BookAuthor({ book }) {
  if (!String(book.authorBio || '').trim()) return null;
  const photo = publicLink(book.authorPhoto), profile = publicLink(book.authorProfileUrl);
  return <section className="book-author"><h2>About the author</h2>
    {photo && <img className="book-author-photo" src={photo} alt={book.authorDisplayName || book.author || 'Author'} width="112" height="112" loading="lazy" />}
    <p><strong>{book.authorDisplayName || book.author}</strong></p>
    <p style={{whiteSpace:'pre-line'}}>{book.authorBio}</p>
    {profile && <p><a href={profile} target="_blank" rel="noopener noreferrer">Author profile ↗</a></p>}
  </section>;
}
