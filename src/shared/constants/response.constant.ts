export interface PageMeta {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface PageResponse<T> {
  items: T[];
  meta: PageMeta;
}


export class ResponseData<T> {
  status: number;
  error: T | null;
  message: string;
  data: T;

  constructor(status: number, error: T | null, message: string, data: T) {
    this.status = status;
    this.error = error == null ? null : error;
    this.message = message;
    this.data = data;
  }
}

export interface Response<T> {
  data: T;
}
