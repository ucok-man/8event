import { NextFunction, Request, Response } from 'express';
import asynchandler from 'express-async-handler';

export function errhandler(
  cb: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return asynchandler((req, res, next) => cb(req, res, next));
}
