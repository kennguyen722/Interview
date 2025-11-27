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
