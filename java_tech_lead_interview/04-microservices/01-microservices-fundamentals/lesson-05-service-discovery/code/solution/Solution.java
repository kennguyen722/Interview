// Simple service registry/discovery simulation.
import java.util.*;import java.util.concurrent.*;
public class Solution {
  static class ServiceRegistry { private final Map<String,List<String>> instances = new ConcurrentHashMap<>();
    void register(String name,String url){ instances.computeIfAbsent(name,k->new ArrayList<>()).add(url);} List<String> discover(String name){ return instances.getOrDefault(name,List.of()); } }
  public static void main(String[] args){
    ServiceRegistry reg = new ServiceRegistry(); reg.register("price","http://price-1"); reg.register("price","http://price-2");
    System.out.println("Price svc instances="+reg.discover("price"));
  }
}
