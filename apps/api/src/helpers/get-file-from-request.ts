import { BadRequestError } from '@/errors/bad-request.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { Request } from 'express';

export function getFileFromRequest(req: Request) {
  if (!req.files) {
    throw new BadRequestError(
      'missing required file body with key: "file-upload"',
    );
  }
  if (Array.isArray(req.files)) {
    throw new InternalSeverError(
      'mutler middleware should not take array. user upload.fields instead',
    );
  }

  return req.files['file-upload'][0];
}
