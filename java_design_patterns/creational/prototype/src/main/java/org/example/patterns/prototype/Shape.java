package org.example.patterns.prototype;

public class Shape implements Prototype<Shape> {
    private final String type; private final int size;
    public Shape(String type, int size){ this.type=type; this.size=size; }
    @Override public Shape copy(){ return new Shape(type,size); }
    public String type(){ return type; }
    public int size(){ return size; }
}
