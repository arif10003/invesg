import React from 'react';
import '../../styles/book-images.css';
import { publicMediaUrl } from '../../api/client';

// A failure renders text once. It never retries or substitutes another title's cover.
export default function BookImage({ src, alt, className, loading = 'lazy', ...props }) {
  const url = publicMediaUrl(src);
  const [failedSource, setFailedSource] = React.useState(null);
  if (!url || failedSource === url) return <span className={`book-image-fallback ${className || ''}`} role="img" aria-label={alt}><strong>{alt}</strong><span>Book image unavailable</span></span>;
  return <img {...props} className={className} src={url} alt={alt} loading={loading} decoding="async" onError={() => setFailedSource(url)} />;
}
