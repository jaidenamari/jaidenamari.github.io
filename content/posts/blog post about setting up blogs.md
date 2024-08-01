---
title: "blog post about setting up blogs"
date: 2024-07-30
draft: false
tags: ["cybersecurity", "blogging"]
categories: ["blog"]
---

## Step-by-Step Guide to Setting Up My Blog on GitHub Pages

### 1. Create a Github Account

I already have a github account, so I think I may just stick with this. It's where all my commits to private work projects are, and could probably do with a configuration audit eventually.

### 2. Create a New Repository

1. Log into my GitHub account.
2. Click on the "+" icon in the top right corner and select "New repository".
3. I'll name my repository as `myusername.github.io` (replacing `myusername` with my GitHub username).
4. Set the repository to "Public" and click "Create repository".

### 3. Set Up GitHub Pages

1. I'll navigate to my new repository.
2. Click on the "Settings" tab.
3. In the left-hand pane, I'll click on "Pages".
4. Under "Source", I'll select deploy from branch to start, but may want to customize this with github action eventuall I can select which branch to service this from "main" works for now.
https://docs.github.com/en/pages/quickstart

### 4. Install ~~Jekyll~~ Hugo Locally

I decided to use hugo instead, because I liked the feel of Malware Hell by C3RB3RU5 on their github. They are using the LoveIt Theme which is Hugo in order to run the blog:
- https://github.com/dillonzq/LoveIt/tree/e9e89a4613baee823596822b7d246f5931263491
- https://c3rb3ru5d3d53c.github.io/categories/docs/

There were some trials and tributes to be paid in order to switch over to hugo. I think my biggest folly was deleting the files from my local folder and not pushing those changes to the remote branch before installing hugo with the template. This resulted in things being out of sync and github having a fit about trying to push to the remote origin 'main' branch.

I also had to change my repo settings to build from the /docs folder instead of root otherwise it tried to build the project using Jekyll in Github Actions.

If I want to customize my blog locally before pushing changes to GitHub:

1. Install hugo `brew install hugo`.
2. Remove the Jekyll version of the blog by simply running
    
    `cd ..`
    `rm -rf jaidenamari.github.io`
    

2. Create a new Hugo site.
```bash
	hugo new site jaidenamari.github.io
	cd jaidenamari.github.io>)
```


### 5. Customize My ~~Jekyll~~ Hugo Site

1. I'll clone the LoveIt Theme to my repo
    
    `git init`
    `git submodule add https://github.com/dillonzq/LoveIt.git themes/LoveIt`
    

2. Once added I modified deleted the hugo.toml file and renamed it to config.toml (in hindsight the new standard is to use hugo.toml so I may revert this back eventually..
3. Basic Config (This got more advanced as I dove down the rabbit hole):
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

### 6. Decide on structure
    
I decided to delete a lot of the pre-generated files because it was making a mess of the project. I wan tot keep the file structure as simple as possible, and manage the content folder with obsidian. 
    
GitHub Pages will automatically build and deploy my site.

### 7. Set Up Continuous Integration (CI) with GitHub Actions

I'll create a `.github/workflows` directory in my repository. I'm mainly copying what I saw in c3rb3ru5d3d53c's repo as it seemed simple and effecient.

### 8. Write My First Blog Post

1. I'll navigate to the `content/posts` directory in the repository.
2. Create a new Markdown file named hello-moon.md`.
3. Add the following front matter to the top...or on second though make a templates folder, and make the following into a template called post template. It's important that the `---` doesn't have spaces.
    
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
3. Inser the template by typing `Templates: Insert template` then choose `Post Template`
4. Commit and push my changes to GitHub.

### 9. Import Obsidian Notes

I'll create a new vault - or a folder in my current vault - for the blog.

1. I opted to open the content folder of the blog as a new vault, then imported all my themes by copying the .obsidian hidden folder from my personal vault. This transferred all my stypes and fonts to the new vault. 
2. .gitignore now has .obsidian in it so that my configs are not includes.

By following these steps, I'll have a fully functional blog hosted on GitHub Pages, using Jekyll to manage my content. This setup is not only free but also leverages my existing skills in web development and Markdown.