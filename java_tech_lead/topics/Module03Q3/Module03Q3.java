import java.util.ArrayList;
import java.util.List;

public class Module03Q3 {
    public static void main(String[] args) {
        List<Object> survivors = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            if (i % 100 == 0) survivors.add(new byte[1024]); // long lived
            else new byte[1024]; // short lived
        }
        System.out.println("Created mix of short- and long-lived objects");
    }
}
