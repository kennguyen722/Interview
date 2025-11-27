class FakeRepo implements java.util.function.Supplier<String> { public String get(){ return "fake"; }}

public class Module07Q2 {
    public static void main(String[] args){
        FakeRepo r = new FakeRepo();
        System.out.println("from fake repo: " + r.get());
    }
}
