import { Injectable } from '@nestjs/common';

type Permission = {
  path: string;
  method: string;
  name: string;
  module?: string;
};
@Injectable()
export class SwaggerService {}
