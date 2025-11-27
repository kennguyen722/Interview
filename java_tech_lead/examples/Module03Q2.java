import java.util.ArrayList;
import java.util.List;

public class Module03Q2 {
    static List<byte[]> leak = new ArrayList<>();
    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i < 10; i++) {
            leak.add(new byte[1024 * 1024]); // accumulate 1MB chunks
            System.out.println("added " + (i+1) + "MB");
            Thread.sleep(200);
        }
        System.out.println("done adding — check heap usage for leak pattern");
    }
}
