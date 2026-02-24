## WebGenesis

AI-powered web experience builder built with **Next.js**, **OpenAI**, and **Inngest** for reliable background jobs.

### Overview

WebGenesis lets you generate, iterate on, and manage modern web experiences using AI.  
It combines OpenAI-powered intelligence with a Next.js frontend and Inngest-driven background workflows to handle long-running or intensive tasks reliably.

### Key Features

- **AI-powered generation**: Use OpenAI models to generate content, layouts, and experiences.
- **Background jobs with Inngest**: Offload heavy or long-running tasks (e.g. processing, syncing, analytics) to robust background workflows.
- **Modern Next.js app**: Built on **Next.js 16** with React 19, app router, and best-practice project structure.
- **Auth & security ready**: Integrated with modern auth tooling (via `@clerk/nextjs`) and schema validation (`zod`).
- **Typed API layer**: Uses `@trpc/*` and `zod` for typesafe API contracts and data validation.
- **Prisma + Postgres**: Uses `@prisma/client` with Postgres adapters for a solid database layer.
- **Polished UI**: Built with Tailwind CSS 4, shadcn/ui primitives, and high-quality React component utilities.

### Tech Stack

- **Framework**: `next@16`, `react@19`, `react-dom@19`
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui, Radix, Base UI
- **AI**: OpenAI (via server-side integration)
- **Background jobs & workflows**: `inngest`, `@inngest/agent-kit`
- **Auth**: `@clerk/nextjs`, `@clerk/themes`
- **Data / DB**: `@prisma/client`, `pg`, Postgres, `superjson`
- **Forms & validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **State / data fetching**: `@tanstack/react-query`, tRPC

### Screenshots

- **Landing / Dashboard**
  - ![Landing / Dashboard](./screenshots/dashboard.png)

- **AI Builder / Editor**
  - ![AI Builder](./screenshots/ai-builder.png)

- **Background Jobs / Activity**
  - ![Inngest Jobs](./screenshots/inngest-jobs.png)

### Getting Started

#### Prerequisites

- **Node.js** (LTS recommended)
- **Package manager**: npm, pnpm, or yarn
- Access to:
  - **OpenAI API key**
  - **Postgres database**
  - **Inngest account / app credentials**
  - **Clerk** (or whichever auth provider you configure)

#### 1. Install dependencies

Use your preferred package manager in the project root:

```bash
# with npm
npm install

# or with pnpm
pnpm install

# or with yarn
yarn install
```

#### 2. Environment variables

Create a `.env` file in the project root and configure values such as:

```bash
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://user:password@host:port/dbname
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
INNGEST_EVENT_KEY=your-inngest-event-key
INNGEST_SIGNING_KEY=your-inngest-signing-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: These are examples. Align the exact variable names with your actual implementation.

#### 3. Database setup

Apply your Prisma schema to the database (adjust commands to your setup):

```bash
npx prisma migrate dev
```

You can also generate the Prisma client explicitly if needed:

```bash
npx prisma generate
```

#### 4. Run the development server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Then open `http://localhost:3000` in your browser.


#### 5. Run Inngest dev server

```bash
npx inngest-cli@latest dev
```

### Inngest Background Jobs

- **Event-driven workflows**: Inngest listens for events emitted from your Next.js app (e.g. content generated, project created).
- **Reliable execution**: Jobs can be retried and observed independently of the main app.
- **Typical use cases**:
  - Processing generated content
  - Long-running AI tasks
  - Webhooks and integrations
  - Analytics and reporting

Check your Inngest dashboard to monitor executions and configure environments.

### Project Scripts

From `package.json`:

- **`npm run dev`**: Start the Next.js development server.
- **`npm run build`**: Build the production bundle.
- **`npm run start`**: Start the production server.
- **`npm run lint`**: Run ESLint.

Use the equivalent commands for `pnpm` or `yarn` if you prefer those.

### Folder Structure (high level)

Your actual structure may vary, but a typical layout:

- `app/` or `src/app/`: Next.js routes, layouts, and pages
- `components/`: Reusable UI components
- `server/` or `lib/`: Server utilities, OpenAI integration, Inngest event handlers
- `prisma/`: Prisma schema and migrations
- `styles/`: Global styles and Tailwind config (if not in root)

### Development Notes

- **Type safety**: Keep schemas and types in sync using `zod`, tRPC, and Prisma.
- **Rate limiting**: `rate-limiter-flexible` is available to protect AI endpoints or auth flows.
- **UI consistency**: Use existing UI primitives (shadcn/ui, Radix, Base UI) for new components.

### Deployment

WebGenesis can be deployed to any platform that supports Next.js apps, such as:

- Vercel
- Render
- Fly.io
- Custom Node.js servers

Ensure that:

- All environment variables are set in your hosting provider.
- Database and Inngest credentials are configured per environment (development, staging, production).
- OpenAI usage and rate limits match your expected traffic.

### Contributing

1. Fork the repository or create a feature branch.
2. Install dependencies and configure `.env`.
3. Run `npm run dev` and make your changes.
4. Run `npm run lint` (and tests if configured).
5. Open a pull request with a clear description of your changes.

### License

Add your preferred license here (e.g. MIT, Apache 2.0) or keep this section updated to match your actual license file.
