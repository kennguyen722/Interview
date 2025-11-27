# Script: enrich-microservices-code.ps1
# Purpose: Replace placeholder Solution.java files in microservices fundamentals lessons with domain-specific illustrative code.
# Usage:
#  powershell.exe -ExecutionPolicy Bypass -File scripts/enrich-microservices-code.ps1

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$fundamentalsPath = Join-Path $root '04-microservices/01-microservices-fundamentals'

if(-not (Test-Path $fundamentalsPath)){
  Write-Host "Fundamentals path not found: $fundamentalsPath" -ForegroundColor Red
  exit 1
}

$mapping = @{
  'lesson-01-api-gateway' = @'
// Demonstrates simple API Gateway routing & fallback.
import java.util.*;
import java.util.function.Supplier;
public class Solution {
  static class ApiGateway {
    private final Map<String, Supplier<String>> routes = new HashMap<>();
    public ApiGateway(){
      routes.put("/price", () -> "PRICE_OK");
      routes.put("/inventory", () -> "INV_OK");
      routes.put("/health", () -> "UP");
    }
    public String dispatch(String path){
      return routes.getOrDefault(path, () -> "404_NOT_FOUND").get();
    }
  }
  public static void main(String[] args){
    ApiGateway gw = new ApiGateway();
    System.out.println(gw.dispatch("/price"));
    System.out.println(gw.dispatch("/unknown"));
  }
}
'@
  'lesson-01-service-decomposition' = @'
// Illustrates service decomposition and internal dependency.
public class Solution {
  interface OrderService { boolean placeOrder(String sku); }
  static class InventoryService { boolean reserve(String sku){ return true; } }
  static class OrderServiceImpl implements OrderService {
    private final InventoryService inv = new InventoryService();
    public boolean placeOrder(String sku){ return inv.reserve(sku); }
  }
  public static void main(String[] args){
    OrderService svc = new OrderServiceImpl();
    System.out.println("Order result=" + svc.placeOrder("ABC-123"));
  }
}
'@
  'lesson-02-communication-patterns' = @'
// Compares synchronous vs asynchronous communication simulation.
import java.util.concurrent.*;
public class Solution {
  static String syncCall(){ try { Thread.sleep(200); } catch(Exception ignored){} return "SYNC_OK"; }
  static CompletableFuture<String> asyncCall(){ return CompletableFuture.supplyAsync(() -> { try { Thread.sleep(200); } catch(Exception ignored){} return "ASYNC_OK"; }); }
  public static void main(String[] args){
    long t1 = System.currentTimeMillis();
    String s1 = syncCall(); String s2 = syncCall();
    long syncElapsed = System.currentTimeMillis()-t1;
    long t2 = System.currentTimeMillis();
    CompletableFuture<String> a1 = asyncCall(); CompletableFuture<String> a2 = asyncCall();
    String r = a1.thenCombine(a2,(x,y)-> x+"+"+y).join();
    long asyncElapsed = System.currentTimeMillis()-t2;
    System.out.println(s1+","+s2+" syncElapsed="+syncElapsed);
    System.out.println(r+" asyncElapsed="+asyncElapsed);
  }
}
'@
  'lesson-02-saga-pattern' = @'
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
'@
  'lesson-03-data-management' = @'
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
'@
  'lesson-03-outbox-pattern' = @'
// Outbox pattern: staging events for reliable publishing.
import java.util.*;import java.util.stream.*;
public class Solution {
  static class OutboxRecord { String id; String payload; boolean published; OutboxRecord(String id,String p){this.id=id;this.payload=p;} }
  static class OutboxRepository { private final List<OutboxRecord> store = new ArrayList<>(); void add(String p){ store.add(new OutboxRecord(UUID.randomUUID().toString(),p)); } List<OutboxRecord> pending(){ return store.stream().filter(r->!r.published).toList(); } void markPublished(OutboxRecord r){ r.published=true; } }
  public static void main(String[] args){
    OutboxRepository repo = new OutboxRepository(); repo.add("event:order.created"); repo.add("event:order.paid");
    for(OutboxRecord r: repo.pending()){ System.out.println("Publishing " + r.payload); repo.markPublished(r); }
    System.out.println("Remaining=" + repo.pending().size());
  }
}
'@
  'lesson-04-cqrs' = @'
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
'@
  'lesson-04-deployment-strategies' = @'
// Deployment strategies enumeration and demo usage.
public class Solution {
  enum Strategy { BLUE_GREEN, CANARY, ROLLING }
  static String describe(Strategy s){ return switch(s){
    case BLUE_GREEN -> "Two environments; switch traffic after verification.";
    case CANARY -> "Gradually expose new version to % of users.";
    case ROLLING -> "Replace instances incrementally with zero downtime."; }; }
  public static void main(String[] args){ for(Strategy s: Strategy.values()) System.out.println(s+": "+describe(s)); }
}
'@
  'lesson-05-service-discovery' = @'
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
'@
}

$lessons = Get-ChildItem -Path $fundamentalsPath -Directory -Filter 'lesson-*'
foreach($lesson in $lessons){
  $solutionPath = Join-Path $lesson.FullName 'code/solution/Solution.java'
  if(-not (Test-Path $solutionPath)){ Write-Host "Missing Solution.java: $($lesson.Name)" -ForegroundColor Yellow; continue }
  $current = Get-Content -Raw $solutionPath
  if($current -match 'initial placeholder'){
    if($mapping.ContainsKey($lesson.Name)){
      $mapping[$lesson.Name] | Set-Content -Path $solutionPath
      Write-Host "Enriched: $($lesson.Name)" -ForegroundColor Green
    } else {
      Write-Host "No mapping for $($lesson.Name)" -ForegroundColor DarkYellow
    }
  } else {
    Write-Host "Skipped (already enriched): $($lesson.Name)" -ForegroundColor Cyan
  }
}
Write-Host 'Microservices fundamentals code enrichment complete.' -ForegroundColor Magenta
