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

export type ArticleHeading = {
  id: string
  text: string
  level: 2 | 3
}

function plainText(node: LexicalNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(plainText).join('')
}

/** Anchor id for a heading, shared by the rendered heading and the table of contents. */
function headingId(node: LexicalNode) {
  return plainText(node)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/** Top-level h2/h3 headings of an article, for the table of contents. */
export function getHeadings(root: LexicalNode): ArticleHeading[] {
  return (root.children ?? []).flatMap((node): ArticleHeading[] => {
    if (node.type !== 'heading') return []
    const text = plainText(node).trim()
    const id = headingId(node)
    if (!text || !id) return []
    // h1 is rendered as h2; deeper levels are left out of the table of contents.
    if (node.tag === 'h3') return [{ id, text, level: 3 }]
    if (!node.tag || node.tag === 'h1' || node.tag === 'h2') return [{ id, text, level: 2 }]
    return []
  })
}

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
      return <Tag className="scroll-mt-24" id={headingId(node) || undefined} key={key}>{children}</Tag>
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
