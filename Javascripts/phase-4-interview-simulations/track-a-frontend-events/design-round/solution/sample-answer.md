# Track A Design Round Sample Answer

## Requirements and Constraints
- Update dashboard cards within 300ms perceived latency.
- Handle bursty event streams during incident spikes.
- Avoid memory leaks over long-running sessions.

## Component Architecture
- EventGateway converts websocket events into typed internal events.
- WidgetStore keeps normalized state by widget ID.
- WidgetRenderer subscribes to selective slices only.

## Event Routing Model
- Use topic-based pub/sub at client layer.
- Apply event dedupe using event ID + monotonic timestamp.
- Reject stale events for out-of-order delivery.

## Performance Strategy
- Batch UI updates with requestAnimationFrame.
- Throttle expensive recalculations.
- Virtualize long lists and avoid full tree re-renders.

## Reliability and Fallback
- Reconnect strategy with capped exponential backoff.
- Circuit-break noisy event channels.
- Fallback to polling for degraded websocket connectivity.

## Testing and Observability
- Add soak tests for 10k events/minute.
- Emit client metrics: droppedEvents, renderLatencyP95, listenerCount.
- Capture trace IDs from backend push path.
