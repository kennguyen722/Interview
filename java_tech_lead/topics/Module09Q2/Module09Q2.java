public class Module09Q2 {
    public static String health() {
        // check relevant subsystems; here simplified
        return "OK";
    }
    public static void main(String[] args) { System.out.println("health=" + health()); }
}
