package org.example.patterns.chain;

public class Request {
    public String payload;
    public boolean authenticated;
    public Request(String payload) { this.payload = payload; }
}
