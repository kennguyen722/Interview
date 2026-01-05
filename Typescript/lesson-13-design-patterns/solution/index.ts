// Solution 1: Type-safe Plugin System
interface Plugin {
  name: string;
  version: string;
  initialize(): void;
  cleanup(): void;
}

class PluginManager<T extends Plugin> {
  private plugins = new Map<string, T>();
  private loaded = new Set<string>();

  register(name: string, plugin: T): void {
    if (this.plugins.has(name)) {
      throw new Error(`Plugin ${name} already registered`);
    }
    this.plugins.set(name, plugin);
  }

  load(name: string): T | undefined {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      return undefined;
    }
    if (!this.loaded.has(name)) {
      plugin.initialize();
      this.loaded.add(name);
    }
    return plugin;
  }

  unload(name: string): boolean {
    const plugin = this.plugins.get(name);
    if (!plugin || !this.loaded.has(name)) {
      return false;
    }
    plugin.cleanup();
    this.loaded.delete(name);
    return true;
  }

  listPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }

  isLoaded(name: string): boolean {
    return this.loaded.has(name);
  }
}

// Test Plugin System
interface LoggerPlugin extends Plugin {
  log(message: string): void;
}

const consoleLogger: LoggerPlugin = {
  name: "console-logger",
  version: "1.0.0",
  initialize: () => console.log("Console logger initialized"),
  cleanup: () => console.log("Console logger cleaned up"),
  log: (message) => console.log(`[LOG] ${message}`),
};

const manager = new PluginManager<LoggerPlugin>();
manager.register("console", consoleLogger);
const logger = manager.load("console");
logger?.log("Hello from plugin!");

// Solution 2: Memento Pattern
class EditorMemento {
  constructor(private readonly state: string) {}

  getState(): string {
    return this.state;
  }
}

class Editor {
  private content = "";

  write(text: string): void {
    this.content += text;
  }

  getContent(): string {
    return this.content;
  }

  save(): EditorMemento {
    return new EditorMemento(this.content);
  }

  restore(memento: EditorMemento): void {
    this.content = memento.getState();
  }
}

class History {
  private mementos: EditorMemento[] = [];
  private currentIndex = -1;

  push(memento: EditorMemento): void {
    this.mementos = this.mementos.slice(0, this.currentIndex + 1);
    this.mementos.push(memento);
    this.currentIndex++;
  }

  undo(): EditorMemento | undefined {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.mementos[this.currentIndex];
    }
    return undefined;
  }

  redo(): EditorMemento | undefined {
    if (this.currentIndex < this.mementos.length - 1) {
      this.currentIndex++;
      return this.mementos[this.currentIndex];
    }
    return undefined;
  }

  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.mementos.length - 1;
  }
}

// Test Memento
const editor = new Editor();
const history = new History();

editor.write("Hello ");
history.push(editor.save());

editor.write("World");
history.push(editor.save());

editor.write("!");
console.log(editor.getContent()); // "Hello World!"

const previousState = history.undo();
if (previousState) {
  editor.restore(previousState);
  console.log(editor.getContent()); // "Hello World"
}

// Solution 3: Chain of Responsibility
interface Request {
  type: string;
  data: any;
}

interface Response {
  success: boolean;
  data?: any;
  error?: string;
}

abstract class Handler<TRequest extends Request = Request, TResponse extends Response = Response> {
  private nextHandler?: Handler<TRequest, TResponse>;

  setNext(handler: Handler<TRequest, TResponse>): Handler<TRequest, TResponse> {
    this.nextHandler = handler;
    return handler;
  }

  async handle(request: TRequest): Promise<TResponse> {
    const canHandle = await this.canHandle(request);
    if (canHandle) {
      return this.process(request);
    }
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return {
      success: false,
      error: "No handler found for request",
    } as TResponse;
  }

  protected abstract canHandle(request: TRequest): Promise<boolean>;
  protected abstract process(request: TRequest): Promise<TResponse>;
}

class AuthHandler extends Handler {
  protected async canHandle(request: Request): Promise<boolean> {
    return request.type === "auth";
  }

  protected async process(request: Request): Promise<Response> {
    console.log("Authenticating...");
    return { success: true, data: { authenticated: true } };
  }
}

class ValidationHandler extends Handler {
  protected async canHandle(request: Request): Promise<boolean> {
    return request.type === "validate";
  }

  protected async process(request: Request): Promise<Response> {
    console.log("Validating...");
    const isValid = !!request.data;
    return {
      success: isValid,
      error: isValid ? undefined : "Validation failed",
    };
  }
}

class ProcessHandler extends Handler {
  protected async canHandle(request: Request): Promise<boolean> {
    return request.type === "process";
  }

  protected async process(request: Request): Promise<Response> {
    console.log("Processing...");
    return { success: true, data: { processed: true } };
  }
}

// Test Chain of Responsibility
const authHandler = new AuthHandler();
const validationHandler = new ValidationHandler();
const processHandler = new ProcessHandler();

authHandler.setNext(validationHandler).setNext(processHandler);

const result = await authHandler.handle({ type: "validate", data: { name: "test" } });
console.log(result);

// Solution 4: Either Monad
abstract class Either<L, R> {
  abstract isLeft(): boolean;
  abstract isRight(): boolean;

  abstract map<U>(fn: (value: R) => U): Either<L, U>;
  abstract flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U>;
  abstract mapLeft<U>(fn: (value: L) => U): Either<U, R>;
  abstract fold<U>(leftFn: (left: L) => U, rightFn: (right: R) => U): U;

  abstract getOrElse(defaultValue: R): R;
  abstract getOrThrow(): R;
}

class Left<L, R> extends Either<L, R> {
  constructor(private value: L) {
    super();
  }

  isLeft(): boolean {
    return true;
  }

  isRight(): boolean {
    return false;
  }

  map<U>(_fn: (value: R) => U): Either<L, U> {
    return new Left<L, U>(this.value);
  }

  flatMap<U>(_fn: (value: R) => Either<L, U>): Either<L, U> {
    return new Left<L, U>(this.value);
  }

  mapLeft<U>(fn: (value: L) => U): Either<U, R> {
    return new Left<U, R>(fn(this.value));
  }

  fold<U>(leftFn: (left: L) => U, _rightFn: (right: R) => U): U {
    return leftFn(this.value);
  }

  getOrElse(defaultValue: R): R {
    return defaultValue;
  }

  getOrThrow(): R {
    throw this.value;
  }
}

class Right<L, R> extends Either<L, R> {
  constructor(private value: R) {
    super();
  }

  isLeft(): boolean {
    return false;
  }

  isRight(): boolean {
    return true;
  }

  map<U>(fn: (value: R) => U): Either<L, U> {
    return new Right<L, U>(fn(this.value));
  }

  flatMap<U>(fn: (value: R) => Either<L, U>): Either<L, U> {
    return fn(this.value);
  }

  mapLeft<U>(_fn: (value: L) => U): Either<U, R> {
    return new Right<U, R>(this.value);
  }

  fold<U>(_leftFn: (left: L) => U, rightFn: (right: R) => U): U {
    return rightFn(this.value);
  }

  getOrElse(_defaultValue: R): R {
    return this.value;
  }

  getOrThrow(): R {
    return this.value;
  }
}

// Helper functions
function left<L, R>(value: L): Either<L, R> {
  return new Left(value);
}

function right<L, R>(value: R): Either<L, R> {
  return new Right(value);
}

// Test Either
async function fetchUser(id: string): Promise<Either<string, { id: string; name: string }>> {
  if (id === "0") {
    return left("User not found");
  }
  return right({ id, name: "Ada" });
}

const userResult = await fetchUser("123");
const message = userResult.fold(
  (error) => `Error: ${error}`,
  (user) => `Found: ${user.name}`
);
console.log(message); // "Found: Ada"

export { PluginManager, Editor, History, Handler, AuthHandler, Either, left, right };
