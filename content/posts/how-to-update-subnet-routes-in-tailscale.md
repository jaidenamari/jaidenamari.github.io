---
title: How to Update Subnet Routes in Tailscale
date: 2025-12-14
draft:
tags:
  - tailscale
  - networking
categories:
  - blog
coverImage: /images/blog-covers/sandro-katalina-triangles.jpg
---

When working with private VPC resources (like an AWS OpenSearch endpoint) you may find that devices on your Tailnet can’t reach them even though they’re connected to the same VPC as the VPN server. The issue is often missing subnet routes.

This guide walks through how to advertise and approve subnet routes in Tailscale so your devices can access private network resources.

This example specifically came from me and another engineer troubleshooting our VPN connection to OpenSearch but the concepts more or less would be the same in other instances.

## 1. Identify the Network You Need Access To

If you can reach your target resource (e.g., OpenSearch, EC2, etc) **from your VPN server** but **not from your local machine**, the issue is likely subnet routing.

Example:

- VPN server can `curl` the OpenSearch endpoint successfully.
- Local machine on the Tailnet cannot.

## 2. Check Your VPC Subnets

Determine which CIDR blocks your environment uses.  You'll have to spelunk around in aws to find these under one of the network config tabs for the resource trying to be accessed.

For example:

- **Production VPC:** `10.0.0.0/16`
- **Development VPC:** `172.30.0.0/16`
- **VPN VPC:** `172.31.0.0/16`

You’ll need to advertise these routes from the VPN server so Tailnet clients can reach them.

## 3. Advertise the Required Routes

On the VPN server (already connected to your Tailnet), run:

```bash
# For production
sudo tailscale set --advertise-routes=10.0.0.0/16

# For VPN + Dev combined
sudo tailscale set --advertise-routes=172.31.0.0/16,172.30.0.0/16
```

If you try to advertise overlapping routes (e.g., multiple /16s covering similar space), Tailscale may report a conflict, only advertise the specific subnets you need.

## 4. Approve the Routes in the Tailscale Admin Console

After advertising, the routes will appear as “pending” until approved.  

Go to:  

**[Tailscale Admin Console → Machines → Your VPN Server → Routes]**

Approve each route you want other devices on the Tailnet to use.

Reference: [Tailscale Docs – Subnet Routers](https://tailscale.com/kb/1019/subnets#add-access-rules-for-the-advertised-subnet-routes)

## 5. Verify Access

Once routes are approved:

1. Ensure your local machine is connected to the Tailnet.
2. Try accessing the resource again

```bash
curl --location --request GET 'https://<your-opensearch-endpoint>/profiles/_search' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Basic <your-auth-key>' \
  --data '{ "size": 100, "sort": [ { "os_created_at": "desc" } ] }' -vvv
```

If the routes are set up correctly, your local machine should now connect successfully.
