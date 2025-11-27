public class Example_Prompt2_PrimitiveVsReference {
    public static void main(String[] args) {
        int a = 5; // primitive, value copied
        int b = a;
        b = 7;
        System.out.println("a=" + a + " b=" + b);

        String s1 = "hello"; // reference to String object
        String s2 = s1;
        s2 = s2.toUpperCase();
        System.out.println("s1=" + s1 + " s2=" + s2);

        StringBuilder sb1 = new StringBuilder("x");
        StringBuilder sb2 = sb1; // both reference same object
        sb2.append("y");
        System.out.println("sb1=" + sb1 + " sb2=" + sb2);
    }
}
