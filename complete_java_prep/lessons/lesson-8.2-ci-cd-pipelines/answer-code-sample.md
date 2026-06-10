# Answer Code Sample - Lesson 8.2: CI/CD Pipelines

## Java Answer (Complete Runnable)

~~~java
import java.util.LinkedHashMap;
import java.util.Map;

public class AnswerApp {
    public static void main(String[] args) {
        Map<String, Boolean> stages = new LinkedHashMap<>();
        stages.put("lint", true);
        stages.put("unit-test", true);
        stages.put("security-scan", true);
        stages.put("package", true);
        stages.put("integration-test", false);
        stages.put("publish-artifact", true);

        System.out.println("Lesson 8.2 - CI/CD pipeline quality gates simulation");

        boolean canDeploy = true;
        for (Map.Entry<String, Boolean> stage : stages.entrySet()) {
            System.out.printf("%-18s => %s%n", stage.getKey(), stage.getValue() ? "PASS" : "FAIL");
            if (!stage.getValue()) {
                canDeploy = false;
                break;
            }
        }

        System.out.println("Deployment allowed: " + canDeploy);
    }
}

~~~
