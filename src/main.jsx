import { MemberSessionProvider } from './context/MemberSessionContext';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { restoreSession } from './api/client';
import BrandLoading from './components/BrandLoading';
import './styles.css';
import './styles/foundation.css';
import './styles/brand.css';
import './styles/visual-readability.css';

function SessionStartup() {
  const [state, setState] = React.useState('loading');
  const restore = React.useCallback(() => {
    setState('loading');
    restoreSession().then(() => setState('ready')).catch(() => setState('error'));
  }, []);
  React.useEffect(restore, [restore]);
  if (state === 'loading') return <BrandLoading />;
  if (state === 'error') return <main className="member-state" role="alert"><h1>Connection unavailable</h1><p>We could not restore your session. Please retry.</p><button onClick={restore}>Retry</button></main>;
  return <MemberSessionProvider><App /></MemberSessionProvider>;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SessionStartup />
  </React.StrictMode>
);
