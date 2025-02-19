import { CreateEventDTO } from '@/dto/create-event.dto';
import { GetAllEventDTO } from '@/dto/get-all-event.dto';
import { GetEventByIdDTO } from '@/dto/get-event-by-id.dto';
import { GetEventSalesDTO } from '@/dto/get-event-sales.dto';
import { GetEventSummaryDTO } from '@/dto/get-event-summary.dto';
import { UpdateEventViewIncrementDTO } from '@/dto/update-event-view-increment.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NotFoundError } from '@/errors/not-found.error';
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
    const { data: dto, error } = GetEventByIdDTO.safeParse(req.params);
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
    const { data: dto, error } = GetEventSummaryDTO.safeParse(req.params);
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
    const { data: dto, error } = GetEventSalesDTO.safeParse(req.params);
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

  updateIncrementEventView = async (req: Request, res: Response) => {
    const { data: dto, error } = UpdateEventViewIncrementDTO.safeParse(
      req.params,
    );
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const event = await this.eventDetailService.incrementView(dto.eventId);
      if (!event) {
        throw new NotFoundError();
      }
      res.status(200).json({ eventId: event.id });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };
}
