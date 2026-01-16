import { Injectable } from "@nestjs/common";
import { OpenAPIObject } from "@nestjs/swagger";
import { HTTPMethod } from "generated/prisma/enums";

type Permission = {
  path: string;
  method: string;
  name: string;
  module?: string;
};
@Injectable()
export class SwaggerService {

  extractPermissions(document: OpenAPIObject) {
const permissions: Permission[] = [];

    for (const path in document.paths) {
      const pathObj = document.paths[path];

      for (const method in pathObj) {
        const meta = pathObj[method];
    const normalizedMethod = method.toUpperCase() as keyof typeof HTTPMethod;

        permissions.push({
          path,
         method: HTTPMethod[normalizedMethod],
          module: meta.tags?.[0] ?? 'Unknown',
          name: meta.summary ?? `${method.toUpperCase()} ${path}`,
        });
      }
    }

    return permissions;
  }
}
