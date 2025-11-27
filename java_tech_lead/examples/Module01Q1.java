public class Module01Q1 {
    public static void main(String[] args) {
        String a = new String("hello");
        String b = new String("hello");
        System.out.println("a == b: " + (a == b));
        System.out.println("a.equals(b): " + a.equals(b));

        Integer x = 128; // outside cache
        Integer y = 128;
        System.out.println("x == y: " + (x == y));
        System.out.println("x.equals(y): " + x.equals(y));
    }
}
