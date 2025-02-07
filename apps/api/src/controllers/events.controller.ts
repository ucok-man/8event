import { CreateEventDTO } from '@/dto/create-event.dto';
import { GetAllEventDTO } from '@/dto/get-all-event.dto';
import { GetByIdEventDTO } from '@/dto/get-by-id-event.dto';
import { GetSalesEventDTO } from '@/dto/get-sales-event.dto';
import { GetSummaryEventDTO } from '@/dto/get-summary-event.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NotFoundError } from '@/errors/not-found.error';
import { cloudinaryPublicIdFromURL } from '@/helpers/cloudinary-public-id-from-url';
import { formatErr } from '@/helpers/format-error';
import { getOrganizerId } from '@/helpers/get-organizer-id';
import { EventDetailService } from '@/services/event-detail.service';
import { EventService } from '@/services/event.service';
import { MediaService } from '@/services/media.service';
import { Request, Response } from 'express';

export class EventsController {
  private eventService = new EventService();
  private mediaService = new MediaService();
  private eventDetailService = new EventDetailService();

  create = async (req: Request, res: Response) => {
    const organizerId = getOrganizerId(req);

    const { data: dto, error } = CreateEventDTO.safeParse(req.body);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      if (dto.event.bannerUrl.includes('minpro-event-ticketing/temp/banner')) {
        const pid = cloudinaryPublicIdFromURL(dto.event.bannerUrl);
        if (pid) {
          dto.event.bannerUrl = await this.mediaService.rename(
            pid,
            pid.replace('/temp', '/event'),
          );
        }
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
    const { data: dto, error } = GetAllEventDTO.safeParse(req.query);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const result = await this.eventService.getAll(dto);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };

  getById = async (req: Request, res: Response) => {
    const organizerId = getOrganizerId(req);
    const { data: dto, error } = GetByIdEventDTO.safeParse(req.params);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const event = await this.eventDetailService.getById(organizerId, dto);
      if (!event) {
        throw new NotFoundError();
      }
      res.status(200).json({
        event: event,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };

  getSummary = async (req: Request, res: Response) => {
    const { data: dto, error } = GetSummaryEventDTO.safeParse(req.params);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const summary = await this.eventDetailService.getSummary(dto);
      if (!summary) {
        throw new NotFoundError();
      }
      res.status(200).json({ summary });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };

  getTicketSales = async (req: Request, res: Response) => {
    const { data: dto, error } = GetSalesEventDTO.safeParse(req.params);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const ticketSales = await this.eventDetailService.getTicketSales(dto);
      if (!ticketSales) {
        throw new NotFoundError();
      }
      res.status(200).json({ ticketSales });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };
}
