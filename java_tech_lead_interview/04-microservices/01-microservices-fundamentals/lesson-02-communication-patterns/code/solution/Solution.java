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
