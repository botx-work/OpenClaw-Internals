# Nodes Tool

<cite>
**Referenced Files in This Document**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts)
- [nodes-cli.ts](file://src/cli/nodes-cli.ts)
- [register.camera.ts](file://src/cli/nodes-cli/register.camera.ts)
- [approval-buttons.ts](file://src/telegram/approval-buttons.ts)
- [commands-approve.ts](file://src/auto-reply/reply/commands-approve.ts)
- [exec-approval-forwarder.ts](file://src/infra/exec-approval-forwarder.ts)
- [method-scopes.ts](file://src/gateway/method-scopes.ts)
- [role-policy.ts](file://src/gateway/role-policy.ts)
- [connect-policy.ts](file://src/gateway/server/ws-connection/connect-policy.ts)
- [device-auth.ts](file://src/gateway/device-auth.ts)
- [device-pairing.ts](file://src/infra/device-pairing.ts)
- [NodeRuntime.kt](file://apps/android/app/src/main/java/ai/openclaw/app/NodeRuntime.kt)
- [CameraHandler.kt](file://apps/android/app/src/main/java/ai/openclaw/app/node/CameraHandler.kt)
- [troubleshooting.md](file://docs/nodes/troubleshooting.md)
- [nodes/troubleshooting.md](file://docs/nodes/troubleshooting.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document explains the Nodes Tool that discovers, authenticates, and controls paired nodes across platforms. It covers node discovery and status, device management operations (camera, screen recording, location), notifications and system command execution, pairing workflows (approve, reject, pending), and permission management. It also documents authentication, security policies, device capabilities, integration patterns, automation scenarios, troubleshooting, and best practices.

## Project Structure
The Nodes Tool spans agent-side orchestration, CLI registration, gateway method scoping, pairing and token management, and platform-specific handlers (Android). The diagram below highlights the main modules involved in node control and pairing.

```mermaid
graph TB
subgraph "Agent Runtime"
NT["nodes-tool.ts"]
end
subgraph "CLI"
NC["nodes-cli.ts"]
CAM["register.camera.ts"]
end
subgraph "Gateway"
MS["method-scopes.ts"]
RP["role-policy.ts"]
CP["connect-policy.ts"]
DA["device-auth.ts"]
end
subgraph "Pairing & Tokens"
DP["device-pairing.ts"]
end
subgraph "Platform Handlers"
AND_RT["NodeRuntime.kt"]
AND_CAM["CameraHandler.kt"]
end
NT --> MS
NT --> RP
NT --> DP
NC --> NT
CAM --> NC
AND_RT --> AND_CAM
AND_CAM --> DA
```

**Diagram sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L1-L816)
- [nodes-cli.ts](file://src/cli/nodes-cli.ts#L1-L2)
- [register.camera.ts](file://src/cli/nodes-cli/register.camera.ts#L37-L95)
- [method-scopes.ts](file://src/gateway/method-scopes.ts#L1-L217)
- [role-policy.ts](file://src/gateway/role-policy.ts#L1-L23)
- [connect-policy.ts](file://src/gateway/server/ws-connection/connect-policy.ts#L68-L102)
- [device-auth.ts](file://src/gateway/device-auth.ts#L1-L55)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L1-L654)
- [NodeRuntime.kt](file://apps/android/app/src/main/java/ai/openclaw/app/NodeRuntime.kt#L44-L77)
- [CameraHandler.kt](file://apps/android/app/src/main/java/ai/openclaw/app/node/CameraHandler.kt#L22-L56)

**Section sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L1-L816)
- [nodes-cli.ts](file://src/cli/nodes-cli.ts#L1-L2)
- [register.camera.ts](file://src/cli/nodes-cli/register.camera.ts#L37-L95)
- [method-scopes.ts](file://src/gateway/method-scopes.ts#L1-L217)
- [role-policy.ts](file://src/gateway/role-policy.ts#L1-L23)
- [connect-policy.ts](file://src/gateway/server/ws-connection/connect-policy.ts#L68-L102)
- [device-auth.ts](file://src/gateway/device-auth.ts#L1-L55)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L1-L654)
- [NodeRuntime.kt](file://apps/android/app/src/main/java/ai/openclaw/app/NodeRuntime.kt#L44-L77)
- [CameraHandler.kt](file://apps/android/app/src/main/java/ai/openclaw/app/node/CameraHandler.kt#L22-L56)

## Core Components
- Nodes Tool (agent): Orchestrates node actions (status, describe, pairing, notify, camera, screen record, location, notifications, run, invoke) and integrates with the gateway via node.invoke and pairing APIs.
- CLI camera subcommands: List cameras on a node and render results.
- Pairing and token management: Device pairing lifecycle (pending, approve, reject), token issuance/rotation/revoke, and verification.
- Security and roles: Method scoping, operator roles, and connection policy decisions.
- Platform handlers (Android): Discovery, camera listing/handling, and device identity/connection policy enforcement.

**Section sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L31-L816)
- [register.camera.ts](file://src/cli/nodes-cli/register.camera.ts#L37-L95)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L255-L403)
- [method-scopes.ts](file://src/gateway/method-scopes.ts#L32-L133)
- [role-policy.ts](file://src/gateway/role-policy.ts#L1-L23)
- [connect-policy.ts](file://src/gateway/server/ws-connection/connect-policy.ts#L68-L102)
- [NodeRuntime.kt](file://apps/android/app/src/main/java/ai/openclaw/app/NodeRuntime.kt#L44-L77)
- [CameraHandler.kt](file://apps/android/app/src/main/java/ai/openclaw/app/node/CameraHandler.kt#L22-L56)

## Architecture Overview
The Nodes Tool executes actions by resolving node identifiers, invoking gateway methods, and coordinating with platform-specific handlers. Pairing and token verification ensure secure access. Approval workflows govern sensitive operations like system.run.

```mermaid
sequenceDiagram
participant Agent as "Agent"
participant Tool as "Nodes Tool"
participant GW as "Gateway"
participant Node as "Node"
participant Plat as "Platform Handler"
Agent->>Tool : action="camera_snap" / "screen_record" / "location_get" / "run"
Tool->>GW : node.list / node.describe (resolve node)
Tool->>GW : node.invoke.<command>(...)
GW-->>Tool : payload/result
alt Media commands
Tool->>Tool : write payload to temp file
Tool-->>Agent : FILE : <path> or MEDIA : <path>
else System run
Tool->>GW : node.invoke.system.run.prepare(...)
GW-->>Tool : prepared plan
opt Requires approval
Tool->>GW : exec.approval.request(...)
GW-->>Tool : allow-once/allow-always/deny
Tool->>GW : node.invoke.system.run(..., approved=true)
end
GW-->>Tool : execution result
Tool-->>Agent : JSON result
end
Note over Node,Plat : Platform handlers manage device capabilities<br/>and enforce permissions
```

**Diagram sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L181-L786)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L320-L384)
- [exec-approval-forwarder.ts](file://src/infra/exec-approval-forwarder.ts#L453-L495)

## Detailed Component Analysis

### Nodes Tool Orchestration
- Actions supported: status, describe, pending, approve, reject, notify, camera_snap, camera_clip, photos_latest, screen_record, location_get, notifications_list/action, device_status/info/permissions/health, run, invoke.
- Resolves node identifiers via gateway and invokes node.invoke with idempotency keys.
- Media commands download payloads to temporary files and optionally attach inline images when vision is available.
- System.run uses a two-phase flow: prepare, then request approval if needed, then execute with approval flags.

```mermaid
flowchart TD
Start(["Action Entry"]) --> Resolve["Resolve node id"]
Resolve --> Action{"Action type?"}
Action --> |camera_snap| CamSnap["node.invoke.camera.snap"]
Action --> |camera_clip| CamClip["node.invoke.camera.clip"]
Action --> |screen_record| ScrRec["node.invoke.screen.record"]
Action --> |location_get| LocGet["node.invoke.location.get"]
Action --> |run| SysRun["prepare -> request approval -> execute"]
CamSnap --> WriteMedia["Write payload to temp file"]
CamClip --> WriteMedia
ScrRec --> WriteMedia
WriteMedia --> ReturnMedia["Return FILE/MEDIA"]
SysRun --> ReturnJSON["Return JSON result"]
LocGet --> ReturnJSON
ReturnMedia --> End(["Exit"])
ReturnJSON --> End
```

**Diagram sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L181-L786)

**Section sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L31-L816)

### CLI Camera Subcommands
- Lists cameras on a node by invoking node.invoke.camera.list and rendering a table or JSON.

**Section sources**
- [register.camera.ts](file://src/cli/nodes-cli/register.camera.ts#L37-L95)

### Pairing Workflows
- Pending pairing requests are listed and approved or rejected via gateway methods.
- Device pairing state includes pending requests and paired devices with tokens.
- Token verification ensures role and scope alignment before granting access.

```mermaid
sequenceDiagram
participant User as "User"
participant GW as "Gateway"
participant Store as "Pairing Store"
User->>GW : node.pair.list
GW-->>User : pending requests
User->>GW : node.pair.approve(requestId)
GW->>Store : approveDevicePairing(requestId)
Store-->>GW : paired device + tokens
GW-->>User : approval result
User->>GW : node.pair.reject(requestId)
GW->>Store : rejectDevicePairing(requestId)
Store-->>GW : removed pending
GW-->>User : rejection result
```

**Diagram sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L195-L216)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L255-L403)

**Section sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L195-L216)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L255-L403)

### System Run and Exec Approvals
- Preparation phase returns a plan; if denied due to approval requirement, the tool requests approval and retries with decision flags.
- Approval buttons and commands enable Telegram-based approvals.

```mermaid
sequenceDiagram
participant Agent as "Agent"
participant Tool as "Nodes Tool"
participant GW as "Gateway"
Agent->>Tool : action="run" + command
Tool->>GW : node.invoke.system.run.prepare(...)
GW-->>Tool : prepared plan
alt Denied : approval required
Tool->>GW : exec.approval.request(...)
GW-->>Tool : decision (allow-once|allow-always|deny)
Tool->>GW : node.invoke.system.run(..., approved=true, decision)
else Allowed
Tool->>GW : node.invoke.system.run(...)
end
GW-->>Tool : execution result
Tool-->>Agent : JSON result
```

**Diagram sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L607-L748)
- [exec-approval-forwarder.ts](file://src/infra/exec-approval-forwarder.ts#L453-L495)
- [approval-buttons.ts](file://src/telegram/approval-buttons.ts#L10-L42)
- [commands-approve.ts](file://src/auto-reply/reply/commands-approve.ts#L75-L116)

**Section sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L607-L748)
- [exec-approval-forwarder.ts](file://src/infra/exec-approval-forwarder.ts#L453-L495)
- [approval-buttons.ts](file://src/telegram/approval-buttons.ts#L10-L42)
- [commands-approve.ts](file://src/auto-reply/reply/commands-approve.ts#L75-L116)

### Authentication, Roles, and Security Policies
- Method scoping maps gateway methods to operator scopes (read/write/admin/approvals/pairing).
- Role policy determines whether a role can skip device identity and which methods are authorized.
- Connection policy evaluates missing device identity and allows local control UI under specific conditions.
- Device authentication payloads encode device metadata and scopes for verification.

```mermaid
flowchart TD
Req["Incoming request"] --> Scope["Resolve required operator scope"]
Scope --> Role["Evaluate role and shared auth"]
Role --> Policy{"Connection policy allows?"}
Policy --> |Yes| Auth["Verify device token and scopes"]
Policy --> |No| Reject["Reject (missing identity or auth)"]
Auth --> Allowed{"Scopes sufficient?"}
Allowed --> |Yes| OK["Allow"]
Allowed --> |No| Deny["Deny (scope mismatch)"]
```

**Diagram sources**
- [method-scopes.ts](file://src/gateway/method-scopes.ts#L137-L217)
- [role-policy.ts](file://src/gateway/role-policy.ts#L14-L23)
- [connect-policy.ts](file://src/gateway/server/ws-connection/connect-policy.ts#L68-L102)
- [device-auth.ts](file://src/gateway/device-auth.ts#L20-L54)

**Section sources**
- [method-scopes.ts](file://src/gateway/method-scopes.ts#L1-L217)
- [role-policy.ts](file://src/gateway/role-policy.ts#L1-L23)
- [connect-policy.ts](file://src/gateway/server/ws-connection/connect-policy.ts#L68-L102)
- [device-auth.ts](file://src/gateway/device-auth.ts#L1-L55)

### Platform Handlers (Android)
- NodeRuntime orchestrates discovery, camera, location, and other device capabilities.
- CameraHandler lists cameras and builds device payloads for the gateway.

**Section sources**
- [NodeRuntime.kt](file://apps/android/app/src/main/java/ai/openclaw/app/NodeRuntime.kt#L44-L77)
- [CameraHandler.kt](file://apps/android/app/src/main/java/ai/openclaw/app/node/CameraHandler.kt#L22-L56)

## Dependency Analysis
The Nodes Tool depends on gateway method scoping, pairing/token management, and platform handlers. The diagram below shows key dependencies.

```mermaid
graph LR
NT["nodes-tool.ts"] --> MS["method-scopes.ts"]
NT --> DP["device-pairing.ts"]
NC["nodes-cli.ts"] --> NT
CAM["register.camera.ts"] --> NC
AND_RT["NodeRuntime.kt"] --> AND_CAM["CameraHandler.kt"]
AND_CAM --> DA["device-auth.ts"]
```

**Diagram sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L1-L816)
- [method-scopes.ts](file://src/gateway/method-scopes.ts#L1-L217)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L1-L654)
- [nodes-cli.ts](file://src/cli/nodes-cli.ts#L1-L2)
- [register.camera.ts](file://src/cli/nodes-cli/register.camera.ts#L37-L95)
- [NodeRuntime.kt](file://apps/android/app/src/main/java/ai/openclaw/app/NodeRuntime.kt#L44-L77)
- [CameraHandler.kt](file://apps/android/app/src/main/java/ai/openclaw/app/node/CameraHandler.kt#L22-L56)
- [device-auth.ts](file://src/gateway/device-auth.ts#L1-L55)

**Section sources**
- [nodes-tool.ts](file://src/agents/tools/nodes-tool.ts#L1-L816)
- [method-scopes.ts](file://src/gateway/method-scopes.ts#L1-L217)
- [device-pairing.ts](file://src/infra/device-pairing.ts#L1-L654)
- [nodes-cli.ts](file://src/cli/nodes-cli.ts#L1-L2)
- [register.camera.ts](file://src/cli/nodes-cli/register.camera.ts#L37-L95)
- [NodeRuntime.kt](file://apps/android/app/src/main/java/ai/openclaw/app/NodeRuntime.kt#L44-L77)
- [CameraHandler.kt](file://apps/android/app/src/main/java/ai/openclaw/app/node/CameraHandler.kt#L22-L56)
- [device-auth.ts](file://src/gateway/device-auth.ts#L1-L55)

## Performance Considerations
- Media operations (camera snap/clip, screen record) write to temporary files; ensure adequate disk space and avoid excessive concurrency.
- System.run preparation and approval introduces latency; batch related commands and reuse prepared plans when possible.
- Use appropriate timeouts for node.invoke and approval requests to balance responsiveness and reliability.

## Troubleshooting Guide
Common symptoms and resolutions:
- Node visible but tool calls fail: verify pairing and foreground permissions.
- Foreground-restricted commands fail: bring node to foreground and retry.
- System execution denied: check exec approvals and allowlist configuration.
- Permission errors: confirm OS permissions for camera, screen recording, location, and system execution.
- Quick recovery loop: check node status, device approvals, and logs.

**Section sources**
- [troubleshooting.md](file://docs/nodes/troubleshooting.md#L51-L115)
- [nodes/troubleshooting.md](file://docs/nodes/troubleshooting.md#L51-L115)

## Conclusion
The Nodes Tool provides a unified interface to discover, authenticate, and control nodes across platforms. Robust pairing, token management, and approval workflows ensure secure operations, while method scoping and role policies enforce least privilege. Following the troubleshooting steps and best practices helps maintain reliable automation.

## Appendices

### Common Automation Scenarios
- Camera monitoring: periodically capture camera snaps and upload to storage.
- Screen recording: schedule short screen captures for UI regression checks.
- Location polling: fetch location updates at intervals for presence tracking.
- System run automation: prepare commands, request approvals, and execute with safeguards.

### Best Practices for Secure Device Management
- Keep pairing approvals current and scoped to minimal required roles and scopes.
- Rotate device tokens regularly and revoke unused ones.
- Enforce foreground execution for sensitive operations and respect platform permissions.
- Monitor logs and use approvals to limit risky system.run commands.