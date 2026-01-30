import { Request } from 'express';

export interface RequestLogined extends Request {
  user: UserInRequest;
}

export interface UserInRequest {
  id: number;
  email: string;
  name: string;
  roleIds: number[];
}

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
