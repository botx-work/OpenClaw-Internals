# System Requirements

<cite>
**Referenced Files in This Document**
- [package.json](file://package.json)
- [README.md](file://README.md)
- [scripts/install.sh](file://scripts/install.sh)
- [scripts/install.ps1](file://scripts/install.ps1)
- [docs/platforms/windows.md](file://docs/platforms/windows.md)
- [docs/platforms/linux.md](file://docs/platforms/linux.md)
- [docs/platforms/macos.md](file://docs/platforms/macos.md)
- [docs/install/node.md](file://docs/install/node.md)
- [docs/install/index.md](file://docs/install/index.md)
- [docs/install/installer.md](file://docs/install/installer.md)
- [docs/help/environment.md](file://docs/help/environment.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Operating System Compatibility](#operating-system-compatibility)
3. [Runtime Requirements](#runtime-requirements)
4. [Prerequisite Tools](#prerequisite-tools)
5. [Environment Variables and Paths](#environment-variables-and-paths)
6. [Platform-Specific Considerations](#platform-specific-considerations)
7. [Dependency Resolution Guidance](#dependency-resolution-guidance)
8. [Verification Checklist](#verification-checklist)

## Introduction
This document consolidates the system requirements for installing OpenClaw across supported platforms. It covers minimum hardware expectations, operating system compatibility, runtime requirements, prerequisite tools, environment variables, and platform-specific considerations—particularly for Windows WSL2.

## Operating System Compatibility
OpenClaw supports:
- macOS
- Linux
- Windows (via WSL2; strongly recommended)

The installer scripts detect the OS and adapt accordingly:
- macOS and Linux: install Node.js 22+ (if missing) and proceed with installation.
- Windows: PowerShell installer ensures Node.js 22+ and provides both npm and git-based installation methods.

**Section sources**
- [docs/platforms/windows.md](file://docs/platforms/windows.md#L11-L15)
- [docs/platforms/linux.md](file://docs/platforms/linux.md#L11-L11)
- [docs/install/index.md](file://docs/install/index.md#L17-L17)
- [scripts/install.sh](file://scripts/install.sh#L253-L269)
- [scripts/install.ps1](file://scripts/install.ps1#L270-L330)

## Runtime Requirements
- Node.js 22 or newer is required. The installer scripts will detect and install Node 22+ when missing.
- On Windows, the installer checks for Node.js and attempts installation via winget, chocolatey, or scoop if not found.

**Section sources**
- [docs/install/node.md](file://docs/install/node.md#L12-L12)
- [docs/install/node.md](file://docs/install/node.md#L14-L21)
- [scripts/install.sh](file://scripts/install.sh#L74-L75)
- [scripts/install.ps1](file://scripts/install.ps1#L151-L162)

## Prerequisite Tools
- Git is required for both npm and git installation methods. The installer ensures Git is available.
- For building from source, pnpm is required. The repository README recommends pnpm for source builds.

Notes:
- On Linux, the installer can auto-detect and install build tools (make, cmake, gcc, etc.) when native dependencies fail to build.
- On macOS, Xcode Command Line Tools and cmake are recommended for native builds.

**Section sources**
- [docs/install/index.md](file://docs/install/index.md#L18-L18)
- [README.md](file://README.md#L94-L94)
- [scripts/install.sh](file://scripts/install.sh#L568-L620)
- [scripts/install.sh](file://scripts/install.sh#L622-L654)
- [scripts/install.ps1](file://scripts/install.ps1#L174-L200)

## Environment Variables and Paths
OpenClaw supports environment variables for configuration and path customization. The precedence order is designed to avoid overriding existing values unnecessarily.

Key environment variables:
- OPENCLAW_HOME: Overrides the home directory used for internal path resolution.
- OPENCLAW_STATE_DIR: Overrides the state directory (default ~/.openclaw).
- OPENCLAW_CONFIG_PATH: Overrides the config file path (default ~/.openclaw/openclaw.json).
- OPENCLAW_LOG_LEVEL: Overrides log level for file and console output.
- OPENCLAW_LOAD_SHELL_ENV and OPENCLAW_SHELL_ENV_TIMEOUT_MS: Enable importing missing expected keys from the login shell.
- SHARP_IGNORE_GLOBAL_LIBVIPS: Controls sharp/libvips behavior during installation.

Additionally, the installer sets SHARP_IGNORE_GLOBAL_LIBVIPS=1 by default to avoid issues with system libvips.

**Section sources**
- [docs/help/environment.md](file://docs/help/environment.md#L104-L111)
- [docs/help/environment.md](file://docs/help/environment.md#L112-L135)
- [docs/install/installer.md](file://docs/install/installer.md#L147-L162)
- [docs/install/installer.md](file://docs/install/installer.md#L373-L379)

## Platform-Specific Considerations

### Windows (WSL2)
- WSL2 is strongly recommended for Windows installations. The documentation emphasizes a full Linux experience within WSL2.
- Steps to enable systemd (required for gateway service installation), install OpenClaw inside WSL2, and configure auto-start before Windows login are provided.
- For exposing WSL services over LAN, portproxy configuration is documented with examples.

**Section sources**
- [docs/platforms/windows.md](file://docs/platforms/windows.md#L11-L15)
- [docs/platforms/windows.md](file://docs/platforms/windows.md#L162-L184)
- [docs/platforms/windows.md](file://docs/platforms/windows.md#L185-L198)
- [docs/platforms/windows.md](file://docs/platforms/windows.md#L102-L146)

### Linux
- The Gateway is fully supported on Linux. Node is the recommended runtime; Bun is not recommended for the Gateway due to known issues with certain channels.
- The installer script can auto-install build tools on various distributions (apt, pacman, dnf, yum, apk).
- Systemd user service is the default for gateway service installation.

**Section sources**
- [docs/platforms/linux.md](file://docs/platforms/linux.md#L11-L11)
- [docs/platforms/linux.md](file://docs/platforms/linux.md#L12-L12)
- [scripts/install.sh](file://scripts/install.sh#L568-L620)
- [docs/platforms/linux.md](file://docs/platforms/linux.md#L65-L95)

### macOS
- The macOS app serves as a menu-bar companion, manages permissions, and can run or connect to the Gateway locally or remotely.
- The installer can leverage Homebrew to install Node.js on macOS.
- For path-related configuration, OPENCLAW_HOME can be used to isolate the service account's filesystem.

**Section sources**
- [docs/platforms/macos.md](file://docs/platforms/macos.md#L11-L24)
- [scripts/install.sh](file://scripts/install.sh#L71-L71)
- [docs/help/environment.md](file://docs/help/environment.md#L118-L135)

## Dependency Resolution Guidance
Common dependency conflicts and resolutions:
- sharp/libvips build errors: The installer defaults SHARP_IGNORE_GLOBAL_LIBVIPS=1. If you need to build against system libvips, unset this variable or adjust as needed.
- Linux permission errors on npm install (-EACCES): Switch npm's global prefix to a user-writable directory and export the PATH accordingly.
- Missing native build tools: The installer can auto-install build tools on Linux and macOS when npm build failures indicate missing dependencies.

**Section sources**
- [docs/install/index.md](file://docs/install/index.md#L82-L90)
- [docs/install/index.md](file://docs/install/index.md#L128-L139)
- [scripts/install.sh](file://scripts/install.sh#L656-L672)
- [docs/install/installer.md](file://docs/install/installer.md#L369-L379)

## Verification Checklist
Before installation, verify:
- Node.js 22+ is installed and accessible in PATH.
- Git is installed (required for both npm and git install methods).
- On Linux, ensure build tools are available or let the installer handle auto-installation.
- On Windows, ensure WSL2 is configured and systemd is enabled for gateway service installation.
- Confirm environment variables (OPENCLAW_HOME, OPENCLAW_STATE_DIR, OPENCLAW_CONFIG_PATH) if customizing paths.
- After installation, run `openclaw doctor` to validate configuration and resolve any warnings.

**Section sources**
- [docs/install/index.md](file://docs/install/index.md#L164-L171)
- [docs/install/index.md](file://docs/install/index.md#L181-L204)
- [docs/platforms/windows.md](file://docs/platforms/windows.md#L162-L184)
- [docs/help/environment.md](file://docs/help/environment.md#L104-L111)