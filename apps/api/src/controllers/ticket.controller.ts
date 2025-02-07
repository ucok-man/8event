import { DeleteTicketDTO } from '@/dto/delete-ticket.dto';
import { FailedValidationError } from '@/errors/failed-validation.error';
import { InternalSeverError } from '@/errors/internal-server.error';
import { NotFoundError } from '@/errors/not-found.error';
import { formatErr } from '@/helpers/format-error';
import { TicketService } from '@/services/ticket.service';
import { Request, Response } from 'express';

export class TicketControllers {
  private ticketService = new TicketService();

  delete = async (req: Request, res: Response) => {
    const { data: dto, error } = DeleteTicketDTO.safeParse(req.params);
    if (error) {
      throw new FailedValidationError(formatErr(error));
    }

    try {
      const ticket = await this.ticketService.delete(dto.ticketId);
      if (!ticket) {
        throw new NotFoundError();
      }
      res.status(200).json({
        ticket: { id: ticket.id },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalSeverError(error.message);
      }
      throw error;
    }
  };
}
