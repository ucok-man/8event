import { ApiError } from './interface';

export class UnauthorizedError extends ApiError {
  constructor() {
    super({
      errmsg: 'you are not allowed to access this resource',
      status: 403,
    });
  }
}
