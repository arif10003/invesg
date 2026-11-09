import { requestPublicJson } from '../../api/client';
import React from 'react';
import { publicLink } from '../../utils/publication.js';
import { articleSectionId } from '../../utils/articlePublication.js';

function MediaImage({block}) {
  const [src,setSrc]=React.useState(null);
  React.useEffect(()=>{const controller=new AbortController();setSrc(null);requestPublicJson(`/api/v1/media/${encodeURIComponent(block.media_id)}`,{signal:controller.signal}).then(result=>{if(!controller.signal.aborted)setSrc(result.data.public_url);}).catch(()=>{});return()=>controller.abort();},[block.media_id]);
  return src?<figure className="article-body-figure"><img src={src} alt={block.alt||''} loading="lazy"/>{block.caption&&<figcaption>{block.caption}</figcaption>}</figure>:null;
}
// React escapes content; CMS HTML is never injected.
export default function ArticleBody({ value, headingPrefix = 'article-section' }) {
  const blocks = Array.isArray(value) ? value : value ? [value] : [];
  return blocks.map((block, index) => {
    if (typeof block === 'string') return <p key={index}>{block}</p>;
    if (!block || typeof block !== 'object') return null;
    switch (block.type) {
      case 'image': return <MediaImage key={index} block={block}/>;
      case 'citation': return <p key={index}>{block.text}{publicLink(block.url)&&<> <a href={publicLink(block.url)} target="_blank" rel="noopener noreferrer">Source</a></>}</p>;
      case 'paragraph': return <p key={index}>{block.text}</p>;
      case 'heading': { const Heading = block.level === 3 ? 'h3' : 'h2'; return <Heading id={articleSectionId(index, headingPrefix)} key={index}>{block.text}</Heading>; }
      case 'figure': return publicLink(block.src) ? <figure className="article-body-figure" key={index}><img src={publicLink(block.src)} alt={block.alt || ''} loading="lazy" />{block.caption && <figcaption>{block.caption}</figcaption>}</figure> : null;
      case 'quote': return <blockquote key={index}><p>{block.text}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>;
      case 'list': { const List = block.ordered ? 'ol' : 'ul'; return <List key={index}>{(block.items || []).map((text, i) => <li key={i}>{text}</li>)}</List>; }
      case 'table': return <div className="article-table-scroll" role="region" aria-label={block.caption || 'Article table'} tabIndex={0} key={index}><table>{block.caption && <caption>{block.caption}</caption>}<thead><tr>{(block.columns || []).map((text, i) => <th scope="col" key={i}>{text}</th>)}</tr></thead><tbody>{(block.rows || []).map((row, i) => <tr key={i}>{row.map((text, j) => <td key={j}>{text}</td>)}</tr>)}</tbody></table></div>;
      default: return null;
    }
  });
}
