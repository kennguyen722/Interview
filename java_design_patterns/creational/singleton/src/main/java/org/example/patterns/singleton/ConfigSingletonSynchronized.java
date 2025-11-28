package org.example.patterns.singleton;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Synchronized accessor Singleton.
 * Simple but has synchronization cost on every access.
 */
public final class ConfigSingletonSynchronized {
    private static ConfigSingletonSynchronized instance;
    private final Map<String, String> config = new ConcurrentHashMap<>();

    private ConfigSingletonSynchronized() {
        config.put("env", "test");
    }

    public static synchronized ConfigSingletonSynchronized getInstance() {
        if(instance == null) instance = new ConfigSingletonSynchronized();
        return instance;
    }

    public String getValue(String key) { return config.get(key); }

    public void setValue(String key, String value) { config.put(key, value); }
}
