public class Module04Q3 {
    static class ReplicatedValue {
        volatile int value;
        long version;
    }

    public static void main(String[] args) {
        ReplicatedValue a = new ReplicatedValue();
        ReplicatedValue b = new ReplicatedValue();
        // simple manual reconciliation: pick highest version
        a.value = 1; a.version = 1;
        b.value = 2; b.version = 2;
        ReplicatedValue resolved = (a.version >= b.version) ? a : b;
        System.out.println("resolved value=" + resolved.value);
    }
}
