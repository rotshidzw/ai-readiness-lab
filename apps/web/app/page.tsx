"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useActivity } from "@/components/activity-provider";

const features = [
  {
    title: "Learning Hub",
    description: "Structured courses, quizzes, and progress tracking with rich markdown lessons.",
  },
  {
    title: "Prompt Lab",
    description: "Experiment with prompt patterns, roles, constraints, and safe templates.",
  },
  {
    title: "Automations",
    description: "Prototype mini agent workflows with trigger-action-output cards.",
  },
];

export default function HomePage() {
  const { addLog } = useActivity();
  const [cue, setCue] = React.useState("Ready to guide you.");

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 p-10">
        <div className="absolute inset-0 gradient-orb opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.3),transparent_60%)]" />
        <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-sky-200">LUMINA AI STUDIO</p>
              <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
                Learn, prompt, and automate with a luminous AI playground.
              </h2>
              <p className="text-base text-white/70">
                A premium, portfolio-grade studio for teaching AI concepts, practicing safe prompts,
                and simulating mini agents with real-time telemetry.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => {
                    addLog({ eventType: "CLICK", message: "Start Learning CTA clicked" });
                    setCue("Pointing to Learning Hub");
                  }}
                >
                  Start Learning
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    addLog({ eventType: "CLICK", message: "Try Prompt Lab CTA clicked" });
                    setCue("Pointing to Prompt Lab");
                  }}
                >
                  Try Prompt Lab
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    addLog({ eventType: "CLICK", message: "View Automations CTA clicked" });
                    setCue("Pointing to Automations");
                  }}
                >
                  View Automations
                </Button>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="glass relative h-72 w-72 rounded-[48px] border border-white/20 bg-white/5 p-6">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-400/40 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-violet-400/40 blur-2xl" />
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="motion-safe:animate-float">
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                    <circle cx="60" cy="60" r="52" fill="url(#grad)" />
                    <circle cx="42" cy="52" r="8" fill="#0F172A" />
                    <circle cx="78" cy="52" r="8" fill="#0F172A" />
                    <path
                      d="M42 76c6 6 30 6 36 0"
                      stroke="#0F172A"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad" x1="20" y1="20" x2="110" y2="110">
                        <stop stopColor="#7DD3FC" />
                        <stop offset="1" stopColor="#C4B5FD" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <p className="text-sm text-white/70">Robot Guide</p>
                <motion.p
                  key={cue}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-white/50"
                >
                  {cue}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            whileHover={{ y: -6 }}
            onMouseEnter={() =>
              addLog({ eventType: "HOVER", message: `Hovered ${feature.title}` })
            }
          >
            <Card>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription className="mt-2">{feature.description}</CardDescription>
            </Card>
          </motion.div>
        ))}
      </section>
    </AppShell>
  );
}
