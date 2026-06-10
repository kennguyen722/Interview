import java.util.LinkedHashMap;
import java.util.Map;

public class AnswerApp {
    record Task(String id, String title, boolean done) {}

    static final class TaskApi {
        private final Map<String, Task> store = new LinkedHashMap<>();

        Task create(String id, String title) {
            validateId(id);
            validateTitle(title);
            if (store.containsKey(id)) {
                throw new IllegalArgumentException("409 CONFLICT: id already exists");
            }
            Task task = new Task(id, title.trim(), false);
            store.put(id, task);
            return task;
        }

        Task markDone(String id) {
            Task existing = store.get(id);
            if (existing == null) {
                throw new IllegalArgumentException("404 NOT FOUND: task not found");
            }
            Task updated = new Task(existing.id(), existing.title(), true);
            store.put(id, updated);
            return updated;
        }

        void validateId(String id) {
            if (id == null || id.isBlank()) {
                throw new IllegalArgumentException("400 BAD REQUEST: id is required");
            }
        }

        void validateTitle(String title) {
            if (title == null || title.isBlank()) {
                throw new IllegalArgumentException("400 BAD REQUEST: title is required");
            }
            if (title.length() > 120) {
                throw new IllegalArgumentException("400 BAD REQUEST: title too long");
            }
        }
    }

    public static void main(String[] args) {
        TaskApi api = new TaskApi();
        System.out.println("Lesson 4.2 - REST API behavior simulation");
        System.out.println("POST /tasks => " + api.create("t-1", "Write controller + DTO + validator"));
        System.out.println("PATCH /tasks/t-1/done => " + api.markDone("t-1"));
    }
}
