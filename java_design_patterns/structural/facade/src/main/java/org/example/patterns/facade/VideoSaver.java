package org.example.patterns.facade;

public class VideoSaver {
    public void save(String path, byte[] data) {
        System.out.println("Saving video to " + path + " (" + data.length + " bytes)");
    }
}
