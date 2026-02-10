import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z } from "zod";
import { prisma } from "@lumina/db";
import { getAuthSession } from "@/lib/auth";

export const createContext = async () => {
  const session = await getAuthSession();
  return { session, prisma };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

const isAdmin = t.middleware(({ ctx, next }) => {
  const email = ctx.session?.user?.email ?? "";
  if (!email.endsWith("@lumina.local")) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next();
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const adminProcedure = t.procedure.use(isAdmin);

export const appRouter = router({
  ai: router({
    generate: publicProcedure
      .input(
        z.object({
          prompt: z.string(),
          mode: z.enum(["Helpful", "Strict", "Tutor"]),
        }),
      )
      .mutation(async ({ input }) => {
        const apiKey = process.env.OPENAI_API_KEY;
        const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
        if (!apiKey) {
          return {
            response: `[Mock:${input.mode}] ${input.prompt}\n\n- Key insight: Focus on intent and constraints.\n- Next step: Provide 1 example and 1 edge case.`,
            source: "mock",
          };
        }

        const systemMap: Record<typeof input.mode, string> = {
          Helpful: "You are a helpful assistant.",
          Strict: "You are a strict assistant. Enforce constraints.",
          Tutor: "You are a patient tutor. Explain step-by-step.",
        };

        const result = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemMap[input.mode] },
              { role: "user", content: input.prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (!result.ok) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI request failed." });
        }

        const data = (await result.json()) as {
          choices: { message: { content: string } }[];
        };

        return { response: data.choices?.[0]?.message?.content ?? "", source: "openai" };
      }),
  }),
  activity: router({
    create: publicProcedure
      .input(
        z.object({
          eventType: z.enum(["NAVIGATION", "CLICK", "HOVER", "SEARCH", "AI", "ERROR", "SYSTEM"]),
          message: z.string(),
          metadata: z.record(z.unknown()).optional(),
          privateMode: z.boolean().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (input.privateMode || !ctx.session?.user?.id) {
          return { persisted: false };
        }
        await ctx.prisma.activityLog.create({
          data: {
            eventType: input.eventType,
            message: input.message,
            metadata: input.metadata ?? {},
            userId: ctx.session.user.id,
          },
        });
        return { persisted: true };
      }),
    list: publicProcedure.query(async ({ ctx }) => {
      if (!ctx.session?.user?.id) return [];
      return ctx.prisma.activityLog.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      });
    }),
  }),
  courses: router({
    list: publicProcedure.query(async ({ ctx }) => {
      return ctx.prisma.course.findMany({
        include: { modules: { include: { lessons: true } } },
        orderBy: { createdAt: "asc" },
      });
    }),
    create: adminProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string(),
          level: z.string(),
        }),
      )
      .mutation(({ ctx, input }) =>
        ctx.prisma.course.create({
          data: { ...input, authorId: ctx.session?.user?.id },
        }),
      ),
  }),
  promptTemplates: router({
    list: publicProcedure.query(({ ctx }) => ctx.prisma.promptTemplate.findMany()),
  }),
  automations: router({
    run: publicProcedure
      .input(
        z.object({
          name: z.string(),
          input: z.string(),
          output: z.string(),
          status: z.string(),
          privateMode: z.boolean().optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (input.privateMode || !ctx.session?.user?.id) {
          return { persisted: false };
        }
        await ctx.prisma.automationRun.create({
          data: {
            name: input.name,
            input: input.input,
            output: input.output,
            status: input.status,
            userId: ctx.session.user.id,
          },
        });
        return { persisted: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
