import path from "path"
import fs from "fs"
import matter from "gray-matter"
import { cache } from "react"

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  coverImage?: string
  tags?: string[]
  readingTime: number
  draft?: boolean
}

const postsDirectory = path.join(process.cwd(), "content/posts")

// Calculate reading time based on words per minute
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// This is a server-only function
export const getAllPosts = cache((): Post[] => {
  // Server-side code guard
  if (typeof window !== 'undefined') {
    return [];
  }

  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`);
    return [];
  }

  // Get all files from the posts directory
  const fileNames = fs.readdirSync(postsDirectory);
  
  // Filter out any non-markdown files
  const markdownFiles = fileNames.filter(fileName => fileName.endsWith('.md'));
  
  const allPosts = markdownFiles.map(fileName => {
    // Remove ".md" from file name to get slug
    const slug = fileName.replace(/\.md$/, '');
    
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents);
    
    // Calculate reading time
    const readingTime = calculateReadingTime(content);
    
    // Generate excerpt if none exists
    let excerpt = data.excerpt || '';
    if (!excerpt && content) {
      // Generate excerpt from content (first 150 characters)
      excerpt = content.substring(0, 150).replace(/[#*[\]\\]/g, '').trim();
      if (content.length > 150) excerpt += '...';
    }
    
    // Combine the data with the slug
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
    };
  });
  
  // Sort posts by date in descending order (newest first)
  return allPosts
    .filter(post => process.env.NODE_ENV === 'development' || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// This is a server-only function
export const getPostBySlug = cache((slug: string): Post | undefined => {
  // Server-side code guard
  if (typeof window !== 'undefined') {
    return undefined;
  }

  // Try to find the post file
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  // If the file doesn't exist, return undefined
  if (!fs.existsSync(fullPath)) {
    return undefined;
  }
  
  // Read markdown file as string
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Use gray-matter to parse the post metadata section
  const { data, content } = matter(fileContents);
  
  // Calculate reading time
  const readingTime = calculateReadingTime(content);
  
  // Generate excerpt if none exists
  let excerpt = data.excerpt || '';
  if (!excerpt && content) {
    // Generate excerpt from content (first 150 characters)
    excerpt = content.substring(0, 150).replace(/[#*[\]\\]/g, '').trim();
    if (content.length > 150) excerpt += '...';
  }
  
  // Combine the data with the slug
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
  };
});
