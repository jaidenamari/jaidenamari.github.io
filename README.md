# Cyberpunk Blog

A modern, cyberpunk-themed personal blog built with Next.js and designed for GitHub Pages.

## Features

- Modern UI with cyberpunk aesthetics
- Responsive design for all devices
- Markdown content support with Obsidian integration
- Static site generation for fast loading times
- GitHub Actions for automated deployment
- Configurable analytics with environment variables

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Content Management

Content is stored as Markdown files in the `content/posts` directory. 

See `.docs/obsidian-workflow.md` for details on how to create and manage content using Obsidian.

## Deployment

This site is configured to deploy to GitHub Pages automatically using GitHub Actions. Push changes to the main branch to trigger a deployment.

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Markdown
- GitHub Actions
- Gray Matter (for frontmatter parsing)

## Analytics

The blog includes a flexible analytics system that can be configured via environment variables:

```
# Create a .env.local file with these variables
# Master switch for all analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Individual services 
NEXT_PUBLIC_ENABLE_GOATCOUNTER=true
```

To add new analytics or tracking scripts:

1. Add configuration to `lib/analytics-config.ts`
2. Add appropriate environment variables
3. Scripts will be automatically loaded on all pages

## License

MIT 