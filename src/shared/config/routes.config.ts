import { PublicRouteMatcher } from 'src/shared/config/public-route.matcher';

/**
 * FAST PATH: prefix-based matcher (O(n), không regex)
 * ⚠ Chỉ dùng cho route thật sự public (static, read-only)
 * ❌ KHÔNG dùng wildcard cho /auth/** (security risk)
 */
//  ! Lưu ý : đã dùng route bên PUBLIC_REGEX thì không dùng PUBLIC_PATTERNS , ví dụ : có  /^\/auth\/((?!logout|refresh).*)$/ thì không dùng /auth/**  !*/
export const PUBLIC_PATTERNS = [
  '/',
  '/chat',
  '/languages/**',
  '/media/**',
  '/api/**',
  '/order-result/**',
  '/categories/**',
  '/products/**',
];

/**
 * REGEX EXCEPTIONS (rare)
 * ⚠ Regex chậm hơn prefix match → chỉ dùng cho ngoại lệ bắt buộc
 * ⚠ Negative lookahead dễ gây backtracking nếu lạm dụng
 */
export const PUBLIC_REGEX = [
  // Public auth endpoints, exclude logout & refresh-token
  /^\/auth\/((?!logout|refresh).*)$/,
];

/**
 * INIT IGNORE: bypass toàn bộ guard khi bootstrap / healthcheck
 * ⚠ Dùng cẩn trọng, có thể bỏ qua security layer
 */
export const IGNORE_PATTERNS = [...PUBLIC_PATTERNS];
export const IGNORE_REGEX = [...PUBLIC_REGEX];

/**
 * Matcher cho runtime request
 * Order: DENY > ALLOW (được enforce bên trong matcher)
 */
export const publicMatcher = new PublicRouteMatcher(PUBLIC_PATTERNS, PUBLIC_REGEX);
export const ignoreMatcher = new PublicRouteMatcher(IGNORE_PATTERNS, IGNORE_REGEX);
