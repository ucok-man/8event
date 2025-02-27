import { ApiError } from './interface';

export class InternalSeverError extends ApiError {
  constructor(_errinternal: string) {
    super({
      _errinternal,
      errmsg:
        'sorry the server encountered problem and cannot procces your request',
      status: 500,
    });
  }
}
