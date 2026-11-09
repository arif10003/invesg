import React from 'react';
import { loadArticle } from '../api/insights.js';
import { useMemberSession } from '../context/MemberSessionContext.jsx';
export function useArticle(slug) {
  const { revision } = useMemberSession();
  const [state, setState] = React.useState({ article: null, loading: Boolean(slug), error: null });
  React.useEffect(() => {
    if (!slug) { setState({ article: null, loading: false, error: null, revision }); return; }
    const controller = new AbortController(); setState({ article: null, loading: true, error: null });
    loadArticle(slug, { signal: controller.signal }).then(article => { if (!controller.signal.aborted) setState({ article, loading: false, error: null, revision }); }).catch(error => { if (!controller.signal.aborted) setState({ article: null, loading: false, error, revision }); });
    return () => controller.abort();
  }, [slug, revision]);
  return state.revision === revision ? state : {article:null,loading:Boolean(slug),error:null};
}
