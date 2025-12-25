import React from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const components: Partial<Components> = {
    code(props) {
      const { className, children } = props
      const match = /language-(\w+)/.exec(className || '')
      const inline = !match

      return !inline ? (
        <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div">
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>
          {children}
        </code>
      )
    },
    img(props) {
      return (
        <div className="relative h-auto w-full my-6 rounded-lg overflow-hidden border border-border">
          <img {...props} className="object-cover w-full h-full" />
        </div>
      )
    },
    a({ href, children, ...props }) {
      const isExternal = href?.startsWith('http')
      return (
        <a
          href={href}
          {...props}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-primary hover:underline"
        >
          {children}
        </a>
      )
    },
    p({ children, ...props }) {
      const childrenArray = React.Children.toArray(children)
      const isVideoEmbed =
        childrenArray.length === 1 &&
        typeof childrenArray[0] === 'string' &&
        (childrenArray[0] as string).startsWith('!video[') &&
        (childrenArray[0] as string).includes('](')

      if (isVideoEmbed) {
        const text = childrenArray[0] as string
        const titleMatch = text.match(/!video\[(.*?)\]/)
        const urlMatch = text.match(/\]\((.*?)\)/)

        if (titleMatch && urlMatch) {
          const title = titleMatch[1]
          const url = urlMatch[1]

          if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const videoId = url.includes('youtu.be') ? url.split('/').pop() : url.match(/v=([^&]+)/)?.[1]

            if (videoId) {
              return (
                <div className="my-6">
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={title}
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )
            }
          } else if (url.includes('vimeo.com')) {
            const videoId = url.split('/').pop()

            if (videoId) {
              return (
                <div className="my-6">
                  <iframe
                    width="100%"
                    height="400"
                    src={`https://player.vimeo.com/video/${videoId}`}
                    title={title}
                    style={{ border: 0 }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )
            }
          }
        }
      }

      return <p {...props}>{children}</p>
    },
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}


