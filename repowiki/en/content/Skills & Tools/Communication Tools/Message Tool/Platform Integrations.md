# Platform Integrations

<cite>
**Referenced Files in This Document**
- [discord.md](file://docs/channels/discord.md)
- [telegram.md](file://docs/channels/telegram.md)
- [slack.md](file://docs/channels/slack.md)
- [whatsapp.md](file://docs/channels/whatsapp.md)
- [signal.md](file://docs/channels/signal.md)
- [imessage.md](file://docs/channels/imessage.md)
- [googlechat.md](file://docs/channels/googlechat.md)
- [msteams.md](file://docs/channels/msteams.md)
- [discord/index.ts](file://extensions/discord/index.ts)
- [telegram/index.ts](file://extensions/telegram/index.ts)
- [slack/index.ts](file://extensions/slack/index.ts)
- [whatsapp/index.ts](file://extensions/whatsapp/index.ts)
- [signal/index.ts](file://extensions/signal/index.ts)
- [imessage/index.ts](file://extensions/imessage/index.ts)
- [googlechat/index.ts](file://extensions/googlechat/index.ts)
- [msteams/index.ts](file://extensions/msteams/index.ts)
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

## Introduction
This document provides comprehensive, platform-specific documentation for message tool implementations across Discord, Telegram, Slack, WhatsApp, Signal, iMessage, Google Chat, and Microsoft Teams. It covers authentication requirements, permission models, message formatting, attachment handling, thread management, moderation capabilities, configuration options, rate-limiting considerations, and troubleshooting guidance for each platform. The goal is to help operators deploy, configure, and operate these integrations reliably and securely.

## Project Structure
Each supported platform is implemented as a plugin that registers a channel with the OpenClaw runtime. The plugin entry points define the channel identity, configuration schema, and registration hooks. Documentation pages describe platform-specific setup, capabilities, and operational guidance.

```mermaid
graph TB
subgraph "Plugin Registry"
D["discord/index.ts"]
T["telegram/index.ts"]
S["slack/index.ts"]
W["whatsapp/index.ts"]
SIG["signal/index.ts"]
IM["imessage/index.ts"]
GC["googlechat/index.ts"]
MS["msteams/index.ts"]
end
subgraph "Channel Docs"
DDoc["docs/channels/discord.md"]
TDoc["docs/channels/telegram.md"]
SDoc["docs/channels/slack.md"]
WDoc["docs/channels/whatsapp.md"]
SIGDoc["docs/channels/signal.md"]
IMDoc["docs/channels/imessage.md"]
GCDoc["docs/channels/googlechat.md"]
MSDoc["docs/channels/msteams.md"]
end
D --> DDoc
T --> TDoc
S --> SDoc
W --> WDoc
SIG --> SIGDoc
IM --> IMDoc
GC --> GCDoc
MS --> MSDoc
```

**Diagram sources**
- [discord/index.ts](file://extensions/discord/index.ts#L1-L20)
- [telegram/index.ts](file://extensions/telegram/index.ts#L1-L18)
- [slack/index.ts](file://extensions/slack/index.ts#L1-L18)
- [whatsapp/index.ts](file://extensions/whatsapp/index.ts#L1-L18)
- [signal/index.ts](file://extensions/signal/index.ts#L1-L18)
- [imessage/index.ts](file://extensions/imessage/index.ts#L1-L18)
- [googlechat/index.ts](file://extensions/googlechat/index.ts#L1-L18)
- [msteams/index.ts](file://extensions/msteams/index.ts#L1-L18)
- [discord.md](file://docs/channels/discord.md#L1-L1223)
- [telegram.md](file://docs/channels/telegram.md#L1-L948)
- [slack.md](file://docs/channels/slack.md#L1-L555)
- [whatsapp.md](file://docs/channels/whatsapp.md#L1-L446)
- [signal.md](file://docs/channels/signal.md#L1-L326)
- [imessage.md](file://docs/channels/imessage.md#L1-L368)
- [googlechat.md](file://docs/channels/googlechat.md#L1-L262)
- [msteams.md](file://docs/channels/msteams.md#L1-L777)

**Section sources**
- [discord/index.ts](file://extensions/discord/index.ts#L1-L20)
- [telegram/index.ts](file://extensions/telegram/index.ts#L1-L18)
- [slack/index.ts](file://extensions/slack/index.ts#L1-L18)
- [whatsapp/index.ts](file://extensions/whatsapp/index.ts#L1-L18)
- [signal/index.ts](file://extensions/signal/index.ts#L1-L18)
- [imessage/index.ts](file://extensions/imessage/index.ts#L1-L18)
- [googlechat/index.ts](file://extensions/googlechat/index.ts#L1-L18)
- [msteams/index.ts](file://extensions/msteams/index.ts#L1-L18)

## Core Components
- Plugin registration: Each platform plugin exports an id, name, description, and a register hook that sets the runtime and registers the channel.
- Channel documentation: Each platform has a dedicated documentation page detailing setup, access control, features, and troubleshooting.

Key responsibilities:
- Authentication: Tokens, secrets, service accounts, or device linking per platform.
- Authorization: Allowlists, mention gating, and per-channel/group policies.
- Delivery: Text, media, and interactive components with platform-specific constraints.
- Moderation: Reactions, acknowledgments, and system event mapping.
- Operations: Streaming, chunking, history limits, and webhook/path configuration.

**Section sources**
- [discord/index.ts](file://extensions/discord/index.ts#L7-L16)
- [telegram/index.ts](file://extensions/telegram/index.ts#L6-L14)
- [slack/index.ts](file://extensions/slack/index.ts#L6-L14)
- [whatsapp/index.ts](file://extensions/whatsapp/index.ts#L6-L14)
- [signal/index.ts](file://extensions/signal/index.ts#L6-L14)
- [imessage/index.ts](file://extensions/imessage/index.ts#L6-L14)
- [googlechat/index.ts](file://extensions/googlechat/index.ts#L6-L14)
- [msteams/index.ts](file://extensions/msteams/index.ts#L6-L14)

## Architecture Overview
The runtime integrates each platform via a plugin that registers a channel implementation. The channel consumes inbound events, normalizes them into a shared envelope, applies authorization and routing, and produces outbound messages respecting platform constraints.

```mermaid
sequenceDiagram
participant User as "User"
participant Plugin as "Platform Plugin"
participant Channel as "Channel Implementation"
participant Runtime as "OpenClaw Runtime"
participant Platform as "External Platform"
User->>Plugin : "Configure credentials and policy"
Plugin->>Channel : "registerChannel()"
Channel->>Runtime : "subscribe/instantiate"
Platform-->>Channel : "inbound event"
Channel->>Channel : "normalize + authorize"
Channel->>Runtime : "route to session"
Runtime-->>Channel : "agent response"
Channel->>Platform : "outbound message"
Platform-->>User : "delivery"
```

[No sources needed since this diagram shows conceptual workflow, not actual code structure]

## Detailed Component Analysis

### Discord
- Authentication: Bot token and optional app token; privileged intents required for content and members.
- Access control: DM policy (pairing/allowlist/open/disabled), guild allowlist, per-channel overrides, mention gating.
- Features: Slash commands, interactive components (buttons, selects, modals), reply threading, forum threads, live preview streaming, reaction notifications, ack reactions.
- Attachments: File blocks and media galleries; filename mapping; size limits.
- Rate limiting: Subject to Discord API quotas; chunking and streaming mitigate latency.
- Troubleshooting: Intents, permissions, pairing codes, forum thread creation, component restrictions.

```mermaid
flowchart TD
Start(["Inbound Discord Message"]) --> Normalize["Normalize + enrich context"]
Normalize --> Authorize{"Authorized?<br/>DM/Guild/Channel"}
Authorize --> |No| Block["Drop or prompt pairing"]
Authorize --> |Yes| Route["Route to session<br/>DM/main or guild/channel"]
Route --> ThreadCheck{"Forum/Thread?"}
ThreadCheck --> |Yes| ThreadBind["Apply thread binding if configured"]
ThreadCheck --> |No| Process["Process message"]
ThreadBind --> Process
Process --> Stream{"Streaming enabled?"}
Stream --> |Yes| Preview["Live preview/edit"]
Stream --> |No| Draft["Draft chunks if needed"]
Preview --> Compose["Compose response"]
Draft --> Compose
Compose --> Components{"Components?"}
Components --> |Yes| Render["Render blocks + actions"]
Components --> |No| Plain["Plain text"]
Render --> Send["Send via Discord API"]
Plain --> Send
Send --> End(["Delivered"])
```

**Diagram sources**
- [discord.md](file://docs/channels/discord.md#L254-L326)
- [discord.md](file://docs/channels/discord.md#L368-L460)
- [discord.md](file://docs/channels/discord.md#L553-L617)
- [discord.md](file://docs/channels/discord.md#L619-L686)

**Section sources**
- [discord.md](file://docs/channels/discord.md#L1-L1223)
- [discord/index.ts](file://extensions/discord/index.ts#L1-L20)

### Telegram
- Authentication: Bot token; optional webhook mode with secret and path; long polling default.
- Access control: DM policy, group allowlists, mention gating, exec approvals.
- Features: Live preview edits, HTML fallback, inline buttons, forum topics, stickers, reactions, polls, typing indicators.
- Attachments: Voice/video notes, stickers, media size caps; caching and search.
- Limits: Chunking, retry, history limits, timeout overrides.
- Troubleshooting: Privacy mode, webhook URL/event subscriptions, DNS/HTTPS restrictions.

```mermaid
flowchart TD
In(["Telegram Update"]) --> Parse["Parse update type"]
Parse --> Type{"Message/Reaction/Poll/etc."}
Type --> |Message| Auth["Check DM/group allowlist"]
Type --> |Reaction| ReactGate["Reaction notifications gate"]
Type --> |Poll| PollGate["Poll actions gate"]
Auth --> |Denied| Drop["Ignore"]
Auth --> |Allowed| Session["Resolve session key"]
ReactGate --> Session
PollGate --> Session
Session --> Reply{"Reply threading?"}
Reply --> |Yes| Tag["Apply reply_to tags"]
Reply --> |No| Direct["Direct reply"]
Tag --> Deliver["Send via Telegram API"]
Direct --> Deliver
Deliver --> Out(["Outbound"])
```

**Diagram sources**
- [telegram.md](file://docs/channels/telegram.md#L222-L231)
- [telegram.md](file://docs/channels/telegram.md#L232-L296)
- [telegram.md](file://docs/channels/telegram.md#L297-L393)
- [telegram.md](file://docs/channels/telegram.md#L394-L471)
- [telegram.md](file://docs/channels/telegram.md#L472-L541)
- [telegram.md](file://docs/channels/telegram.md#L542-L640)
- [telegram.md](file://docs/channels/telegram.md#L641-L703)
- [telegram.md](file://docs/channels/telegram.md#L704-L721)
- [telegram.md](file://docs/channels/telegram.md#L722-L763)
- [telegram.md](file://docs/channels/telegram.md#L764-L791)

**Section sources**
- [telegram.md](file://docs/channels/telegram.md#L1-L948)
- [telegram/index.ts](file://extensions/telegram/index.ts#L1-L18)

### Slack
- Authentication: Bot token + app token (Socket Mode) or bot token + signing secret (HTTP Events API).
- Access control: DM policy, channel allowlists, per-channel user allowlists, mention gating.
- Features: Slash commands, block actions, modal interactions, reactions, pins, member info, typing indicators, assistant thread status.
- Media: Inbound file downloads, outbound uploads, chunking, thread replies.
- Streaming: Native Slack streaming via Agents and AI Apps API with start/append/stop.
- Troubleshooting: Socket mode connectivity, HTTP webhook paths, signing secrets, native command registration.

```mermaid
sequenceDiagram
participant Slack as "Slack"
participant Gateway as "OpenClaw"
participant Bot as "Bot Token"
participant Graph as "Graph API (optional)"
Slack->>Gateway : "Event (message/reaction/pin/member)"
Gateway->>Gateway : "Validate signature (HTTP) or connect (Socket)"
Gateway->>Gateway : "Authorize sender (DM/Channel/User allowlists)"
Gateway->>Gateway : "Map to session (direct/channel/group)"
Gateway->>Bot : "Send message (with thread_ts if needed)"
Bot-->>Slack : "Message delivered"
Slack->>Gateway : "Slash command / interaction"
Gateway->>Graph : "Optional : read history/media (Graph)"
Graph-->>Gateway : "Data (if permitted)"
Gateway-->>Slack : "Response (ephemeral or posted)"
```

**Diagram sources**
- [slack.md](file://docs/channels/slack.md#L298-L325)
- [slack.md](file://docs/channels/slack.md#L492-L532)

**Section sources**
- [slack.md](file://docs/channels/slack.md#L1-L555)
- [slack/index.ts](file://extensions/slack/index.ts#L1-L18)

### WhatsApp
- Authentication: QR-based linking via Baileys; per-account credential directories; logout behavior.
- Access control: DM policy, group allowlists, sender allowlists, mention gating, self-chat safeguards.
- Features: Read receipts, pending history injection, media optimization, voice notes, GIF playback, ack reactions.
- Delivery: Text chunking, media size caps, fallback behavior on send failure.
- Troubleshooting: Link status, reconnect loops, active listener requirement, group gating, Bun compatibility.

```mermaid
flowchart TD
WAIn(["WhatsApp Inbound"]) --> Link{"Linked?"}
Link --> |No| Status["Report not linked"]
Link --> |Yes| Accept["Accept message"]
Accept --> Normalize["Normalize + extract context"]
Normalize --> Gate{"Group/DM allowed?"}
Gate --> |No| Ignore["Ignore message"]
Gate --> |Yes| Inject["Inject pending history if configured"]
Inject --> Reply["Prepare reply"]
Reply --> Media{"Media present?"}
Media --> |Yes| Optimize["Optimize/rewrite media"]
Media --> |No| Text["Chunk text"]
Optimize --> Send["Send via Baileys"]
Text --> Send
Send --> Out(["Outbound"])
```

**Diagram sources**
- [whatsapp.md](file://docs/channels/whatsapp.md#L210-L290)
- [whatsapp.md](file://docs/channels/whatsapp.md#L292-L316)
- [whatsapp.md](file://docs/channels/whatsapp.md#L318-L342)

**Section sources**
- [whatsapp.md](file://docs/channels/whatsapp.md#L1-L446)
- [whatsapp/index.ts](file://extensions/whatsapp/index.ts#L1-L18)

### Signal
- Authentication: signal-cli daemon via JSON-RPC + SSE; account number or UUID-based allowlists.
- Access control: DM policy (pairing recommended), group allowlists, mention patterns.
- Features: External daemon mode, typing indicators, read receipts, reactions, media chunking, history limits.
- Delivery: Text chunking, newline preference, media caps, UUID/number targets.
- Troubleshooting: Daemon reachability, pairing approvals, config validation, signal-cli version.

```mermaid
sequenceDiagram
participant User as "User"
participant Daemon as "signal-cli"
participant Gateway as "OpenClaw"
participant Signal as "Signal"
User->>Daemon : "Send message"
Daemon-->>Gateway : "SSE event"
Gateway->>Gateway : "Authorize (DM/group)"
Gateway->>Gateway : "Route to session"
Gateway->>Daemon : "Send reply"
Daemon-->>Signal : "Deliver"
Signal-->>User : "Receive"
```

**Diagram sources**
- [signal.md](file://docs/channels/signal.md#L200-L220)

**Section sources**
- [signal.md](file://docs/channels/signal.md#L1-L326)
- [signal/index.ts](file://extensions/signal/index.ts#L1-L18)

### iMessage
- Authentication: Legacy imsg RPC over stdio; optional remote SSH wrapper; attachment fetching via SCP.
- Access control: DM policy, group allowlists, mention patterns, multi-account support.
- Features: Attachment ingestion, outbound chunking, delivery targets, config writes.
- Troubleshooting: RPC support, permissions (Full Disk Access, Automation), remote attachment paths.

```mermaid
flowchart TD
In(["iMessage RPC"]) --> Auth["Check DM/group allowlist"]
Auth --> |Denied| Skip["Skip message"]
Auth --> |Allowed| Route["Route to session"]
Route --> Attach{"Attachments?"}
Attach --> |Yes| Fetch["Fetch via SCP (if remote)"]
Attach --> |No| Reply["Prepare reply"]
Fetch --> Reply
Reply --> Send["Send via imsg"]
Send --> Done(["Delivered"])
```

**Diagram sources**
- [imessage.md](file://docs/channels/imessage.md#L247-L286)

**Section sources**
- [imessage.md](file://docs/channels/imessage.md#L1-L368)
- [imessage/index.ts](file://extensions/imessage/index.ts#L1-L18)

### Google Chat
- Authentication: Service account with Chat API credentials; webhook audience validation; bearer token verification.
- Access control: DM pairing, group allowlists, mention gating, bot user for detection.
- Features: Webhook-only, typing indicators, reactions, media downloads, targets by user/space.
- Security: Audience type and value enforcement; path exposure via Tailscale Funnel or reverse proxy.
- Troubleshooting: 405 errors, plugin enabled, gateway restart, webhook URL/event subscriptions.

```mermaid
sequenceDiagram
participant GC as "Google Chat"
participant GW as "OpenClaw"
participant SA as "Service Account"
GC->>GW : "Webhook POST /googlechat"
GW->>GW : "Verify Authorization header"
GW->>SA : "Validate audience (URL/project)"
SA-->>GW : "OK"
GW->>GW : "Route by space (DM/group)"
GW-->>GC : "Response"
```

**Diagram sources**
- [googlechat.md](file://docs/channels/googlechat.md#L139-L153)

**Section sources**
- [googlechat.md](file://docs/channels/googlechat.md#L1-L262)
- [googlechat/index.ts](file://extensions/googlechat/index.ts#L1-L18)

### Microsoft Teams
- Authentication: Azure Bot registration (App ID, client secret, tenant ID); Bot Framework webhook endpoint.
- Access control: DM policy, group allowlists, per-team/channel overrides, mention gating.
- Features: Adaptive Cards, polls, file handling (DMs via FileConsentCard; group chats via SharePoint), reply style (threads vs posts).
- Media/history: RSC-only vs Graph API; SharePoint site ID for group file uploads; per-user sharing links.
- Troubleshooting: Webhook timeouts, manifest upload errors, RSC permissions, version mismatches.

```mermaid
flowchart TD
Start(["Teams Webhook"]) --> Validate["Validate Bot Framework token"]
Validate --> Allowed{"Allowed sender?"}
Allowed --> |No| Reject["Reject or ignore"]
Allowed --> |Yes| Resolve["Resolve team/channel/session"]
Resolve --> ReplyStyle{"Reply style?"}
ReplyStyle --> |Thread| Thread["Post in-thread"]
ReplyStyle --> |Top-level| Top["Post top-level"]
Thread --> Cards{"Adaptive Card?"}
Top --> Cards
Cards --> |Yes| AC["Send card"]
Cards --> |No| Text["Send text"]
AC --> End(["Delivered"])
Text --> End
```

**Diagram sources**
- [msteams.md](file://docs/channels/msteams.md#L487-L518)

**Section sources**
- [msteams.md](file://docs/channels/msteams.md#L1-L777)
- [msteams/index.ts](file://extensions/msteams/index.ts#L1-L18)

## Dependency Analysis
- Plugin-to-channel mapping: Each platform plugin registers a channel implementation with the runtime.
- Documentation-to-feature mapping: Each docs page enumerates capabilities, limits, and configuration keys.
- External dependencies: Platform SDKs, service accounts, tokens, and daemon processes vary by platform.

```mermaid
graph LR
P_Discord["discord/index.ts"] --> C_Discord["docs/channels/discord.md"]
P_Telegram["telegram/index.ts"] --> C_Telegram["docs/channels/telegram.md"]
P_Slack["slack/index.ts"] --> C_Slack["docs/channels/slack.md"]
P_WhatsApp["whatsapp/index.ts"] --> C_WhatsApp["docs/channels/whatsapp.md"]
P_Signal["signal/index.ts"] --> C_Signal["docs/channels/signal.md"]
P_iMessage["imessage/index.ts"] --> C_iMessage["docs/channels/imessage.md"]
P_GoogleChat["googlechat/index.ts"] --> C_GoogleChat["docs/channels/googlechat.md"]
P_MS["msteams/index.ts"] --> C_MS["docs/channels/msteams.md"]
```

**Diagram sources**
- [discord/index.ts](file://extensions/discord/index.ts#L1-L20)
- [telegram/index.ts](file://extensions/telegram/index.ts#L1-L18)
- [slack/index.ts](file://extensions/slack/index.ts#L1-L18)
- [whatsapp/index.ts](file://extensions/whatsapp/index.ts#L1-L18)
- [signal/index.ts](file://extensions/signal/index.ts#L1-L18)
- [imessage/index.ts](file://extensions/imessage/index.ts#L1-L18)
- [googlechat/index.ts](file://extensions/googlechat/index.ts#L1-L18)
- [msteams/index.ts](file://extensions/msteams/index.ts#L1-L18)
- [discord.md](file://docs/channels/discord.md#L1-L1223)
- [telegram.md](file://docs/channels/telegram.md#L1-L948)
- [slack.md](file://docs/channels/slack.md#L1-L555)
- [whatsapp.md](file://docs/channels/whatsapp.md#L1-L446)
- [signal.md](file://docs/channels/signal.md#L1-L326)
- [imessage.md](file://docs/channels/imessage.md#L1-L368)
- [googlechat.md](file://docs/channels/googlechat.md#L1-L262)
- [msteams.md](file://docs/channels/msteams.md#L1-L777)

**Section sources**
- [discord/index.ts](file://extensions/discord/index.ts#L1-L20)
- [telegram/index.ts](file://extensions/telegram/index.ts#L1-L18)
- [slack/index.ts](file://extensions/slack/index.ts#L1-L18)
- [whatsapp/index.ts](file://extensions/whatsapp/index.ts#L1-L18)
- [signal/index.ts](file://extensions/signal/index.ts#L1-L18)
- [imessage/index.ts](file://extensions/imessage/index.ts#L1-L18)
- [googlechat/index.ts](file://extensions/googlechat/index.ts#L1-L18)
- [msteams/index.ts](file://extensions/msteams/index.ts#L1-L18)

## Performance Considerations
- Streaming and chunking: Many platforms support live preview or block streaming to improve perceived latency. Tune chunk sizes and modes per platform.
- Media handling: Optimize images and enforce size caps to reduce bandwidth and API costs.
- Rate limiting: Respect platform quotas; implement backoff and retry strategies for transient failures.
- History context: Limit history depth to balance context quality and prompt size.
- Webhook security: Validate signatures and audience claims to prevent abuse and unnecessary load.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- Discord: Verify intents, permissions, pairing codes, forum thread creation, component usage.
- Telegram: Privacy mode, webhook URL/event subscriptions, DNS/HTTPS restrictions, long polling vs webhook.
- Slack: Socket mode connectivity, HTTP webhook paths, signing secrets, native command registration.
- WhatsApp: Link status, reconnect loops, active listener requirement, group gating, Bun compatibility.
- Signal: Daemon reachability, pairing approvals, config validation, signal-cli version.
- iMessage: RPC support, permissions, remote attachment paths, SSH key auth.
- Google Chat: 405 errors, plugin enabled, gateway restart, webhook URL/event subscriptions.
- Microsoft Teams: Webhook timeouts, manifest upload errors, RSC permissions, version mismatches.

**Section sources**
- [discord.md](file://docs/channels/discord.md#L169-L171)
- [discord.md](file://docs/channels/discord.md#L286-L326)
- [telegram.md](file://docs/channels/telegram.md#L793-L800)
- [telegram.md](file://docs/channels/telegram.md#L704-L721)
- [slack.md](file://docs/channels/slack.md#L433-L490)
- [whatsapp.md](file://docs/channels/whatsapp.md#L374-L424)
- [signal.md](file://docs/channels/signal.md#L251-L286)
- [imessage.md](file://docs/channels/imessage.md#L304-L360)
- [googlechat.md](file://docs/channels/googlechat.md#L209-L256)
- [msteams.md](file://docs/channels/msteams.md#L745-L777)

## Conclusion
Each platform integration in OpenClaw balances rich feature sets with platform-specific constraints. Operators should carefully configure authentication, authorization, and delivery policies, and leverage streaming, chunking, and moderation features to provide a responsive and secure user experience. The documentation pages and plugin architecture enable consistent deployment and maintenance across Discord, Telegram, Slack, WhatsApp, Signal, iMessage, Google Chat, and Microsoft Teams.