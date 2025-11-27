final class ImmutablePoint {
    private final int x;
    private final int y;

    public ImmutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() { return x; }
    public int getY() { return y; }
}

public class Module01Q2 {
    public static void main(String[] args) {
        ImmutablePoint p = new ImmutablePoint(3, 4);
        System.out.println("x=" + p.getX() + " y=" + p.getY());
    }
}
