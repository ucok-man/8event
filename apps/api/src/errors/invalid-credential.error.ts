import { ApiError } from './interface';

export class InvalidCredentialError extends ApiError {
  constructor() {
    super({
      errmsg: 'invalid authentication credentials',
      status: 401,
    });
  }
}
