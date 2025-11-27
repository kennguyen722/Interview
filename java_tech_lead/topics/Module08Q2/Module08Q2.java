public class Module08Q2 {
    static int version = 0;
    static String data = "v0";

    // optimistic update pattern
    public static boolean tryUpdate(int expectedVersion, String newData) {
        synchronized (Module08Q2.class) {
            if (version != expectedVersion) return false;
            version++;
            data = newData;
            return true;
        }
    }

    public static void main(String[] args) {
        int observed = version;
        boolean ok = tryUpdate(observed, "v1");
        System.out.println("update ok=" + ok + " newVersion=" + version + " data=" + data);
    }
}
