public class Module05Q2 {
    public static void main(String[] args) {
        handle("v1", "data");
        handle("v2", "data");
    }

    static void handle(String version, String payload) {
        switch(version) {
            case "v1": System.out.println("handled by v1: " + payload); break;
            case "v2": System.out.println("handled by v2: " + payload); break;
            default: System.out.println("unknown version");
        }
    }
}
