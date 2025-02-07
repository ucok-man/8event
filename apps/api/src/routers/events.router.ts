import { EventsController } from '@/controllers/events.controller';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class EventsRouter {
  private router: Router;
  private controller: EventsController;

  constructor() {
    this.controller = new EventsController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', catcherror(this.controller.getAll));
    this.router.post('/', catcherror(this.controller.create));
    this.router.get('/id/:eventId', catcherror(this.controller.getById));
    this.router.get(
      '/id/:eventId/summary',
      catcherror(this.controller.getSummary),
    );
    this.router.get(
      '/id/:eventId/sales',
      catcherror(this.controller.getTicketSales),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
