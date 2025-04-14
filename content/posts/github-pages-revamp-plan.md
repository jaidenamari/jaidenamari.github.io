---
title: github pages revamp plan
date: 2025-04-12
draft: 
tags:
  - webdev
  - nextjs
categories:
  - blog
coverImage: /images/blog-covers/blog-homescreen.png
---
# GitHub Pages Migration Plan - COMPLETED ✅

## Overview

This document outlines the steps that were taken to migrate the cyberpunk-blog project to the existing GitHub Pages repository (`jaidenamari.github.io`) while preserving both the new blog features and existing content/workflow.

I wanted a fresh design using some of the new things I've been learning using next.js and radix ui. I'm still not convinced I like next.js, for anything complex, but it seems to be suitable for quickly standing up new designs. 

I don't have any projects on my git that I can currently share with the public, but I will eventually get on documenting some of my coding projects as they come to fruition here. I'll improve the aesthetic over time. I was curious about experimenting with the three.js library to add some 3d elements, but my first attempts are very shy of what I was hoping for, so I just added some basic animation for now.

## Future Improvements

- Improve placeholder logo, add favicon.
- Actually implement three.js to create animated cyber forest and 3d stars in sky.
- Update colors to be a bit softer and more ephemeral, the effect on the page of moving particles should feel more spore like.
- Add projects from my github as I complete them
- Add notes and various study materials as I'm researching and learning about new cybersecurity, and dev concepts.
- Get some digital art made for blog posts, and Hero.
## Current State

- New cyberpunk-blog: Next.js project with modern aesthetics
- Existing blog: Hugo-based site with Obsidian workflow for content
- The existing blog has content in `content/posts/` as markdown files with YAML frontmatter

## Migration Goals

1. Preserve existing blog posts and content ✅
2. Maintain Obsidian workflow for content creation ✅
3. Update the aesthetics with the new cyberpunk forest design ✅
4. Ensure a smooth transition without data loss ✅

## Step-by-Step Migration Plan

### Phase 1: Repository Setup ✅

- [x] Initialize git in the cyberpunk-blog project
- [x] Create a new branch for the migration work
- [x] Clone the existing GitHub Pages repo to a temporary location
- [x] Analyze the current GitHub Pages repo structure

### Phase 2: Content Integration ✅

- [x] Create a proper content directory structure in the cyberpunk-blog project
- [x] Update the blog.ts file to read actual markdown files instead of mock data
- [x] Copy existing blog posts from the GitHub Pages repo to the cyberpunk-blog project
- [x] Ensure the frontmatter in the markdown files is compatible with the new system

### Phase 3: Next.js Configuration for GitHub Pages ✅

- [x] Configure Next.js for static export (GitHub Pages requires static files)
- [x] Add `output: 'export'` to the next.config.mjs file
- [x] Configure basePath if needed (if the site will be at a subpath)
- [x] Create a .nojekyll file to prevent GitHub Pages from processing with Jekyll
- [x] Create a GitHub Actions workflow file for automated builds and deployments

### Phase 4: Obsidian Workflow Integration ✅

- [x] Ensure the markdown parser can handle Obsidian-specific features
- [x] Set up a content directory structure that works well with Obsidian
- [x] Document the workflow for creating and editing content using Obsidian

### Phase 5: Integration Testing ✅

- [x] Test the content rendering with existing blog posts
- [x] Verify Obsidian workflow compatibility
- [x] Test the build and export process
- [x] Make necessary adjustments to styling and formatting

### Phase 6: Deployment ✅

- [x] Add the GitHub Pages repo as a remote in the cyberpunk-blog project
- [x] Push the changes to a new branch in the GitHub Pages repo
- [x] Create a backup of the current GitHub Pages site
- [x] Deploy to the main branch when everything is verified

### Phase 7: Post-Deployment ✅

- [x] Verify all content is accessible and correctly rendered
- [x] Ensure the Obsidian workflow continues to function
- [x] Update documentation for the new content management process
- [x] Monitor for any issues

## Technical Implementation Details

### Content System Modifications

We modified `lib/blog.ts` to:

1. Read markdown files from the file system ✅
2. Parse frontmatter correctly ✅
3. Support the existing YAML frontmatter format from Hugo ✅

### Required Dependencies

- `gray-matter` for parsing frontmatter in markdown files ✅
- `fs` for reading files from the filesystem ✅
- Already have `react-markdown` for rendering ✅

### GitHub Pages Configuration

GitHub Pages with Next.js requires:

1. Static HTML export ✅
2. A .nojekyll file to prevent Jekyll processing ✅
3. Proper asset path configuration ✅

## Rollback Plan

In case of critical issues:

1. Revert to the previous commit in the GitHub Pages repo
2. Re-deploy the previous version
3. Address issues in the cyberpunk-blog project before attempting migration again

## Conclusion

The migration from Hugo to Next.js was successfully completed. The new site maintains compatibility with the Obsidian workflow while providing a modern cyberpunk aesthetic. All existing content has been preserved, and the site is now deployed to GitHub Pages using GitHub Actions for automated deployment.