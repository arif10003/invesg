import { useMemberSession } from '../../context/MemberSessionContext';
import { downloadPdf } from '../../api/member';
import React from 'react';
import { Download, Link as LinkIcon, Quote, Share2 } from 'lucide-react';
import SaveButton from '../member/SaveButton';
import { articleShareData } from '../../utils/articlePublication.js';

export default function PublicationTools({ article, author }) {
  const noteId = React.useId();
  const session = useMemberSession();
  const [downloading, setDownloading] = React.useState(false);
  async function getPdf(){setDownloading(true);try{window.location.assign(await downloadPdf(article.id));}catch(error){setMessage(error.message);}finally{setDownloading(false);}}
  const [message, setMessage] = React.useState('');
  const [fallback, setFallback] = React.useState('');
  React.useEffect(() => { setMessage(''); setFallback(''); }, [article.slug]);
  async function copy(kind) {
    const data = articleShareData(article, author, window.location.origin);
    const text = kind === 'citation' ? data.citation : data.url;
    try { await navigator.clipboard.writeText(text); setFallback(''); setMessage(kind === 'citation' ? 'Citation copied.' : 'Article link copied.'); }
    catch { setFallback(text); setMessage('Select and copy the text below.'); }
  }
  async function share() {
    setMessage('');
    if (!navigator.share) { await copy('link'); return; }
    try {
      const { title, url } = articleShareData(article, author, window.location.origin);
      await navigator.share({ title, url });
      setMessage('Share options closed.');
    } catch (error) {
      if (error.name !== 'AbortError') await copy('link');
    }
  }
  return <section className="publication-tools" aria-label="Publication tools" aria-describedby={noteId}><h2>Publication Tools</h2>
    <p className="publication-member-note" id={noteId}>Member PDFs and bookmarks use your verified invesg account.</p>
    {article.pdf?.available === true && <div className="publication-action">{session.status==='authenticated'?<button disabled={downloading||!session.profile?.email_verified_at} onClick={getPdf}><Download/>Download PDF</button>:<a href={`/login?${new URLSearchParams({returnTo:`/insights/${article.slug}`,action:'download'})}`}><Download/>Sign in to download PDF</a>}<small>Requires a verified email and current publication eligibility.</small></div>}
    <SaveButton key={session.revision} id={article.id} slug={article.slug} label="Save Insight"/>
    <button className="article-share-action" type="button" onClick={share}><Share2 aria-hidden="true" /> Share article</button>
    <button type="button" onClick={() => copy('citation')}><Quote aria-hidden="true" /> Copy citation</button>
    <button type="button" onClick={() => copy('link')}><LinkIcon aria-hidden="true" /> Copy article link</button>
    <p className="publication-feedback" role="status" aria-live="polite">{message}</p>
    {fallback && <label className="publication-copy-fallback">Select and copy<textarea aria-label="Article link or citation to copy" readOnly value={fallback} onFocus={event => event.target.select()} /></label>}
  </section>;
}
