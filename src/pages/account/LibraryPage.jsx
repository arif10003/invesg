import { useMemberSession } from '../../context/MemberSessionContext';
import { claimPurchases } from '../../api/member';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MemberLayout from '../../components/member/MemberLayout';
import LibraryCollection from '../../components/member/LibraryCollection';
import { libraryKind, loadMemberLibrary } from '../../api/member';
import '../../styles/books.css';

const tabs = [{ id: 'books', label: 'My Books' }, { id: 'saved', label: 'Saved Insights' }, { id: 'pdfs', label: 'PDF Insights' }];

export default function LibraryPage({ previewItems: requestedPreviewItems, previewState = "ready" }) {
  const session=useMemberSession();
  const [claimMessage,setClaimMessage]=React.useState(''),[claimBusy,setClaimBusy]=React.useState(false);
  async function claim(){setClaimBusy(true);try{const result=await claimPurchases();setClaimMessage(`${result.data.claimed_count} purchase entitlement(s) claimed.`);retry();}catch(error){setClaimMessage(error.message);}finally{setClaimBusy(false);}}
  const previewItems = import.meta.env.DEV ? requestedPreviewItems : null;
  const [params, setParams] = useSearchParams();
  const selected = libraryKind(params.get('tab'));
  const [attempt, retry] = React.useReducer(value => value + 1, 0);
  const [result, setResult] = React.useState({ status: 'loading', items: null });
  const refs = React.useRef([]);
  const id = React.useId();
  React.useEffect(() => {
    if (previewItems) return;
    const controller = new AbortController();
    setResult({ status: 'loading', items: null, revision: session.revision });
    loadMemberLibrary(selected, { signal: controller.signal }).then(data => {
      if (!controller.signal.aborted) setResult({...data,revision:session.revision});
    }).catch(() => { if (!controller.signal.aborted) setResult({ status: 'error', items: null, revision:session.revision }); });
    return () => controller.abort();
  }, [selected, attempt, session.revision, previewItems]);
  const select = index => { const next = new URLSearchParams(params); next.set("tab", tabs[index].id); setParams(next); };
  const keyboard = (event, index) => {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next !== null) { event.preventDefault(); select(next); refs.current[next]?.focus(); }
  };
  return <MemberLayout title="My Library" path="/account/library"><p>Your personal collection of books and Insights.</p>{!previewItems && session.status==='authenticated' && <div className="commerce-notice"><p>{session.profile.email_verified_at?'Previous guest purchases using your verified email can be claimed here.':'Verify your email before opening purchased books and member PDFs.'}</p>{!session.profile.email_verified_at?<a href="/account/verify-email">Verify email</a>:<button disabled={claimBusy} onClick={claim}>Claim previous purchases</button>}<p role="status">{claimMessage}</p></div>}<div className="member-tabs" role="tablist" aria-label="Library collections">{tabs.map((tab, index) => <button key={tab.id} ref={element => { refs.current[index] = element; }} type="button" role="tab" id={`${id}-${tab.id}`} aria-controls={`${id}-panel-${tab.id}`} aria-selected={selected === tab.id} tabIndex={selected === tab.id ? 0 : -1} onClick={() => select(index)} onKeyDown={event => keyboard(event, index)}>{tab.label}</button>)}</div>{tabs.map(tab => <section key={tab.id} id={`${id}-panel-${tab.id}`} role="tabpanel" aria-labelledby={`${id}-${tab.id}`} hidden={selected !== tab.id} tabIndex={0}>{selected === tab.id && <><p className="member-collection-note">{selected === 'books' ? 'Only verified purchase entitlements belong in My Books.' : selected === 'saved' ? 'Bookmarks reference the original article; they do not create a separate copy.' : 'Eligible member PDFs are separate from saved Insights. Downloading a PDF does not imply permanent ownership.'}</p><LibraryCollection key={`${session.revision}-${selected}`} kind={selected} preview={Boolean(previewItems)} result={previewItems ? { status: previewState, items: previewItems[selected] } : (session.status!=='authenticated'?{status:'unauthorized',items:null}:result.revision===session.revision?result:{status:'loading',items:null})} retry={retry} /></>}</section>)}</MemberLayout>;
}
