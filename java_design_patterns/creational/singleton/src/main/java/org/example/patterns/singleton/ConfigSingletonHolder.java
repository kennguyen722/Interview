package org.example.patterns.singleton;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Lazy Holder Singleton (Initialization-on-demand holder idiom).
 * Thread-safe without synchronization; instance created when first accessed.
 */
public final class ConfigSingletonHolder {
    private final Map<String, String> config = new ConcurrentHashMap<>();

    private ConfigSingletonHolder() {
        config.put("env", "dev");
        config.put("featureX", "disabled");
    }

    private static class Holder { static final ConfigSingletonHolder INSTANCE = new ConfigSingletonHolder(); }

    public static ConfigSingletonHolder getInstance() { return Holder.INSTANCE; }

    public String getValue(String key) { return config.get(key); }

    public void setValue(String key, String value) { config.put(key, value); }
}
