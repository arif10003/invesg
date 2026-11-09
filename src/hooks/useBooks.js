import React from 'react';
import { loadBooks, loadBook } from '../api/books.js';
export function useBooks(slug, { enabled = true } = {}) {
  const [state, setState] = React.useState({ loading: true, error: null, books: [], book: null });
  React.useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setState({ loading: true, error: null, books: [], book: null });
    (slug === undefined ? loadBooks({ signal: controller.signal }) : loadBook(slug, { signal: controller.signal })).then(value => {
      if (!controller.signal.aborted) setState({ loading: false, error: null, books: slug === undefined ? value : [], book: slug === undefined ? null : value });
    }).catch(error => { if (!controller.signal.aborted) setState({ loading: false, error, books: [], book: null }); });
    return () => controller.abort();
  }, [slug, enabled]);
  return state;
}
