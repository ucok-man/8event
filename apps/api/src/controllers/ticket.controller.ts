// import { EventCategoryService } from '@/services/event-category.service';
// import { EventService } from '@/services/event.service';
// import { MediaService } from '@/services/media.service';
// import { TicketService } from '@/services/ticket.service';

export class EventController {
  // private eventService = new EventService();
  // private eventCategoryService = new EventCategoryService();
  // private ticketService = new TicketService();
  // private mediaService = new MediaService();

  constructor() {
    // this.create = this.create.bind(this);
  }

  //   async create(req: Request, res: Response) {
  //     const { data: dto, error } = CreateTicketDtoValidation.safeParse(req.body);
  //     if (error) {
  //       throw new FailedValidationError(fromError(error));
  //     }

  //     const organizerId = ''; // TODO: get this from request

  //     try {
  //       const categories = await this.eventCategoryService.createManyIfNotExist(
  //         dto.categories,
  //       );
  //       const event = await this.eventService.create(
  //         organizerId,
  //         { ...dto },
  //         categories,
  //       );
  //       res.status(201).json({
  //         eventId: event.id,
  //       });
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         throw new InternalSeverError(error.message);
  //       }
  //       throw error;
  //     }
  //   }
}
