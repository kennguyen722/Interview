public class Module08Q1 {
    interface Dao { String findById(String id); }
    static class InMemoryDao implements Dao { public String findById(String id){ return "row:" + id; } }

    public static void main(String[] args){
        Dao dao = new InMemoryDao();
        System.out.println(dao.findById("123"));
    }
}
