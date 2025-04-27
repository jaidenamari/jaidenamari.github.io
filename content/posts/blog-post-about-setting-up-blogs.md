---
title: "blog post about setting up blogs"
date: 2024-07-30
draft: false
tags: ["cybersecurity", "blogging"]
categories: ["blog"]
coverImage: "/images/blog-covers/cyberpunk-forest-blog-setup.png"
---

### 1. Create a Github Account

I created a new github account, mainly because I wanted to rebrand my online presence and to have a clear trackable start. While my old git has 1000's of commits, it's mainly to internal work projects. 

### 2. Create a New Repository

1. Log into GitHub.
2. Click on the "+" icon in the top right corner and select "New repository".
3. I'll name my repository as `spriggan.github.io`.
4. Set the repository to "Public" and click "Create repository".

### 3. Set Up GitHub Pages

1. I'll navigate to my new repository.
2. Click on the "Settings" tab.
3. In the left-hand pane, I'll click on "Pages".
4. Under "Source", I'll select deploy from branch to start, but may want to customize this with github actions eventually I can select which branch to service this from "main" works for now.
https://docs.github.com/en/pages/quickstart

### 4. Install Hugo Locally

I decided to use hugo instead, because I liked the feel of Malware Hell by C3RB3RU5 on their github. They are using the LoveIt Theme which is Hugo in order to run the blog:
- https://github.com/dillonzq/LoveIt/tree/e9e89a4613baee823596822b7d246f5931263491
- https://c3rb3ru5d3d53c.github.io/categories/docs/

Now I had initially setup the blog to use jekyll and there were some trials and tribulations to switching over. I'm always learning new things in git, and managed to stumble my way into resetting up the project from scratch.

I also had to add the .nojekyll file to my repo otherwise it tried to build the project using Jekyll in Github Actions.

I wanted to customize my blog locally before pushing changes to GitHub:

1. Install hugo `brew install hugo`.
2. Remove the Jekyll version of the blog by simply running
3. Create a new Hugo site.
```bash
	hugo new site spriggan.github.io
	cd spriggan.github.io
```

### 5. Customize My Hugo Site

1. I'll clone the LoveIt Theme to my repo
    
    `git init`
    `git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt`
    

2. Once added I modified the hugo.toml file.
3. Basic Config (This got more advanced as I dove down the rabbit hole, but I started with c3rb3rusd3d53c's config):
	```
	baseURL = "https://jaidenamari.github.io/"  
	languageCode = "en"  
	title = "My Cybersecurity Adventure"  
	description = "Where cyber witchery meets security"  
	theme = "LoveIt"  
	publishDir = "docs"  
	  
	[params]  
	  version = "0.2.X"  
	  
	[menu]  
	  [[menu.main]]  
	    identifier = "posts"  
	    name = "Posts"  
	    url = "/posts/"  
	    weight = 1  
	  [[menu.main]]  
	    identifier = "tags"  
	    name = "Tags"  
	    url = "/tags/"  
	    weight = 2  
	  [[menu.main]]  
	    identifier = "categories"  
	    name = "Categories"  
	    url = "/categories/"  
	    weight = 3
	```

Eventually I will work on a more custom theme. I want to emulate the [Vanilla Amoled](https://github.com/SakuraIsayeki/vanilla-amoled-theme)  theme I use in Obsidian. In addition to this "ultra-dark" theme I will add some pops of color eventually to break things up visually. 
### 6. Set Up Continuous Integration (CI) with GitHub Actions

I'll create a `.github/workflows` directory in my repository. I used the gitub pages repo from peaceiris on github: https://github.com/peaceiris/actions-gh-pages 

This was a bit tricky to setup because I tried switching my github pages settings to deploy using github actions, but later found that this caused problems with the GITHUB_TOKEN, which was an issue mentioned in the peaceiris repo FAQ. Instead I opted to just deploy from the gh-pages branch that was included in my repo after hugo builds the `./public` folder.

### 7. Import Obsidian Notes

I'll create a new vault - or a folder in my current vault - for the blog.

1. I opted to open the content folder of the blog as a new vault, then imported all my themes by copying the .obsidian hidden folder from my personal vault. This transferred all my stypes and fonts to the new vault. 
2. .gitignore now has .obsidian in it so that my configs are not includes.

By following these steps, I'll have a fully functional blog hosted on GitHub Pages, using Jekyll to manage my content. This setup is not only free but also leverages my existing skills in web development and Markdown.

### 8. Write My First Blog Post

1. I'll navigate to the `content/posts` directory in the repository.
2. Create a new Markdown file named hello-moon.md`.
3. Add the following front matter to the top...or on second thought make a `/templates` folder, and make the following into a template called post template. It's important that the `---` delimeter doesn't have spaces.
    
```markdown
---
title: "{{title}}"
date: {{date}}
draft: false
tags: ["cybersecurity", "blogging"]
categories: ["blog"]
---
```
    

2. Use `cmd + p` to open the command pallete on macOS
3. Insert the template by typing `Templates: Insert template` then choose `Post Template`
4. Commit and push my changes to GitHub.