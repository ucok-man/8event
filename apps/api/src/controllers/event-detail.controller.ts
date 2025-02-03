import { GetByIdEventDTO } from '@/dto/get-by-id-event.dto';
import { GetSummaryEventDTO } from '@/dto/get-summary-event.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NotFoundError } from '@/errors/not-found.error';
import { formatErr } from '@/helpers/format-error';
import { getOrganizerId } from '@/helpers/get-organizer-id';
import { EventDetailService } from '@/services/event-detail.service';
import { Request, Response } from 'express';

export class EventDetailController {
  private eventDetailService = new EventDetailService();

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
}
