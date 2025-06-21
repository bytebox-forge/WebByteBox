---
layout: post
title: "Raspberry Pi Kubernetes Cluster: Because Why Not?"
date: 2024-12-05 20:15:00 -0000
categories: lab-logs
tags: [kubernetes, raspberry-pi, k3s, cluster, masochism]
description: "Building a Kubernetes cluster on Raspberry Pi 4s - a tale of tiny computers doing big things, questionable life choices, and surprising performance."
status: "SURPRISINGLY STABLE"
---

## The Questionable Decision

Someone on Reddit said "you can run Kubernetes on Raspberry Pis" and my brain translated that to "you SHOULD run Kubernetes on Raspberry Pis." 

Narrator: *He should not have.*

But here we are, with 8 Raspberry Pi 4s pretending to be a serious Kubernetes cluster.

## The Hardware

**Cluster Specifications:**
- 8x Raspberry Pi 4 (8GB RAM each)
- 8x 128GB Samsung EVO Select microSD cards
- 1x 8-port Gigabit switch
- 1x Custom 3D-printed rack (because aesthetics matter)
- 1x Lot of patience

**Network Layout:**
```
pi-k8s-master-01  (192.168.1.10) - Control Plane
pi-k8s-master-02  (192.168.1.11) - Control Plane  
pi-k8s-master-03  (192.168.1.12) - Control Plane
pi-k8s-worker-01  (192.168.1.20) - Worker Node
pi-k8s-worker-02  (192.168.1.21) - Worker Node
pi-k8s-worker-03  (192.168.1.22) - Worker Node
pi-k8s-worker-04  (192.168.1.23) - Worker Node
pi-k8s-worker-05  (192.168.1.24) - Worker Node
```

## Installation Journey

### Step 1: Ubuntu Server Setup
Because Raspberry Pi OS is for people who like their lives easy.

```bash
# Flash Ubuntu Server 22.04 LTS to all 8 SD cards
# Enable SSH and set up SSH keys
# Update all the things
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget vim git
```

### Step 2: K3s Installation
Chose K3s because it's Kubernetes for people who don't hate themselves *that* much.

**Master Node Setup:**
```bash
# On first master node
curl -sfL https://get.k3s.io | sh -s - server --cluster-init

# Get the token for other nodes
sudo cat /var/lib/rancher/k3s/server/node-token
```

**Additional Masters:**
```bash
# On remaining master nodes
curl -sfL https://get.k3s.io | sh -s - server \
  --server https://192.168.1.10:6443 \
  --token <TOKEN_FROM_FIRST_MASTER>
```

**Worker Nodes:**
```bash
# On worker nodes
curl -sfL https://get.k3s.io | K3S_URL=https://192.168.1.10:6443 \
  K3S_TOKEN=<TOKEN> sh -
```

## The Cluster in Action

**Node Status:**
```bash
kubectl get nodes -o wide
NAME               STATUS   ROLES                       AGE     VERSION
pi-k8s-master-01   Ready    control-plane,etcd,master   12d     v1.28.4+k3s2
pi-k8s-master-02   Ready    control-plane,etcd,master   12d     v1.28.4+k3s2
pi-k8s-master-03   Ready    control-plane,etcd,master   12d     v1.28.4+k3s2
pi-k8s-worker-01   Ready    <none>                      12d     v1.28.4+k3s2
pi-k8s-worker-02   Ready    <none>                      12d     v1.28.4+k3s2
pi-k8s-worker-03   Ready    <none>                      12d     v1.28.4+k3s2
pi-k8s-worker-04   Ready    <none>                      12d     v1.28.4+k3s2
pi-k8s-worker-05   Ready    <none>                      12d     v1.28.4+k3s2
```

**Cluster Resources:**
```bash
kubectl describe nodes | grep -A 5 "Capacity:"
Capacity:
  cpu:                4
  ephemeral-storage:  125293548Ki
  hugepages-1Gi:      0
  hugepages-2Mi:      0
  memory:             8010840Ki
```

Total cluster capacity: 32 CPU cores, 64GB RAM. Not bad for a bunch of credit card-sized computers.

## Deployed Applications

### Nginx Ingress Controller
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-ingress-controller
spec:
  type: LoadBalancer
  externalIPs:
    - 192.168.1.100
  ports:
    - port: 80
      targetPort: 80
      name: http
    - port: 443
      targetPort: 443
      name: https
```

### Monitoring Stack
Yes, we're monitoring the monitors. It's monitors all the way down.

```yaml
# Prometheus on ARM64
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### Demo Applications
Because what's a Kubernetes cluster without some apps that serve cat pictures?

**Cat Picture API:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cat-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cat-api
  template:
    metadata:
      labels:
        app: cat-api
    spec:
      containers:
      - name: cat-api
        image: nginx:alpine
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"
```

## Performance Metrics

**Cluster Stats After 2 Weeks:**
- **Uptime**: 99.2% (that 0.8% was me accidentally unplugging things)
- **Average CPU Usage**: 15% across all nodes
- **Memory Usage**: ~40% (Kubernetes itself is surprisingly hungry)
- **Pod Density**: ~25 pods per node before things get interesting

**Load Testing Results:**
```bash
# Using hey to load test nginx
hey -n 10000 -c 100 http://192.168.1.100

Summary:
  Total:        45.2341 secs
  Slowest:      2.1234 secs
  Fastest:      0.0123 secs
  Average:      0.4521 secs
  Requests/sec: 221.10
```

Not bad for a bunch of SBCs!

## Challenges Faced

### 1. ARM64 Container Images
Half the Docker images on Docker Hub don't have ARM64 builds. It's 2024, people!

### 2. SD Card Reliability
One SD card failed after 8 days. Lesson learned: enterprise storage exists for a reason.

### 3. Power Management
8 Pi 4s at full load = significant power draw. The UPS was not amused.

### 4. Heat Management
Even with heatsinks, summer deployment required additional cooling. Tiny computers, big heat.

## Lessons Learned

1. **K3s is Amazing**: Lightweight Kubernetes that actually works
2. **ARM64 Ecosystem**: Better than expected, but still has gaps
3. **Persistent Storage**: NFS works, but NVMe would be better
4. **Power Planning**: Calculate power requirements before deployment
5. **Cooling is Critical**: Small computers still need airflow

## Cost Breakdown

- 8x Raspberry Pi 4 (8GB): $75 each = $600
- 8x 128GB microSD cards: $20 each = $160
- Network switch: $80
- Cables and accessories: $50
- Custom rack materials: $30
- **Total**: $920

For comparison, a single server with similar specs would cost $2,000+. The Pi cluster wins on cost but loses on single-threaded performance.

## Current Workloads

The cluster is currently running:
- **Monitoring stack** (Prometheus, Grafana)
- **CI/CD pipeline** (Tekton)
- **Development environments** (Various web apps)
- **Home automation** (Node-RED, Home Assistant)
- **Learning platform** (JupyterHub)

## Future Plans

- [ ] Add persistent storage with NFS
- [ ] Implement GitOps with ArgoCD
- [ ] Deploy service mesh (Istio/Linkerd)
- [ ] Add more monitoring and alerting
- [ ] Experiment with machine learning workloads
- [ ] Build a proper custom enclosure

## Would I Do It Again?

**Absolutely.** 

This cluster has been surprisingly stable and performant. It's perfect for:
- Learning Kubernetes
- Development environments
- Home automation
- Light production workloads
- Impressing visitors

**Status**: ✅ PRODUCTION (ish)  
**Reliability**: Better than expected  
**Performance**: Adequate for most tasks  
**Cool Factor**: Maximum  
**Wife Approval**: Pending...  

The Raspberry Pi Kubernetes cluster: proving that sometimes the best ideas start with "that's probably a terrible idea, but let's try it anyway."

---

*Coming next: "Why My NAS Became Sentient and Started Ordering Its Own Hard Drives"*
