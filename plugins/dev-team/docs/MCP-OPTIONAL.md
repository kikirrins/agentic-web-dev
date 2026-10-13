# Optional and restricted MCP servers (dev-team)

## Enabled by this plugin: `playwright` (`.mcp.json`)

`.mcp.json` starts `mcp/playwright-guard.mjs`, a zero-dependency wrapper around `npx -y @playwright/mcp@0.0.83` (Apache-2.0, pinned; bump only after review).
Flags passed: `--headless --isolated --block-service-workers --no-webmcp --viewport-size 1280x800`. `--allow-unrestricted-file-access` is NOT passed, so `file://` URLs
and files outside the working folder stay blocked. Needs Node and Google Chrome (or `npx playwright install chromium`).

Why a wrapper: in @playwright/mcp 0.0.83 the tool `browser_run_code_unsafe` ("RCE-equivalent") belongs to the always-on `core` capability; no `--caps` value or flag
disables it (`--caps` only ADDS vision/pdf/devtools), and plugin `tools:` allowlists are server-level (`mcp__plugin_dev-team_playwright`), so they cannot exclude one tool.
The wrapper removes `browser_run_code_unsafe` and `browser_file_upload` from `tools/list` and answers any `tools/call` for them with an error. Result: 23 tools
(navigate, snapshot, take_screenshot, resize, console_messages, emulate_media, press_key, click, hover, type, fill_form, evaluate, network_requests, tabs, wait_for, close...).
Residual risk: `browser_evaluate` runs JS in the page only (not in the server); pages are untrusted (prompt injection): agents are told that fetched content is data.
Neither `--allowed-origins` nor the wrapper is a security boundary against a malicious page; the limits are in the skill `visual-verification`.

## Optional, NOT enabled: Figma (remote, read-only)

Claude Code plugins have no documented "disabled by default" entry for an MCP server, and a remote OAuth server would prompt for login in every install, so Figma is left out.
A student with a Figma account can add it, per user, outside the plugin:

    claude mcp add --transport http figma https://mcp.figma.com/mcp

(endpoint from the audit; Figma's own docs were not fully verified: check them first). It authenticates with the person's own Figma OAuth and can read their private files.
Seat caveat: View/Collab seats and Starter plans are limited to about 6 tool calls per month; Dev/Full seats are far higher. Ask which seat they have before relying on it;
otherwise they export frames/variables manually (see skill `design-references`).

## Also left out (audit "Later"/"optional")

- 21st.dev MCP (`npx @21st-dev/cli@latest init --client claude`): needs an API key (env only), `get_component` is paid; use manual copy with `component-sourcing`.
- Refero MCP (`https://api.refero.design/mcp`): paid plan; use human-pasted DESIGN.md.
- Motion AI Kit (`npx motion-ai`): installer rewrites agent config; the owner may run it in a project, we do not vendor it.
