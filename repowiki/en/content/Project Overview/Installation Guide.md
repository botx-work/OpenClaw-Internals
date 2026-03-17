# Installation Guide

<cite>
**Referenced Files in This Document**
- [README.md](file://README.md)
- [package.json](file://package.json)
- [Dockerfile](file://Dockerfile)
- [Dockerfile.sandbox](file://Dockerfile.sandbox)
- [docker-compose.yml](file://docker-compose.yml)
- [scripts/install.sh](file://scripts/install.sh)
- [scripts/install.ps1](file://scripts/install.ps1)
- [docs/install/index.md](file://docs/install/index.md)
- [docs/install/node.md](file://docs/install/node.md)
- [docs/install/docker.md](file://docs/install/docker.md)
- [docs/install/kubernetes.md](file://docs/install/kubernetes.md)
- [docs/install/nix.md](file://docs/install/nix.md)
- [docs/install/bun.md](file://docs/install/bun.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Quick Installation Methods](#quick-installation-methods)
4. [Standard Installation (npm/pnpm/bun)](#standard-installation-npmpnpmbun)
5. [Development Installation from Source](#development-installation-from-source)
6. [Docker-Based Deployments](#docker-based-deployments)
7. [Nix-Based Installations](#nix-based-installations)
8. [Kubernetes Deployments](#kubernetes-deployments)
9. [Platform-Specific Considerations](#platform-specific-considerations)
10. [Post-Installation Verification](#post-installation-verification)
11. [Troubleshooting Common Issues](#troubleshooting-common-issues)
12. [Choosing the Right Installation Method](#choosing-the-right-installation-method)
13. [Conclusion](#conclusion)

## Introduction

OpenClaw is a personal AI assistant that runs on your own devices, connecting to multiple messaging platforms including WhatsApp, Telegram, Discord, Slack, Google Chat, Signal, iMessage, and many others. This installation guide provides comprehensive coverage of all supported installation methods, from simple package manager installations to complex containerized and orchestrated deployments.

The guide covers:
- Standard installations using npm, pnpm, or bun
- Development installations from source
- Docker-based deployments
- Nix-based installations
- Kubernetes deployments
- Platform-specific requirements and configurations
- Troubleshooting and verification steps

## System Requirements

### Node.js Requirements
OpenClaw requires **Node.js 22.16 or newer**. While Node 24 is the recommended default runtime, the installer script will automatically install Node 24 if missing. The package.json explicitly defines the minimum Node version requirement.

### Operating System Support
- **macOS**: Full support with native app integration
- **Linux**: Complete support for all distributions
- **Windows**: Strongly recommended via WSL2 for optimal experience

### Additional Dependencies
- **pnpm**: Required only for building from source
- **Docker**: Required for Docker-based deployments
- **kubectl**: Required for Kubernetes deployments
- **Nix**: Required for Nix-based installations

**Section sources**
- [package.json:437-439](file://package.json#L437-L439)
- [docs/install/node.md:12](file://docs/install/node.md#L12)
- [docs/install/index.md:14-22](file://docs/install/index.md#L14-L22)

## Quick Installation Methods

### Recommended: Installer Script
The installer script is the most straightforward approach, handling Node detection, installation, and onboarding in a single step.

```bash
# macOS / Linux / WSL2
curl -fsSL https://openclaw.ai/install.sh | bash

# Windows (PowerShell)
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### Package Manager Installation
For users who prefer managing Node themselves:

```bash
# npm (recommended Node 24)
npm install -g openclaw@latest

# pnpm (recommended Node 24)
pnpm add -g openclaw@latest
pnpm approve-builds -g  # approve build scripts

# bun (experimental)
bun add -g openclaw@latest
```

### Skip Onboarding
To install only the binary without running the wizard:

```bash
# macOS / Linux / WSL2
curl -fsSL https://openclaw.ai/install.sh | bash -s -- --no-onboard

# Windows (PowerShell)
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -NoOnboard
```

**Section sources**
- [docs/install/index.md:35-70](file://docs/install/index.md#L35-L70)
- [docs/install/index.md:72-115](file://docs/install/index.md#L72-L115)
- [scripts/install.sh:4-7](file://scripts/install.sh#L4-L7)
- [scripts/install.ps1:1-4](file://scripts/install.ps1#L1-L4)

## Standard Installation (npm/pnpm/bun)

### npm Installation
The npm installation is the most common approach for production environments:

```bash
# Basic installation
npm install -g openclaw@latest

# Run setup wizard with daemon installation
openclaw setup --wizard --install-daemon
```

#### Handling Sharp Build Errors
If you encounter `sharp` build errors due to globally installed libvips:

```bash
# Force prebuilt binaries
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

### pnpm Installation
pnpm provides better dependency management and is recommended for development:

```bash
# Install with pnpm
pnpm add -g openclaw@latest

# Approve build scripts (required for packages with build scripts)
pnpm approve-builds -g

# Run setup wizard
openclaw setup --wizard --install-daemon
```

### bun Installation (Experimental)
Bun offers the fastest local development experience but has limitations:

```bash
# Install with bun
bun add -g openclaw@latest

# Note: Not recommended for production Gateway runtime
```

**Section sources**
- [docs/install/index.md:72-115](file://docs/install/index.md#L72-L115)
- [docs/install/index.md:82-90](file://docs/install/index.md#L82-L90)
- [docs/install/bun.md:14](file://docs/install/bun.md#L14)

## Development Installation from Source

### Prerequisites
- Node.js 22.16+ (automatically handled by installer script)
- pnpm (required for builds)
- Git for cloning the repository

### Step-by-Step Build Process

```bash
# Clone the repository
git clone https://github.com/openclaw/openclaw.git
cd openclaw

# Install dependencies
pnpm install

# Build UI dependencies
pnpm ui:build

# Build the application
pnpm build

# Link globally or use pnpm openclaw
pnpm link --global

# Run setup wizard
openclaw setup --wizard --install-daemon
```

### Development Workflow
For ongoing development, use the watch mode:

```bash
# Start development server with auto-reload
pnpm gateway:watch
```

### Alternative: Direct TypeScript Execution
You can also run OpenClaw directly from TypeScript files:

```bash
# Run without linking
pnpm openclaw setup --wizard --install-daemon
```

**Section sources**
- [docs/install/index.md:117-150](file://docs/install/index.md#L117-L150)
- [README.md:92-111](file://README.md#L92-L111)

## Docker-Based Deployments

### Containerized Gateway Setup

#### Quick Start with Docker Setup Script
```bash
# Run the setup script (recommended)
./docker-setup.sh

# This builds the image, runs onboarding, starts gateway, and generates token
```

#### Manual Docker Compose Flow
```bash
# Build the image
docker build -t openclaw:local -f Dockerfile .

# Run onboarding
docker compose run --rm openclaw-cli onboard

# Start gateway
docker compose up -d openclaw-gateway
```

### Docker Compose Configuration
The docker-compose.yml provides a complete setup with:

- **Gateway Service**: Main OpenClaw container
- **CLI Service**: Interactive container for commands
- **Volume Mounts**: Persists configuration and workspace
- **Port Mapping**: Exposes gateway on port 18789

### Environment Variables
Key environment variables for Docker deployments:

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCLAW_IMAGE` | Custom image name | `openclaw:local` |
| `OPENCLAW_CONFIG_DIR` | Host config directory | `~/.openclaw` |
| `OPENCLAW_WORKSPACE_DIR` | Host workspace directory | `~/.openclaw/workspace` |
| `OPENCLAW_GATEWAY_PORT` | Published gateway port | `18789` |
| `OPENCLAW_GATEWAY_BIND` | Gateway bind mode | `lan` |

### Sandbox Configuration
Enable Docker-based agent sandboxing:

```bash
export OPENCLAW_SANDBOX=1
./docker-setup.sh
```

This mounts the Docker socket and configures sandbox settings for secure tool execution.

### Browser Automation Setup
For browser automation capabilities:

```bash
# Install Chromium browsers during build
docker build --build-arg OPENCLAW_INSTALL_BROWSER=1 .

# Or install at runtime
docker compose run --rm openclaw-cli \
  node /app/node_modules/playwright-core/cli.js install chromium
```

### Health Checks
The Docker image includes built-in health checks:

```bash
# Liveness probe
curl -fsS http://127.0.0.1:18789/healthz

# Readiness probe  
curl -fsS http://127.0.0.1:18789/readyz
```

**Section sources**
- [docs/install/docker.md:35-84](file://docs/install/docker.md#L35-L84)
- [docs/install/docker.md:224-240](file://docs/install/docker.md#L224-L240)
- [docs/install/docker.md:469-495](file://docs/install/docker.md#L469-L495)
- [docker-compose.yml:1-79](file://docker-compose.yml#L1-L79)

## Nix-Based Installations

### Recommended Approach: nix-openclaw
The official Nix installation uses the nix-openclaw repository with Home Manager integration:

```bash
# Follow the nix-openclaw setup guide
# Repository: github:openclaw/nix-openclaw
```

### Nix Mode Runtime Behavior
When `OPENCLAW_NIX_MODE=1` is set:

- Auto-install and self-mutation flows are disabled
- Missing dependencies show Nix-specific remediation messages
- UI displays read-only Nix mode banner

### Configuration Paths in Nix Mode
Set these explicitly for Nix-managed locations:

```bash
export OPENCLAW_HOME=~/.openclaw
export OPENCLAW_STATE_DIR=~/.openclaw
export OPENCLAW_CONFIG_PATH=~/.openclaw/openclaw.json
```

### Benefits of Nix Installation
- **Reproducible installs**: All dependencies pinned to specific versions
- **Rollback capability**: Instant rollback with `home-manager switch --rollback`
- **Declarative configuration**: Everything managed through Nix expressions
- **Isolation**: Pure functional package management

**Section sources**
- [docs/install/nix.md:10-43](file://docs/install/nix.md#L10-L43)
- [docs/install/nix.md:46-81](file://docs/install/nix.md#L46-L81)

## Kubernetes Deployments

### Prerequisites
- Running Kubernetes cluster (any major distribution)
- `kubectl` configured and connected
- API key for at least one model provider

### Quick Start
```bash
# Set your provider API key
export OPENAI_API_KEY="your-api-key-here"

# Deploy with single command
./scripts/k8s/deploy.sh

# Access gateway
kubectl port-forward svc/openclaw 18789:18789 -n openclaw
```

### Deployment Architecture
The Kubernetes deployment consists of:

```
Namespace: openclaw
├── Deployment/openclaw        # Single pod with init container
├── Service/openclaw           # ClusterIP service on port 18789
├── PersistentVolumeClaim      # 10Gi storage for state
├── ConfigMap/openclaw-config  # Application configuration
└── Secret/openclaw-secrets    # API keys and tokens
```

### Customization Options

#### Provider Configuration
Add multiple model providers:

```bash
export ANTHROPIC_API_KEY="..."
export OPENAI_API_KEY="..."
export GOOGLE_API_KEY="..."
./scripts/k8s/deploy.sh --create-secret
./scripts/k8s/deploy.sh
```

#### Namespace Customization
```bash
OPENCLAW_NAMESPACE=my-namespace ./scripts/k8s/deploy.sh
```

#### Image Customization
Edit `scripts/k8s/manifests/deployment.yaml`:

```yaml
image: ghcr.io/openclaw/openclaw:2026.3.1
```

### Production Considerations
- **Network Exposure**: Use Ingress or LoadBalancer for external access
- **TLS Termination**: Configure proper TLS termination
- **Gateway Binding**: Change from loopback to appropriate bind for external access
- **Security Hardening**: Leverages Kubernetes security best practices

**Section sources**
- [docs/install/kubernetes.md:9-52](file://docs/install/kubernetes.md#L9-L52)
- [docs/install/kubernetes.md:84-94](file://docs/install/kubernetes.md#L84-L94)
- [docs/install/kubernetes.md:144-153](file://docs/install/kubernetes.md#L144-L153)

## Platform-Specific Considerations

### macOS Installation
- **Native App**: Full macOS integration with menu bar control
- **Permissions**: Requires appropriate macOS permissions for full functionality
- **Xcode Tools**: Command Line Tools required for native build dependencies

### Linux Installation
- **Distribution Support**: Works on all major Linux distributions
- **Build Dependencies**: May require additional system packages for certain features
- **Desktop Environments**: Full functionality across GNOME, KDE, XFCE, and others

### Windows Installation
- **WSL2 Recommended**: Strongly recommended for optimal experience
- **PowerShell Script**: Automated installer handles Node.js detection and installation
- **Path Configuration**: Automatic PATH updates for seamless command availability

### Containerized Environments
- **Docker**: Production-ready container images with security hardening
- **Resource Requirements**: Minimum 2GB RAM recommended for image builds
- **Persistence**: Configurable volume mounts for state persistence

**Section sources**
- [docs/install/node.md:24-68](file://docs/install/node.md#L24-L68)
- [docs/install/index.md:20-22](file://docs/install/index.md#L20-L22)
- [scripts/install.ps1:50-200](file://scripts/install.ps1#L50-L200)

## Post-Installation Verification

### Basic Health Check
Verify your installation with these commands:

```bash
# Check installation health
openclaw doctor

# Verify gateway status
openclaw status

# Open Control UI in browser
openclaw dashboard
```

### Environment Variables
Configure custom runtime paths if needed:

```bash
# Home directory for internal paths
export OPENCLAW_HOME=~/.openclaw

# Mutable state location  
export OPENCLAW_STATE_DIR=~/.openclaw

# Config file location
export OPENCLAW_CONFIG_PATH=~/.openclaw/openclaw.json
```

### Docker Verification
For Docker installations:

```bash
# Check container health
docker compose ps

# Verify gateway accessibility
curl -fsS http://127.0.0.1:18789/healthz

# View logs
docker compose logs openclaw-gateway
```

### Kubernetes Verification
For Kubernetes deployments:

```bash
# Check pod status
kubectl get pods -n openclaw

# Verify service connectivity
kubectl exec -it deployment/openclaw -n openclaw -- curl -sS http://127.0.0.1:18789/healthz

# View logs
kubectl logs deployment/openclaw -n openclaw -f
```

**Section sources**
- [docs/install/index.md:173-190](file://docs/install/index.md#L173-L190)
- [docs/install/docker.md:469-495](file://docs/install/docker.md#L469-L495)

## Troubleshooting Common Issues

### Node.js PATH Issues
**Problem**: `openclaw: command not found`
**Solution**:
```bash
# Find global npm prefix
npm prefix -g

# Add to PATH (macOS/Linux)
export PATH="$(npm prefix -g)/bin:$PATH"

# Add to PATH (Windows)
# Add output of npm prefix -g to System PATH
```

### Permission Errors (Linux)
**Problem**: `EACCES` errors during npm install
**Solution**:
```bash
# Change npm global prefix to user-writable directory
mkdir -p "$HOME/.npm-global"
npm config set prefix "$HOME/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
```

### Sharp Build Failures
**Problem**: `sharp` fails with global libvips installed
**Solution**:
```bash
# Force prebuilt binaries
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install -g openclaw@latest
```

### Docker Socket Permissions
**Problem**: Cannot access Docker socket in sandbox mode
**Solution**:
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Re-login or run
newgrp docker
```

### Port Conflicts (Docker)
**Problem**: Port 18789 already in use
**Solution**:
```bash
# Change published port
export OPENCLAW_GATEWAY_PORT=18790
./docker-setup.sh
```

### Windows Execution Policy
**Problem**: PowerShell execution policy prevents script execution
**Solution**:
```powershell
# Set execution policy for current process
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Or run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
```

**Section sources**
- [docs/install/node.md:91-139](file://docs/install/node.md#L91-L139)
- [docs/install/index.md:191-214](file://docs/install/index.md#L191-L214)
- [scripts/install.sh:536-673](file://scripts/install.sh#L536-L673)
- [scripts/install.ps1:56-80](file://scripts/install.ps1#L56-L80)

## Choosing the Right Installation Method

### Development and Testing
- **npm/pnpm**: Best for development with hot reload and easy debugging
- **Docker**: Ideal for consistent environments across team members
- **Bun**: Fastest local development but limited production support

### Production Deployments
- **Docker**: Recommended for containerized production environments
- **Kubernetes**: Best for scalable, orchestrated deployments
- **Nix**: Excellent for reproducible, immutable infrastructure

### Platform-Specific Scenarios
- **macOS**: Native installation for full feature support
- **Linux Servers**: Docker or Kubernetes for server deployments
- **Windows**: WSL2 with native installation recommended
- **CI/CD**: Docker images for consistent pipeline execution

### Decision Matrix

| Scenario | Recommended Method | Reason |
|----------|---------------------|---------|
| Local Development | npm/pnpm | Fast iteration, easy debugging |
| Team Development | Docker | Consistent environments |
| Production Server | Docker/Kubernetes | Scalability, monitoring |
| Reproducible Infrastructure | Nix | Immutable, rollback capability |
| Windows Development | WSL2 + npm | Optimal Windows experience |
| CI/CD Pipeline | Docker | Consistent, portable |

### Migration Path
When moving between installation methods:

1. **Export Configuration**: Back up your current configuration
2. **Test New Environment**: Verify functionality in new setup
3. **Gradual Migration**: Phase out old installation
4. **Monitor Performance**: Track any performance differences

**Section sources**
- [docs/install/index.md:24-33](file://docs/install/index.md#L24-L33)
- [docs/install/docker.md:13-17](file://docs/install/docker.md#L13-L17)

## Conclusion

OpenClaw provides flexible installation options to suit various deployment scenarios and technical requirements. The choice of installation method depends on your specific use case, technical expertise, and infrastructure constraints.

**Key Takeaways**:
- The installer script handles most complexity automatically
- Docker provides the most straightforward containerized deployment
- Nix offers the most reproducible and maintainable setup
- Kubernetes enables scalable, production-grade deployments
- Platform-specific considerations are crucial for optimal performance

**Next Steps**:
1. Choose the installation method that best fits your needs
2. Follow the platform-specific instructions
3. Verify installation with the provided health checks
4. Configure environment variables as needed
5. Explore advanced features like sandboxing and multi-agent routing

For any issues or questions, consult the troubleshooting section or reach out to the OpenClaw community through the provided channels.