import React from 'react';
import { subscribeSessionEnd } from '../utils/sessionEvents';
import { getSession, subscribeSession, clearSession } from '../api/client.js';
export const MemberSessionContext = React.createContext({ status: 'guest', profile: null, revision: 0 });
export function MemberSessionProvider({ children }) {
  React.useEffect(() => subscribeSessionEnd(() => { clearSession(); window.location.replace('/'); }), []);
  const session = React.useSyncExternalStore(subscribeSession, getSession, getSession);
  return <MemberSessionContext.Provider value={session}>{children}</MemberSessionContext.Provider>;
}
export const useMemberSession = () => React.useContext(MemberSessionContext);
