import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const course = await prisma.course.upsert({
    where: { id: "intro-ai" },
    update: {},
    create: {
      id: "intro-ai",
      title: "Lumina Foundations",
      description: "Learn AI concepts with guided practice and safety patterns.",
      level: "Beginner",
      modules: {
        create: [
          {
            title: "Getting Oriented",
            order: 1,
            lessons: {
              create: [
                {
                  title: "What is an AI Workflow?",
                  slug: "ai-workflow",
                  order: 1,
                  content: `# AI Workflows\n\nAI workflows combine **inputs**, **prompts**, and **outputs** with guardrails.\n\n> Callout: Start simple and iterate.\n\n\`\`\`ts\nconst prompt = "Summarize this paragraph";\n\`\`\`\n`,
                  quizzes: {
                    create: [
                      {
                        title: "Workflow basics",
                        questions: {
                          create: [
                            {
                              prompt: "Which element defines the intent?",
                              options: ["Input", "Prompt", "Output"],
                              answer: "Prompt",
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  title: "Prompt Safety Patterns",
                  slug: "prompt-safety",
                  order: 2,
                  content: `# Prompt Safety\n\nUse constraints, context, and evaluation.\n\n- Define role\n- Provide examples\n- Add refusal policy\n`,
                },
              ],
            },
          },
          {
            title: "Prompt Crafting",
            order: 2,
            lessons: {
              create: [
                {
                  title: "Tone and Format",
                  slug: "tone-format",
                  order: 1,
                  content: `# Tone + Format\n\nSpecify tone, length, and format explicitly.\n`,
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.promptTemplate.createMany({
    data: [
      {
        title: "System: Tutor",
        category: "System",
        content: "You are a friendly AI tutor. Explain concepts with analogies and a quick quiz.",
      },
      {
        title: "Constraint: Guardrails",
        category: "Constraints",
        content: "Refuse unsafe requests. Provide safer alternatives.",
      },
      {
        title: "Role: Product Coach",
        category: "Roles",
        content: "Act as a product coach. Provide step-by-step feedback.",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeded", course.title);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
