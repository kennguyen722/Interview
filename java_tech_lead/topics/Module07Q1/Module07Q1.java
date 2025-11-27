interface Repo { String getData(); }
class ProdRepo implements Repo { public String getData(){ return "real"; }}

public class Module07Q1 {
    private final Repo repo;
    public Module07Q1(Repo repo){ this.repo = repo; }
    public String produce() { return "value:" + repo.getData(); }

    public static void main(String[] args){
        Module07Q1 m = new Module07Q1(new ProdRepo());
        System.out.println(m.produce());
    }
}
