import { ApiError } from './interface';

export class FailedValidationError extends ApiError {
  constructor(errdetail: Record<any, any>) {
    const errmsg = 'we found some issue with your request';
    super(422, errmsg, errdetail);
  }
}
