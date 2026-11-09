import React from 'react';

// Book descriptions support emphasis and headings, never executable HTML.
export function Inline({ text }) {
  const source = String(text ?? '');
  const stack = [{ children: [] }];
  let key = 0;
  const append = value => stack[stack.length - 1].children.push(value);
  const pattern = /\\([\\*_])|\*{1,3}|_{1,3}/g;
  let cursor = 0;
  for (const match of source.matchAll(pattern)) {
    append(source.slice(cursor, match.index));
    cursor = match.index + match[0].length;
    if (match[1]) { append(match[1]); continue; }
    const marker = match[0][0];
    let count = match[0].length;
    const previous = source[match.index - 1] || '';
    const next = source[cursor] || '';
    if (marker === '_' && /[\p{L}\p{N}]/u.test(previous) && /[\p{L}\p{N}]/u.test(next)) { append(match[0]); continue; }
    while (count) {
      const top = stack[stack.length - 1];
      if (stack.length > 1 && top.marker[0] === marker && count >= top.marker.length && /\S/.test(previous)) {
        stack.pop(); count -= top.marker.length;
        append(top.marker.length === 2 ? <strong key={key++}>{top.children}</strong> : <em key={key++}>{top.children}</em>);
      } else if (/\S/.test(next)) {
        const size = count >= 2 ? 2 : 1;
        stack.push({ marker: marker.repeat(size), children: [] }); count -= size;
      } else { append(marker.repeat(count)); count = 0; }
    }
  }
  append(source.slice(cursor));
  while (stack.length > 1) { const top = stack.pop(); append([top.marker, ...top.children]); }
  return stack[0].children;
}
function plainText(text = '') {
  return text.replace(/^#{1,6}\s+/, '').replace(/\*\*|__|\*|_/g, '').replace(/\s+/g, ' ').trim();
}
function Block({ text }) {
  const heading = text.match(/^#{1,6}\s+(.+)$/);
  return heading ? <h3><Inline text={heading[1]} /></h3> : <p><Inline text={text} /></p>;
}
export default function BookDescription({ book }) {
  const paragraphs = (book.description || []).flatMap(text => text.split(/\n\s*\n/)).map(text => text.trim()).filter(Boolean);
  // The API may already contain the same approved introduction/closing as the template.
  const body = paragraphs.filter(text => !book.headline || plainText(text) !== plainText(book.headline));
  const closingAlreadyPresent = body.some(text => plainText(text) === plainText(book.closing));
  return <section className="book-description">
    {book.headline && <h2><Inline text={book.headline} /></h2>}
    {body.slice(0, 2).map((text, index) => <Block key={index} text={text} />)}
    {body.length > 2 && <details><summary>Read more about the book</summary>{body.slice(2).map((text, index) => <Block key={index} text={text} />)}</details>}
    {book.closing && !closingAlreadyPresent && <p><strong><Inline text={book.closing} /></strong></p>}
  </section>;
}
