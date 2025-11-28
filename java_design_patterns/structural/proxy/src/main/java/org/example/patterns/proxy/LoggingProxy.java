package org.example.patterns.proxy;

public class LoggingProxy implements Service {
    private final Service delegate;
    public LoggingProxy(Service delegate) { this.delegate = delegate; }

    @Override
    public String execute(String input) {
        System.out.println("[Proxy] Input: " + input);
        String result = delegate.execute(input);
        System.out.println("[Proxy] Output: " + result);
        return result;
    }
}
