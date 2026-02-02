"use client";

import * as React from "react";
import { trpc } from "@/components/trpc-provider";

export type ActivityLog = {
  id: string;
  eventType: "NAVIGATION" | "CLICK" | "HOVER" | "SEARCH" | "AI" | "ERROR" | "SYSTEM";
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
};

type ActivityContextValue = {
  logs: ActivityLog[];
  privateMode: boolean;
  addLog: (entry: Omit<ActivityLog, "id" | "createdAt">) => void;
  togglePrivateMode: () => void;
  search: string;
  setSearch: (value: string) => void;
  filters: Record<string, boolean>;
  toggleFilter: (key: ActivityLog["eventType"]) => void;
  exportLogs: () => void;
};

const ActivityContext = React.createContext<ActivityContextValue | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = React.useState<ActivityLog[]>([]);
  const [privateMode, setPrivateMode] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<Record<ActivityLog["eventType"], boolean>>({
    NAVIGATION: true,
    CLICK: true,
    HOVER: true,
    SEARCH: true,
    AI: true,
    ERROR: true,
    SYSTEM: true,
  });

  const createLog = trpc.activity.create.useMutation();

  const addLog = React.useCallback(
    (entry: Omit<ActivityLog, "id" | "createdAt">) => {
      const newLog: ActivityLog = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      setLogs((prev) => [newLog, ...prev].slice(0, 200));
      createLog.mutate({
        eventType: entry.eventType,
        message: entry.message,
        metadata: entry.metadata,
        privateMode,
      });
    },
    [createLog, privateMode],
  );

  const togglePrivateMode = () => setPrivateMode((prev) => !prev);

  const toggleFilter = (key: ActivityLog["eventType"]) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const exportLogs = () => {
    const payload = JSON.stringify(logs, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "lumina-activity-logs.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ActivityContext.Provider
      value={{
        logs,
        privateMode,
        addLog,
        togglePrivateMode,
        search,
        setSearch,
        filters,
        toggleFilter,
        exportLogs,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = React.useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return context;
}
