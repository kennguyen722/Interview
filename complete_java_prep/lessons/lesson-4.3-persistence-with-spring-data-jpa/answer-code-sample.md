# Answer Code Sample - Lesson 4.3: Persistence with Spring Data JPA

## Java Answer (Complete Runnable)

~~~java
import java.util.HashMap;
import java.util.Map;

public class AnswerApp {
    static final class Account {
        private final long id;
        private String owner;
        private long cents;

        Account(long id, String owner, long cents) {
            this.id = id;
            this.owner = owner;
            this.cents = cents;
        }

        long getId() { return id; }
        String getOwner() { return owner; }
        long getCents() { return cents; }
        void add(long amount) { cents += amount; }
    }

    static final class AccountRepository {
        private final Map<Long, Account> table = new HashMap<>();
        Account save(Account account) { table.put(account.getId(), account); return account; }
        Account findById(long id) { return table.get(id); }
    }

    static final class AccountService {
        private final AccountRepository repository;
        AccountService(AccountRepository repository) { this.repository = repository; }

        void transfer(long fromId, long toId, long amount) {
            Account from = repository.findById(fromId);
            Account to = repository.findById(toId);
            if (from == null || to == null) throw new IllegalArgumentException("Account missing");
            if (amount <= 0 || from.getCents() < amount) throw new IllegalArgumentException("Invalid amount");
            from.add(-amount);
            to.add(amount);
        }
    }

    public static void main(String[] args) {
        AccountRepository repository = new AccountRepository();
        repository.save(new Account(1, "Alice", 10_000));
        repository.save(new Account(2, "Bob", 2_000));

        AccountService service = new AccountService(repository);
        service.transfer(1, 2, 1_500);

        System.out.println("Lesson 4.3 - Persistence pattern simulation");
        System.out.println("Alice balance: " + repository.findById(1).getCents());
        System.out.println("Bob balance: " + repository.findById(2).getCents());
    }
}

~~~
