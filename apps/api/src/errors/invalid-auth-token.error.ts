import { ApiError } from './interface';

export class InvalidAuthTokenError extends ApiError {
  constructor() {
    super({
      errmsg: 'invalid or missing authentication token',
      status: 401,
    });
  }
}
