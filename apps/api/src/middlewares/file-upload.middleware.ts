import { BadRequestError } from '@/errors/bad-request.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const withFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const uploadmd = upload.fields([{ name: 'file-upload', maxCount: 1 }]);
  uploadmd(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new BadRequestError(err.message));
    } else if (err) {
      next(new InternalSeverError(err));
    }

    // everything goes fine
    next();
  });
};
