// @copilot:fill-solution
public class PolymorphismDemo {
    interface Greeter { String greet(); }
    static class CasualGreeter implements Greeter { public String greet(){ return "Hi"; } }
    static class FormalGreeter implements Greeter { public String greet(){ return "Good day"; } }
    public static void main(String[] args){
        Greeter g = Math.random() > .5 ? new CasualGreeter() : new FormalGreeter();
        System.out.println(g.greet());
    }
}
