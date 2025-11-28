package org.example.patterns.proxy;

public class RealService implements Service {
    @Override
    public String execute(String input) {
        return "Processed: " + input;
    }
}
