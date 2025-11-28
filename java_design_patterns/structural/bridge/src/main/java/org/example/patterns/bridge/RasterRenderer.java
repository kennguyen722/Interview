package org.example.patterns.bridge;

public class RasterRenderer implements Renderer {
    @Override
    public void renderCircle(float x, float y, float radius) {
        System.out.printf("Raster: circle at (%.2f, %.2f) r=%.2f%n", x, y, radius);
    }
}
