import { TransactionControllers } from '@/controllers/transaction.controller';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class TransactionRouter {
  private router: Router;
  private controller: TransactionControllers;

  constructor() {
    this.controller = new TransactionControllers();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/checkout', catcherror(this.controller.checkout));
  }

  getRouter(): Router {
    return this.router;
  }
}
