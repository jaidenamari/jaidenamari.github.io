import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const postsDirectory = path.join(__dirname, '../content/posts')
const outputDir = path.join(__dirname, '../src/data')

function calculateReadingTime(content) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function buildPosts() {
  console.log('Building posts manifest...')
  
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`)
    fs.mkdirSync(outputDir, { recursive: true })
    fs.writeFileSync(
      path.join(outputDir, 'posts.json'),
      JSON.stringify({ posts: [] }, null, 2)
    )
    return
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const markdownFiles = fileNames.filter(fileName => fileName.endsWith('.md'))

  const posts = markdownFiles.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const readingTime = calculateReadingTime(content)

    let excerpt = data.excerpt || ''
    if (!excerpt && content) {
      excerpt = content.substring(0, 150).replace(/[#*[\]\\]/g, '').trim()
      if (content.length > 150) excerpt += '...'
    }

    return {
      slug,
      title: data.title || slug,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      excerpt,
      content,
      coverImage: data.coverImage || '/placeholder.svg?height=600&width=800',
      tags: data.tags || [],
      readingTime,
      draft: data.draft || false
    }
  })

  const publishedPosts = posts
    .filter(post => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  fs.mkdirSync(outputDir, { recursive: true })
  
  fs.writeFileSync(
    path.join(outputDir, 'posts.json'),
    JSON.stringify({ posts: publishedPosts }, null, 2)
  )

  console.log(`Built ${publishedPosts.length} posts to src/data/posts.json`)
}

buildPosts()

