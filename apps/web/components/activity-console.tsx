"use client";

import * as React from "react";
import { useActivity } from "@/components/activity-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const filters = ["CLICK", "NAVIGATION", "HOVER", "SEARCH", "AI", "ERROR", "SYSTEM"] as const;

export function ActivityConsole() {
  const {
    logs,
    privateMode,
    togglePrivateMode,
    search,
    setSearch,
    filters: activeFilters,
    toggleFilter,
    exportLogs,
  } = useActivity();

  const filtered = logs.filter((log) => {
    const matchesFilter = activeFilters[log.eventType];
    const matchesSearch =
      !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.eventType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <aside className="fixed bottom-0 right-0 z-40 w-full max-w-lg p-4 md:top-0 md:h-full">
      <div className="glass flex h-[45vh] flex-col rounded-3xl border border-white/10 p-4 md:h-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Activity Console</h2>
            <p className="text-xs text-white/60">Realtime telemetry for every action.</p>
          </div>
          <Badge className={cn(privateMode && "border-sky-400/60 text-sky-200")}>
            {privateMode ? "Private" : "Sync"}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">Private mode</span>
            <Toggle pressed={privateMode} onClick={togglePrivateMode} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => toggleFilter(filter)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition",
                activeFilters[filter]
                  ? "border-sky-400/60 bg-sky-500/20 text-sky-100"
                  : "border-white/10 text-white/50",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-2">
          {filtered.length === 0 ? (
            <div className="text-sm text-white/50">No activity yet.</div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{log.eventType}</span>
                  <span>{log.createdAt.toLocaleTimeString()}</span>
                </div>
                <p className="mt-1 text-sm text-white/80">{log.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Button variant="outline" onClick={exportLogs}>
            Export logs
          </Button>
          <span className="text-xs text-white/50">{filtered.length} entries</span>
        </div>
      </div>
    </aside>
  );
}
