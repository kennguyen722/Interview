// Example 1: Domain modeling with rich types
type Currency = "USD" | "EUR" | "GBP";
type Money = {
  amount: number;
  currency: Currency;
};

type UserRole = "admin" | "member" | "guest";
type User = {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
};

// Example 2: Result/Either pattern
type Ok<T> = { ok: true; value: T };
type Err<E = Error> = { ok: false; error: E };
type Result<T, E = Error> = Ok<T> | Err<E>;

function unwrap<T, E>(result: Result<T, E>): T {
  if (!result.ok) {
    throw result.error;
  }
  return result.value;
}

function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (!result.ok) return result;
  try {
    return { ok: true, value: fn(result.value) };
  } catch (err) {
    return { ok: false, error: err as E };
  }
}

// Example 3: Exhaustive pattern matching
function renderStatus(status: "idle" | "loading" | "done"): string {
  switch (status) {
    case "idle":
      return "Ready";
    case "loading":
      return "In progress";
    case "done":
      return "Complete";
    default:
      assertNever(status);
  }
}

function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${x}`);
}

// Example 4: State machines
type AuthState =
  | { tag: "loggedOut" }
  | { tag: "loggingIn" }
  | { tag: "loggedIn"; user: User }
  | { tag: "error"; message: string };

type AuthAction =
  | { type: "login"; email: string; password: string }
  | { type: "loginSuccess"; user: User }
  | { type: "loginFailure"; error: string }
  | { type: "logout" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (state.tag) {
    case "loggedOut":
      if (action.type === "login") {
        return { tag: "loggingIn" };
      }
      return state;

    case "loggingIn":
      if (action.type === "loginSuccess") {
        return { tag: "loggedIn", user: action.user };
      }
      if (action.type === "loginFailure") {
        return { tag: "error", message: action.error };
      }
      return state;

    case "loggedIn":
      if (action.type === "logout") {
        return { tag: "loggedOut" };
      }
      return state;

    case "error":
      if (action.type === "login") {
        return { tag: "loggingIn" };
      }
      return state;

    default:
      assertNever(state);
  }
}

// Example 5: Dependency injection
interface EmailSender {
  send(to: string, subject: string, body: string): Promise<void>;
}

interface UserRepository {
  get(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

async function inviteUser(sender: EmailSender, repo: UserRepository, email: string): Promise<Result<User>> {
  try {
    const user: User = {
      id: Math.random().toString(),
      email,
      role: "member",
      createdAt: new Date(),
    };
    await repo.save(user);
    await sender.send(email, "Welcome", `Welcome to our service!`);
    return { ok: true, value: user };
  } catch (err) {
    return { ok: false, error: err as Error };
  }
}

// Example 6: Immutability patterns
function addRole(user: User, newRole: UserRole): User {
  return { ...user, role: newRole };
}

function updateUser(user: User, updates: Partial<Omit<User, "id">>): User {
  return { ...user, ...updates };
}

export { User, Money, Result, renderStatus, AuthState, AuthAction, authReducer, inviteUser, updateUser };
