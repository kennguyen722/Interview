import java.util.concurrent.atomic.AtomicReference;

public class Module02Q3 {
    static class MutableHolder { int v; }

    public static void main(String[] args) {
        AtomicReference<MutableHolder> ref = new AtomicReference<>(new MutableHolder());
        MutableHolder m = ref.get();
        m.v = 1; // mutate before publication
        ref.set(m); // atomic publish
        MutableHolder seen = ref.get();
        System.out.println("seen.v=" + seen.v);
    }
}
