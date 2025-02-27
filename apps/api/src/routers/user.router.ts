import { UserControllers } from '@/controllers/user.controller';
import { withAuthentication } from '@/middlewares/auth.middleware';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class UserRouter {
  private router: Router;
  private controller: UserControllers;

  constructor() {
    this.controller = new UserControllers();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/identity',
      withAuthentication,
      catcherror(this.controller.identity),
    );
    this.router.get(
      '/me',
      withAuthentication,
      catcherror(this.controller.getCurrentUser),
    );
    this.router.patch(
      '/me',
      withAuthentication,
      catcherror(this.controller.updateCurrentUser),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
