public class Module03Q1 {
    static class Obj { int[] data = new int[1000]; }
    public static void main(String[] args) {
        Obj o = new Obj();
        foo(o);
        System.out.println("object still referenced on heap: " + o);
    }
    static void foo(Obj x) {
        int local = 5; // stored on stack in frame
        System.out.println("local=" + local + " x=" + x);
    }
}
