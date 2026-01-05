// Example 1: Basic Express server with types
import express, { Request, Response, NextFunction, Express } from "express";

const app: Express = express();
app.use(express.json());

// Type definitions for DTOs
interface CreateUserRequest {
  name: string;
  email: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

interface HealthResponse {
  status: "ok" | "degraded" | "error";
  timestamp: string;
}

// Example 2: Typed route handlers
app.get("/health", (req: Request, res: Response<HealthResponse>) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.post("/users", (req: Request<{}, UserResponse, CreateUserRequest>, res: Response<UserResponse>, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const user: UserResponse = {
      id: Math.random().toString(36),
      name,
      email,
    };
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.get("/users/:id", (req: Request<{ id: string }>, res: Response<UserResponse | { error: string }>) => {
  const { id } = req.params;
  // Simulated lookup
  const user = null; // Would be from database
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// Example 3: Middleware with types
function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} ${req.path}`);
  next();
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Missing authorization" });
  }
  next();
}

app.use(loggingMiddleware);

// Example 4: Error handler middleware
interface ErrorResponse {
  error: string;
  code: string;
  timestamp: string;
}

function errorHandler(err: unknown, req: Request, res: Response<ErrorResponse>, next: NextFunction) {
  console.error(err);

  const message = err instanceof Error ? err.message : "Unknown error";
  const code = (err as { code?: string }).code || "INTERNAL_ERROR";

  res.status(500).json({
    error: message,
    code,
    timestamp: new Date().toISOString(),
  });
}

// Register error handler
app.use(errorHandler);

// Example 5: Custom request augmentation
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

function extractUserId(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (token) {
    // Simulated token parsing
    req.userId = "user-123";
  }
  next();
}

export { app, CreateUserRequest, UserResponse, HealthResponse, ErrorResponse };
