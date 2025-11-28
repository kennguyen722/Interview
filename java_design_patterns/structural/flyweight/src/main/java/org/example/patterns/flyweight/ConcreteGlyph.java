package org.example.patterns.flyweight;

public class ConcreteGlyph implements Glyph {
    private final char symbol;

    public ConcreteGlyph(char symbol) { this.symbol = symbol; }

    @Override
    public void draw(int x, int y) {
        System.out.printf("Glyph '%c' at (%d,%d)%n", symbol, x, y);
    }
}
