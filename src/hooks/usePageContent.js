import React from 'react';
import { requestPublicJson } from '../api/client.js';
// Only published copy enters fixed templates. Existing approved copy is the fallback.
export function usePageContent(key, { enabled = true } = {}) {
  const [content,setContent]=React.useState(null);
  React.useEffect(()=>{
    if(!enabled)return;
    const controller=new AbortController();setContent(null);
    requestPublicJson(`/api/v1/pages/${encodeURIComponent(key)}`,{signal:controller.signal}).then(result=>{if(!controller.signal.aborted)setContent(result.data);}).catch(()=>{});
    return()=>controller.abort();
  },[key,enabled]);
  return content;
}
