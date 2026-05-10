# CRM SeqByte

A Next.js CRM and invoicing app built with shadcn/ui, Prisma, and Better Auth.

## What’s Included

- Dashboard shell with sidebar navigation.
- Clients and companies management.
- Invoice series management.
- Invoice creation with a row-based products table.
- Bidirectional payment term and due date syncing.

## Project Docs

See [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) for the current app structure, key routes, and invoice form behavior.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Scripts

- `pnpm dev` starts the development server.
- `pnpm build` creates a production build.
- `pnpm start` runs the production server.
- `pnpm lint` runs ESLint.
- `pnpm seed` seeds the database.
- `pnpm prisma` runs Prisma commands through the local env wrapper.
