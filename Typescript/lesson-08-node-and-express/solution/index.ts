import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

// Solution 1: Health check endpoint
interface HealthResponse {
  status: "ok" | "degraded";
  uptime: number;
}

app.get("/health", (req: Request, res: Response<HealthResponse>) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

// Solution 2: Get user by ID
interface User {
  id: string;
  name: string;
  email: string;
}

const users: Map<string, User> = new Map([
  ["1", { id: "1", name: "Ada", email: "ada@example.com" }],
  ["2", { id: "2", name: "Bob", email: "bob@example.com" }],
]);

app.get("/users/:id", (req: Request<{ id: string }>, res: Response<User | { error: string }>) => {
  const { id } = req.params;
  const user = users.get(id);

  if (!user) {
    return res.status(404).json({ error: `User ${id} not found` });
  }

  res.json(user);
});

// Solution 3: Error handler middleware
interface ErrorResponse {
  error: string;
  code: string;
  timestamp: string;
}

function errorHandler(err: unknown, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  console.error("Error:", err);

  const message = err instanceof Error ? err.message : "Unknown error";
  const code = (err as { code?: string }).code || "INTERNAL_ERROR";

  res.status(500).json({
    error: message,
    code,
    timestamp: new Date().toISOString(),
  });
}

// Register error handler after all routes
app.use(errorHandler);

// Example: Throw an error in a route
app.post("/users", (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      throw new Error("Name and email are required");
    }
    const newUser: User = {
      id: String(users.size + 1),
      name,
      email,
    };
    users.set(newUser.id, newUser);
    res.status(201).json(newUser);
  } catch (err) {
    // Error gets passed to errorHandler middleware
    throw err;
  }
});

export { app, HealthResponse, User, ErrorResponse };
