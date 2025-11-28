package org.example.patterns.bridge;

public class VectorRenderer implements Renderer {
    @Override
    public void renderCircle(float x, float y, float radius) {
        System.out.printf("Vector: circle at (%.2f, %.2f) r=%.2f%n", x, y, radius);
    }
}
