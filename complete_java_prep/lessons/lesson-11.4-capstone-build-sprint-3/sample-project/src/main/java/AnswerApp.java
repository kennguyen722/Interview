/**
 * Lesson 11.4 - Capstone Build Sprint 3 (Deployment + Load Test + Hardening)
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 11.4: Capstone Sprint 3 - Deployment + Load Test + Hardening ===\n");

        System.out.println("--- Sprint 3 acceptance criteria ---");
        String[] criteria = {
            "Kubernetes: deployment.yaml, service.yaml, ingress.yaml, configmap.yaml",
            "HPA scales backend between 2-5 replicas based on CPU",
            "k6 load test: 100 RPS for 3 minutes, p99 < 200ms, error rate < 0.1%",
            "OWASP dependency-check: no critical CVEs in dependencies",
            "TLS certificate on Ingress (self-signed for local cluster)",
            "Three ADRs: DB choice, auth strategy, event bus approach",
            "Runbook: startup, health check, rollback, scale-up procedure"
        };
        for (String c : criteria) System.out.println("  [ ] " + c);

        System.out.println("\n--- k6 load test script (k6-script.js) ---");
        System.out.println("  import http from 'k6/http';");
        System.out.println("  export const options = {");
        System.out.println("    stages: [");
        System.out.println("      { duration: '30s', target: 50  },  // ramp up");
        System.out.println("      { duration: '2m',  target: 100 },  // hold");
        System.out.println("      { duration: '30s', target: 0   }   // ramp down");
        System.out.println("    ],");
        System.out.println("    thresholds: {");
        System.out.println("      http_req_duration: ['p(99)<200'],");
        System.out.println("      http_req_failed:   ['rate<0.001']");
        System.out.println("    }");
        System.out.println("  };");
        System.out.println("  export default function () {");
        System.out.println("    http.get('http://api.example.com/api/books');");
        System.out.println("  }");

        System.out.println("\n--- HPA manifest ---");
        System.out.println("  apiVersion: autoscaling/v2");
        System.out.println("  kind: HorizontalPodAutoscaler");
        System.out.println("  spec:");
        System.out.println("    scaleTargetRef: { kind: Deployment, name: backend }");
        System.out.println("    minReplicas: 2");
        System.out.println("    maxReplicas: 5");
        System.out.println("    metrics:");
        System.out.println("      - type: Resource");
        System.out.println("        resource: { name: cpu, target: { type: Utilization, averageUtilization: 60 } }");
    }
}