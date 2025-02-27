import { EventsController } from '@/controllers/events.controller';
import { withAuthentication, withRole } from '@/middlewares/auth.middleware';
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
    this.router.get('/id/:eventId', catcherror(this.controller.getById));
    this.router.patch(
      '/id/:eventId/increment-view',
      catcherror(this.controller.updateIncrementEventView),
    );

    this.router.post(
      '/',
      withAuthentication,
      withRole('ORGANIZER'),
      catcherror(this.controller.create),
    );
    this.router.get(
      '/id/:eventId/summary',
      withAuthentication,
      withRole('ORGANIZER'),
      catcherror(this.controller.getSummary),
    );
    this.router.get(
      '/id/:eventId/sales',
      withAuthentication,
      withRole('ORGANIZER'),
      catcherror(this.controller.getTicketSales),
    );
    this.router.get(
      '/statistic',
      withAuthentication,
      withRole('ORGANIZER'),
      catcherror(this.controller.getStatistic),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
