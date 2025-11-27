// Event application to a read model demonstrating eventual consistency.
import java.util.concurrent.*;import java.util.*;
public class Solution {
  static class ReadModel { private final Map<String,Integer> stock = new ConcurrentHashMap<>(); void apply(String sku,int delta){ stock.merge(sku,delta,Integer::sum);} int get(String sku){ return stock.getOrDefault(sku,0);} }
  public static void main(String[] args){
    ReadModel rm = new ReadModel();
    rm.apply("SKU1",5); rm.apply("SKU1",-2); rm.apply("SKU2",10);
    System.out.println("SKU1="+rm.get("SKU1")+" SKU2="+rm.get("SKU2"));
  }
}
