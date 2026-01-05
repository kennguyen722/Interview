# Lesson 21: Real-Time Applications & WebSocket Patterns

## Objective
Build type-safe real-time applications using WebSockets, Server-Sent Events, and WebRTC with bi-directional type safety and protocol definitions.

## Topics Covered

### 1. WebSocket Communication
- Type-safe WebSocket clients/servers
- Message protocol definition
- Connection lifecycle management
- Reconnection strategies

### 2. Server-Sent Events (SSE)
- One-way server push
- Event stream typing
- Connection monitoring
- Browser EventSource API

### 3. Real-Time Data Sync
- Operational transformation
- Conflict-free replicated data types (CRDTs)
- Optimistic updates
- Client-side caching

### 4. WebRTC for P2P
- Peer-to-peer connections
- Signaling server design
- Media stream handling
- Data channels

### 5. Pub/Sub Patterns
- Redis pub/sub
- Socket.IO rooms
- Presence detection
- Broadcasting strategies

### 6. Scaling Real-Time Systems
- Horizontal scaling with sticky sessions
- Message distribution
- State synchronization
- Load balancing

## Learning Outcomes
- Build type-safe WebSocket APIs
- Implement real-time collaboration
- Handle connection failures gracefully
- Scale real-time applications
- Design efficient sync protocols

## Key Concepts

### Type-Safe WebSocket Protocol
```typescript
type ClientMessage =
  | { type: "join"; roomId: string }
  | { type: "message"; content: string }
  | { type: "leave" };

type ServerMessage =
  | { type: "joined"; userId: string }
  | { type: "message"; userId: string; content: string }
  | { type: "userLeft"; userId: string };
```

### Connection Management
```typescript
class WebSocketConnection {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async send<T extends ClientMessage>(message: T): Promise<void> {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      await this.reconnect();
      this.send(message);
    }
  }
}
```

## Resources
- [Socket.IO Documentation](https://socket.io/docs/)
- [WebSocket MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [WebRTC Specification](https://webrtc.org/)
