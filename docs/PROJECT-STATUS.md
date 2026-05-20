# Project Status

## 2026-05-20 — OpenAPI contract generation hardening

### Completed features
- Added deterministic OpenAPI generation script at `src/generate-openapi.ts` to export `openapi.json` from the running Nest application module graph.
- Added `openapi:generate` npm script to produce machine-readable OpenAPI artifacts for frontend/mobile contract consumption.
- Added `openapi:check` npm script to detect OpenAPI contract drift using git diff checks against `openapi.json`.
- Added Zod v4-compatible OpenAPI tooling dependency: `@asteasolutions/zod-to-openapi`.

### Modified files
- `package.json`
- `openapi.json` (generated artifact)
- `src/generate-openapi.ts`

### Current status
- OpenAPI contracts can now be generated deterministically outside Swagger UI runtime.
- Backend can provide a stable artifact for frontend/mobile typed contract generation pipelines.

### Known issues
- Existing endpoint-level examples in `shared-docs/API_SPEC.md` are still manually maintained and may drift from runtime Zod schema refinements/transforms unless validated in CI.

### Next recommended step
- Wire CI to run `npm run openapi:check` and generate typed clients from `openapi.json` for web/mobile.

## 2026-05-15 — Guest order detail and product detail response alignment

### Completed features
- Exposed `productId` in guest order detail item responses (`GET /guest/orders`) so clients can map selected order items back to products.
- Normalized product detail response for customer endpoint (`GET /products/get-one/:id`) to include translated fields and image URLs.
- Standardized Prisma generated import paths in repositories/services to relative generated client paths.

### Modified files
- `src/routes/orders/order.repository.ts`
- `src/shared/repositories/product.repository.ts`
- `src/routes/languages/language.repository.ts`
- `src/shared/services/prisma.service.ts`
- `src/generated/i18n.generated.ts` (generated/formatting update)

### Current status
- Backend changes are implemented and ready for consumer contract update.
- API response shapes for guest order detail and product detail are now consistent with repository mapping.

### Known issues
- `docs/PROJECT-STATUS.md` and API contract docs were missing/empty before this update.
- Minor non-functional formatting-only changes are present in a few files.

### Next recommended step
- Validate the updated API contract with frontend integration tests for `GET /guest/orders` and `GET /products/get-one/:id`.
