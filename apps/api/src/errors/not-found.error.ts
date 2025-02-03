import { ApiError } from './interface';

export class NotFoundError extends ApiError {
  constructor() {
    super({
      errmsg: 'the resource you are looking for cannot be found',
      status: 404,
    });
  }
}
