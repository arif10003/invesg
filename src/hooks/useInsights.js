import { useMemberSession } from '../context/MemberSessionContext';
import React from 'react';
import { loadInsights } from '../api/insights.js';

export function useInsights({enabled=true}={}) {
  const {revision} = useMemberSession();
  const [attempt, retry] = React.useReducer(value => value + 1, 0);
  const [state, setState] = React.useState({ articles: [], spotlight: [], loading: true, error: null });
  React.useEffect(() => {
    if(!enabled)return;
    const controller = new AbortController();
    setState(previous => ({ ...previous, loading: true, error: null }));
    loadInsights({ signal: controller.signal }).then(data => {
      if (!controller.signal.aborted) setState({ ...data, loading: false, error: null });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ articles: [], spotlight: [], loading: false, error });
    });
    return () => controller.abort();
  }, [attempt,revision,enabled]);
  return { ...state, retry };
}
