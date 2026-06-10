package com.interview.module2;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class InMemoryRepository<T> {

    private final CopyOnWriteArrayList<T> items = new CopyOnWriteArrayList<>();

    public void save(T item) {
        items.add(item);
    }

    public List<T> findAll() {
        return new ArrayList<>(items);
    }
}
