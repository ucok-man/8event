export abstract class ApiError extends Error {
  readonly status: number;
  readonly errmsg: string;
  readonly errdetail?: Record<string, string>;
  readonly _errinternal?: string;

  constructor({
    status,
    errmsg,
    errdetail,
    _errinternal,
  }: {
    status: number;
    errmsg: string;
    errdetail?: Record<any, any>;
    _errinternal?: string;
  }) {
    super(_errinternal || errmsg);
    this.errmsg = errmsg;
    this.status = status;
    this.errdetail = errdetail;
    this._errinternal = _errinternal;
    Error.captureStackTrace(this, this.constructor);
  }
}
