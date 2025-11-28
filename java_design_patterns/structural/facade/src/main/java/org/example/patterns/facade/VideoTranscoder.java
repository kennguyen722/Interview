package org.example.patterns.facade;

public class VideoTranscoder {
    public byte[] transcode(byte[] frames, String format) {
        System.out.println("Transcoding to format " + format);
        return frames;
    }
}
