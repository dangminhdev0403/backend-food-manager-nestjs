# Backend Project Rules

## Tech Stack

| Technology | Version    |
| ---------- | ---------- |
| Language   | TypeScript |
| Framework  | NestJS v11 |
| ORM        | Prisma     |
| Database   | PostgreSQL |

---

## SKILL

- Use skill /nestjs-expert for project

## 1. Feature Structure

```
src/
├──prisma/
   └── schema.prisma
├── routes/
│   ├── auth/           # roles, users, JWT, guards
│   ├── user-profile/   # addresses management
│   ├── product/        # categories, products, variants, images
│   ├── cart/           # carts, cart_items, guest cart merge
│   ├── order/          # orders, order_items, checkout
│   └── review/         # reviews, ratings
├── shared/             # cross-feature utilities
│   ├── decorators/     # @CurrentUser(), @Roles(), @Public()
│   ├── filters/        # global exception filter
│   ├── guards/         # JwtAuthGuard, RolesGuard
│   ├── interceptors/   # response transformation
│   ├── pipes/          # validation, transformation
│   └── utils/          # helpers, constants
    └── config/         # configs
```

**Each feature folder:**

```
routes/[feature]/
├── [feature].service.ts
├── [feature].controller.ts
├── dto/
├── schemas/
├── types/
├── tests/
└── CONTEXT.md
```

---

## 2. Naming Conventions

| Element           | Convention                 | Example                                |
| ----------------- | -------------------------- | -------------------------------------- |
| Feature folders   | kebab-case                 | `user-profile/`, `product/`            |
| Files             | kebab-case                 | `create-user.dto.ts`, `user.entity.ts` |
| Classes           | PascalCase                 | `UserService`, `CreateUserDto`         |
| Functions/Methods | camelCase                  | `findById()`, `createOrder()`          |
| Variables         | camelCase                  | `userId`, `cartItems`                  |
| Constants         | UPPER_SNAKE_CASE           | `MAX_CART_ITEMS`, `ORDER_STATUS`       |
| Interfaces/Types  | PascalCase + prefix/suffix | `IUserPayload`, `OrderStatusType`      |
| Entities          | PascalCase singular        | `User`, `ProductVariant`               |

---

## 3. Feature Rules

### Feature Boundaries

| Feature      | Owns                                   | Notes                         |
| ------------ | -------------------------------------- | ----------------------------- |
| auth         | roles, users, refresh_tokens           | JWT, guards                   |
| user-profile | addresses                              | User addresses only           |
| product      | categories, products, variants, images | Catalog management            |
| cart         | carts, cart_items                      | References `product_variants` |
| order        | orders, order_items                    | Snapshots variant data        |
| review       | reviews                                | Links user + product + order  |

### Cross-Feature Communication

```typescript
// ✅ DO: Use NestJS module imports
@Module({
  imports: [ProductModule], // explicit dependency
  providers: [CartService],
})
export class CartModule {}

// ✅ DO: Use EventEmitter for async
this.eventEmitter.emit('order.created', { orderId, userId });

// ❌ DON'T: Direct internal imports
import { ProductService } from '../product/product.service'; // WRONG
```

---

## 4. Code Patterns

### Error Handling

```typescript
// ✅ DO: Use NestJS built-in exceptions
throw new NotFoundException(`Product #${id} not found`);
throw new BadRequestException('Insufficient stock');

// ✅ DO: Custom exception extends HttpException
export class InsufficientStockException extends HttpException {
  constructor(sku: string) {
    super(`Insufficient stock for SKU: ${sku}`, HttpStatus.BAD_REQUEST);
  }
}
```

### Validation (DTOs)

```typescript
// ✅ DO: Use Zod-based validation in DTOs
Preferred pattern:
```

ts
import { z } from 'zod';

export const CreateProductSchema = z.object({
name: z.string().min(1),
price: z.number().nonnegative(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;

### Response Format

```typescript
// Success
{ data: {...}, message: 'Created successfully', meta: { page: 1, total: 100 } }

// Error
{ statusCode: 404, message: 'Product not found', error: 'Not Found' }

// Pagination
{ data: [...], meta: { page: 1, limit: 10, total: 95, totalPages: 10 } }
```

### Repository Pattern

```typescript
// ✅ DO: Complex queries in repository
@Injectable()
export class ProductRepository {
  async findWithVariants(id: number): Promise<Product> {
    return await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
      },
    });
  }
}

// ❌ DON'T: Queries in service
// this.productRepo.createQueryBuilder()... // WRONG place
```

### Logging

```typescript
// ✅ DO: Logger at service level
private readonly logger = new Logger(OrderService.name);

async createOrder(dto: CreateOrderDto) {
  this.logger.log(`Creating order for user ${dto.userId}`);
}
```

---

## 5. Anti-Patterns (DON'T)

| ❌ DON'T                                     | ✅ DO                           |
| -------------------------------------------- | ------------------------------- |
| Import from another feature's internal files | Use module exports/imports      |
| Business logic in controllers                | Keep logic in services          |
| Raw SQL in services                          | Use repository pattern          |
| Hardcode configs                             | Use `ConfigService`             |
| Store plain passwords                        | Use bcrypt hash                 |
| Link cart/order to `products`                | Link to `product_variants`      |
| FK to addresses in orders                    | Snapshot address to JSON        |
| Circular feature dependencies                | Use EventEmitter for decoupling |

---

## 6. Git Workflow

### Branch Naming

```
[type]/[feature]-[short-description]

feature/auth-jwt-refresh
fix/cart-guest-merge
refactor/order-checkout-flow
```

### Commit Messages

```
[type]: [description]

feat: add guest cart merge on login
fix: correct stock validation in checkout
refactor: extract payment logic to service
```

### PR Requirements

- ✅ Linked to issue/task
- ✅ All tests passing
- ✅ No TypeScript errors
- ✅ 1+ team member review

---

## 7. Testing

| Layer        | Coverage | Location                             |
| ------------ | -------- | ------------------------------------ |
| Services     | 80%+     | `tests/[feature].service.spec.ts`    |
| Controllers  | 70%+     | `tests/[feature].controller.spec.ts` |
| Repositories | 60%+     | `tests/[entity].repository.spec.ts`  |

### Test Structure

```typescript
describe('CartService', () => {
  describe('addItem', () => {
    it('should add item to cart', async () => {
      // Arrange
      const dto = { productVariantId: 1, quantity: 2 };

      // Act
      const result = await service.addItem(cartId, dto);

      // Assert
      expect(result.items).toHaveLength(1);
    });
  });
});
```

---

## 8. NestJS Decorators Quick Reference

```typescript
// Custom decorators
@CurrentUser()      // Get user from request
@Roles('admin')     // Role-based access
@Public()           // Skip auth guard

// Guards
@UseGuards(JwtAuthGuard, RolesGuard)

// Prisma   Transactions (checkout/order)
await this.prisma.$transaction(async (tx) => {
  // transactional operations
});
```

### Prisma Query Rules

- Simple Prisma queries may stay inside services.
- Complex reusable queries should be extracted into repository/query modules.
- Avoid deeply nested Prisma includes.
- Prefer select over include when possible.
- Avoid overfetching relations.

## Pagination Rules

Prefer cursor pagination over offset pagination for:

- mobile infinite scroll
- product feeds
- order history
- reviews

Preferred response:

```ts
{
  data: [],
  meta: {
    cursor,
    hasNextPage,
    limit
  }
}
```
## API Documentation & Contract Synchronization

This backend follows a contract-driven architecture.

All API contracts must remain synchronized between:

- runtime behavior
- Zod validation
- OpenAPI/Swagger
- frontend/mobile integrations
- generated typed clients
- shared contract artifacts

---

## Contract Architecture

```txt
Zod Schemas
    ↓
Runtime Validation (ZodValidationPipe)
    ↓
OpenAPI / Swagger
    ↓
openapi.json
    ↓
../shared-docs/API_SPEC.json
    ↓
Next.js frontend
Expo mobile app
API integration layer
typed client generation
future admin dashboard
AI agents
```

---

## Machine-Readable Contract Source Of Truth

Generated OpenAPI artifact:

- `openapi.json`

Shared exported contract artifact:

- `../shared-docs/API_SPEC.json`

`API_SPEC.json` is the machine-readable source of truth for:

- Next.js frontend
- Expo mobile app
- API integration layer
- React Query hooks
- typed client generation
- future admin dashboard
- AI-assisted development
- automated API synchronization

---

## Human-Readable Documentation Source Of Truth

Human-maintained architecture/business documentation:

- `../shared-docs/API_SPEC.md`

`API_SPEC.md` is the human-readable source of truth for:

- business flows
- integration notes
- auth flow
- booking/order lifecycle
- pagination strategy
- websocket events
- implementation notes
- frontend/mobile behavior
- architectural decisions

---

## Synchronization Triggers

Whenever APIs are:

- created
- modified
- renamed
- deprecated
- validation schema changed
- response structure changed
- pagination changed
- filtering behavior changed
- auth behavior changed
- websocket event payload changed
- DTO/request/response behavior changed

AI must synchronize contracts in the same task/session.

---

## Required Synchronization Workflow

After changing any backend API behavior:

1. update runtime implementation
2. keep Zod schemas synchronized with runtime behavior
3. keep OpenAPI/Swagger synchronized with Zod schemas
4. regenerate OpenAPI artifacts
5. synchronize shared contract artifacts
6. update human-readable documentation when business/integration behavior changes
7. avoid contract drift between:
   - runtime validation
   - Swagger/OpenAPI
   - generated contracts
   - frontend/mobile integrations
   - typed clients

---

## Required Commands

```bash
npm run openapi:generate
npm run openapi:check
```

---

## Generated Artifacts

The following files are generated artifacts:

- `openapi.json`
- `../shared-docs/API_SPEC.json`

AI must not manually maintain generated OpenAPI JSON artifacts when generation scripts exist.

AI must not manually edit generated contract artifacts unless explicitly fixing the generator itself.

Generated artifacts must always be regenerated via commands.

---

## Strict Validation Rules

This backend uses Zod as the single source of truth for validation.

Rules:

- use Zod validation only
- keep runtime validation aligned with OpenAPI
- do not introduce class-validator
- do not duplicate validation logic
- do not manually invent frontend/mobile contracts
- do not allow Swagger/OpenAPI drift
- do not expose internal/private fields unintentionally

---

## Frontend/Mobile Stability Rules

API contracts must remain stable for:

- Next.js frontend
- Expo mobile app
- React Query cache keys
- optimistic updates
- infinite scroll pagination
- websocket synchronization
- typed client generation

Breaking contract changes must always regenerate and synchronize OpenAPI artifacts.

---

## Drift Prevention

The project uses deterministic OpenAPI generation and drift checks.

Contract drift must be detected through:

```bash
npm run openapi:check
```

Any API change that alters generated OpenAPI artifacts without synchronization is considered invalid.

---

## CI/CD Policy

OpenAPI drift checks should run in CI/CD pipelines and pull requests.

Recommended workflow:

```txt
backend code change
    ↓
Zod schema change
    ↓
npm run openapi:generate
    ↓
openapi.json regenerated
    ↓
API_SPEC.json synchronized
    ↓
frontend/mobile typed clients updated
    ↓
npm run openapi:check
    ↓
CI validation passes
```