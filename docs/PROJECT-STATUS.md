# Project Status

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
