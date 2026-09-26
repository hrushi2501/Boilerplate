# Skill: Model Context Protocol (MCP)

## When to Use

Use Model Context Protocol (MCP) when:

- Integrating standardized external tool servers, enterprise knowledge systems, or developer environments (e.g. GitHub MCP, Postgres MCP, filesystem MCP, Google Drive MCP)
- Exposing hackathon application tools or database contexts as standard MCP endpoints for external AI agents or IDE clients
- Building modular agent systems where tools and resources are dynamically discovered and negotiated over protocol

> **Note**: MCP is an **optional** capability. Do not install heavy MCP server packages or daemon processes unless your hackathon challenge specifically requires MCP interoperability.

---

## MCP Architecture Overview

```text
┌─────────────────┐       JSON-RPC 2.0        ┌──────────────────┐
│   MCP Client    │  ◄─────────────────────►  │    MCP Server    │
│  (Next.js Host  │   (stdio or Stream/SSE)   │ (DB, Files, API, │
│  or AI Agent)   │                           │  External Tools) │
└─────────────────┘                           └──────────────────┘
         │                                              │
         ├── Prompts (Slash commands / presets)        ├── Tools (Executable functions)
         └── Resources (Context, file schemas, data)   └── Resources (Readable data)
```

---

## Core Primitives

1. **Resources**: Read-only context provided by the server to the client (e.g., database schema descriptions, system logs, uploaded file contents).
2. **Tools**: Callable functions with typed JSON Schema parameters that the agent can execute (e.g., execute SQL query, dispatch email, trigger API).
3. **Prompts**: Parameterized prompt templates managed by the server.

---

## Integration Patterns

### 1. Connecting an MCP Server to AI SDK / LangChain

When using `@modelcontextprotocol/sdk`:

- Connect over standard SSE transport for web/serverless environments, or stdio transport for local sidecars:

```ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

export async function createMcpClient(serverUrl: string) {
  const transport = new SSEClientTransport(new URL(serverUrl));
  const client = new Client(
    { name: "pravi-ai-client", version: "1.0.0" },
    { capabilities: { tools: {}, resources: {} } }
  );

  await client.connect(transport);
  return client;
}
```

### 2. Converting MCP Tools to Standard Agent Tools

Convert MCP tools into standard Zod-validated agent tools dynamically:

- Fetch tools using `client.listTools()`
- Wrap each tool execution with `client.callTool({ name, arguments: args })`

---

## Security & Boundary Safeguards

1. **Strict Permission Scoping**: Never grant blanket write access to all MCP tools. Enforce an allowlist of permitted tool names.
2. **Resource Sanitation**: Treat all content returned from MCP resources as **untrusted data**. Never evaluate returned strings directly as code.
3. **Network Isolation**: When hosting MCP servers, restrict endpoints to authenticated internal networks or protect with bearer tokens.
