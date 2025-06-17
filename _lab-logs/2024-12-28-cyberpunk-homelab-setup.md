---
layout: post
title: "Building a Cyberpunk Homelab: Matrix-Style Infrastructure"
date: 2024-12-28 15:30:00 -0000
categories: lab-logs
tags: [homelab, infrastructure, cyberpunk, self-hosting]
description: "Journey into building a cyberpunk-themed homelab that would make Neo jealous - complete with Matrix-style monitoring, neon-lit server racks, and terminal-based everything."
github_repo: "https://github.com/[username]/cyberpunk-homelab"
---

Welcome to the digital underground, fellow cyber-warriors. Today I'm documenting my journey of building a homelab that looks like it belongs in the Matrix - because why settle for boring enterprise gear when you can have a cyberpunk paradise?

## The Vision

Picture this: A basement server room bathed in neon green light, monitors displaying cascading code, and the gentle hum of servers plotting the digital revolution. This isn't just infrastructure - it's an aesthetic statement.

### Hardware Foundation

```bash
root@matrix:~$ lscpu | grep -E "(Model|CPU)"
Model name:            Intel(R) Xeon(R) E5-2697 v4 @ 2.30GHz
CPU(s):                36
```

The core of my setup consists of:

- **Primary Server**: Dell PowerEdge R730 (because nothing says "I'm serious" like rack-mount enterprise gear)
- **Storage Beast**: Custom NAS with 48TB raw storage
- **Network Switch**: Ubiquiti Dream Machine Pro (for that prosumer flex)
- **Pi Cluster**: 8x Raspberry Pi 4 running K3s (because horizontal scaling is sexy)

## The Matrix Stack

### Container Orchestration

Running everything in Docker Swarm because Kubernetes felt too mainstream:

```yaml
version: '3.8'
services:
  homelab-dashboard:
    image: organizr/organizr
    environment:
      - PUID=1000
      - PGID=1000
    volumes:
      - ./config:/config
    ports:
      - "80:80"
    networks:
      - matrix-net
    deploy:
      replicas: 2
      placement:
        constraints:
          - node.role == worker
```

### Monitoring That Would Make Morpheus Proud

The monitoring stack is where the magic happens:

- **Prometheus**: Metrics collection (the Oracle of server stats)
- **Grafana**: Dashboards with cyberpunk themes
- **Loki**: Log aggregation (because logs are the breadcrumbs in the digital forest)
- **Alertmanager**: When things go wrong (and they will)

```bash
# Custom Grafana dashboard with Matrix-style green text
curl -X POST \
  http://grafana:3000/api/dashboards/db \
  -H 'Content-Type: application/json' \
  -d '{
    "dashboard": {
      "title": "Matrix Homelab",
      "theme": "dark",
      "style": "dark"
    }
  }'
```

### The Neon Aesthetic

Here's where things get fun. I've modified every web interface to match the cyberpunk aesthetic:

```css
/* Custom CSS injected into every service */
:root {
  --matrix-green: #00ff41;
  --cyber-purple: #8a2be2;
  --warning-amber: #ffb000;
}

body {
  background: #000000;
  color: var(--matrix-green);
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 5px var(--matrix-green);
}
```

## Security: Paranoia as a Feature

### Network Segmentation

```bash
# VLANs for days
ip link add link eth0 name vlan.100 type vlan id 100  # Trusted
ip link add link eth0 name vlan.200 type vlan id 200  # DMZ
ip link add link eth0 name vlan.666 type vlan id 666  # Sketchy experiments
```

### Zero Trust, Maximum Paranoia

Every service runs behind:
- Traefik reverse proxy with Let's Encrypt
- Authelia for 2FA on everything
- Fail2ban for the script kiddies
- Wireguard VPN because OpenVPN is so 2019

## The Terminal Dashboard

The crown jewel is a custom terminal dashboard that aggregates everything:

```bash
#!/bin/bash
# homelab-status.sh - The Matrix has you...

while true; do
    clear
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                    MATRIX HOMELAB STATUS                 ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo
    
    # System status with Matrix flair
    echo "┌─ SYSTEM RESOURCES ─────────────────────────────────────────┐"
    printf "│ CPU Usage: "
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    if (( $(echo "$cpu_usage > 80" | bc -l) )); then
        printf "\033[31m%s%%\033[0m" "$cpu_usage"  # Red for high usage
    else
        printf "\033[32m%s%%\033[0m" "$cpu_usage"  # Green for normal
    fi
    echo "                                      │"
    
    printf "│ Memory:    "
    free -h | awk 'NR==2{printf "\033[32m%s/%s\033[0m", $3,$2}'
    echo "                                      │"
    
    printf "│ Uptime:    "
    uptime -p | sed 's/up //' | tr -d '\n'
    echo "                                              │"
    echo "└────────────────────────────────────────────────────────────┘"
      # Docker containers status
    echo "┌─ CONTAINER STATUS ─────────────────────────────────────────┐"
    docker ps --format "table {% raw %}{{.Names}}\t{{.Status}}{% endraw %}" | tail -n +2 | while read line; do
        name=$(echo $line | awk '{print $1}')
        status=$(echo $line | awk '{print $2}')
        if [[ $status == "Up" ]]; then
            printf "│ \033[32m●\033[0m %-50s │\n" "$name"
        else
            printf "│ \033[31m●\033[0m %-50s │\n" "$name"
        fi
    done
    echo "└────────────────────────────────────────────────────────────┘"
    
    sleep 5
done
```

## Lessons Learned

### What Worked

1. **Aesthetics Matter**: Making the lab visually appealing increased my motivation to work on it
2. **Documentation is King**: Every service needs a runbook
3. **Backup Everything**: RAID is not a backup (learned this the hard way)

### What Didn't Work

1. **Over-Engineering**: Started with Kubernetes, realized Docker Swarm was sufficient
2. **RGB Everything**: Turns out blinking lights get annoying at 3 AM
3. **Custom Kernels**: Stick to stable releases for production workloads

## Future Enhancements

### Phase 2: The Rabbit Hole Goes Deeper

```bash
# TODO: Next phase additions
- [ ] GPU cluster for AI/ML experiments
- [ ] Software-defined networking with OpenWrt
- [ ] Custom PCB design for status indicators
- [ ] Integration with home automation (because why not?)
- [ ] Blockchain node (just kidding, I'm not that far gone)
```

### Network Topology

```
Internet
    │
┌───▼───┐     ┌─────────┐     ┌──────────────┐
│ Router │────▶│ Firewall │────▶│ Core Switch  │
└───────┘     └─────────┘     └──────┬───────┘
                                     │
                ┌────────────────────┼────────────────────┐
                │                    │                    │
         ┌──────▼──────┐      ┌──────▼──────┐     ┌──────▼──────┐
         │   Server    │      │     NAS     │     │  Pi Cluster │
         │   Rack      │      │   Storage   │     │   (K3s)     │
         └─────────────┘      └─────────────┘     └─────────────┘
```

## Conclusion

Building a cyberpunk homelab isn't just about the technology - it's about creating an environment that inspires you to push boundaries and explore the digital frontier. Sure, it might be overkill for hosting a few websites, but where's the fun in doing things the easy way?

The Matrix has you... and honestly, that's exactly where I want to be.

---

*Want to see more homelab adventures? Check out my other posts in the [lab-logs](/lab-logs/) section. And if you build your own cyberpunk setup, ping me - I'd love to see how deep your rabbit hole goes.*

```bash
# Keep the digital revolution alive
echo "There is no spoon... only servers" > /dev/null
exit 0
```
