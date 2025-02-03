import { EventDetailController } from '@/controllers/event-detail.controller';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class EventDetailRouter {
  private router: Router;
  private controller: EventDetailController;

  constructor() {
    this.controller = new EventDetailController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/id/:eventId', catcherror(this.controller.getById));
    this.router.get(
      '/id/:eventId/summary',
      catcherror(this.controller.getSummary),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
