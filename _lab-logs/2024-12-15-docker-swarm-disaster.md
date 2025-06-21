---
layout: post
title: "Docker Swarm Disaster: When Containers Go Rogue"
date: 2024-12-15 03:42:00 -0000
categories: lab-logs
tags: [docker, swarm, disaster-recovery, 3am-debugging]
description: "A harrowing tale of Docker Swarm chaos at 3 AM, featuring cascading failures, mystery containers, and the therapeutic power of coffee."
status: "RESOLVED (barely)"
---

## 03:00 - The Incident

```bash
[2024-12-15 03:00:47] CRITICAL: docker-swarm-01 - Multiple service failures detected
[2024-12-15 03:00:48] CRITICAL: docker-swarm-02 - Node unreachable
[2024-12-15 03:00:49] WARNING: docker-swarm-03 - High memory usage: 94%
```

Nothing says "great Saturday night" like your monitoring system screaming at 3 AM. What started as a simple container deployment turned into a full-scale digital disaster movie.

## The Investigation

### Initial Assessment
```bash
mayor@docker-swarm-01:~$ docker service ls
ID             NAME                MODE         REPLICAS   IMAGE                    PORTS
ERROR: Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

Perfect. The Docker daemon decided to take an unscheduled vacation. Time for some percussive maintenance on the distributed system.

### Node Status Check
```bash
mayor@docker-swarm-manager:~$ docker node ls
ID                            HOSTNAME       STATUS    AVAILABILITY   MANAGER STATUS
7s8df9s8df9s8df9s8df9s8df9    swarm-01      Down      Active         
2k3j4k2j34k2j34k2j34k2j34    swarm-02      Ready     Active         Leader
5m6n5m6n5m6n5m6n5m6n5m6n     swarm-03      Ready     Active         
```

One node down, but at least the manager is still breathing. Let's see what chaos the containers have unleashed.

## The Plot Thickens

### Memory Investigation
Turns out, one of the containers decided it needed ALL the RAM. Like, literally all of it.

```bash
CONTAINER ID   NAME                   CPU %     MEM USAGE / LIMIT     MEM %
a1b2c3d4e5f6   data-processor_1       0.50%     15.8GiB / 16.0GiB     98.75%
```

A runaway data processing job was trying to process the entire internet. Noble goal, questionable execution.

### The Fix
1. **Kill the Memory Hog**
   ```bash
   docker kill a1b2c3d4e5f6
   # Sometimes you gotta be ruthless
   ```

2. **Restart the Down Node**
   ```bash
   # Drive to basement server room at 3:30 AM
   # Press the power button (classic IT solution)
   # Wait for boot sequence while questioning life choices
   ```

3. **Rebalance Services**
   ```bash
   docker service update --force data-processor
   # Let Docker figure out where things should go this time
   ```

## Lessons Learned

1. **Resource Limits Are Not Suggestions**: Always set memory limits on containers. Docker is surprisingly eager to give a container all available resources.

2. **3 AM is Not Debugging Time**: But sometimes the servers don't care about your sleep schedule.

3. **Monitoring Is Life**: Shoutout to Prometheus for waking me up before everything caught fire.

4. **Coffee Is Essential**: Consumed approximately 47 cups during this incident.

## The Resolution

```bash
[2024-12-15 04:23:12] INFO: All services restored
[2024-12-15 04:23:13] INFO: Swarm cluster stable
[2024-12-15 04:23:14] INFO: mayor going back to bed
```

## Prevention Measures

Added to the ever-growing list of "things to do Monday":

- [ ] Implement proper resource quotas
- [ ] Set up automated container restart policies  
- [ ] Install better monitoring for runaway processes
- [ ] Buy more coffee
- [ ] Consider a career in something less chaotic (lol, as if)

## Technical Details

### Container Resource Configuration
```yaml
# docker-compose.yml - The updated, safer version
version: '3.8'
services:
  data-processor:
    image: data-processor:latest
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 4G
        reservations:
          cpus: '1.0'
          memory: 2G
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
```

### Monitoring Improvements
Added Prometheus alerts for:
- Memory usage > 80%
- CPU usage > 85% sustained for 5 minutes
- Container restart loops
- Node disconnections

## Aftermath

System has been stable for 48 hours now. The rogue container has been containerized (see what I did there?) with proper resource limits. Sleep has been resumed.

**Status**: ✅ RESOLVED  
**Downtime**: 1 hour 23 minutes  
**Coffee Consumed**: Too much  
**Lessons Learned**: Priceless  

---

*Next time: "Why I thought running a Kubernetes cluster on Raspberry Pis was a good idea"*
