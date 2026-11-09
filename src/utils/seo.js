import React from "react";
import { applyPageMetadata } from './seoMetadata';

export function usePageSeo({ title, description, canonicalPath, image, article, robots = "index,follow" }) {
  React.useEffect(() => applyPageMetadata(document, window.location.origin, {
    title, description, canonicalPath, image, article, robots,
  }), [article, canonicalPath, description, image, robots, title]);
}
