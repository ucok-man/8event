import { ApiError } from './interface';

export class UnauthenticatedError extends ApiError {
  constructor() {
    super({
      errmsg: 'you must be authenticated to access this resource',
      status: 401,
    });
  }
}
