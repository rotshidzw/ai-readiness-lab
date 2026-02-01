"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActivity } from "@/components/activity-provider";
import { trpc } from "@/components/trpc-provider";

const automations = [
  {
    name: "Summarize text",
    trigger: "Paste content",
    action: "Extract key points",
    output: "Summary and bullet list",
  },
  {
    name: "Generate study plan",
    trigger: "Goal + timeline",
    action: "Schedule micro-lessons",
    output: "Week-by-week plan",
  },
  {
    name: "Check prompt for risks",
    trigger: "Prompt input",
    action: "Scan for unsafe requests",
    output: "Risk score and suggestion",
  },
];

export default function AutomationsPage() {
  const { addLog, privateMode } = useActivity();
  const runAutomation = trpc.automations.run.useMutation();

  const handleRun = async (automation: (typeof automations)[number]) => {
    addLog({ eventType: "SYSTEM", message: `Running automation: ${automation.name}` });
    addLog({ eventType: "AI", message: "Trigger accepted" });
    addLog({ eventType: "AI", message: "Action in progress..." });
    const output = `Automation ${automation.name} completed successfully.`;
    runAutomation.mutate({
      name: automation.name,
      input: automation.trigger,
      output,
      status: "Done",
      privateMode,
    });
    addLog({ eventType: "SYSTEM", message: "Done" });
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Automations</p>
          <h2 className="text-3xl font-semibold">Automation Playground</h2>
          <p className="text-sm text-white/60">
            Prototype trigger-action-output cards with live telemetry.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {automations.map((automation) => (
            <Card key={automation.name}>
              <CardTitle>{automation.name}</CardTitle>
              <CardDescription className="mt-2">Trigger → Action → Output</CardDescription>
              <div className="mt-4 space-y-2 text-xs text-white/70">
                <p>Trigger: {automation.trigger}</p>
                <p>Action: {automation.action}</p>
                <p>Output: {automation.output}</p>
              </div>
              <Button className="mt-6" onClick={() => handleRun(automation)}>
                Run automation
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
