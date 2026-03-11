# Skill Configuration & Gating

<cite>
**Referenced Files in This Document**
- [index.ts](file://src/plugin-sdk/index.ts)
- [skills.md](file://docs/tools/skills.md)
- [skills-config.md](file://docs/tools/skills-config.md)
- [types.secrets.ts](file://src/config/types.secrets.ts)
- [runtime.ts](file://src/plugin-sdk/runtime.ts)
- [allowlist-resolution.ts](file://src/plugin-sdk/allowlist-resolution.ts)
- [group-access.ts](file://src/plugin-sdk/group-access.ts)
- [runtime-group-policy.ts](file://src/config/runtime-group-policy.ts)
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts)
- [channel-config-helpers.ts](file://src/plugin-sdk/channel-config-helpers.ts)
- [skills.ts](file://src/agents/skills.ts)
- [skill-commands.ts](file://src/auto-reply/skill-commands.ts)
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
This document explains how OpenClaw manages skill configuration, gating, and runtime behavior. It covers:
- Environment variable injection and secret handling
- Permission gating and group policies
- Execution constraints and load-time filtering
- Validation, configuration inheritance, and runtime parameter handling
- Conditional execution patterns, environment-specific configurations, and security gating
- Best practices for secure skill deployment and configuration management

## Project Structure
OpenClaw organizes skill-related logic across documentation, SDK utilities, configuration types, and runtime components:
- Documentation defines configuration schemas and gating rules
- SDK exports helpers for environment, permissions, and runtime
- Configuration types define secret resolution and policy defaults
- Agents and auto-reply orchestrate discovery, filtering, and command mapping

```mermaid
graph TB
subgraph "Documentation"
D1["docs/tools/skills.md"]
D2["docs/tools/skills-config.md"]
end
subgraph "SDK"
S1["src/plugin-sdk/index.ts"]
S2["src/plugin-sdk/runtime.ts"]
S3["src/plugin-sdk/group-access.ts"]
S4["src/plugin-sdk/command-auth.ts"]
S5["src/plugin-sdk/allowlist-resolution.ts"]
S6["src/plugin-sdk/channel-config-helpers.ts"]
end
subgraph "Config"
C1["src/config/types.secrets.ts"]
C2["src/config/runtime-group-policy.ts"]
end
subgraph "Agents/Auto-Reply"
A1["src/agents/skills.ts"]
A2["src/auto-reply/skill-commands.ts"]
end
D1 --> A1
D2 --> A1
A1 --> A2
S1 --> S2
S1 --> S3
S1 --> S4
S1 --> S5
S1 --> S6
S3 --> C2
S4 --> C1
S6 --> C1
A2 --> A1
```

**Diagram sources**
- [skills.md](file://docs/tools/skills.md#L1-L303)
- [skills-config.md](file://docs/tools/skills-config.md#L1-L78)
- [index.ts](file://src/plugin-sdk/index.ts#L1-L812)
- [runtime.ts](file://src/plugin-sdk/runtime.ts#L1-L45)
- [group-access.ts](file://src/plugin-sdk/group-access.ts#L1-L209)
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts#L1-L115)
- [allowlist-resolution.ts](file://src/plugin-sdk/allowlist-resolution.ts#L1-L31)
- [channel-config-helpers.ts](file://src/plugin-sdk/channel-config-helpers.ts#L1-L141)
- [types.secrets.ts](file://src/config/types.secrets.ts#L1-L225)
- [runtime-group-policy.ts](file://src/config/runtime-group-policy.ts#L1-L119)
- [skills.ts](file://src/agents/skills.ts#L1-L47)
- [skill-commands.ts](file://src/auto-reply/skill-commands.ts#L1-L205)

**Section sources**
- [skills.md](file://docs/tools/skills.md#L1-L303)
- [skills-config.md](file://docs/tools/skills-config.md#L1-L78)
- [index.ts](file://src/plugin-sdk/index.ts#L1-L812)

## Core Components
- Skill configuration schema and environment injection are documented and enforced via configuration files and SDK helpers.
- Secret handling supports multiple providers (environment, file, exec) with validation and normalization.
- Group access evaluation and runtime group policy resolution provide permission gating.
- Command authorization integrates allowlists and DM/group policies.
- Agent-side utilities build snapshots, filter skills, and map commands.

**Section sources**
- [skills-config.md](file://docs/tools/skills-config.md#L1-L78)
- [types.secrets.ts](file://src/config/types.secrets.ts#L1-L225)
- [group-access.ts](file://src/plugin-sdk/group-access.ts#L1-L209)
- [runtime-group-policy.ts](file://src/config/runtime-group-policy.ts#L1-L119)
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts#L1-L115)
- [skills.ts](file://src/agents/skills.ts#L1-L47)
- [skill-commands.ts](file://src/auto-reply/skill-commands.ts#L1-L205)

## Architecture Overview
The skill lifecycle spans discovery, gating, configuration application, and runtime execution:

```mermaid
sequenceDiagram
participant User as "User"
participant Agent as "Agent Runtime"
participant Docs as "Skills Docs"
participant SDK as "Plugin SDK"
participant Sec as "Security/Gating"
participant Env as "Environment"
participant Run as "Runtime Env"
User->>Agent : "/skill <name> [args]"
Agent->>Docs : Load skills.md + metadata
Agent->>SDK : Build snapshot + filters
SDK->>Sec : Evaluate gating (bins/env/config)
Sec-->>SDK : Eligibility result
Agent->>Env : Apply env overrides (per-run)
Env-->>Agent : process.env snapshot
Agent->>Run : resolveRuntimeEnv()
Run-->>Agent : RuntimeEnv
Agent-->>User : Execute skill/tool or deny
```

**Diagram sources**
- [skills.md](file://docs/tools/skills.md#L106-L187)
- [skills-config.md](file://docs/tools/skills-config.md#L54-L78)
- [runtime.ts](file://src/plugin-sdk/runtime.ts#L26-L44)
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts#L63-L114)
- [group-access.ts](file://src/plugin-sdk/group-access.ts#L145-L208)

## Detailed Component Analysis

### Skill Configuration Schema and Environment Injection
- Configuration locations and precedence are defined in the skills documentation.
- Global and per-skill environment variables are injected at run-time and restored after completion.
- Sandbox considerations: sandboxed runs do not inherit host environment; use sandbox-specific environment configuration.

```mermaid
flowchart TD
Start(["Agent run start"]) --> ReadMeta["Read skill metadata"]
ReadMeta --> ApplyEnv["Apply skills.entries.<key>.env/apiKey"]
ApplyEnv --> BuildPrompt["Build system prompt with eligible skills"]
BuildPrompt --> RestoreEnv["Restore original process.env"]
RestoreEnv --> End(["Agent run end"])
```

**Diagram sources**
- [skills.md](file://docs/tools/skills.md#L230-L241)
- [skills-config.md](file://docs/tools/skills-config.md#L57-L78)

**Section sources**
- [skills.md](file://docs/tools/skills.md#L13-L77)
- [skills.md](file://docs/tools/skills.md#L189-L241)
- [skills-config.md](file://docs/tools/skills-config.md#L13-L78)

### Secret Resolution and Validation
Secrets support multiple providers and are validated and normalized:
- SecretRef shape and coercion
- Validation of environment template references
- Defaults for legacy and template forms
- Assertions for unresolved references

```mermaid
classDiagram
class SecretRef {
+string source
+string provider
+string id
}
class SecretInput {
<<union>>
}
class SecretsConfig {
+providers
+defaults
+resolution
}
SecretInput --> SecretRef : "coerce"
SecretsConfig --> SecretRef : "resolve"
```

**Diagram sources**
- [types.secrets.ts](file://src/config/types.secrets.ts#L1-L225)

**Section sources**
- [types.secrets.ts](file://src/config/types.secrets.ts#L1-L225)

### Permission Gating and Group Policies
Group access decisions are evaluated based on:
- Provider presence and defaults
- Allowlists and route matching
- Sender allowlist checks
- DM/group policy combinations

```mermaid
flowchart TD
A["Resolve provider runtime group policy"] --> B{"Policy == disabled?"}
B --> |Yes| Deny["Deny access"]
B --> |No| C{"Route enabled?"}
C --> |No| Deny
C --> |Yes| D{"Policy == allowlist?"}
D --> |Yes| E{"Allowlist configured and matched?"}
E --> |No| Deny
E --> |Yes| Allow["Allow access"]
D --> |No| Allow
```

**Diagram sources**
- [runtime-group-policy.ts](file://src/config/runtime-group-policy.ts#L16-L87)
- [group-access.ts](file://src/plugin-sdk/group-access.ts#L53-L143)

**Section sources**
- [runtime-group-policy.ts](file://src/config/runtime-group-policy.ts#L1-L119)
- [group-access.ts](file://src/plugin-sdk/group-access.ts#L1-L209)

### Command Authorization and DM Policy Integration
Command authorization considers:
- DM policy and allowlists
- Effective allowlists derived from configuration and persisted store
- Authorizer composition across owner and group scopes

```mermaid
sequenceDiagram
participant Req as "Incoming Request"
participant Auth as "Command Authorization"
participant DM as "DM Policy"
participant Lists as "Allowlists"
participant Gate as "Access Decision"
Req->>Auth : rawBody, isGroup, dmPolicy
Auth->>DM : Resolve DM outcome
DM-->>Auth : Outcome
Auth->>Lists : Compute effective allowlists
Lists-->>Auth : effectiveAllowFrom, effectiveGroupAllowFrom
Auth->>Gate : Authorizer composition
Gate-->>Req : Authorized or denied
```

**Diagram sources**
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts#L63-L114)
- [skills.md](file://docs/tools/skills.md#L56-L76)

**Section sources**
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts#L1-L115)
- [skills.md](file://docs/tools/skills.md#L69-L76)

### Runtime Environment and Parameter Handling
- RuntimeEnv abstraction enables logging, erroring, and controlled exits.
- Environment resolution supports overriding defaults and unavailable exit scenarios.

```mermaid
classDiagram
class RuntimeEnv {
+log(...)
+error(...)
+exit(code)
}
class RuntimeResolvers {
+resolveRuntimeEnv()
+resolveRuntimeEnvWithUnavailableExit()
}
RuntimeResolvers --> RuntimeEnv : "returns"
```

**Diagram sources**
- [runtime.ts](file://src/plugin-sdk/runtime.ts#L9-L44)

**Section sources**
- [runtime.ts](file://src/plugin-sdk/runtime.ts#L1-L45)

### Configuration Inheritance and Channel Scoping
- Helpers provide scoped accessors for channel accounts and allowlists.
- Normalize and format allowlist entries consistently across channels.

```mermaid
flowchart TD
Cfg["OpenClawConfig"] --> Acc["Resolve Account"]
Acc --> AF["Resolve AllowFrom"]
AF --> Fmt["Format AllowFrom Entries"]
Fmt --> Use["Use in gating and commands"]
```

**Diagram sources**
- [channel-config-helpers.ts](file://src/plugin-sdk/channel-config-helpers.ts#L33-L60)
- [channel-config-helpers.ts](file://src/plugin-sdk/channel-config-helpers.ts#L107-L141)

**Section sources**
- [channel-config-helpers.ts](file://src/plugin-sdk/channel-config-helpers.ts#L1-L141)

### Skill Discovery, Filtering, and Command Mapping
- Agent utilities build snapshots, filter skills, and compute commands.
- Command mapping deduplicates by skill name and resolves invocations.

```mermaid
sequenceDiagram
participant Agent as "Agent"
participant Disc as "Discovery"
participant Filter as "Filtering"
participant Cmd as "Command Specs"
Agent->>Disc : Scan workspace + managed + bundled
Disc-->>Agent : Candidate skills
Agent->>Filter : Apply gating (metadata, bins, env, config)
Filter-->>Agent : Eligible skills
Agent->>Cmd : Build command specs
Cmd-->>Agent : Unique command list
```

**Diagram sources**
- [skills.ts](file://src/agents/skills.ts#L26-L34)
- [skill-commands.ts](file://src/auto-reply/skill-commands.ts#L36-L129)

**Section sources**
- [skills.ts](file://src/agents/skills.ts#L1-L47)
- [skill-commands.ts](file://src/auto-reply/skill-commands.ts#L1-L205)

## Dependency Analysis
The following diagram highlights key dependencies among components involved in skill gating and configuration:

```mermaid
graph LR
SecTypes["types.secrets.ts"] --> CmdAuth["command-auth.ts"]
SecTypes --> ChanCfg["channel-config-helpers.ts"]
RGP["runtime-group-policy.ts"] --> GrAcc["group-access.ts"]
SDKIdx["plugin-sdk/index.ts"] --> Runt["runtime.ts"]
SDKIdx --> GrAcc
SDKIdx --> CmdAuth
SDKIdx --> ChanCfg
DocsS["skills.md"] --> Agents["agents/skills.ts"]
DocsCfg["skills-config.md"] --> Agents
Agents --> Cmds["auto-reply/skill-commands.ts"]
```

**Diagram sources**
- [types.secrets.ts](file://src/config/types.secrets.ts#L1-L225)
- [runtime-group-policy.ts](file://src/config/runtime-group-policy.ts#L1-L119)
- [group-access.ts](file://src/plugin-sdk/group-access.ts#L1-L209)
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts#L1-L115)
- [channel-config-helpers.ts](file://src/plugin-sdk/channel-config-helpers.ts#L1-L141)
- [runtime.ts](file://src/plugin-sdk/runtime.ts#L1-L45)
- [index.ts](file://src/plugin-sdk/index.ts#L1-L812)
- [skills.md](file://docs/tools/skills.md#L1-L303)
- [skills-config.md](file://docs/tools/skills-config.md#L1-L78)
- [skills.ts](file://src/agents/skills.ts#L1-L47)
- [skill-commands.ts](file://src/auto-reply/skill-commands.ts#L1-L205)

**Section sources**
- [index.ts](file://src/plugin-sdk/index.ts#L1-L812)

## Performance Considerations
- Skills snapshot caching reduces repeated computation across turns within a session.
- Watcher refreshes enable hot reload when SKILL.md changes.
- Prompt token overhead from skills list is deterministic and depends on the number and length of skill fields.

**Section sources**
- [skills.md](file://docs/tools/skills.md#L242-L286)

## Troubleshooting Guide
- Unresolved SecretRef errors indicate missing or misconfigured secret providers; ensure providers are defined and resolvable before reading sensitive values.
- Group policy warnings highlight missing provider configuration; configure groupPolicy explicitly or provide provider credentials.
- Command authorization failures often stem from missing allowlists or DM policy restrictions; verify effective allowlists and sender eligibility.

**Section sources**
- [types.secrets.ts](file://src/config/types.secrets.ts#L125-L142)
- [runtime-group-policy.ts](file://src/config/runtime-group-policy.ts#L91-L111)
- [command-auth.ts](file://src/plugin-sdk/command-auth.ts#L63-L114)

## Conclusion
OpenClaw’s skill configuration and gating system combines declarative metadata, robust secret handling, and flexible group policies to enforce secure and predictable execution. By leveraging environment injection, runtime policy resolution, and command authorization, operators can tailor skill availability and invocation to their operational context while maintaining strong security boundaries.

## Appendices

### Best Practices for Secure Skill Deployment and Configuration Management
- Treat third-party skills as untrusted; review before enabling.
- Prefer sandboxed runs for untrusted inputs and risky tools.
- Use secrets configuration to avoid embedding credentials in prompts or logs.
- Configure group policies explicitly to avoid fallbacks that inadvertently restrict or expose functionality.
- Keep environment variables scoped to agent runs and avoid global shell pollution.
- Validate gating criteria (binaries, environment variables, configuration paths) prior to enabling skills.

[No sources needed since this section provides general guidance]