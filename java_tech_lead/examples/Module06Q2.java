import java.util.ArrayList;
import java.util.List;

public class Module06Q2 {
    static void naiveProcess(List<Integer> items) {
        for (Integer i : items) { slow(i); }
    }
    static void batchedProcess(List<Integer> items) {
        int batch = 10;
        for (int i = 0; i < items.size(); i += batch) {
            int end = Math.min(i + batch, items.size());
            for (int j = i; j < end; j++) slow(items.get(j));
        }
    }
    static void slow(Integer i) { try { Thread.sleep(1); } catch (InterruptedException ignored) {} }

    public static void main(String[] args) {
        List<Integer> items = new ArrayList<>();
        for (int i=0;i<100;i++) items.add(i);
        long t = System.currentTimeMillis(); naiveProcess(items); System.out.println("naive=" + (System.currentTimeMillis()-t));
        t = System.currentTimeMillis(); batchedProcess(items); System.out.println("batched=" + (System.currentTimeMillis()-t));
    }
}
