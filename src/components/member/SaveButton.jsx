import React from 'react';
import { Bookmark } from 'lucide-react';
import { useMemberSession } from '../../context/MemberSessionContext';
import { listBookmarks, saveBookmark, removeBookmark } from '../../api/member';
export default function SaveButton({ slug, id, label = 'Save Insight' }) {
  const session=useMemberSession();const [saved,setSaved]=React.useState(null),[message,setMessage]=React.useState(''),[busy,setBusy]=React.useState(false);
  React.useEffect(()=>{let live=true;setSaved(null);setMessage('');if(session.status==='authenticated'&&id)listBookmarks().then(items=>{if(live)setSaved(items.some(item=>item.id===id));}).catch(error=>{if(live)setMessage(error.message);});return()=>{live=false;};},[id,session.revision]);
  async function toggle(){setBusy(true);try{if(saved)await removeBookmark(id);else await saveBookmark(id);setSaved(!saved);setMessage(saved?'Removed from saved Insights.':'Insight saved.');}catch(error){setMessage(error.message);}finally{setBusy(false);}}
  return <div className="publication-action">{session.status!=='authenticated'?<a href={`/login?${new URLSearchParams({returnTo:`/insights/${slug}`,action:'save'})}`}><Bookmark/>Sign in to save</a>:<button type="button" disabled={!id||saved===null||busy} onClick={toggle}><Bookmark/>{saved?'Remove saved Insight':label}</button>}<small role="status">{message || 'A bookmark keeps a reference; it does not grant additional access.'}</small></div>;
}
