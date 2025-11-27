public class Module09Q3 {
    public static boolean layer1(String in){ return in != null; }
    public static boolean layer2(String in){ return in.length() > 0; }
    public static void main(String[] args){
        String input = "ok";
        if (layer1(input) && layer2(input)) System.out.println("passed layered checks");
    }
}
