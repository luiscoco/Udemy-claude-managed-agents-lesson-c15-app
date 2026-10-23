# C15 · Context Growth and Compaction

Reduces authored usage and compaction records. It does not force a provider compaction. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Observe rather than assume compaction
- Deduplicate request usage
- Missing coverage stays explicit

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3015`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3015
```

## How the app was build

### 1. Deduplicate the authored observation window

A Set prevents repeated request and compaction labels from being counted twice. This tiny fixture uses labels as identities; production consumers need the actual persisted event IDs.

Source: [src/lesson.ts](src/lesson.ts#L13) · selected statements

```typescript
const seen = new Set<string>();

let compactions = 0,
  inputTokens = 0;

for (const kind of list(input, "events")) {
  const id = String(kind);
  if (seen.has(id)) continue;
  seen.add(id);
  if (id === "compaction") compactions++;
  if (id === "request") inputTokens += 120;
}
```

### 2. Retain incomplete coverage as a distinct outcome

historyComplete chooses passed or incomplete. The sample sums only its distinct authored request observations and reports windowOccupancy as unknown; accumulated token totals do not measure the current context window.

Source: [src/lesson.ts](src/lesson.ts#L15) · selected statements

```typescript
const complete = flag(input, "historyComplete");

return report(
  complete ? "passed" : "incomplete",
  "Count only observations in the covered event window",
  {
    compactions,
    inputTokens,
    historyComplete: complete,
    windowOccupancy: "unknown",
  },
  [
    "Deduplicate persisted event IDs",
    "Record explicit context-compacted events",
    "Sum only distinct request spans",
    "Do not infer current context size from totals",
  ],
);
```

### Check your understanding

Run **Deduplicate an observed compaction** in the application. Compare the result with these scenario expectations:

```json
{
  "input": {
    "events": [
      "request",
      "compaction",
      "request",
      "compaction"
    ],
    "historyComplete": true
  },
  "expectedOutcome": "passed",
  "checkEvidence": {
    "compactions": 1
  }
}
```

Then try **Keep incomplete coverage visible**. Its expected outcome is `incomplete`; identify the condition or evidence field that explains the difference.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
