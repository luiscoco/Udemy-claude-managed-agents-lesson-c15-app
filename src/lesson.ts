import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 15,
  title: "Context Growth and Compaction",
  description: "As a project continues, a thread accumulates messages, tool calls, and tool results. Eventually its history approaches the model’s context limit.",
  concepts: ["Observe rather than assume compaction", "Deduplicate request usage", "Missing coverage stays explicit"],
  scope: "Reduces authored usage and compaction records. It does not force a provider compaction. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Deduplicate an observed compaction", "input": {"events": ["request", "compaction", "request", "compaction"], "historyComplete": true}, "expected": "passed", "checks": {"compactions": 1}}, {"id": "1", "label": "Keep incomplete coverage visible", "input": {"events": ["request"], "historyComplete": false}, "expected": "incomplete", "checks": {"compactions": 0}}],
  async run(input) {

const seen=new Set<string>();let compactions=0,inputTokens=0;
for(const kind of list(input,"events")){const id=String(kind);if(seen.has(id))continue;seen.add(id);if(id==="compaction")compactions++;if(id==="request")inputTokens+=120;}
const complete=flag(input,"historyComplete");
return report(complete?"passed":"incomplete","Count only observations in the covered event window",{compactions,inputTokens,historyComplete:complete,windowOccupancy:"unknown"},["Deduplicate persisted event IDs","Record explicit context-compacted events","Sum only distinct request spans","Do not infer current context size from totals"]);

  }
};
