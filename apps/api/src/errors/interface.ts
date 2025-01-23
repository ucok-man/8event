export abstract class ApiError extends Error {
  readonly status: number;
  readonly errmsg: string;
  readonly errdetail?: Record<string, string>;

  constructor(status: number, errmsg: string, errdetail?: Record<any, any>) {
    super(errmsg);
    this.errmsg = errmsg;
    this.status = status;
    this.errdetail = errdetail;
    Error.captureStackTrace(this, this.constructor);
  }
}
