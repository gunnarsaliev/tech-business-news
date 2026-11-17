'use client'

import { useState } from 'react'
import { Check, Link2, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openShare = (target: 'x' | 'linkedin') => {
    const url = encodeURIComponent(window.location.href)
    const shareUrl =
      target === 'x'
        ? `https://x.com/intent/post?url=${url}&text=${encodeURIComponent(title)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Share</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={copyLink} size="sm" variant="outline">
          {copied ? <Check data-icon="inline-start" /> : <Link2 data-icon="inline-start" />}
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button onClick={() => openShare('x')} size="sm" variant="outline">
          <Share2 data-icon="inline-start" />X
        </Button>
        <Button onClick={() => openShare('linkedin')} size="sm" variant="outline">
          <Share2 data-icon="inline-start" />
          LinkedIn
        </Button>
      </div>
    </div>
  )
}
