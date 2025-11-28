package org.example.patterns.objectpool;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.function.Supplier;

public class ObjectPool<T> {
    private final Deque<T> idle = new ArrayDeque<>();
    private final Supplier<T> creator;
    public ObjectPool(Supplier<T> creator){ this.creator = creator; }
    public T borrow(){ return idle.isEmpty() ? creator.get() : idle.pop(); }
    public void release(T obj){ idle.push(obj); }
    public int size(){ return idle.size(); }
}
