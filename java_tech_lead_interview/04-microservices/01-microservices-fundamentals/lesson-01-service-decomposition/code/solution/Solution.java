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
