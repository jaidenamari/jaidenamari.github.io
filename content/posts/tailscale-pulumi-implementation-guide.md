---
title: Tailscal Pulumi Implementation Guide
date: 2025-12-13
draft: false
tags:
  - devops
  - cybersecurity
  - tailscale
categories:
  - blog
coverImage: /images/blog-covers/ray-zhuang-neon-burn.jpg
---
## Why infrastructure as Code for Tailscale Deployment?

You want to automate the deployment of VMs that will automatically join a Tailscale network on first boot. No SSH keys to distribute, no extra exposed ports, no manual server configuration. This guide is meant to walk you through building that with Pulumi, cloud-init, and Digital Ocean.

Infrastructure as Code (IaC) is a whole bag of worms, but it does offer some distinct advantages when building and deploying software. One of the main reasons I like to use it is to prevent drift between environments. Time and time again I've had to figure out why configurations between dev/prod were behaving differently and it would be some policy, or configuration that was manually applied, or a misconfigured vpc. It's hard to keep track of what engineers are doing at all times. 

- Reproducibility - Define infrastructure, deploy it consistently accross environments. No manual configuration drift.
- Security by default: Embedding Tailscale into the IaC setup means every VM automatically joins the zero-trust network on first boot. No SSH keys to manage or share, no exposed ports, no additional VPN configuration.
- Rapid scaling: Easy to deploy 5+ of the exact same server with the same settings and configurations, and they automatically show up on the Tailscale network
- Version Control: The Infrastructure as Code configuration lives in Git. Making it easy to Review changes, rollback mistakes, and have an audit trail for the networking setup. 
- Ephemeral Auth: Tailscale auth keys are injected at deplyoment time and used only once. No long-lived creds every get stored on disk.

This implementation uses Pulumi which is a typescript based IaC, with cloud-init to achieve as close to a zero touch Tailscale deployment on pretty much any cloud provider. For this example we are using Digital Ocean, but it is just as easy to do this on any other cloud provider like AWS.

I'm going to walk you through how to set this up from scratch, so that you have your own version of this repo that you can customize as needed. If you would like you can also check out the version of this that's been built already.
### Flow

1. Pulumi reads Tailscale auth key from encrypted configuration
2. Cloud-init script generated with embedded Tailscale setup
3. VM deployed with cloud-init user data
4. On boot, cloud-init installs and configures Tailscale automatically
5. VM joins the Tailscale network with specified hostname and settings

### Security Model

- No SSH port 22 exposed to internet
- Only Tailscale UDP (41641) and ICMP allowed inbound
- SSH access exclusively through Tailscale network
- Auth keys stored as Pulumi secrets
- No persistent credentials on VMs

---

## Prerequisites

1. **Tailscale Account** - Sign up at [tailscale.com](https://tailscale.com)  
2. Github Account (Assume you probably have one)
3. **Pulumi CLI** - Install from [pulumi.com/docs/get-started/install](https://www.pulumi.com/docs/get-started/install/)  
4. **Node.js** - Version 20 or later  
5. **Cloud Provider Account** - DigitalOcean

## Initialize project Directory

### Project Structure

```
src/
├── cloud-init.ts # Generates cloud-init YAML with Tailscale setup
├── providers/
│ ├── aws.ts # AWS EC2 implementation (placeholder)
│ └── digitalocean.ts # DigitalOcean Droplet implementation
index.ts # Main Pulumi program with provider selection
```

```bash
mkdir tailscale-pulumi && cd tailscale-pulumi
mkdir -p src/providers
```

### Create a package.json

```json
{
  "name": "tailscale-pulumi",
  "version": "1.0.0",
  "main": "index.ts",
  "scripts": {
    "deploy": "pulumi up",
    "destroy": "pulumi destroy",
    "preview": "pulumi preview"
  },
  "dependencies": {
    "@pulumi/digitalocean": "^4.0.0",
    "@pulumi/pulumi": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.19.9",
    "typescript": "^5.0.0"
  }
}
```

Run `npm install` to pull down the required dependencies

### Minimalist tsconfig

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*", "*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Nothing fancy here. And heck it probably wont even work because Typescript is glorious like that, but I believe in you.

### pulumi.yaml

```yaml
name: tailscale-pulumi
runtime: nodejs
description: Automated Tailscale deployment using cloud-init
template:
  config:
    tailscale-pulumi:authkey:
      description: Tailscale auth key for automatic node registration
      secret: true
```

The `secret: true` flag ensures the auth key is encrypted in the pulumi state file. 

### Building the Cloud Init Script

Cloud-init is the secret sauce to this recipe. It's a standard for VM initializations that all major cloud providers support. I was stumped trying to figure out exactly the best point to inject Tailscale into server set up. But cloud init is the hook I wanted and needed. This can be set up as a more barebones script file, but to cater to the nature of this node project we are writing it in typescript.

```typescript
import * as pulumi from '@pulumi/pulumi';

export interface TailscaleConfig {
  authKey: string | pulumi.Input<string>;
  hostname?: string;
  acceptRoutes?: boolean;
  enableSSH?: boolean;
  tags?: string[];
}

export function generateCloudInitUserData(config: TailscaleConfig): pulumi.Output<string> {
  return pulumi.output(config.authKey).apply(authKey => {
    // Build Tailscale command-line arguments
    const hostname = config.hostname ? `--hostname=${config.hostname}` : '';
    const acceptRoutes = config.acceptRoutes ? '--accept-routes' : '';
    const sshFlag = config.enableSSH ? '--ssh' : '';
    const tags = config.tags?.length ? `--advertise-tags=${config.tags.join(',')}` : '';
    
    const tailscaleArgs = [hostname, acceptRoutes, sshFlag, tags]
      .filter(arg => arg.length > 0)
      .join(' ');

    return `#cloud-config
			package_update: true
			package_upgrade: true
			
			packages:
			  - curl
			
			write_files:
			  - path: /etc/tailscale-setup.sh
			    permissions: '0755'
			    content: |
			      #!/bin/bash
			      set -euo pipefail
			      
			      echo "Installing Tailscale..."
			      curl -fsSL https://tailscale.com/install.sh | sh
			      
			      systemctl enable --now tailscaled
			      sleep 5
			      
			      echo "Connecting to Tailscale network..."
			      tailscale up --authkey=${authKey} ${tailscaleArgs}
			      
			      echo "Tailscale setup complete!"
			      tailscale status
			
			runcmd:
			  - /etc/tailscale-setup.sh
			
			final_message: "Tailscale setup completed. Check 'tailscale status'."
			`;
			  });
}
```

#### What's happening here:

The `pulumi.output().apply()` pattern is the pulumi way of handling values that might not be available until deployment time. Your auth key gets stored here as a secret, so we will need to unwrap it asyncronously at some point.

Where generating a cloud-init.yml that:

1. Updates system packages (because security)
2. Installs curl (need this for tailscale's installer script)
3. Writes a bash script to /etc/tailscale-setup.sh
4. executes that script via r`uncmd`

The bash script does the heavy lifting:

- Downloads and runs Tailscale's official installer
- Enables and starts the talscaled systemd service
- Connects to the network using taislcale up with the auth key
- the `set -euo pipefail` means fail fast on errors

>note: providing the --ssh flag tells Tailscale to handle SSH connections through its own protocol. This means Tailscale manages authentication and you get things like SSH session recording and access logs.

## Creating Digital Ocean Resources

```typescript
import * as digitalocean from '@pulumi/digitalocean';
import * as pulumi from '@pulumi/pulumi';
import { generateCloudInitUserData, TailscaleConfig } from '../cloud-init';

export interface DigitalOceanVmConfig {
  tailscale: TailscaleConfig;
  size?: string;
  region?: string;
  monitoring?: boolean;
}

export function createDigitalOceanDroplet(
  name: string, 
  config: DigitalOceanVmConfig
): digitalocean.Droplet {
  const ubuntuImage = digitalocean.getImage({
    slug: 'ubuntu-22-04-x64'
  });

  const userData = generateCloudInitUserData(config.tailscale);

  return new digitalocean.Droplet(name, {
    image: ubuntuImage.then(img => img.slug || img.id.toString()),
    name: name,
    region: config.region || 'sfo3',
    size: config.size || 's-1vcpu-1gb',
    userData: userData,
    tags: ['tailscale', 'pulumi-managed'],
    monitoring: config.monitoring || false,
    ipv6: true
  });
}

export function createTailscaleFirewall(
  name: string, 
  dropletIds: pulumi.Input<number>[]
): digitalocean.Firewall {
  return new digitalocean.Firewall(`${name}-firewall`, {
    name: `${name}-tailscale-firewall`,
    dropletIds: dropletIds,
    
    inboundRules: [
      {
        protocol: 'udp',
        portRange: '41641',
        sourceAddresses: ['0.0.0.0/0', '::/0']
      },
      {
        protocol: 'icmp',
        sourceAddresses: ['0.0.0.0/0', '::/0']
      }
    ],
    
    outboundRules: [
      {
        protocol: 'tcp',
        portRange: 'all',
        destinationAddresses: ['0.0.0.0/0', '::/0']
      },
      {
        protocol: 'udp',
        portRange: 'all',
        destinationAddresses: ['0.0.0.0/0', '::/0']
      },
      {
        protocol: 'icmp',
        destinationAddresses: ['0.0.0.0/0', '::/0']
      }
    ]
  });
}
```

#### What is going on here?

`createDigitalOceanDroplet()` assembles a droplet resources:
- Using an ubuntu 22.04 LTS image slug
- `userData` is our cloud-init configuration passed to the VM on boot
- size is specifying the type of droplet
- `ipv6: true` because it's 2025

`createTailscaleFirewall()` creates a DigitalOcean firewall with very specific rules:

Inbound:
- UDP port 414641: Tailscale's coordination port
- ICMP: For ping and network diagnostics

Outbound:
- Everything: The BM needs to reach package repos, Tailscale's control plane, and other Tailscale nodes.

Notice what is missing from the config...There is no SSH on port 22. The droplet will not be accessible via traditional SSH. You will not need to generate an SSH key for this. This is the security model we are after. 


## Deployment Orchestration

The main entry point `index.ts` ties everything together

```typescript
import * as pulumi from '@pulumi/pulumi';
import { 
  createDigitalOceanDroplet, 
  createTailscaleFirewall 
} from './src/providers/digitalocean';

const config = new pulumi.Config();
const tailscaleAuthKey = config.requireSecret('authkey');
const instanceName = 'tailscale-vm';

const droplet = createDigitalOceanDroplet(instanceName, {
  tailscale: {
    authKey: tailscaleAuthKey,
    hostname: instanceName,
    acceptRoutes: true,
    enableSSH: true,
    tags: ['tag:pulumi']
  },
  size: 's-1vcpu-1gb',
  region: 'sfo3',
  monitoring: true
});

const firewall = createTailscaleFirewall(
  instanceName, 
  [droplet.id.apply(id => parseInt(id, 10))]
);

export const dropletId = droplet.id;
export const publicIp = droplet.ipv4Address;
export const tailscaleHostname = instanceName;
export const firewallId = firewall.id;
```

**The flow:**

1. Load Pulumi config and grab the Tailscale auth key (stored as a secret)
2. Create the droplet with Tailscale configuration
3. Create the firewall and attach it to the droplet
4. Export useful values (droplet ID, public IP, etc.)

The `droplet.id.apply(id => parseInt(id, 10))` is another Pulumi pattern. The droplet ID isn't available until the resource is created, so we use `apply()` to transform it asynchronously. DigitalOcean's API returns IDs as strings, but the firewall resource expects integers. We parse it.

The `acceptRoutes: true` flag tells this node to accept routes advertised by other Tailscale nodes. Useful if you're setting up subnet routing later.

## Configure Tailscale Admin Panel

### Generate an Auth Key

1. Navigate to the [Tailscale Admin Console](https://login.tailscale.com/admin)  
2. Click **Settings** in the left sidebar  
3. Select the **Keys** tab  
4. Click **Generate auth key**  
5. Configure the auth key settings:  
   - **Description**: Enter `pulumi-deployment` or similar  
   - **Reusable**: Leave **unchecked** (each VM should use the key once)  
   - **Ephemeral**: Check this if you want VMs to disappear from Tailscale when destroyed  
   - **Preauthorized**: **Check this** (allows automatic approval without manual intervention)  
   - **Expiration**: Set to your preference (90 days is common)  
   - **Tags**: Optionally add tags like `tag:pulumi` or `tag:server` for ACL management  
6. Click **Generate key**  
7. **Copy the auth key - it looks like `tskey-auth-xxxxxxxxxxxxx-yyyyyyyyyyyyyyyy`  
8. Store this securely - you'll need it in Step 3

### Optional: Configure ACLs for Tagged Nodes

It is my preference to setup ACL policy to include the tags from the auth key. It's fairly easy to configure different groups and policies here.

This would look something like this:

```json  
{  
  "tagOwners": {
      "tag:pulumi": ["autogroup:admin"]  
  },  
  "acls": [    
	  {      
		  "action": "accept",      
		  "src": ["autogroup:admin"],      
		  "dst": ["tag:pulumi:*"]    
	  }  
  ]
}  
```

Don't forget to click save to apply the ACL changes.

## Configure Cloud Provider

Digital Ocean is how I tested this, but it is simple enough to add this sort of thing to aws. First you need to get an API token from [cloud.digitalocean.com/account/api/tokens](https://cloud.digitalocean.com/account/api/tokens). The instructions generally are along these lines:

1. Generate a New Token
2. Fill in the required form fields:
	- Token Name: Give it a descriptive name (e.g. "pulum-droplet-setup")
	- Expiration: Choose an appropriate expiration time
3. Set Scopes:

	For setting up droplets with firewall permissions, you should select something like:
	
	- **droplet:create** + **droplet:read**
	- **firewall:create** + **firewall:read**
	- **firewall:update** + **firewall:read**
	- **project:read** (often required)
4. Store this key securely for the next steps

>Note: it took me a bit to figure out the scopes and they may change based on how you set up this repo. Don't be shy to experiment with what you want to add to your droplet our automate in pulumi.

## Initialize Pulumi Stack  

Now we set the following variables in your pulumi config. One of the handy things is that using the --secret flag will encrypt any secrets added to this so it's fairly safe to have them committed to the code base.
  
```bash  
# Initialize a new stack
pulumi stack init dev

# Set provider to DigitalOcean (build this so aws, etc can be added)  
pulumi config set tailscale-pulumi:provider digitalocean  

# Set your Tailscale auth key
pulumi config set tailscale-pulumi:authkey tskey-auth-xxxxx --secret

# Set your DigitalOcean API token
# Generate one at: https://cloud.digitalocean.com/account/api/tokens
pulumi config set digitalocean:token dop_v1_xxxxx --secret
```

## Preview Infrastructure

Before deploying, preview what Pulumi will create:  
  
```bash  
npm run preview
```

Pulumi will show you a plan of what it will create. Review it. Make sure nothing looks weird.
## Deploy Infrastructure

```bash  
npm run deploy
```

Pulumi will:  
1. Create the VM with cloud-init configuration  
2. Set up firewall rules (only Tailscale UDP port 41641 and ICMP allowed)  
3. On first boot, the VM will automatically:  
   - Install Tailscale  
   - Authenticate with your auth key  
   - Join your Tailscale network  
   - Configure SSH access through Tailscale  
  
The deployment takes 2-3 minutes. Watch for the outputs at the end something like:

```bash  
Outputs:  
    dropletId         : "123456789"    
    publicIp          : "192.0.2.100"    
    tailscaleHostname : "tailscale-vm"
    firewallId        : "abv123"
```

## Step 7: Verify Tailscale Connection  
  
### Check Tailscale Admin Console  
  
1. Go to the [Tailscale Machines page](https://login.tailscale.com/admin/machines)  
2. Look for your new machine with hostname `tailscale-vm`  
3. It should show as **Connected** with a green indicator  
4. Note the Tailscale IP address (usually `100.x.x.x`)  
  
### SSH into Your VM via Tailscale  
  
```bash  
# Use the Tailscale hostname or IP  
ssh root@tailscale-vm  
  
# Or use the Tailscale IP directly  
ssh root@100.x.x.x  
```  
  
**Note**: Traditional SSH on port 22 is NOT exposed to the internet. Access is exclusively through the Tailscale network.  
  
### Verify Tailscale Status on the VM  
  
Once connected via SSH:  
  
```bash  
# Check Tailscale status  
sudo tailscale status  
  
# View full network status  
sudo tailscale status --json  
  
# Test connectivity to other Tailscale nodes  
tailscale ping <another-tailscale-device>  
```


## Congratulations You Now Have a Child...Server

What have you created? A reproducible IaC setup that deploys VMs with zero-trust networking baked in. The Infrastrcutre Aas Code can be versioned in Git. You can deploy a hoard of these onto the internet and they will be identical twins. You can also delete things in bulk if needed. 

The security model is worth appreciating. We have no SSH keys to manage, which was the main driver for this. The scenario I kept encountering was working on projects and having people come and go, and trying to remember who had server access and who didn't this is much easier to manage via an identify provider and Tailscale authentication. Access can then be managed centrally through a Tailscale ACL.

### Extending this

Some ideas for experimentation:

- Buld a different provider like aws and deploy there
- Add multiple droplets in different regions
- Configure subnet routing to access private networks
- Set up Tailscale's MagicDNS for internal service discovery
- Implement tagging strategies for fine-grained ACL control
- Automate certificate management with Tailscale's built-in HTTPS support

The pattern scales. You can adapt this to AWS, GCP, Azure, or any provider with cloud-init support. The cloud-init script remains largely unchanged.
