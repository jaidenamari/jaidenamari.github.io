import path from "path"
import fs from "fs/promises"
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

// Async version of getAllPosts
export const getAllPosts = cache(async (): Promise<Post[]> => {
  // Server-side code guard
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
    // Check if directory exists (async)
    try {
      await fs.access(postsDirectory);
    } catch {
      console.warn(`Posts directory not found: ${postsDirectory}`);
      return [];
    }

    // Get all files from the posts directory (async)
    const fileNames = await fs.readdir(postsDirectory);
    
    // Filter out any non-markdown files
    const markdownFiles = fileNames.filter(fileName => fileName.endsWith('.md'));
    
    // Process all files in parallel
    const allPosts = await Promise.all(
      markdownFiles.map(async (fileName) => {
        // Remove ".md" from file name to get slug
        const slug = fileName.replace(/\.md$/, '');
        
        // Read markdown file as string (async)
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        
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
      })
    );
    
    // Sort posts by date in descending order (newest first)
    return allPosts
      .filter(post => process.env.NODE_ENV === 'development' || !post.draft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading posts:', error);
    return [];
  }
});

// Async version of getPostBySlug
export const getPostBySlug = cache(async (slug: string): Promise<Post | undefined> => {
  // Server-side code guard
  if (typeof window !== 'undefined') {
    return undefined;
  }

  try {
    // Try to find the post file (async)
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    
    // Check if file exists (async)
    try {
      await fs.access(fullPath);
    } catch {
      return undefined;
    }
    
    // Read markdown file as string (async)
    const fileContents = await fs.readFile(fullPath, 'utf8');
    
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
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return undefined;
  }
});