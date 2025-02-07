import { SAFE_MIME_IMAGE } from '@/constant';
import { BadRequestError } from '@/errors/bad-request.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { getFileFromRequest } from '@/helpers/get-file-from-request';
import { getOrganizerId } from '@/helpers/get-organizer-id';
import { MediaService } from '@/services/media.service';
import { Request, Response } from 'express';

export class MediaControllers {
  private mediaService = new MediaService();

  uploadBannerTemp = async (req: Request, res: Response) => {
    const organizerId = getOrganizerId(req);

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
      const url = await this.mediaService.uploadBannerTemp(
        fileinput.buffer,
        organizerId,
      );

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

  uploadAsset = async (req: Request, res: Response) => {
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
      const url = await this.mediaService.uploadAsset(fileinput.buffer);

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
}
