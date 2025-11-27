public class Module09Q1 {
    public static boolean isValidUser(String username) {
        if (username == null) return false;
        if (username.length() < 3 || username.length() > 50) return false;
        return username.matches("[A-Za-z0-9_.-]+");
    }
    public static void main(String[] args) {
        System.out.println(isValidUser("alice_1"));
        System.out.println(isValidUser("<script>bad</script>"));
    }
}
