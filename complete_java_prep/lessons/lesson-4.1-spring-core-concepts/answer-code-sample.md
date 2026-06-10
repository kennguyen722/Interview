# Answer Code Sample - Lesson 4.1: Spring Core Concepts

## Java Answer (Complete Runnable)

~~~java
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

public class AnswerApp {
    static final class MiniContainer {
        private final Map<Class<?>, Supplier<?>> providers = new HashMap<>();
        <T> void register(Class<T> type, Supplier<T> provider) { providers.put(type, provider); }
        <T> T resolve(Class<T> type) {
            Supplier<?> provider = providers.get(type);
            if (provider == null) {
                throw new IllegalStateException("No provider for type: " + type.getSimpleName());
            }
            return type.cast(provider.get());
        }
    }

    static final class UserRepository {
        String findDisplayNameById(String id) { return "user-" + id; }
    }

    static final class UserService {
        private final UserRepository repository;
        UserService(UserRepository repository) { this.repository = repository; }
        String greeting(String userId) { return "Hello, " + repository.findDisplayNameById(userId) + "!"; }
    }

    public static void main(String[] args) {
        MiniContainer container = new MiniContainer();
        container.register(UserRepository.class, UserRepository::new);
        container.register(UserService.class, () -> new UserService(container.resolve(UserRepository.class)));

        UserService service = container.resolve(UserService.class);
        System.out.println("Lesson 4.1 - IoC/DI simulation");
        System.out.println(service.greeting("42"));
    }
}

~~~
