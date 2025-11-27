// Simple saga orchestrator with compensation support.
import java.util.*;import java.util.function.*;
public class Solution {
  static class SagaStep { Supplier<Boolean> action; Runnable compensation; SagaStep(Supplier<Boolean>a,Runnable c){action=a;compensation=c;} }
  static class Saga {
    private final List<SagaStep> steps = new ArrayList<>();
    void add(SagaStep s){ steps.add(s); }
    boolean run(){ List<SagaStep> executed = new ArrayList<>();
      for(SagaStep s: steps){ if(Boolean.TRUE.equals(s.action.get())){ executed.add(s);} else { for(int i=executed.size()-1;i>=0;i--) executed.get(i).compensation.run(); return false; } }
      return true;
    }
  }
  public static void main(String[] a){
    Saga saga = new Saga();
    saga.add(new SagaStep(() -> { System.out.println("Reserve inventory"); return true; }, ()-> System.out.println("Release inventory")));
    saga.add(new SagaStep(() -> { System.out.println("Charge payment"); return true; }, ()-> System.out.println("Refund payment")));
    saga.add(new SagaStep(() -> { System.out.println("Update shipping"); return false; }, ()-> System.out.println("Revert shipping")));
    System.out.println("Saga result="+saga.run());
  }
}
