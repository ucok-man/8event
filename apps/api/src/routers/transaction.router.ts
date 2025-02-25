import { TransactionControllers } from '@/controllers/transaction.controller';
import { withAuthentication, withRole } from '@/middlewares/auth.middleware';
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
    this.router.post(
      '/checkout',
      withAuthentication,
      withRole('CUSTOMER'),
      catcherror(this.controller.checkout),
    );
    this.router.get(
      '/uid/:userId',
      withAuthentication,
      catcherror(this.controller.getByUserId),
    );

    this.router.patch(
      '/id/:transactionId',
      withAuthentication,
      catcherror(this.controller.update),
    );

    this.router.patch(
      '/id/:transactionId/proof',
      withAuthentication,
      catcherror(this.controller.update),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
