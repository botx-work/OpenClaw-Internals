# Performance Profiling & Benchmarking

<cite>
**Referenced Files in This Document**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts)
- [bench-model.ts](file://scripts/bench-model.ts)
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs)
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh)
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh)
- [run.ts](file://src/agents/pi-embedded-runner/run.ts)
- [service.ts](file://extensions/diagnostics-otel/src/service.ts)
- [status.ts](file://src/auto-reply/status.ts)
- [memory-cli.ts](file://src/cli/memory-cli.ts)
- [usage.ts](file://src/agents/auth-profiles/usage.ts)
- [scan.ts](file://src/commands/models/scan.ts)
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts)
- [profiler.prose](file://extensions/open-prose/skills/prose/lib/profiler.prose)
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
This document describes performance profiling and benchmarking practices in OpenClaw. It focuses on identifying bottlenecks in gateway operations, agent processing, and plugin execution, and provides methodologies for measuring memory usage, CPU utilization, and I/O performance. It also outlines benchmarking approaches for model inference, message processing, and concurrent session handling, along with practical examples, metric interpretation, and optimization strategies grounded in the repository’s existing scripts and instrumentation.

## Project Structure
OpenClaw includes dedicated benchmarking and profiling assets across scripts, platform-specific tooling, and internal instrumentation:
- CLI startup and unit test performance benchmarks
- Android macrobenchmarking and CPU hotspots collection
- Agent usage accounting and token/context metrics
- OTel-based observability for latency, tokens, and cost
- UI usage aggregation and display

```mermaid
graph TB
subgraph "Benchmark Scripts"
A["scripts/bench-cli-startup.ts"]
B["scripts/bench-model.ts"]
C["scripts/test-perf-budget.mjs"]
end
subgraph "Android Perf"
D["apps/android/scripts/perf-startup-benchmark.sh"]
E["apps/android/scripts/perf-startup-hotspots.sh"]
end
subgraph "Agent Metrics"
F["src/agents/pi-embedded-runner/run.ts"]
G["src/auto-reply/status.ts"]
H["src/agents/auth-profiles/usage.ts"]
end
subgraph "OTel Observability"
I["extensions/diagnostics-otel/src/service.ts"]
end
subgraph "CLI & UI"
J["src/cli/memory-cli.ts"]
K["ui/src/ui/views/usage-metrics.ts"]
end
L["extensions/open-prose/skills/profiler.prose"]
A --> I
B --> I
C --> I
D --> I
E --> I
F --> I
G --> I
H --> I
J --> I
K --> I
L --> I
```

**Diagram sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L1-L201)
- [bench-model.ts](file://scripts/bench-model.ts#L1-L147)
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs#L1-L128)
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L1-L125)
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L1-L155)
- [run.ts](file://src/agents/pi-embedded-runner/run.ts#L121-L177)
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)
- [status.ts](file://src/auto-reply/status.ts#L306-L343)
- [usage.ts](file://src/agents/auth-profiles/usage.ts#L84-L234)
- [memory-cli.ts](file://src/cli/memory-cli.ts#L657-L686)
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)
- [profiler.prose](file://extensions/open-prose/skills/profiler.prose#L317-L357)

**Section sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L1-L201)
- [bench-model.ts](file://scripts/bench-model.ts#L1-L147)
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs#L1-L128)
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L1-L125)
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L1-L155)
- [run.ts](file://src/agents/pi-embedded-runner/run.ts#L121-L177)
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)
- [status.ts](file://src/auto-reply/status.ts#L306-L343)
- [usage.ts](file://src/agents/auth-profiles/usage.ts#L84-L234)
- [memory-cli.ts](file://src/cli/memory-cli.ts#L657-L686)
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)
- [profiler.prose](file://extensions/open-prose/skills/profiler.prose#L317-L357)

## Core Components
- CLI startup benchmark: measures command execution times and exit characteristics across multiple runs and entries.
- Model inference benchmark: executes model completions and aggregates timing and usage metrics.
- Test performance budget: enforces wall-clock and regression budgets during unit test runs.
- Android macrobenchmark: captures cold-start metrics and optionally compares against a baseline snapshot.
- Android CPU hotspots: collects and summarizes CPU profiles to identify hotspots during startup.
- Agent usage accounting: accumulates token usage, cache metrics, and context sizes across agent runs.
- OTel observability: records latency, token counts, cost, and context metrics for downstream analysis.
- UI usage aggregation: consolidates usage by provider, agent, and channel for dashboards.

**Section sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L68-L154)
- [bench-model.ts](file://scripts/bench-model.ts#L50-L79)
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs#L61-L127)
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L62-L124)
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L104-L154)
- [run.ts](file://src/agents/pi-embedded-runner/run.ts#L157-L177)
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)

## Architecture Overview
The performance pipeline integrates external benchmarking scripts with internal metrics and observability:

```mermaid
sequenceDiagram
participant Dev as "Developer"
participant BenchCLI as "bench-cli-startup.ts"
participant BenchModel as "bench-model.ts"
participant AndroidBench as "perf-startup-benchmark.sh"
participant AndroidHotspot as "perf-startup-hotspots.sh"
participant Agent as "pi-embedded-runner/run.ts"
participant OTel as "diagnostics-otel service.ts"
participant UI as "usage-metrics.ts"
Dev->>BenchCLI : "Run startup benchmark"
BenchCLI-->>Dev : "avg/p50/p95/min/max + exits"
Dev->>BenchModel : "Run model inference benchmark"
BenchModel-->>Dev : "median/min/max per model"
Dev->>AndroidBench : "Run cold-start macrobenchmark"
AndroidBench-->>Dev : "median/min/max/CV + baseline delta"
Dev->>AndroidHotspot : "Capture CPU profile"
AndroidHotspot-->>Dev : "DSO/Symbol hotspots + children"
Agent->>OTel : "Emit usage/latency/context/cost"
OTel-->>Dev : "Metrics for analysis"
UI->>OTel : "Aggregate usage by provider/agent/channel"
UI-->>Dev : "Usage dashboard"
```

**Diagram sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L156-L200)
- [bench-model.ts](file://scripts/bench-model.ts#L81-L146)
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L62-L124)
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L104-L154)
- [run.ts](file://src/agents/pi-embedded-runner/run.ts#L157-L177)
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)

## Detailed Component Analysis

### CLI Startup Benchmark
Measures command execution time and exit conditions across multiple runs. Provides average, median, 95th percentile, min, and max timings, plus exit code distribution.

```mermaid
flowchart TD
Start(["Start"]) --> Parse["Parse flags<br/>--entry/--entry-secondary/--runs/--timeout-ms"]
Parse --> Cases["Iterate default command cases"]
Cases --> Spawn["Spawn Node process with dist entry"]
Spawn --> Time["Measure elapsed time"]
Time --> Collect["Collect exit code/signal"]
Collect --> Stats["Compute avg/p50/p95/min/max"]
Stats --> ExitSummary["Summarize exits"]
ExitSummary --> Report["Print per-case stats"]
Report --> Compare{"Secondary entry?"}
Compare --> |Yes| Delta["Compute delta and percent change"]
Compare --> |No| End(["Done"])
Delta --> End
```

**Diagram sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L28-L154)

**Section sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L68-L154)

### Model Inference Benchmark
Executes model completions with a fixed prompt and records duration and usage metrics. Aggregates median/min/max durations for comparison.

```mermaid
sequenceDiagram
participant Dev as "Developer"
participant BM as "bench-model.ts"
participant Provider as "Model Provider"
Dev->>BM : "Set --runs and --prompt"
BM->>Provider : "completeSimple(prompt, apiKey, options)"
Provider-->>BM : "Response with usage"
BM->>BM : "Record durationMs and usage"
BM-->>Dev : "Per-run logs and summary"
```

**Diagram sources**
- [bench-model.ts](file://scripts/bench-model.ts#L50-L79)
- [bench-model.ts](file://scripts/bench-model.ts#L115-L138)

**Section sources**
- [bench-model.ts](file://scripts/bench-model.ts#L50-L79)
- [bench-model.ts](file://scripts/bench-model.ts#L115-L138)

### Test Performance Budget
Enforces wall-clock and regression budgets for unit tests, capturing Vitest JSON reporter output to derive per-file durations.

```mermaid
flowchart TD
Start(["Start"]) --> Parse["Parse --config/--max-wall-ms/--baseline-wall-ms/--max-regression-pct"]
Parse --> RunVitest["Run vitest with JSON reporter"]
RunVitest --> ParseJSON["Read JSON report and compute file-sum duration"]
ParseJSON --> CheckBudget{"Exceeds max wall or baseline budget?"}
CheckBudget --> |Yes| Fail["Log failure and exit 1"]
CheckBudget --> |No| Log["Log wall/file-sum/files and pass"]
Log --> End(["Done"])
Fail --> End
```

**Diagram sources**
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs#L61-L127)

**Section sources**
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs#L61-L127)

### Android Macrobenchmark (Cold Start)
Runs a connected Android macrobenchmark, extracts cold-start metrics, snapshots results, and optionally compares to a baseline.

```mermaid
sequenceDiagram
participant Dev as "Developer"
participant Script as "perf-startup-benchmark.sh"
Dev->>Script : "Execute with optional --baseline"
Script->>Device : "Run Gradle connectedDebugAndroidTest"
Script->>Script : "Locate latest benchmarkData.json"
Script->>Script : "Copy snapshot to results dir"
Script->>Script : "Parse median/min/max/CV and device info"
Script-->>Dev : "Compact summary and baseline delta"
```

**Diagram sources**
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L62-L124)

**Section sources**
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L62-L124)

### Android CPU Hotspots
Captures CPU profiles during startup and prints top DSOs, symbols, and children to identify hotspots.

```mermaid
flowchart TD
Start(["Start"]) --> Setup["Resolve simpleperf path and defaults"]
Setup --> Install["Install debug APK"]
Install --> Capture["Run app_profiler.py to capture perf.data"]
Capture --> ReportDSO["Generate DSO CSV"]
Capture --> ReportSymbols["Generate Symbol CSV"]
Capture --> ReportChildren["Generate Children report"]
ReportDSO --> Summarize["Print top DSO/Symbol and children clues"]
ReportSymbols --> Summarize
ReportChildren --> Summarize
Summarize --> End(["Done"])
```

**Diagram sources**
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L104-L154)

**Section sources**
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L104-L154)

### Agent Usage Accounting and Token/Context Metrics
Accumulates token usage, cache reads/writes, and context sizes across agent runs, normalizing and merging usage into an accumulator.

```mermaid
flowchart TD
Start(["Start"]) --> Normalize["Normalize usage values"]
Normalize --> HasValues{"Has valid usage?"}
HasValues --> |No| End(["Skip"])
HasValues --> |Yes| Merge["Merge into accumulator:<br/>input/output/cacheRead/cacheWrite/total"]
Merge --> Last["Track last cache/input for accurate context reporting"]
Last --> End(["Done"])
```

**Diagram sources**
- [run.ts](file://src/agents/pi-embedded-runner/run.ts#L149-L177)

**Section sources**
- [run.ts](file://src/agents/pi-embedded-runner/run.ts#L149-L177)

### OTel Observability (Latency, Tokens, Cost, Context)
Records latency, token counts, cost, and context metrics for downstream analysis and alerting.

```mermaid
sequenceDiagram
participant Agent as "Agent Runner"
participant OTel as "OTel Service"
Agent->>OTel : "usage{input,output,cacheRead,cacheWrite,prompt,total}"
Agent->>OTel : "costUsd, durationMs"
Agent->>OTel : "context{limit,used}"
OTel->>OTel : "Add token counters and record histograms"
OTel-->>Agent : "Metrics exported"
```

**Diagram sources**
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)

**Section sources**
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)

### UI Usage Aggregation
Aggregates usage totals by provider, agent, and channel for dashboards and reporting.

```mermaid
flowchart TD
Start(["Start"]) --> Iterate["Iterate sessions and usage entries"]
Iterate --> Provider["Merge totals by provider"]
Iterate --> Agent["Merge totals by agentId"]
Iterate --> Channel["Merge totals by channel"]
Provider --> Latency["Merge latency totals"]
Agent --> Latency
Channel --> Latency
Latency --> End(["Render usage metrics"])
```

**Diagram sources**
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)

**Section sources**
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)

### Profiling Analysis Script (Prose Skill)
Provides structured analysis prompts for profiling data, focusing on cost attribution, time attribution, efficiency, cache efficiency, and hotspots.

```mermaid
flowchart TD
Start(["Start"]) --> Load["Load profiling data and pre-calculated metrics"]
Load --> Analyze["Run analyzer prompt"]
Analyze --> Output["Output insights:<br/>cost/time attribution, efficiency,<br/>cache ratios, hotspots"]
Output --> End(["Done"])
```

**Diagram sources**
- [profiler.prose](file://extensions/open-prose/skills/prose/lib/profiler.prose#L317-L357)

**Section sources**
- [profiler.prose](file://extensions/open-prose/skills/prose/lib/profiler.prose#L317-L357)

## Dependency Analysis
The following diagram shows how benchmarking and profiling components relate to internal metrics and observability:

```mermaid
graph LR
BenchCLI["bench-cli-startup.ts"] --> OTel["diagnostics-otel service.ts"]
BenchModel["bench-model.ts"] --> OTel
TestBudget["test-perf-budget.mjs"] --> OTel
AndroidBench["perf-startup-benchmark.sh"] --> OTel
AndroidHotspot["perf-startup-hotspots.sh"] --> OTel
AgentRun["pi-embedded-runner/run.ts"] --> OTel
Status["auto-reply/status.ts"] --> OTel
Usage["agents/auth-profiles/usage.ts"] --> OTel
MemoryCLI["cli/memory-cli.ts"] --> OTel
UsageMetrics["ui/views/usage-metrics.ts"] --> OTel
ProfilerProse["open-prose profiler.prose"] --> OTel
```

**Diagram sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L156-L200)
- [bench-model.ts](file://scripts/bench-model.ts#L81-L146)
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs#L61-L127)
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L62-L124)
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L104-L154)
- [run.ts](file://src/agents/pi-embedded-runner/run.ts#L157-L177)
- [status.ts](file://src/auto-reply/status.ts#L306-L343)
- [usage.ts](file://src/agents/auth-profiles/usage.ts#L84-L234)
- [memory-cli.ts](file://src/cli/memory-cli.ts#L657-L686)
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)
- [profiler.prose](file://extensions/open-prose/skills/prose/lib/profiler.prose#L317-L357)

**Section sources**
- [service.ts](file://extensions/diagnostics-otel/src/service.ts#L389-L426)
- [usage-metrics.ts](file://ui/src/ui/views/usage-metrics.ts#L407-L431)

## Performance Considerations
- Memory usage patterns
  - Monitor indexing progress and ETA to infer throughput and memory pressure during large operations.
  - Use cache hit rates and token counts to detect memory-heavy operations and potential overfetching.
- CPU utilization tracking
  - Use Android CPU hotspots to identify hot DSOs and symbols during startup and agent runs.
  - Correlate hotspots with agent bindings and tool invocations to prioritize optimization.
- I/O performance measurement
  - Measure cold-start times and coefficient of variation to assess stability and responsiveness.
  - Track token and cost metrics to infer I/O-heavy providers and optimize batching or caching.
- Benchmarking methodologies
  - Model inference: run multiple iterations with fixed prompts and compare median/min/max durations and usage.
  - Message processing: instrument agent loops and tool calls to measure latency and throughput.
  - Concurrent sessions: scale up sessions and monitor latency, cache hit rates, and cost growth to identify saturation points.
- Practical examples
  - Use CLI startup benchmark to compare entry points and detect regressions.
  - Use Android macrobenchmark to track cold-start stability and regressions against baselines.
  - Use OTel metrics to correlate latency with token usage and cost for cost-efficiency analysis.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
- CLI startup benchmark shows unexpected exit codes or signals
  - Review exit summaries and adjust timeouts or environment flags.
  - Compare primary and secondary entries to isolate regressions.
- Model benchmark missing environment keys
  - Ensure required API keys are set before running model inference benchmark.
- Android macrobenchmark fails to produce results
  - Verify device connectivity, permissions, and that benchmark artifacts are generated.
  - Confirm baseline file path if comparing against historical snapshots.
- Android CPU hotspots capture fails
  - Ensure simpleperf is available via NDK and device supports profiling.
  - Adjust capture duration and filters to avoid timeouts.
- Test performance budget exceeded
  - Investigate wall-clock and regression thresholds; adjust baseline or investigate flaky tests.

**Section sources**
- [bench-cli-startup.ts](file://scripts/bench-cli-startup.ts#L117-L127)
- [bench-model.ts](file://scripts/bench-model.ts#L85-L92)
- [perf-startup-benchmark.sh](file://apps/android/scripts/perf-startup-benchmark.sh#L49-L53)
- [perf-startup-hotspots.sh](file://apps/android/scripts/perf-startup-hotspots.sh#L72-L87)
- [test-perf-budget.mjs](file://scripts/test-perf-budget.mjs#L104-L117)

## Conclusion
OpenClaw provides a robust foundation for performance profiling and benchmarking across CLI, model inference, Android startup, and agent processing. By combining deterministic benchmarks, macrobenchmarks, CPU profiling, and OTel-based metrics, teams can identify bottlenecks, enforce budgets, and iteratively optimize throughput, latency, and cost.

[No sources needed since this section summarizes without analyzing specific files]

## Appendices
- Benchmarking checklist
  - Define baseline and targets for startup, inference, and concurrency.
  - Instrument latency, tokens, cost, and context metrics.
  - Capture CPU profiles during hotspots and correlate with agent/tool activity.
  - Enforce test performance budgets to prevent regressions.
- Metric interpretation guide
  - Startup: focus on median and CV; investigate outliers and baseline deltas.
  - Inference: compare median/min/max; track token and cost per run.
  - Agent usage: monitor cache hit rate and context size; flag excessive cache reads/writes.
  - Concurrency: observe latency increases and cost growth with session count.

[No sources needed since this section provides general guidance]