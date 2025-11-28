package org.example.patterns.singleton;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enum-based Singleton.
 * Simplest and serialization-safe.
 */
public enum ConfigSingletonEnum {
    INSTANCE;
    private final Map<String, String> config = new ConcurrentHashMap<>();
    ConfigSingletonEnum() {
        config.put("env", "prod-enum");
    }
    public String getValue(String key) { return config.get(key); }
    public void setValue(String key, String value) { config.put(key, value); }
}
