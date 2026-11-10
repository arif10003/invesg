import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../../styles/book-purchase-action.css';

export default function BookPurchaseButton({ book, label = 'Purchase e-book', variant = 'primary' }) {
  const className = variant === 'text' ? 'book-purchase-link' : 'book-purchase-action';
  if (book.isPrint || book.canPurchase !== true) return <button type="button" className={className} disabled>{book.comingSoon || book.status === 'coming_soon' ? 'Coming Soon' : 'Purchasing is not open yet'}</button>;
  return <a className={className} href={`/checkout/${book.slug}`}>{label} <ArrowRight aria-hidden="true" /></a>;
}

