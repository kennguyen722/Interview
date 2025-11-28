package org.example.patterns.chain;

public abstract class AbstractHandler implements Handler {
    private Handler next;

    @Override
    public Handler linkWith(Handler next) {
        this.next = next;
        return next;
    }

    protected void next(Request request) {
        if (next != null) next.handle(request);
    }
}
