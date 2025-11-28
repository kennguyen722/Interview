package org.example.patterns.singleton;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Eager Singleton: instance created at class-load time.
 * Pros: simple, thread-safe by JVM class initialization; Cons: not lazy.
 */
public final class ConfigSingletonEager {
    private static final ConfigSingletonEager INSTANCE = new ConfigSingletonEager();
    private final Map<String, String> config = new ConcurrentHashMap<>();

    private ConfigSingletonEager() {
        // Simulate loading config defaults
        config.put("env", "prod");
        config.put("featureX", "enabled");
    }

    public static ConfigSingletonEager getInstance() { return INSTANCE; }

    public String getValue(String key) { return config.get(key); }

    public void setValue(String key, String value) { config.put(key, value); }
}
