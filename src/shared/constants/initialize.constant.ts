import { RequestMethod } from '@nestjs/common';

export const METHOD_MAP = {
  [RequestMethod.GET]: 'GET',
  [RequestMethod.POST]: 'POST',
  [RequestMethod.PUT]: 'PUT',
  [RequestMethod.DELETE]: 'DELETE',
  [RequestMethod.PATCH]: 'PATCH',
  [RequestMethod.ALL]: 'ALL',
  [RequestMethod.OPTIONS]: 'OPTIONS',
  [RequestMethod.HEAD]: 'HEAD',
};

export interface RouteMeta {
  controller: string;
  controllerPath: string;
  tags: string[];
  methodName: string;
  httpMethod: string | null;
  routePath: string | null;
  fullPath: string;
  summary: string;
}
