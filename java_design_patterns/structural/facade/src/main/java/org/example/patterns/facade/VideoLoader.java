package org.example.patterns.facade;

public class VideoLoader {
    public byte[] load(String path) {
        System.out.println("Loading video from " + path);
        return new byte[0];
    }
}
