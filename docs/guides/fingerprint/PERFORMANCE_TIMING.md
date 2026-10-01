# Performance Timing Protection

> Keep browser-visible timing behavior consistent with the active fingerprint profile.

## Why Use It

Websites can combine navigation, resource, and connection timing values into a profile of the browser environment. Proxy routing, host load, and platform differences can make those values inconsistent with the identity presented by the active profile.

`--bot-performance-timing` applies the profile's timing policy to supported browser-visible timing surfaces. It is intended for sessions where timing consistency matters across pages, workers, and BrowserContexts.

The policy addresses a common mismatch: the browser can present one profile while connection timing still reflects the host machine, proxy route, or platform. A site can compare the timing stages rather than looking at one value in isolation. BotBrowser keeps the reported stages ordered and consistent with the active profile while preserving the normal zero values for stages that do not apply, such as a reused connection or a request without TLS.

## Requirements

- ENT Tier3 or higher.
- A profile package with Performance Timing Protection enabled.
- Set the flag before the first page or worker starts.

The policy is resolved per BrowserContext. A context without the required entitlement remains disabled even when another context enables the feature.

## Usage

Enable the standard policy:

```bash
chromium-browser \
  --bot-profile="/path/to/profile.enc" \
  --bot-performance-timing=basic
```

Use the extended policy when the profile supports it:

```bash
chromium-browser \
  --bot-profile="/path/to/profile.enc" \
  --bot-performance-timing=advanced
```

A bare `--bot-performance-timing` is equivalent to `basic`. Omit the flag or use `--bot-performance-timing=false` to leave the policy disabled.

## Modes

| Value | Behavior |
|-------|----------|
| `basic` | Applies the standard profile-backed policy to connection-stage values such as DNS lookup, connection start/end, and secure-connection timing when those stages exist. |
| `advanced` | Extends the policy across supported navigation and resource timing entries, including the related legacy timing view, so the stages remain coherent from connection through response completion. |
| `false` | Disables the policy. |

`basic` is useful when the main concern is a profile and connection route exposing different timing characteristics. `advanced` is intended for workflows that also inspect navigation and resource timing entries together. It keeps the later request, response, document, and load stages internally consistent instead of changing only one connection value.

The feature changes values exposed to browser content. It does not change the actual proxy route, server processing time, or network transport.

## Related Flags

- [`--bot-time-seed`](../../../CLI_FLAGS.md#flag-bot-time-seed) controls deterministic execution timing diversity.
- [`--bot-time-scale`](../../../CLI_FLAGS.md#flag-bot-time-scale) compresses high-resolution timing intervals.

These flags address different timing surfaces and can be used together when the active profile supports them.

**Related documentation:** [Performance Fingerprinting](PERFORMANCE.md) · [Advanced Features](../../../ADVANCED_FEATURES.md#performance-timing-protection) · [CLI Flags Reference](../../../CLI_FLAGS.md#flag-bot-performance-timing)

---

**[Legal Disclaimer & Terms of Use](https://github.com/botswin/BotBrowser/blob/main/DISCLAIMER.md) • [Responsible Use Guidelines](https://github.com/botswin/BotBrowser/blob/main/RESPONSIBLE_USE.md)**. BotBrowser is for authorized fingerprint protection and privacy research only.
