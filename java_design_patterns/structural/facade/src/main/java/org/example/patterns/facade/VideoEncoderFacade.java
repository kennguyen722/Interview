package org.example.patterns.facade;

public class VideoEncoderFacade {
    private final VideoLoader loader = new VideoLoader();
    private final VideoTranscoder transcoder = new VideoTranscoder();
    private final VideoSaver saver = new VideoSaver();

    public void encode(String inputPath, String outputPath, String format) {
        byte[] frames = loader.load(inputPath);
        byte[] encoded = transcoder.transcode(frames, format);
        saver.save(outputPath, encoded);
    }
}
