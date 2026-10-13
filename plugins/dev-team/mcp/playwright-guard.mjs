#!/usr/bin/env node
// Guarded launcher for the Playwright MCP server (dev-team plugin). Zero dependencies.
//
// Why this exists: @playwright/mcp always exposes `browser_run_code_unsafe` (it is a "core" tool: no flag or
// --caps value turns it off) and the plugin tool allowlist is server-level (`mcp__plugin_dev-team_playwright`),
// so it cannot exclude one tool. This wrapper starts the real server as a child process, removes the denied tools
// from `tools/list` and rejects any `tools/call` for them, so an agent can never see or run them.
//
// Denied: browser_run_code_unsafe (arbitrary JS in the server process, RCE-equivalent) and browser_file_upload
// (no uploading files from disk into pages). Everything else is the upstream server unchanged.
// Hardening flags: headless, isolated (profile in memory, no cookies on disk), no service workers, no WebMCP
// tools registered by pages, file:// and files outside the workspace stay blocked (we never pass
// --allow-unrestricted-file-access). The package version is pinned; review before bumping.
import { spawn } from 'node:child_process'

const PKG = '@playwright/mcp@0.0.83'
const DENY = new Set(['browser_run_code_unsafe', 'browser_file_upload'])
const FLAGS = ['--headless', '--isolated', '--block-service-workers', '--no-webmcp', '--viewport-size', '1280x800']

const child = spawn('npx', ['-y', PKG, ...FLAGS, ...process.argv.slice(2)], { stdio: ['pipe', 'pipe', 'inherit'] })
const listIds = new Set()

const send = (stream, msg) => stream.write(JSON.stringify(msg) + '\n')

function lines(stream, onLine) {
  let buf = ''
  stream.setEncoding('utf8')
  stream.on('data', (chunk) => {
    buf += chunk
    let i
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim()
      buf = buf.slice(i + 1)
      if (line) onLine(line)
    }
  })
}

// client -> server
lines(process.stdin, (line) => {
  let msg
  try {
    msg = JSON.parse(line)
  } catch {
    return child.stdin.write(line + '\n')
  }
  if (msg.method === 'tools/list' && msg.id !== undefined) listIds.add(msg.id)
  if (msg.method === 'tools/call' && DENY.has(msg.params?.name) && msg.id !== undefined) {
    return send(process.stdout, {
      jsonrpc: '2.0',
      id: msg.id,
      result: { isError: true, content: [{ type: 'text', text: `${msg.params.name} is disabled by the dev-team plugin guard.` }] },
    })
  }
  send(child.stdin, msg)
})

// server -> client
lines(child.stdout, (line) => {
  let msg
  try {
    msg = JSON.parse(line)
  } catch {
    return process.stdout.write(line + '\n')
  }
  if (msg.id !== undefined && listIds.has(msg.id) && Array.isArray(msg.result?.tools)) {
    listIds.delete(msg.id)
    msg.result.tools = msg.result.tools.filter((t) => !DENY.has(t.name))
  }
  send(process.stdout, msg)
})

process.stdin.on('end', () => child.kill())
child.on('exit', (code) => process.exit(code ?? 0))
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => child.kill())
