function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function serializeText(node) {
  let text = escapeHtml(node.text ?? '');
  if (!text) return '';
  const f = node.format || 0;
  if (f & 1)  text = `<strong>${text}</strong>`;
  if (f & 2)  text = `<em>${text}</em>`;
  if (f & 4)  text = `<s>${text}</s>`;
  if (f & 8)  text = `<u>${text}</u>`;
  if (f & 16) text = `<code>${text}</code>`;
  if (f & 32) text = `<sub>${text}</sub>`;
  if (f & 64) text = `<sup>${text}</sup>`;
  return text;
}

function serializeChildren(children) {
  return (children || []).map(serializeNode).join('');
}

function serializeNode(node) {
  switch (node.type) {
    case 'text':
      return serializeText(node);
    case 'linebreak':
      return '<br>';
    case 'paragraph': {
      const inner = serializeChildren(node.children);
      return `<p>${inner || '<br>'}</p>`;
    }
    case 'heading': {
      const tag = node.tag || 'h2';
      return `<${tag}>${serializeChildren(node.children)}</${tag}>`;
    }
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul';
      return `<${tag}>${serializeChildren(node.children)}</${tag}>`;
    }
    case 'listitem':
      return `<li>${serializeChildren(node.children)}</li>`;
    case 'link':
    case 'autolink': {
      const href = escapeHtml(node.url || node.fields?.url || '#');
      const target = node.newTab ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${target}>${serializeChildren(node.children)}</a>`;
    }
    case 'quote':
      return `<blockquote>${serializeChildren(node.children)}</blockquote>`;
    case 'code':
      return `<pre><code>${serializeChildren(node.children)}</code></pre>`;
    case 'horizontalrule':
      return '<hr>';
    case 'upload': {
      const val = node.value;
      if (val?.url) {
        const src = escapeHtml(val.url);
        const alt = escapeHtml(val.alt || '');
        return `<img src="${src}" alt="${alt}" style="max-width:100%;height:auto;" />`;
      }
      return '';
    }
    default:
      return node.children ? serializeChildren(node.children) : '';
  }
}

export function lexicalToHtml(data) {
  if (!data?.root) return '';
  return serializeChildren(data.root.children);
}
