import 'reflect-metadata';

import { DiscoveryService } from '@nestjs/core';
import { Prisma } from 'generated/prisma/client';
import { routeIgnore, whitelist } from 'src/shared/constants/auth.constant';
import { METHOD_MAP, RouteMeta } from 'src/shared/constants/initialize.constant';

// Predicate to check for unique constraint errors , web check code error : https://www.prisma.io/docs/orm/reference/error-reference
export function isUniqueConstraintError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
export function isPublicRoute(path: string, isInit: boolean = false): boolean {
  if (isInit) {
    return routeIgnore.some((rule) => {
      if (typeof rule === 'string') return rule === path;
      if (rule instanceof RegExp) return rule.test(path);
      return false;
    });
  }

  return whitelist.some((rule) => {
    if (typeof rule === 'string') return rule === path;
    if (rule instanceof RegExp) return rule.test(path);
    return false;
  });
}

export function collectRoutesMetadata(app) {
  const discovery = app.get(DiscoveryService);
  const controllers = discovery.getControllers();

  const results: RouteMeta[] = [];

  for (const wrapper of controllers) {
    const controllerClass = wrapper.metatype;
    const controllerInstance = wrapper.instance;

    if (!controllerInstance || !controllerClass) continue;

    const controllerPath: string = Reflect.getMetadata('path', controllerClass) || '';

    const tags: string[] = Reflect.getMetadata('swagger/apiUseTags', controllerClass) ?? [];

    const prototype = Object.getPrototypeOf(controllerInstance);

    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => name !== 'constructor' && typeof controllerInstance[name] === 'function',
    );

    for (const methodName of methodNames) {
      const methodRef = controllerInstance[methodName];

      const routePath: string | null = Reflect.getMetadata('path', methodRef) || null;

      const requestMethod = Reflect.getMetadata('method', methodRef);
      const httpMethod = METHOD_MAP[requestMethod] ?? null;

      const operationMeta = Reflect.getMetadata('swagger/apiOperation', methodRef) ?? {};

      if (!operationMeta.summary) continue;

      const fullPath = `/${controllerPath}/${routePath}`.replace(/\/+/g, '/').replace(/\/$/, '');

      results.push({
        controller: controllerClass.name,
        controllerPath,
        tags,
        methodName,
        httpMethod,
        routePath,
        fullPath,
        summary: operationMeta.summary,
      });
    }
  }

  return results;
}
export function normalizePermissions(routes: RouteMeta[]) {
  return routes
    .filter((r) => !isPublicRoute(r.fullPath, true)) // BỎ QUA PUBLIC ROUTE
    .map((r) => ({
      name: r.summary, // Summary = permission name
      method: r.httpMethod, // GET / POST / PUT / DELETE
      path: r.fullPath, // /roles/:id
      module: r.tags?.[0].toLocaleLowerCase() ?? null, // lấy tag đầu tiên làm module
    }));
}

export function groupByModule(list: Array<any>) {
  const grouped = list.reduce(
    (acc, item) => {
      const key = item.module.toUpperCase();
      if (!acc[key]) acc[key] = [];
      acc[key].push({ id: item.id, name: item.name });
      return acc;
    },
    {} as Record<string, any[]>,
  );

  return grouped;
}
