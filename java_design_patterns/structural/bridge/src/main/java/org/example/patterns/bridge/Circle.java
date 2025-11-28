package org.example.patterns.bridge;

public class Circle extends Shape {
    private final float x;
    private final float y;
    private final float radius;

    public Circle(Renderer renderer, float x, float y, float radius) {
        super(renderer);
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    @Override
    public void draw() {
        renderer.renderCircle(x, y, radius);
    }
}
