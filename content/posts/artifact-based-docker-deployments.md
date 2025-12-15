---
title: Artifact Based Docker Deployments
date: 2025-12-14
draft: false
tags:
  - docker
  - deployment
  - ci
  - cd
  - ci/cd
categories:
  - blog
coverImage: /images/blog-covers/cheng-feng-red-wet.jpg
---
# Immutable Artifact Deployments

Stop building on servers.

There's a cleaner way to deploy containerized applications. Instead of pulling code to a server and building it there, wasting cycles and sanity, we build Docker images once in CI/CD and ship immutable artifacts to production.

This eliminates an entire class of deployment failures. If the build passes in CI, it runs in production because they're literally the same artifact. No more "it worked in CI but failed on the server during npm install" nightmares at 3am. (I don't actually stay up that late anymore).

One of the unique challenges that may come up is the difference between compiling something like a TSed backend, and putting it in a container, versus static code like Angular. We are going to explore what it may require to get an Angular Container shipped. 

## The Core Concept

Traditional deployments transfer source code to a server, then build it. This creates problems:

- Server resources consumed by build processes
- Risk of deploying broken code that fails to build in production
- Stale files lingering unless explicitly deleted
- Different build outputs between environments

The fix: build Docker images in GitHub Actions, push them to a container registry, then pull and run them on the server. One build, deploy anywhere.

## Architecture Overview

Three phases:

**1. Build Phase** (GitHub Actions)

- Compile application into Docker images
- Tag with commit SHA and environment
- Push to GitHub Container Registry (GHCR)

**2. Sync Phase** (GitHub Actions → Server)

- Transfer only deployment manifests via rsync
- Use SSH for secure server access
- Minimal file sync, preserving directory structure

**3. Deploy Phase** (Server)

- Pull pre-built images from registry
- Recreate containers with new images
- Clean up old resources

## Setting Up the Pipeline

### The Reusable Workflow

Create `.github/workflows/deploy.yml`. This is the core deployment logic that multiple environments will call:

```yaml
name: Deployment Pipeline

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      SSH_PRIVATE_KEY:
        required: true

jobs:
  deploy:
    name: Deploy to ${{ inputs.environment }}
    environment: ${{ inputs.environment }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Log into GHCR using the automatic GITHUB_TOKEN
      # This token is scoped to the repository and automatically available
      - name: Log in to GHCR
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      # Build the Docker image and push with two tags:
      # 1. Commit SHA for immutable reference
      # 2. Environment-latest for convenience
      - name: Build and Push Image
        uses: docker/build-push-action@v4
        with:
          context: ./client
          push: true
          tags: |
            ghcr.io/${{ github.repository_owner }}/${{ github.event.repository.name }}-client:${{ github.sha }}
            ghcr.io/${{ github.repository_owner }}/${{ github.event.repository.name }}-client:${{ inputs.environment }}-latest
      
      # Load SSH private key into the SSH agent
      # This allows rsync and ssh commands to authenticate
      - name: Set up SSH
        uses: webfactory/ssh-agent@v0.5.3
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
      
      # Two-step deployment:
      # 1. Rsync deployment files to server
      # 2. SSH in and execute the deploy script
      - name: Update Server Deployment
        env:
          SERVER_LOGIN: ${{ vars.SSH_USER }}@${{ vars.TARGET_SERVER }}
          DEPLOY_DIR: ${{ vars.DEPLOY_DIR }}
        run: |
          # Sync only files listed in deploy-manifest.txt
          # This prevents transferring source code or unnecessary files
          rsync -avz --files-from=deploy-manifest.txt \
            -e "ssh -o StrictHostKeyChecking=no" \
            ./ ${{ env.SERVER_LOGIN }}:${{ env.DEPLOY_DIR }}/
          
          # SSH to server and:
          # 1. Login to GHCR (forwarding the token)
          # 2. Run deploy.sh with the commit SHA as TAG
          # 3. Logout for security cleanup
          ssh -o StrictHostKeyChecking=no ${{ env.SERVER_LOGIN }} "
            cd ${{ env.DEPLOY_DIR }} && \
            echo '${{ secrets.GITHUB_TOKEN }}' | docker login ghcr.io -u ${{ github.actor }} --password-stdin && \
            chmod +x deploy.sh && \
            TAG=${{ github.sha }} ./deploy.sh && \
            docker logout ghcr.io
          "
```

`workflow_call` is a pattern that lets us define deployment logic once and reuse it across multiple environments with different triggers. Dev deploys on merge to main, prod deploys on release. This is my preferred style of doing this right now, but there are a gazillion ways to trigger these workflows.

**About GITHUB_TOKEN:** This is automatically available in workflows with read permissions. We need to explicitly grant write permissions for it to push to GHCR.

### Environment-Specific Triggers

Create separate workflow files that call the reusable workflow with different triggers.

**Dev** (`.github/workflows/deploy-dev.yml`): Deploy on merge to main

```yaml
name: Deploy to Development

# Prevent concurrent deployments to dev
# If a new push happens while deploying, cancel the old one
concurrency:
  group: deploy_dev
  cancel-in-progress: true

on:
  push:
    branches: [main]
    # Don't trigger on documentation changes
    paths-ignore:
      - '**/*.md'
      - 'docs/**'

jobs:
  call-reusable:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: dev
    secrets:
      SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

**Production** (`.github/workflows/deploy-prod.yml`): Deploy on release

```yaml
name: Deploy to Production

concurrency:
  group: deploy_prod
  cancel-in-progress: false  # Don't cancel prod deployments

on:
  release:
    types: [published]  # Triggers when publishing a release in GitHub

jobs:
  call-reusable:
    uses: ./.github/workflows/deploy.yml
    with:
      environment: prod
    secrets:
      SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
```

**Why separate triggers?** Dev gets every merge for rapid iteration. Production gets deliberate releases. Same deployment code, different cadence.

## Containerizing Angular

Angular apps compile to static files. Don't run `ng serve` in production, it's a development server and is not properly optimized.

Multi-stage Dockerfile for Angular:

```dockerfile
# Stage 1: Build the Angular app
FROM node:20-alpine AS build
WORKDIR /build
COPY package*.json ./
RUN npm ci  # Use ci instead of install for reproducible builds
COPY . .
RUN npm run build

# Stage 2: Serve with Caddy
FROM caddy:alpine
WORKDIR /app
# Copy only the built artifacts, not node_modules or source
COPY --from=build /build/dist/your-app/browser ./www
EXPOSE 80
# Caddy's file-server mode serves static files efficiently
CMD ["caddy", "file-server", "--root", "/app/www", "--listen", ":80"]
```

The build stage includes Node.js and all dev dependencies. The final stage contains only static files and Caddy, which is much smaller. The build artifacts are immutable; the container is just a delivery mechanism.

Why the Proxy? The compiled Angular app is just static files. These need to be served over HTTP. By embedding Caddy in the container, we package everything the app needs to run. The outer Caddy proxy (defined in docker-compose) handles SSL and routing, while the inner Caddy simply serves files on port 4200.

The proxy configuration in `proxy/Caddyfile`

```c
{$DOMAIN} {
    reverse_proxy client:4200
}
```

## Server-Side Configuration

### Docker Compose for Deployment

`docker-compose.deploy.yml`:

```yaml
services:
  # Reverse proxy handling SSL and routing
  proxy:
    image: caddy:alpine
    volumes:
      - ./proxy/Caddyfile:/etc/caddy/Caddyfile
    ports:
      - "80:80"
      - "443:443"
    environment:
      DOMAIN: ${DOMAIN}
  
  # The application container
  # The TAG environment variable is set by deploy.sh
  client:
    image: ghcr.io/your-org/your-repo-client:${TAG}
    expose:
      - 4200  # Internal only, not published to host
```

The proxy handles SSL termination and routing. The app container doesn't know or care about HTTPS. This separation lets us update the app without touching SSL certs, and vice versa.

### Deployment Script

This file is somewhat dynamic and will depend on the setup and dependencies. Typically we run this as a "post deploy" step after the github workflow has almost completed. THe purpose is to pull the images that have been built, recreates them if needed. 

`deploy.sh`:

```bash
#!/usr/bin/env bash
set -eo pipefail

# Use deploy compose file
docker compose -f docker-compose.deploy.yml pull
docker compose -f docker-compose.deploy.yml up -d --force-recreate
docker system prune -f

echo "Deployment complete"
```

- `set -eo pipefail` will exit immediately if any command fails (`-e`), and catch failures in piped commands (`-o pipefail`). This prevents partial deployments.
- `--force-recreate` because sometimes we need to deploy the same image with different environment variables. This ensures containers are rebuilt even if the image hasn't changed.
- `docker system prune -f` removes all unused containers, networks, and images in one shot. More aggressive than image pruning, but keeps the system clean. The `-f` flag skips confirmation prompts.

>note: it may be necessary to add migration code here, and its reasonable to add a check for environment variables that are required for the deployment workflow. I will often ahve caddy setup on projects and I reload caddy after I recreate and run migrations.

### Deployment Manifest

`deploy-manifest.txt` specifies exactly which files rsync transfers:

```
docker-compose.deploy.yml
proxy/Caddyfile
deploy.sh
```

>**Why a manifest?** This is specifically for files that don't get built into images. I prefere a manifest over managing this transfer in the deploy workflow. Without it, rsync transfers everything: source code, node_modules, .git history. This is wasteful and can cause permission issues. The manifest ensures only deployment files reach the server. There may be a better way to handle this that is less manual and touchy, but it works for now.

## Server Setup

Prepare the server once:

```bash
# Install Docker (don't use apt for this, get the latest)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose plugin
apt install docker-compose-plugin -y

# Create deployment directory
mkdir -p /opt/deployments
chown $USER:$USER /opt/deployments

# Add SSH public key for GitHub Actions
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys
```

>note: Create a dedicated deploy user instead of using root. Add them to the docker group so they can run docker commands without sudo. This is necessary, but I like to do this in principle out of habit.

## GitHub Configuration

### Enable GHCR Write Access

Navigate to **Settings → Actions → General → Workflow permissions**:

- Select "Read and write permissions"
- Check "Allow GitHub Actions to create and approve pull requests"

This grants GITHUB_TOKEN the ability to push images to GHCR. Without this, the workflow can build but not publish.

### Repository Secretssss

Navigate to **Settings → Secrets and variables → Actions → Secrets**:

**SSH_PRIVATE_KEY**:

```bash
# Generate a new SSH key pair specifically for deployments
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/deploy_key -N ""

# Copy the private key content (including BEGIN/END lines)
cat ~/.ssh/deploy_key

# Add the public key to the server's authorized_keys
cat ~/.ssh/deploy_key.pub
```

Paste the entire private key as the secret value. Add the public key to the server's `~/.ssh/authorized_keys`.
### Repository Variables

Navigate to **Settings → Secrets and variables → Actions → Variables**:

- `SSH_USER`: Username for SSH connection (e.g., `deploy`)
- `TARGET_SERVER`: Server IP or domain (e.g., `192.168.1.100` or `app.example.com`)
- `DEPLOY_DIR`: Deployment directory path (e.g., `/opt/deployments`)

**Variables vs Secrets:** Use variables for non-sensitive configuration. They're visible in workflow logs, making debugging easier. Secrets are masked in logs and should only be used for credentials. I discovered this the hard way when I was trying to figure out why my action was failing and all the lines I was try to read about the server was redacted from the logs.

## Why This Works

-  Each commit produces exactly one set of images, tagged with the commit SHA, which removes ambiguity.
-  Dev, staging, and production run identical images. Configuration differences are handled via environment variables..
- Change one line in docker-compose.deploy.yml or re-run the workflow with a previous commit SHA.
- GitHub Actions runners compile the code. This keeps servers lean and predictable.
- Images are built and scanned in CI before deployment. Servers never see source code, npm tokens, or build secrets.

## The Deployment Dance

1. Push code to main (or publish a release)
2. GitHub Actions builds Docker images
3. Images pushed to GHCR with commit SHA tag
4. Deployment files synced to server via rsync
5. Server pulls images and recreates containers
6. Old containers stopped, new ones started
7. Old images cleaned up after 24 hours or in post deploy scripts

If something breaks, the workflow fails before touching production.

## Future Augmentations

**Secrets Management**: This example uses basic environment variables. For production, consider dotenvx for encrypted secrets in source control, or use a proper secrets manager.

**Networking**: Replace SSH keys with Tailscale for simplified access management. No key rotation, no exposed SSH ports. [[tailscale-pulumi-implementation-guide]]

**Monitoring**: Add health checks to the deploy script. Poll the service after deployment and automatically rollback if it fails to respond.

**Image Tags**: Use both SHA and environment tags. SHA tags are immutable references to specific versions. Environment tags (like `prod-latest`) provide convenience but can move.

**Multiple Services**: If there are multiple services (API, worker, frontend), build and push them all in parallel, then deploy them together. GitHub Actions builds make this efficient.

## The Neon Lit Bottom Line

We want to build and test the same artifact between environments. Consistency is key.

Servers become dumb terminals in the best way. Pull image. Run container. Predictable execution in the server racks humming somewhere dehydrating our planet.

When the inevitable deployment goes haywire we can simply rollback by changing a single tag. No rebuilds, no SSH sessions with bleary eyes trying to remember which env variable was not added. The commit SHA is the contract here.

The machine doesn't care about our anxieties. It runs what we give it. 
