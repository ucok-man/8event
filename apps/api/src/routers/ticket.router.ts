import { TicketControllers } from '@/controllers/ticket.controller';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class TicketRouter {
  private router: Router;
  private controller: TicketControllers;

  constructor() {
    this.controller = new TicketControllers();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.delete('/id/:ticketId', catcherror(this.controller.delete));
  }

  getRouter(): Router {
    return this.router;
  }
}
