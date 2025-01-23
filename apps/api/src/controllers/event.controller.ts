import { SAFE_MIME_IMAGE } from '@/constant';
import { CreateEventDtoValidation } from '@/dto/create-event.dto';
import { BadRequestError } from '@/errors/bad-request.error';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { getFileFromRequest } from '@/helpers/get-file-from-request';
import { EventCategoryService } from '@/services/event-category.service';
import { EventService } from '@/services/event.service';
import { MediaService } from '@/services/media.service';
import { TicketService } from '@/services/ticket.service';
import { Request, Response } from 'express';
import { fromError } from 'zod-validation-error';

export class EventController {
  private eventService = new EventService();
  private eventCategoryService = new EventCategoryService();
  private ticketService = new TicketService();
  private mediaService = new MediaService();

  constructor() {
    this.uploadBanner = this.uploadBanner.bind(this);
    this.create = this.create.bind(this);
  }

  async create(req: Request, res: Response) {
    const { data: dto, error } = CreateEventDtoValidation.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(fromError(error));
    }

    const organizerId = ''; // TODO: get this from request

    try {
      const categories = await this.eventCategoryService.createManyIfNotExist(
        dto.categories,
      );
      const event = await this.eventService.create(
        organizerId,
        { ...dto },
        categories,
      );
      const ticket = await this.ticketService.createMany(dto.tickets, event.id);
      res.status(201).json({
        eventId: event.id,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  }

  async uploadBanner(req: Request, res: Response) {
    const organizerId = 'randomid'; // TODO: get organizer id

    const fileinput = getFileFromRequest(req);
    const match = SAFE_MIME_IMAGE.find(
      (safemime) => safemime === fileinput.mimetype,
    );
    if (!match) {
      throw new BadRequestError(
        'file format not supported, valid format are [jpg, png, webp]',
      );
    }

    try {
      const url = await this.mediaService.uploadEventBanner(
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
  }
}
