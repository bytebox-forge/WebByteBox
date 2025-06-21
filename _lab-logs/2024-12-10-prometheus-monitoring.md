---
layout: post
title: "Prometheus Monitoring Stack: Watching the Watchers"
date: 2024-12-10 14:22:00 -0000
categories: lab-logs
tags: [monitoring, prometheus, grafana, alertmanager, observability]
description: "Setting up a comprehensive monitoring stack with Prometheus, Grafana, and AlertManager to keep my homelab infrastructure under surveillance."
status: "ACTIVE"
---

## The Mission

Building a monitoring stack that would make Big Brother jealous. Because if you're not monitoring your infrastructure, are you even home-labbing?

The goal: Complete observability of my homelab with pretty dashboards and alerts that actually wake me up when things go sideways.

## Architecture Overview

```ascii
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Prometheus    │    │     Grafana     │    │  AlertManager   │
│   (Metrics)     │◄───┤  (Dashboards)   │    │  (Notifications)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        ▲                        ▲
         │                        │                        │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Node Exporter  │    │ Docker Metrics  │    │   Custom Apps   │
│  (System Stats) │    │   (Containers)  │    │   (Business)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Stack Components

### Prometheus Server
The brain of the operation. Scrapes metrics from everything with a pulse.

**Configuration Highlights:**

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "rules/*.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: 
        - 'swarm-01:9100'
        - 'swarm-02:9100'
        - 'swarm-03:9100'
        - 'nas-server:9100'

  - job_name: 'cadvisor'
    static_configs:
      - targets:
        - 'swarm-01:8080'
        - 'swarm-02:8080'
        - 'swarm-03:8080'
```

### Grafana Dashboards
Because data without visualization is just numbers screaming into the void.

**Key Dashboards:**

1. **Infrastructure Overview**
   - System health at a glance
   - Resource utilization trends
   - Network traffic patterns

2. **Docker Swarm Monitoring**
   - Container resource usage
   - Service health status
   - Cluster node status

3. **Application Performance**
   - Response times
   - Error rates
   - Custom business metrics

### AlertManager Rules
When things go wrong, I want to know IMMEDIATELY.

```yaml
groups:
  - name: infrastructure.rules
    rules:
      - alert: InstanceDown
        expr: up == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Instance {{ $labels.instance }} down"
          description: "{{ $labels.instance }} has been down for more than 5 minutes."

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 90
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.instance }}"
          description: "Memory usage is above 90% on {{ $labels.instance }}"

      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
          description: "CPU usage is above 85% on {{ $labels.instance }}"
```

## Deployment Strategy

### Docker Compose Setup

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus/config:/etc/prometheus
      - prometheus-data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
      - '--web.enable-lifecycle'
      - '--storage.tsdb.retention.time=30d'

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
      - ./grafana/datasources:/etc/grafana/provisioning/datasources
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_USERS_ALLOW_SIGN_UP=false

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/config:/etc/alertmanager
      - alertmanager-data:/alertmanager

volumes:
  prometheus-data:
  grafana-data:
  alertmanager-data:
```

## Custom Metrics Collection

### Node Exporter Deployment
System-level metrics from all machines:

```bash
# Install on each node
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
sudo cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

# Create systemd service
sudo tee /etc/systemd/system/node_exporter.service > /dev/null <<EOF
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

### Custom Application Metrics
Because why monitor just infrastructure when you can monitor everything?

```python
# Python Flask app with Prometheus metrics
from prometheus_client import Counter, Histogram, generate_latest
from flask import Flask, Response

app = Flask(__name__)

REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency')

@app.before_request
def before_request():
    REQUEST_COUNT.labels(method=request.method, endpoint=request.endpoint).inc()

@app.route('/metrics')
def metrics():
    return Response(generate_latest(), mimetype='text/plain')
```

## Dashboard Highlights

### System Overview Dashboard
- **Uptime**: How long since the last "oops"
- **Resource Usage**: CPU, Memory, Disk, Network
- **Service Health**: All the important stuff at a glance

### Docker Swarm Dashboard
- **Container Stats**: Who's eating all the RAM?
- **Service Distribution**: Load balancing visualization
- **Network Traffic**: Data flow patterns

### Custom Business Metrics
- **API Response Times**: How fast are we?
- **Error Rates**: How broken are we?
- **User Activity**: Who's actually using this?

## Alert Configuration

### Notification Channels

```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@bytebox.local'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    email_configs:
      - to: 'admin@bytebox.local'
        subject: '[ALERT] {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          Labels: {{ .Labels }}
          {{ end }}
    
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
        channel: '#alerts'
        username: 'prometheus'
        title: 'ByteBox Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

## Performance Metrics

After 2 weeks of monitoring:

- **Data Retention**: 30 days of metrics (12GB storage)
- **Scrape Performance**: ~50ms average scrape time
- **Alert Response**: Sub-60 second notification delivery
- **Dashboard Load**: <2 second render time

## Lessons Learned

1. **Start Simple**: Don't try to monitor everything on day one
2. **Meaningful Alerts**: Alert fatigue is real - make them count
3. **Resource Planning**: Prometheus can eat significant resources
4. **Retention Strategy**: Balance storage costs with data needs

## Next Steps

- [ ] Implement distributed tracing with Jaeger
- [ ] Add log aggregation with ELK stack
- [ ] Custom exporters for IoT devices
- [ ] Machine learning for anomaly detection
- [ ] Multi-cluster federation

## Current Status

**Status**: ✅ PRODUCTION READY  
**Uptime**: 99.97% (that 0.03% was a planned coffee refill outage)  
**Metrics Collected**: 847 different series  
**Dashboards**: 12 and counting  
**Alerts Fired**: 23 (mostly my fault)  

The monitoring system is now actively watching everything in the lab. Big Brother would be proud.

---

*Next up: "Building a CI/CD Pipeline That Actually Works (Spoiler: It Doesn't)"*
