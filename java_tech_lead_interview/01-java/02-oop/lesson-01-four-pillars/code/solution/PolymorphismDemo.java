public class PolymorphismDemo {
    interface Greeter { String greet(); }
    static class CasualGreeter implements Greeter { public String greet(){ return "Hi"; } }
    static class FormalGreeter implements Greeter { public String greet(){ return "Good day"; } }
    static void run(Greeter g){ System.out.println(g.greet()); }
    public static void main(String[] args){ run(new CasualGreeter()); run(new FormalGreeter()); }
}
