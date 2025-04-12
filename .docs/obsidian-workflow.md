# Obsidian Workflow for Cyberpunk Blog

This document outlines how to use Obsidian for content creation with the cyberpunk-blog setup.

## Setup

### Linking Obsidian Vault

1. Configure your Obsidian vault to include or point to the `content/posts` directory in your blog repository.
2. You can either:
   - Create a new vault directly in the `content/posts` directory
   - Add the `content/posts` directory as a folder in your existing vault
   - Use symbolic links to connect your existing Obsidian notes to the blog

### Creating New Blog Posts

When creating a new blog post in Obsidian, follow these steps:

1. Create a new markdown file in the `content/posts` directory
2. Add the required frontmatter at the top of the file:

```yaml
---
title: "Your Post Title"
date: YYYY-MM-DDT12:00:00+00:00
draft: false
tags: ["tag1", "tag2"]
categories: ["blog"]
---
```

3. Write your content below the frontmatter
4. Save the file with a descriptive filename that will become the URL slug (e.g., `my-blog-post.md`)

## Frontmatter Requirements

The following frontmatter fields are supported:

| Field | Required | Description |
|-------|----------|-------------|
| title | Yes | The title of your blog post |
| date | Yes | Publication date in ISO format |
| draft | No | Set to `true` to mark as draft (won't show in production) |
| tags | No | Array of tags for categorization |
| categories | No | Array of categories |
| excerpt | No | Short summary of the post (will be auto-generated if not provided) |
| coverImage | No | Path to the cover image (defaults to placeholder if not provided) |

## Obsidian-Specific Features

The blog supports the following Obsidian-specific markdown features:

1. **Basic Markdown**: All standard markdown syntax (headings, lists, links, etc.)
2. **Code Blocks**: Syntax highlighting for code
3. **Images**: Regular markdown image syntax

### Limitations

The following Obsidian features may not work as expected on the blog:

1. **Wiki Links**: The blog currently doesn't process `[[links]]` the same way Obsidian does
2. **Embeds**: Obsidian embeds won't work directly
3. **Callouts**: Standard markdown doesn't support Obsidian callouts

## Workflow Steps

Typical workflow:

1. Create/edit content in Obsidian
2. Commit and push changes to the repository
3. GitHub Actions will automatically build and deploy the site

## Testing Locally

To test how your posts look before pushing:

1. From the blog repository root, run:
   ```bash
   npm run dev
   ```
2. View your site at `http://localhost:3000`
3. Make any necessary adjustments before committing

## Tips and Best Practices

1. Use descriptive filenames that work well as URL slugs
2. Include relevant tags to help with organization
3. Preview your content locally before pushing
4. If using images, place them in the `public` directory and reference them with relative paths
5. Set `draft: true` for posts you're still working on 