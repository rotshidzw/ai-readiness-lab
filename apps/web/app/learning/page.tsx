"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { trpc } from "@/components/trpc-provider";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useActivity } from "@/components/activity-provider";

export default function LearningHubPage() {
  const { addLog } = useActivity();
  const [query, setQuery] = React.useState("");
  const courses = trpc.courses.list.useQuery();

  const filtered = (courses.data ?? []).filter((course) =>
    course.title.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Learning Hub</p>
          <h2 className="text-3xl font-semibold">Curriculum & Progress</h2>
          <p className="text-sm text-white/60">
            Explore lessons with markdown, callouts, and quiz checkpoints.
          </p>
        </div>

        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            addLog({ eventType: "SEARCH", message: `Learning search: ${event.target.value}` });
          }}
          placeholder="Search lessons"
        />

        <div className="grid gap-6">
          {courses.isLoading && (
            <div className="grid gap-4">
              {[1, 2].map((item) => (
                <div key={item} className="h-32 animate-pulse rounded-3xl bg-white/5" />
              ))}
            </div>
          )}
          {filtered.map((course) => (
            <Card key={course.id}>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription className="mt-2">{course.description}</CardDescription>
              <div className="mt-4 space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id} className="rounded-2xl border border-white/10 p-4">
                    <p className="text-sm font-semibold text-white">{module.title}</p>
                    <ul className="mt-2 space-y-1 text-xs text-white/60">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id}>{lesson.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          ))}
          {!courses.isLoading && filtered.length === 0 && (
            <div className="text-sm text-white/60">No courses match your search.</div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
