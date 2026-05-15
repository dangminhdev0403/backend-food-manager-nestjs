# Backend Project Rules

## Tech Stack

| Technology | Version    |
| ---------- | ---------- |
| Language   | TypeScript |
| Framework  | NestJS v11 |
| ORM        | TypeORM    |
| Database   | MySQL 8.x  |

---

## SKILL

- Use skill /nestjs-expert for project

## 1. Feature Structure

```
src/
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
routes/[feature-name]/
├── [feature].module.ts
├── [feature].controller.ts
├── [feature].service.ts
├── repositories/[entity].repository.ts
├── dto/create-[entity].dto.ts
├── entities/[entity].entity.ts
├── types/[feature].types.ts
├── tests/[feature].service.spec.ts
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
// ✅ DO: class-validator in DTOs
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}
```

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
    return this.createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .where('product.id = :id', { id })
      .getOne();
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

// Transactions (checkout/order)
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.startTransaction();
try {
  // ... operations
  await queryRunner.commitTransaction();
} catch (err) {
  await queryRunner.rollbackTransaction();
}
```
