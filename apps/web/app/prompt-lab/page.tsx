"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { trpc } from "@/components/trpc-provider";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/components/activity-provider";

const modes = ["Helpful", "Strict", "Tutor"] as const;

type Mode = (typeof modes)[number];

export default function PromptLabPage() {
  const { addLog } = useActivity();
  const templates = trpc.promptTemplates.list.useQuery();
  const [prompt, setPrompt] = React.useState("Explain vector databases in simple terms.");
  const [mode, setMode] = React.useState<Mode>("Helpful");
  const [response, setResponse] = React.useState("");
  const [status, setStatus] = React.useState("Idle");

  const aiGenerate = trpc.ai.generate.useMutation();

  const runPrompt = async () => {
    addLog({ eventType: "AI", message: `Prompt run (${mode})` });
    setStatus("Generating answer...");
    try {
      const result = await aiGenerate.mutateAsync({ prompt, mode });
      setResponse(result.response);
      setStatus(result.source === "openai" ? "Done (OpenAI)" : "Done (Mock)");
      addLog({ eventType: "AI", message: "Prompt response generated" });
    } catch (error) {
      setStatus("Error");
      addLog({ eventType: "ERROR", message: "Prompt generation failed" });
    }
  };

  return (
    <AppShell>
      <div className="grid gap-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Prompt Lab</p>
          <h2 className="text-3xl font-semibold">Prompt Playground</h2>
          <p className="text-sm text-white/60">
            Select a pattern, edit, and run against a mock AI responder.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardTitle>Prompt Editor</CardTitle>
            <CardDescription className="mt-2">Choose a mode and run the prompt.</CardDescription>
            <div className="mt-4 space-y-4">
              <textarea
                className="min-h-[180px] w-full rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 focus:outline-none"
                value={prompt}
                onChange={(event) => {
                  setPrompt(event.target.value);
                  addLog({ eventType: "CLICK", message: "Prompt editor updated" });
                }}
              />
              <div className="flex flex-wrap gap-3">
                {modes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setMode(item);
                      addLog({ eventType: "CLICK", message: `Mode switched to ${item}` });
                    }}
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition ${
                      mode === item
                        ? "border-sky-400/70 bg-sky-500/20 text-sky-100"
                        : "border-white/10 text-white/50"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <Button onClick={runPrompt}>Run</Button>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white/70">
                <p className="text-xs uppercase text-white/40">Status</p>
                <p>{status}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Response</CardTitle>
            <CardDescription className="mt-2">Simulated AI output.</CardDescription>
            <pre className="mt-4 min-h-[220px] whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/40 p-4 text-xs text-white/70">
              {response || "Run a prompt to see the response."}
            </pre>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Template Library</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(templates.data ?? []).map((template) => (
              <Card
                key={template.id}
                onMouseEnter={() =>
                  addLog({ eventType: "HOVER", message: `Template hover: ${template.title}` })
                }
              >
                <CardTitle>{template.title}</CardTitle>
                <CardDescription className="mt-2">{template.category}</CardDescription>
                <p className="mt-4 text-xs text-white/60">{template.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
