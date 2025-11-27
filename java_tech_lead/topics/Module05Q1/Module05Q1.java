// Adapter-style pattern: keep calling code unchanged while swapping implementations

interface Service { String doWork(); }
class MonolithService implements Service { public String doWork(){ return "monolith"; }}
class MicroserviceAdapter implements Service { public String doWork(){ return "microservice"; }}

public class Module05Q1 {
    public static void main(String[] args){
        Service s = new MonolithService();
        System.out.println("before: " + s.doWork());
        // swap to microservice adapter
        s = new MicroserviceAdapter();
        System.out.println("after: " + s.doWork());
    }
}
