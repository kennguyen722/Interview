package org.example.patterns.iterator;

import java.util.ArrayList;
import java.util.List;

public class TreeNode {
    public final String value;
    public final List<TreeNode> children = new ArrayList<>();
    public TreeNode(String value) { this.value = value; }
    public TreeNode add(TreeNode child) { children.add(child); return this; }
}
