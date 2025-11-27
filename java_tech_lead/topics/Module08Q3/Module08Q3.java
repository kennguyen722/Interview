public class Module08Q3 {
    // Example: add new nullable column without breaking readers
    static class Record { String id; String name; String newField; }
    public static void main(String[] args) {
        Record r = new Record(); r.id = "1"; r.name = "Alice";
        System.out.println("id=" + r.id + " name=" + r.name + " new=" + r.newField);
    }
}
