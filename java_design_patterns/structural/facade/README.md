# Facade Pattern (Structural)

## Intent
- Provide a simple interface to a complex subsystem.

## Motivation
- `VideoEncoderFacade` hides loader/transcoder/saver orchestration.

## Structure
- Facade: `VideoEncoderFacade`
- Subsystems: `VideoLoader`, `VideoTranscoder`, `VideoSaver`

## Usage
- Clients call the facade instead of coordinating subsystems directly.

## Example
```java
new VideoEncoderFacade().encode("in.mp4", "out.webm", "WEBM");
```

## Pros/Cons
- Pros: Simplifies usage; reduces coupling.
- Cons: May hide advanced features; another layer to maintain.

## When to Use
- Complex APIs where most clients need a streamlined entry point.
