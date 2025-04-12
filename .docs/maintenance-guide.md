# Cyberpunk Blog Maintenance Guide

This guide provides instructions for maintaining and updating the Cyberpunk Blog.

## Repository Structure

```
cyberpunk-blog/
├── .docs/                # Documentation
├── .github/workflows/    # GitHub Actions workflows
├── app/                  # Next.js app directory
├── components/           # React components
├── content/
│   └── posts/            # Markdown blog posts
├── lib/                  # Utility functions
├── public/               # Static assets
└── ...                   # Other configuration files
```

## Basic Workflow

### Adding a New Blog Post

1. Create a new markdown file in the `content/posts` directory
2. Include proper frontmatter at the top of the file:

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
4. Commit and push your changes to GitHub
5. GitHub Actions will automatically build and deploy your site

### Using Obsidian

See `.docs/obsidian-workflow.md` for detailed instructions on using Obsidian with this blog.

## Local Development

### Setting Up Your Development Environment

1. Clone the repository:
   ```bash
   git clone git@github.com:jaidenamari/jaidenamari.github.io.git
   cd jaidenamari.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. View your site at `http://localhost:3000`

### Making Changes

1. Edit files locally
2. Test your changes with the development server
3. Commit and push changes to GitHub
4. GitHub Actions will handle the build and deployment

## Deployment

The site uses GitHub Actions for automatic deployment to GitHub Pages. The workflow is defined in `.github/workflows/deploy.yml`.

### Manual Deployment

If needed, you can manually deploy:

1. Build the site:
   ```bash
   npm run build
   ```

2. The static site will be generated in the `out` directory
3. Push these files to the `main` branch of the repository

## Common Tasks

### Updating Dependencies

1. Update packages:
   ```bash
   npm update
   ```

2. If there are major updates, review the documentation for those packages

### Modifying the Layout

1. Edit files in the `components` directory
2. Update styles in `app/globals.css` or Tailwind classes

### Adding Images

1. Add images to the `public` directory
2. Reference them in your markdown with relative paths: `/your-image.jpg`

## Troubleshooting

### Build Errors

- Check the GitHub Actions logs for details
- Try building locally to reproduce the error
- Common issues include:
  - Broken links
  - Invalid markdown syntax
  - Missing dependencies

### Content Not Updating

- Verify your changes were pushed to the correct branch
- Check if the GitHub Actions workflow completed successfully
- Try clearing your browser cache

## Backups

A backup of the original Hugo site exists in the `backup-hugo-site` branch. If needed, you can revert to this version by switching branches and redeploying. 