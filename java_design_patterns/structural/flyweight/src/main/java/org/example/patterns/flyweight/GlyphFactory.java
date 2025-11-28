package org.example.patterns.flyweight;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class GlyphFactory {
    private final Map<Character, Glyph> cache = new ConcurrentHashMap<>();

    public Glyph get(char symbol) {
        return cache.computeIfAbsent(symbol, ConcreteGlyph::new);
    }
}
