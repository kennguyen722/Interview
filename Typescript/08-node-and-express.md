# Lesson 08: Node and Express APIs

## Goals
- Build HTTP handlers with strong types.
- Define request/response contracts and middleware types.
- Keep domain and transport layers separated.

## Minimal typed Express setup
```
npm i express
npm i -D @types/express ts-node nodemon
```

```ts
// src/server.ts
import express, { Request, Response, NextFunction } from "express";

const app = express();
app.use(express.json());

interface CreateUserBody { name: string; email: string }
interface UserDto { id: string; name: string; email: string }

app.post("/users", (req: Request<{}, UserDto, CreateUserBody>, res: Response<UserDto>, next: NextFunction) => {
  try {
    const { name, email } = req.body;
    const user: UserDto = { id: crypto.randomUUID(), name, email };
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.listen(3000, () => console.log("API on http://localhost:3000"));
```

## Middleware typing
```ts
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) return res.status(401).json({ message: "missing auth" });
  next();
}
```
Add types to `req.user` via declaration merging when you attach custom properties.

## Separation of concerns
- Domain functions pure, no Express types.
- Adapters translate `Request` to domain input and domain output to HTTP responses.
- Extract DTOs and validation schemas to keep handlers thin.

## Exercises
- Add a `/health` route that returns `{ status: "ok" }` with typed response.
- Create `GET /users/:id` route typed with `Request<{ id: string }>` and return 404 when missing.
- Add an `errorHandler` middleware with proper `(err, req, res, next)` signature and ensure it returns JSON errors.
