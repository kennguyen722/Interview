# Module 8 Solution - DevOps and Platform Engineering

Production platform baseline for lessons 8.1 through 8.5.

## Lesson Coverage

- 8.1 Docker for Java and Frontend
  - Multi-stage Dockerfiles for backend and frontend.
- 8.2 CI/CD Pipelines
  - GitHub Actions workflow with backend/frontend builds, tests, lint, and security scan.
- 8.3 Kubernetes Fundamentals
  - Base deployments, services, ingress, and dev overlay using Kustomize.
- 8.4 Observability and SRE Basics
  - Prometheus scrape config and Grafana provisioning with starter dashboard.
- 8.5 Performance and Capacity Planning
  - k6 smoke script with latency and error thresholds.

## Runbook

1. Local containers:

```bash
docker compose up -d --build
```

2. Apply Kubernetes (kind or minikube):

```bash
kubectl apply -k k8s/overlays/dev
```

3. Run load test:

```bash
k6 run performance/k6/smoke.js
```

## Notes

- Backend image assumes Module 6 source as build context.
- Frontend image assumes Module 7 source as build context.
- Prometheus expects backend `/actuator/prometheus` endpoint to be enabled.
