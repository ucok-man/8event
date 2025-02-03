import { ApiError } from './interface';

export class BadRequestError extends ApiError {
  constructor(errmsg: string) {
    super({
      errmsg,
      status: 401,
    });
  }
}
