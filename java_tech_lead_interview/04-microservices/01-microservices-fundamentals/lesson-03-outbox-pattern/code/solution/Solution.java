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
