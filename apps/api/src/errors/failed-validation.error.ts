import { ApiError } from './interface';

export class FailedValidationError extends ApiError {
  constructor(errdetail: Record<any, any>) {
    super({
      errmsg: 'we found some issue with your request',
      errdetail,
      status: 422,
    });
  }
}
