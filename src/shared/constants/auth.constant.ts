import { Request } from 'express';
import { PublicRouteMatcher } from 'src/shared/config/public-route.matcher';

export interface RequestLogined extends Request {
  user: UserInRequest;
}
export interface RequestGuest {
  tableSession: {
    id: number;
    tableId: number;
    token: string;
  };
}
export interface UserInRequest {
  id: number;
  email: string;
  name: string;
  roleIds: number[];
}
export const PUBLIC_ROUTES = [
  '/',
  '/chat',

  '/languages/**',
  '/media/**',
  '/api/**',
  '/order-result/**',

  '/auth/**', // you can exclude later in guard
];

//! public route
export const whitelist = [
  //! route động  /products/**

  /^\/order-result\/.*/,
  /^\/languages(\/.*)?$/,
  /^\/api\/.*/,
  /^\/media\/.*/,
  //! route cứng /products

  '/chat',
  '/',
  /^\/auth\/((?!logout|refresh).*)$/,
];
export const whitelistMatcher = new PublicRouteMatcher(PUBLIC_ROUTES);

//! routeIgnore  Permissions initialization
export const routeIgnore = [...whitelist, /^\/auth\/.*/, /^\/profile\/.*/];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
};

export const TypeOfVerfication = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const;

export type TypeOfVerficationCodeType = (typeof TypeOfVerfication)[keyof typeof TypeOfVerfication];
