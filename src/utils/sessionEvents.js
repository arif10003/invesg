let channel;
function sessionChannel() {
  if (typeof window === 'undefined' || !window.BroadcastChannel) return null;
  return channel ||= new window.BroadcastChannel('invesg-session');
}
export function publishSessionEnd() { sessionChannel()?.postMessage({ type: 'signed-out' }); }
export function subscribeSessionEnd(listener) {
  const current = sessionChannel();
  if (!current) return () => {};
  const receive = event => { if (event.data?.type === 'signed-out') listener(); };
  current.addEventListener('message', receive);
  return () => current.removeEventListener('message', receive);
}
