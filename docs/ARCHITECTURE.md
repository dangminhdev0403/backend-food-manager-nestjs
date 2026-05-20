# Frontend Architecture

## Overview

Restaurant and table ordering management backend built with:

- Nestjs
- TypeScript

## Folder Structure

```
└── 📁backend-food-manager-nestjs
    └── 📁generated
    └── 📁initialScript
        ├── index.ts
        ├── initial-system.ts
    └── 📁prisma
        └── 📁migrations
        ├── schema.prisma
    └── 📁src
        └── 📁generated
        └── 📁i18n
            └── 📁en
            └── 📁vi
        └── 📁routes
            └── 📁auth
                └── 📁passport
                    └── 📁guard
                    └── 📁strategy
        └── 📁shared
            └── 📁config
            └── 📁constants
            └── 📁decorators
            └── 📁dtos
            └── 📁errors
            └── 📁filters
            └── 📁guard
            └── 📁helpers
            └── 📁Interceptors
            └── 📁models
            └── 📁pipe
            └── 📁repositories
            └── 📁services
            ├── shared.module.ts
        ├── app.controller.spec.ts
        ├── app.controller.ts
        ├── app.module.ts
        ├── app.service.ts
        ├── main.ts
    └── 📁test
```

## Application structure

- `app/` contains route segments for public pages, auth, table/guest ordering flow, and management pages.
- `components/` contains reusable UI and feature components.
- `queries/` contains TanStack Query hooks for custom client-side data fetching/mutations.
- `schemaValidations/` contains shared Zod schemas and request/response typing.
- `lib/` contains cross-cutting helpers, stores, logger, and utility functions.

### Data model shape (Prisma)

- Prisma schema is in `prisma/schema.prisma`.
- Generated artifacts:
  - Prisma client → `generated/prisma`
  - Zod validators → `generated/zod-validator`
- Core domain clusters in schema:
  - Identity/access: `User`, `Role`, `Permission`, `UserHasRole`, `RolePermission`, `RefreshToken`, `Device`
  - Catalog/i18n: `Product`, `Category`, `Language`, translation tables
  - Ordering/table flow: `Table`, `TableQRCode`, `TableSession`, `Order`, `OrderItem`, `OrderItemTranslation`
- Order flow supports both in-person guest QR ordering and remote authenticated user ordering (`OrderSource`).

### Request pipeline and global behavior

- App bootstrap is in `src/main.ts`.
- Global `JwtAuthGuard` is applied for all routes; public route bypass is path-based via `publicMatcher` from `src/shared/config/routes.config.ts`.
- Global response shaping uses `TransformationInterceptor`.
- Global validation uses `nestjs-zod` (`ZodValidationPipe`) at app level.
- Global exception handling is layered via app filters (`CatchEverythingFilter`, `GlobalExceptionFilter`, `HttpExceptionFilter`).
- Swagger is enabled only when `NODE_ENV !== production`, served at `/api` with raw JSON at `/swagger-json`.

### Module organization

- Root composition is `AppModule` (`src/app.module.ts`).
- Domain features are organized under `src/routes/*` and typically follow controller/service/repository + dto/model splits.
- Notable multi-controller domains:
  - Orders: separate guest/user/admin controllers in one module.
  - Products/Categories/Languages/Tables: split admin vs user-facing controllers where needed.

### Shared infrastructure pattern

- `SharedModule` is marked `@Global()` and exports cross-cutting services/repositories (PrismaService, hashing/token services, shared repositories).
- This enables feature modules to consume data/access utilities without re-declaring providers.

### AuthN/AuthZ model

- Auth is implemented in `src/routes/auth` with Passport strategies:
  - `local` for credential login
  - `jwt` for access token
  - `jwt-refresh` for refresh flow
- Authorization combines:
  - Route-level public/protected decision by path matcher (`PUBLIC_PATTERNS` + `PUBLIC_REGEX`)
  - Permission domain (`src/routes/permissions`) and role domain (`src/routes/roles`) for RBAC behavior.

## Configuration and integration notes

- `ConfigModule` is global; environment variables drive runtime configuration.
- Cloudinary is configured asynchronously in `AppModule` and used for media handling.
- i18n resources are loaded from `src/i18n/` with query (`lang`) and `Accept-Language` resolvers.
