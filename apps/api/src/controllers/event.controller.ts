import { SAFE_MIME_IMAGE } from '@/constant';
import { CreateEventDTO } from '@/dto/create-event.dto';
import { GetAllEventDTO } from '@/dto/get-all-event.dto';
import { BadRequestError } from '@/errors/bad-request.error';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { cloudinaryPublicIdFromURL } from '@/helpers/cloudinary-public-id-from-url';
import { formatErr } from '@/helpers/format-error';
import { getFileFromRequest } from '@/helpers/get-file-from-request';
import { getOrganizerId } from '@/helpers/get-organizer-id';
// import { EventCategoryService } from '@/services/event-category.service';
import { EventService } from '@/services/event.service';
import { MediaService } from '@/services/media.service';
// import { TicketService } from '@/services/ticket.service';
import { Request, Response } from 'express';

export class EventController {
  private eventService = new EventService();
  // private eventCategoryService = new EventCategoryService();
  // private ticketService = new TicketService();
  private mediaService = new MediaService();

  create = async (req: Request, res: Response) => {
    const organizerId = getOrganizerId(req);

    const { data: dto, error } = CreateEventDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const pid = cloudinaryPublicIdFromURL(dto.event.bannerUrl);
      if (pid) {
        dto.event.bannerUrl = await this.mediaService.rename(
          pid,
          pid.replace('/temp', '/event'),
        );
      }

      const eventid = await this.eventService.create(organizerId, dto);
      res.status(201).json({
        event: { id: eventid },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };

  getAll = async (req: Request, res: Response) => {
    const organizerId = getOrganizerId(req);
    const { data: dto, error } = GetAllEventDTO.safeParse(req.query);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const result = await this.eventService.getAll(organizerId, dto);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };

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

  uploadDescriptionAsset = async (req: Request, res: Response) => {
    // const organizerId = getOrganizerId(req);

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
