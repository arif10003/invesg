import { useMemberSession } from '../../context/MemberSessionContext';
import { downloadBook, downloadPdf, removeBookmark } from '../../api/member';
import React from 'react';
import { memberDate } from '../../utils/memberDate';
import { BookOpen, Bookmark, FileText } from 'lucide-react';
import BookCover from '../books/BookCover';
import { publicLink } from '../../utils/publication';

const collections = {
  books: { Icon: BookOpen, title: 'No purchased books yet', description: 'Your verified e-book purchases will appear here.', href: '/insights/books', label: 'Explore Books & Publications' },
  saved: { Icon: Bookmark, title: 'No saved insights yet', description: 'Save published Insights to return to them later.', href: '/insights', label: 'Explore Insights' },
  pdfs: { Icon: FileText, title: 'No eligible PDF publications yet', description: 'PDF publications currently available to your membership will appear here.', href: '/insights', label: 'Explore Insights' },
};

// Ready data is reserved for a future authorized server response, never local
// storage, URL parameters or the public product catalog. Access actions stay
// disabled until their corresponding server integrations exist.
export default function LibraryCollection({ kind, result, retry, preview: requestedPreview = false }) {
  const session = useMemberSession();
  const [message,setMessage]=React.useState(''),[busy,setBusy]=React.useState(null);
  async function act(item){setBusy(item.id);try{if(kind==='saved'){await removeBookmark(item.id);retry?.();setMessage('Bookmark removed.');}else{window.location.assign(await (kind==='books'?downloadBook(item.id):downloadPdf(item.id)));}}catch(error){setMessage(error.message);}finally{setBusy(null);}}
  const preview = import.meta.env.DEV && requestedPreview;
  const info = collections[kind] || collections.books;
  const Icon = info.Icon;
  if (result.status === 'loading') return <div className="member-state" role="status">Loading your collection…</div>;
  if (result.status !== 'ready') {
    const title = result.status === 'unauthorized' ? 'Sign in to view your library' : result.status === 'forbidden' ? (session.profile && !session.profile.email_verified_at ? 'Verify your email to open this collection' : 'This collection is not accessible') : result.status === 'error' ? 'Your collection could not be loaded' : 'Library services are not available yet';
    return <div className="member-state"><Icon aria-hidden="true" /><h2>{title}</h2><p>{result.status === 'unavailable' ? 'Member accounts and purchase access are being prepared. We cannot retrieve or verify your collection yet.' : 'Your collection has not been shown. Please check your account access or try again later.'}</p>{result.status === 'error' && <button type="button" onClick={retry}>Try again</button>}<a href="/login?returnTo=%2Faccount%2Flibrary">Log in</a></div>;
  }
  // Missing data must never masquerade as a successful empty response.
  if (!Array.isArray(result.items)) return <div className="member-state" role="alert"><h2>Your collection could not be loaded</h2><p>The collection response is incomplete. Please try again later.</p></div>;
  if (!result.items.length) return <div className="member-state"><Icon aria-hidden="true" /><h2>{info.title}</h2><p>{info.description}</p><a href={info.href}>{info.label}</a></div>;
  return <><p role="status">{message}</p><ul className="member-collection">{result.items.map(item => {
    const available = item.available !== false;
    const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug || '') ? item.slug : null;
    const href = preview && publicLink(item.href) ? item.href : slug ? (kind === 'books' ? `/insights/books/${slug}` : `/insights/${slug}`) : null;
    return <li className="member-item" key={item.id}>
      {kind === 'books' && <BookCover book={item} />}
      <div><span className="member-label">{preview ? 'Development preview item' : kind === 'books' ? 'Verified purchase' : kind === 'saved' ? (item.contentTypeLabel || 'Saved Insight') : 'Member PDF publication'}</span><h3>{available || kind === 'books' ? item.title || 'Publication unavailable' : 'Publication unavailable'}</h3>{kind === 'books' && <p>Access: {item.accessState || (available ? 'active' : 'unavailable')}</p>}{kind === 'books' && item.author && <p>By {item.author}</p>}{available ? <>{kind !== 'books' && item.author && <p>By {item.author}</p>}{item.excerpt && <p>{item.excerpt}</p>}{item.purchasedAt && kind === 'books' && <p>Purchased <time dateTime={item.purchasedAt}>{memberDate(item.purchasedAt) || 'Date unavailable'}</time></p>}{item.publishedAt && kind !== 'books' && <p>Published {item.publishedAt}</p>}{kind === 'pdfs' && <p>{item.saved === true ? 'Also saved to your Insights collection.' : 'Eligible for member access; not marked as saved.'} Access depends on current eligibility.</p>}{publicLink(href) && <a href={href}>{kind === 'books' ? 'View details' : 'Read Insight'}</a>}</> : <p>This publication may have been unpublished or access may have changed.</p>}</div>
      <div className="member-item-actions"><button type="button" disabled={preview || busy!==null || session.status!=='authenticated' || (!available && kind!=='saved')} onClick={()=>act(item)}>{busy===item.id?'Please wait…':kind==='saved'?'Remove bookmark':available?'Download securely':'Access unavailable'}</button><small>{kind==='saved'?'Updates your account bookmarks.':'Each download requires a fresh authorization check.'}</small></div>
    </li>;
  })}</ul></>;
}
