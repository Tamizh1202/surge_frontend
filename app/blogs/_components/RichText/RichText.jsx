import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Simple recursive component to render Lexical rich text from Payload CMS
const RichText = ({ content, className }) => {
  if (!content || !content.root || !content.root.children) {
    return null;
  }

  const renderNode = (node, index) => {
    if (!node) return null;

    switch (node.type) {
      case 'paragraph':
        return (
          <p key={index} style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </p>
        );

      case 'text':
        let text = node.text;
        
        // Lexical format bitmask: 1=Bold, 2=Italic, 4=Underline, 8=Strikethrough, 16=Code, 32=Subscript, 64=Superscript
        let element = <span key={index}>{text}</span>;
        
        if (node.format & 1) element = <strong key={index}>{element}</strong>;
        if (node.format & 2) element = <em key={index}>{element}</em>;
        if (node.format & 4) element = <u key={index}>{element}</u>;
        if (node.format & 8) element = <span key={index} style={{ textDecoration: 'line-through' }}>{element}</span>;
        
        return element;

      case 'heading':
        const HeadingTag = node.tag || 'h2';
        return (
          <HeadingTag key={index} style={{ marginTop: '2rem', marginBottom: '1rem', fontWeight: 'bold' }}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </HeadingTag>
        );

      case 'list':
        const ListTag = node.listType === 'number' ? 'ol' : 'ul';
        return (
          <ListTag key={index} style={{ marginLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: node.listType === 'number' ? 'decimal' : 'disc' }}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </ListTag>
        );

      case 'listitem':
        return (
          <li key={index} style={{ marginBottom: '0.5rem' }}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </li>
        );

      case 'link':
        return (
          <Link key={index} href={node.fields?.url || '#'} style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
            {node.children?.map((child, i) => renderNode(child, i))}
          </Link>
        );


      case 'upload':
        // Payload image upload in rich text
        if (node.value && node.value.url) {
          return (
            <div key={index} style={{ margin: '2rem 0' }}>
              <Image 
                src={node.value.url} 
                alt={node.value.alt || ''} 
                width={node.value.width || 800} 
                height={node.value.height || 400} 
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
              />
              {node.value.caption && (
                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  {node.value.caption}
                </p>
              )}
            </div>
          );
        }
        return null;

      default:
        // Fallback for unknown types
        if (node.children) {
          return <div key={index}>{node.children.map((child, i) => renderNode(child, i))}</div>;
        }
        return null;
    }
  };

  return (
    <div className={className}>
      {content.root.children.map((node, index) => renderNode(node, index))}
    </div>
  );
};

export default RichText;
