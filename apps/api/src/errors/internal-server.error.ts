import { ApiError } from './interface';

export class InternalSeverError extends ApiError {
  constructor(errmsg: string) {
    super(500, errmsg);
  }
}
