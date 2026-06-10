package com.interview.module2;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class MetricsExporter {

    public void exportAsJsonLines(List<MetricEvent> events, Path targetFile) throws IOException {
        List<String> lines = events.stream()
                .map(event -> "{\"service\":\"" + event.service() + "\",\"metric\":\"" + event.metric() + "\",\"value\":" + event.value() + "}")
                .toList();
        Files.createDirectories(targetFile.getParent());
        Files.write(targetFile, lines);
    }
}
