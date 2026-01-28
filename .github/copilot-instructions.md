# URL Shortener Backend - Copilot Instructions

## Project Overview

Express.js TypeScript backend service for URL shortening. Early-stage project with a minimal Express server, environment configuration pattern, and development tooling setup. Focus is on building the core URL shortening service architecture.

## Architecture & Data Flow

### Layered Structure

- **[src/server.ts](src/server.ts)**: Application entry point; initializes Express server and routes
- **[src/config/index.ts](src/config/index.ts)**: Environment configuration management; loads `.env` variables (PORT, NODE_ENV)
- **Future layers**: Database layer, service layer, and route handlers will extend this pattern

### Environment Configuration Pattern

Use the centralized config module for all environment variables:

```typescript
// src/config/index.ts structure
import dotenv from 'dotenv';
dotenv.config();

const config = {
  VARIABLE_NAME: process.env.VARIABLE_NAME!,
};
```

Non-null assertion (`!`) indicates required variables—update config when new env vars needed.

## Development Workflow

### Commands

- **`npm run dev`**: Start development server with hot reload (via nodemon watching `src/**/*.ts`)
- **Build & Run**: `ts-node -r tsconfig-paths/register src/server.ts` (handles TypeScript and path aliases)

### TypeScript Setup

- **Compiler Target**: ES6, CommonJS modules
- **Path Aliases**: `@/*` resolves to `src/*` (configured in tsconfig.json)
- **Strict Mode**: Enabled globally—all new code requires proper type annotations

## Code Style & Linting

### Formatting (Prettier)

- Line width: 80 characters
- Indent: 2 spaces, no tabs
- Quotes: Single quotes
- Trailing commas: All positions
- Semicolons: Required

### Linting (ESLint)

- Config: [eslint.config.mjs](eslint.config.mjs)
- Uses TypeScript ESLint and Prettier integration
- Run linting manually: `npx eslint .` (not in package.json scripts yet)

### Apply formatting: `npx prettier --write .`

## Key Patterns & Conventions

1. **Module Organization**: Clear separation between server setup (`server.ts`), configuration (`config/`), and future business logic
2. **Environment-First Design**: All configurable values sourced through `.env` and config module
3. **Express Structure**: Minimal and extensible; add routes and middleware at `server.ts` level initially
4. **Import Comments**: Organize imports with inline comments (`// Node Modules.`, `// Custom Modules.`)

## Critical Implementation Considerations

- **Non-null Assertions**: Used for required env vars; treat as contract—missing values will crash at startup
- **Type Safety**: Strict mode enabled; leverage TypeScript for catching URL/ID validation issues
- **Hot Reload**: Nodemon watches only `src` directory; compiled files not watched
- **No Database Integration Yet**: Future implementation should follow config pattern for connection strings

## Immediate Next Steps for New Features

1. Create feature branch from `src/` structure (e.g., `src/routes/`, `src/services/`, `src/models/`)
2. Update [config/index.ts](src/config/index.ts) for new environment variables
3. Extend Express middleware/routes in [server.ts](src/server.ts)
4. Maintain strict TypeScript; avoid `any` types

## External Dependencies

- **express**: ^5.2.1 - Web framework
- **dotenv**: ^17.2.3 - Environment variable management
- **ts-node**: ^10.9.2 - TypeScript runtime (dev only, via nodemon)
- **typescript**: ^5.9.3 - Language support
