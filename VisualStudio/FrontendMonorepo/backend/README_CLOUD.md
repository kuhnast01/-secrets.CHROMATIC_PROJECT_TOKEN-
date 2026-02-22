# Cloud & Scaling Best Practices

- Use `/healthz` for liveness/readiness probes in Docker/Kubernetes.
- Use stateless app design (no local file/session storage).
- Use managed Postgres (e.g., AWS RDS, Azure, GCP) for production.
- Use a CDN for static assets (e.g., Cloudflare, AWS CloudFront).
- Use environment variables for all config/secrets.
- Enable horizontal scaling (multiple containers/VMs).
- Use centralized logging (e.g., Datadog, CloudWatch, ELK).
- Set up monitoring/alerting (e.g., Sentry, Prometheus).
- Use HTTPS everywhere in production.
