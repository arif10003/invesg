import { publicLink } from './publication.js';

export const articleSectionId = (index, prefix = 'article-section') => `${prefix}-${index + 1}`;

// Public metadata only. Never use a manuscript URL, token, or entitlement here.
export function articleShareData(article, author, origin) {
  const path = publicLink(article.href) || `/insights/${encodeURIComponent(article.slug)}`;
  const url = new URL(path, origin).href;
  const authorName=author?.name || article.authorName;
  const citation = `${authorName ? `${authorName}. ` : ''}${article.title}. ${article.citationNote || 'INVESG.'}${article.publishedAt ? ` ${article.publishedAt}.` : ''} ${url}`;
  return { title: article.title, url, citation };
}
