package org.example.patterns.singleton;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Double-Checked Locking (DCL) Singleton.
 * Uses volatile for safe publication; reduces synchronization after init.
 */
public final class ConfigSingletonDcl {
    private static volatile ConfigSingletonDcl instance;
    private final Map<String, String> config = new ConcurrentHashMap<>();

    private ConfigSingletonDcl() {
        config.put("env", "staging");
    }

    public static ConfigSingletonDcl getInstance() {
        ConfigSingletonDcl local = instance;
        if (local == null) {
            synchronized (ConfigSingletonDcl.class) {
                local = instance;
                if (local == null) {
                    local = new ConfigSingletonDcl();
                    instance = local;
                }
            }
        }
        return local;
    }

    public String getValue(String key) { return config.get(key); }

    public void setValue(String key, String value) { config.put(key, value); }
}
