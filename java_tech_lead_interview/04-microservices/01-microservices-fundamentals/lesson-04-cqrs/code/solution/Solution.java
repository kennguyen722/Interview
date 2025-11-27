// CQRS: separate command & query concerns.
import java.math.BigDecimal;import java.util.*;
public class Solution {
  interface Command { }
  static class UpdatePrice implements Command { String sku; BigDecimal price; UpdatePrice(String s,BigDecimal p){sku=s;price=p;} }
  interface CommandHandler<C extends Command>{ void handle(C c); }
  interface Query<R>{ }
  static class PriceQuery implements Query<BigDecimal>{ String sku; PriceQuery(String s){sku=s;} }
  static class PriceStore { Map<String,BigDecimal> map = new HashMap<>(); }
  static class UpdatePriceHandler implements CommandHandler<UpdatePrice>{ PriceStore store; UpdatePriceHandler(PriceStore s){store=s;} public void handle(UpdatePrice c){ store.map.put(c.sku,c.price);} }
  static BigDecimal handleQuery(PriceStore store, PriceQuery q){ return store.map.get(q.sku); }
  public static void main(String[] args){
    PriceStore st = new PriceStore(); UpdatePriceHandler h = new UpdatePriceHandler(st); h.handle(new UpdatePrice("SKU1", new BigDecimal("9.99")));
    System.out.println("Price="+ handleQuery(st,new PriceQuery("SKU1"))); }
}
