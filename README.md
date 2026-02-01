# LUMINA AI Studio

Portfolio-grade full-stack AI learning and prompt practice studio with a premium iOS-like feel.

## Features
- Landing page with animated gradient mesh, floating orbs, and Robot Guide mascot.
- Learning Hub with seeded courses, modules, lessons, quizzes, and progress tracking scaffolding.
- Prompt Lab with templates, prompt editor, and AI response (mock by default, OpenAI optional).
- Automations Playground with trigger-action-output cards and activity telemetry.
- Activity Console with filters, search, private mode, and JSON export.

## Tech Stack
- Next.js App Router + TypeScript
- TailwindCSS + shadcn/ui primitives
- Framer Motion
- tRPC + Zod
- Prisma ORM + PostgreSQL (Docker Compose)
- NextAuth (GitHub provider) + demo mode

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Start Postgres (Docker)
```bash
docker compose up -d
```

### 3) Configure environment variables
Create `apps/web/.env.local`:
```bash
DATABASE_URL="postgresql://lumina:lumina@localhost:5434/lumina"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
OPENAI_API_KEY="" # optional
OPENAI_MODEL="gpt-4o-mini" # optional
```

### 4) Initialize database + seed
```bash
npm run db:push
npm run seed
```

### 5) Run the app
```bash
npm run dev
```

## Scripts
- `npm run dev` - start web app
- `npm run build` - production build
- `npm run lint` - lint
- `npm run format` - format check
- `npm run db:push` - push prisma schema
- `npm run db:migrate` - create migrations
- `npm run db:studio` - prisma studio
- `npm run seed` - seed database

## Screenshots
- Landing page: `docs/screenshots/landing.png`
- Learning hub: `docs/screenshots/learning.png`
- Prompt lab: `docs/screenshots/prompt-lab.png`
- Automations: `docs/screenshots/automations.png`

> Add screenshots here after running the app locally.
