# Answer Code Sample - Lesson 8.3: Kubernetes Fundamentals

## Java Answer (Complete Runnable)

~~~java
/**
 * Lesson 8.3 - Kubernetes Fundamentals
 *
 * KEY TERMS:
 *   Pod          - smallest deployable unit; wraps 1-N containers.
 *   Deployment   - declarative desired-state for a set of Pods.
 *   Service      - stable DNS name + load balancer over Pod IPs.
 *   Ingress      - HTTP(S) gateway routing external traffic to Services.
 *   ConfigMap    - non-sensitive key-value configuration.
 *   Secret       - sensitive data stored base64-encoded in etcd.
 *   HPA          - Horizontal Pod Autoscaler; scales replicas by CPU/memory.
 *   probe        - liveness (restart on fail) / readiness (remove from LB).
 */
public class AnswerApp {
    public static void main(String[] args) {
        System.out.println("=== Lesson 8.3: Kubernetes Fundamentals ===\n");

        System.out.println("--- deployment.yaml ---");
        System.out.println("  apiVersion: apps/v1");
        System.out.println("  kind: Deployment");
        System.out.println("  metadata: { name: backend }");
        System.out.println("  spec:");
        System.out.println("    replicas: 3");
        System.out.println("    selector: { matchLabels: { app: backend } }");
        System.out.println("    template:");
        System.out.println("      metadata: { labels: { app: backend } }");
        System.out.println("      spec:");
        System.out.println("        containers:");
        System.out.println("          - name: backend");
        System.out.println("            image: myregistry/backend:v1.2.3");
        System.out.println("            ports: [ { containerPort: 8080 } ]");
        System.out.println("            resources:");
        System.out.println("              requests: { cpu: 250m, memory: 256Mi }");
        System.out.println("              limits:   { cpu: 500m, memory: 512Mi }");
        System.out.println("            livenessProbe:");
        System.out.println("              httpGet: { path: /actuator/health, port: 8080 }");
        System.out.println("              initialDelaySeconds: 30");
        System.out.println("            readinessProbe:");
        System.out.println("              httpGet: { path: /actuator/health/readiness, port: 8080 }");

        System.out.println("\n--- service.yaml ---");
        System.out.println("  apiVersion: v1");
        System.out.println("  kind: Service");
        System.out.println("  metadata: { name: backend-svc }");
        System.out.println("  spec:");
        System.out.println("    selector: { app: backend }");
        System.out.println("    ports: [ { port: 80, targetPort: 8080 } ]");
        System.out.println("    type: ClusterIP");

        System.out.println("\n--- Rolling update + rollback ---");
        System.out.println("  strategy:");
        System.out.println("    type: RollingUpdate");
        System.out.println("    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }");
        System.out.println("\n  kubectl set image deploy/backend backend=myregistry/backend:v1.3.0");
        System.out.println("  kubectl rollout status deploy/backend");
        System.out.println("  kubectl rollout undo   deploy/backend   # instant rollback");

        System.out.println("\n--- Key kubectl commands ---");
        String[][] cmds = {
            {"kubectl get pods -n app",               "List running pods"},
            {"kubectl logs backend-xxx --tail=50",    "Tail container logs"},
            {"kubectl exec -it backend-xxx -- bash",  "Shell into running container"},
            {"kubectl describe pod backend-xxx",      "Full pod events and conditions"},
            {"kubectl top pods",                      "CPU/memory usage per pod"}
        };
        for (String[] c : cmds)
            System.out.printf("  %-45s  %s%n", c[0], c[1]);
    }
}
~~~
