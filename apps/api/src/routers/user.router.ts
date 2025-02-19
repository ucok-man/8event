import { UserControllers } from '@/controllers/user.controller';
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
    this.router.get('/id/:userId', catcherror(this.controller.getById));
  }

  getRouter(): Router {
    return this.router;
  }
}
