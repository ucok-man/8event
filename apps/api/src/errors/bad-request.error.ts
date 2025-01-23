import { ApiError } from './interface';

export class BadRequestError extends ApiError {
  constructor(errmsg: string) {
    super(401, errmsg);
  }
}
