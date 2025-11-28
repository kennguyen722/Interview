package org.example.patterns.iterator;

import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Iterator;

public class TreeIterator implements Iterator<String> {
    private final Deque<TreeNode> stack = new ArrayDeque<>();

    public TreeIterator(TreeNode root) { stack.push(root); }

    @Override public boolean hasNext() { return !stack.isEmpty(); }

    @Override public String next() {
        TreeNode node = stack.pop();
        for (int i = node.children.size() - 1; i >= 0; i--) {
            stack.push(node.children.get(i));
        }
        return node.value;
    }
}
