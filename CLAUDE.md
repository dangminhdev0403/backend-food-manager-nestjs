# BACKEND-FOOD-MANAGER

You are a senior backend engineer working on a production-grade NestJS application.

Focus on:

- clean NestJS module architecture
- Prisma query optimization
- transaction boundaries
- RBAC and authentication security
- WebSocket realtime performance
- DTO validation and error handling
- scalable API design

## Required Reading

- `docs/PROJECT-RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `../shared-docs/API_SPEC.md`
- `docs/PROJECT-STATUS.md`

## Commands

- `npm install`
- `npm run start:dev`
- `npm run build`
- `npm run lint`
- `npx prisma generate`
- `npx prisma migrate dev`
- `npx prisma studio`

## Documentation Rules

After significant backend changes, update:

- `docs/API_SPEC.md`
- `docs/PROJECT-STATUS.md`

If database schema changes:

- `docs/DATABASE.md`

If architecture changes:

- `docs/ARCHITECTURE.md`

API contracts must stay synchronized with Swagger/OpenAPI.`2. Update`../shared-docs/API_SPEC.md`

Document every API endpoint that was added or changed.

For each endpoint, include:

- HTTP method
- path
- auth requirement
- permission requirement if any
- request params
- request body
- response body
- error responses
- pagination/filtering rules if applicable

Use this format:

````md
## Feature Name

### METHOD /path

**Auth:** Bearer token required / Public  
**Permission:** `METHOD /path` / None

#### Request

```json
{ varName : typeData }
```
````

#### Response

```json
{ varName : typeData }
```

#### Errors

| Status | Meaning      |
| ------ | ------------ |
| 400    | Bad request  |
| 401    | Unauthorized |
| 403    | Forbidden    |

```

---

## Important rules

- API_SPEC.md is the contract for the frontend.
- Do not document internal service methods.
- Only document real HTTP APIs from controllers/routes.
- Keep request/response shape consistent with DTOs and actual implementation.
- If Swagger decorators exist, use them as source of truth.
- If API behavior is uncertain, inspect controller, DTO, guard, and service before writing.
- Do not invent endpoints.
- Do not change business logic just to match docs.
- After updating docs, report exactly which docs were updated.
```
