import { SAFE_MIME_IMAGE } from '@/constant';
import { DeleteMediaDTO } from '@/dto/delete-media.dto';
import { BadRequestError } from '@/errors/bad-request.error';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { formatErr } from '@/helpers/format-error';
import { getFileFromRequest } from '@/helpers/get-file-from-request';
import { MediaService } from '@/services/media.service';
import { Request, Response } from 'express';

export class MediaControllers {
  private mediaService = new MediaService();

  uploadEventBanner = async (req: Request, res: Response) => {
    const fileinput = getFileFromRequest(req);
    const match = SAFE_MIME_IMAGE.find(
      (safemime) => safemime === fileinput.mimetype,
    );
    if (!match) {
      throw new BadRequestError(
        'file format not supported, valid format are [jpg, png]',
      );
    }

    try {
      const url = await this.mediaService.uploadEventBanner(fileinput.buffer);

      res.status(201).json({
        imageUrl: url,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };

  uploadEventAsset = async (req: Request, res: Response) => {
    const fileinput = getFileFromRequest(req);
    const match = SAFE_MIME_IMAGE.find(
      (safemime) => safemime === fileinput.mimetype,
    );
    if (!match) {
      throw new BadRequestError(
        'file format not supported, valid format are [jpg, png]',
      );
    }

    try {
      const url = await this.mediaService.uploadEventAsset(fileinput.buffer);

      res.status(201).json({
        imageUrl: url,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };

  remove = async (req: Request, res: Response) => {
    const { data: dto, error } = DeleteMediaDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const ok = await this.mediaService.remove(dto.mediaUrl);
      if (!ok) {
        throw new BadRequestError('invalid media url format');
      }
      res.status(200).json({
        message: 'success removing requested media',
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };
}
