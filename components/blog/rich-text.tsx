import type { ReactNode } from 'react'

/** A node of Payload's Lexical rich text JSON. */
export type LexicalNode = {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  fields?: { url?: string; newTab?: boolean }
}

// Lexical stores text formatting as a bitmask.
const BOLD = 1
const ITALIC = 2
const STRIKETHROUGH = 4
const UNDERLINE = 8
const CODE = 16

function renderText(node: LexicalNode): ReactNode {
  const format = typeof node.format === 'number' ? node.format : 0
  let content: ReactNode = node.text
  if (format & CODE) content = <code>{content}</code>
  if (format & BOLD) content = <strong>{content}</strong>
  if (format & ITALIC) content = <em>{content}</em>
  if (format & UNDERLINE) content = <u>{content}</u>
  if (format & STRIKETHROUGH) content = <s>{content}</s>
  return content
}

function renderNode(node: LexicalNode, key: number): ReactNode {
  const children = node.children?.map(renderNode)

  switch (node.type) {
    case 'text':
      return <span key={key}>{renderText(node)}</span>
    case 'linebreak':
      return <br key={key} />
    case 'paragraph':
      return <p key={key}>{children}</p>
    case 'heading': {
      // The article title is the page's only h1.
      const Tag = (node.tag && node.tag !== 'h1' ? node.tag : 'h2') as 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      return <Tag key={key}>{children}</Tag>
    }
    case 'quote':
      return <blockquote key={key}>{children}</blockquote>
    case 'list':
      return node.listType === 'number' ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>
    case 'listitem':
      return <li key={key}>{children}</li>
    case 'horizontalrule':
      return <hr key={key} />
    case 'link':
    case 'autolink': {
      const newTab = node.fields?.newTab
      return (
        <a href={node.fields?.url ?? '#'} key={key} rel={newTab ? 'noopener noreferrer' : undefined} target={newTab ? '_blank' : undefined}>
          {children}
        </a>
      )
    }
    default:
      // Unknown node types (e.g. custom blocks) still show their text.
      return children ? <div key={key}>{children}</div> : null
  }
}

export function RichText({ root }: { root: LexicalNode }) {
  return <>{root.children?.map(renderNode)}</>
}
