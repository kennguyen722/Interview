package org.example.patterns.composite;

public class Leaf implements Component {
    private final int size;
    public Leaf(int size) { this.size = size; }
    @Override public int getSize() { return size; }
}
