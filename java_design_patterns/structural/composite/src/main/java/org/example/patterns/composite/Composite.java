package org.example.patterns.composite;

import java.util.ArrayList;
import java.util.List;

public class Composite implements Component {
    private final List<Component> children = new ArrayList<>();

    public Composite add(Component c) { children.add(c); return this; }

    @Override
    public int getSize() {
        return children.stream().mapToInt(Component::getSize).sum();
    }
}
