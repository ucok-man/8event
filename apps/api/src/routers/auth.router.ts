import { AuthControllers } from '@/controllers/auth.controller';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class AuthRouter {
  private router: Router;
  private controller: AuthControllers;

  constructor() {
    this.controller = new AuthControllers();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', catcherror(this.controller.register));
    this.router.post('/login', catcherror(this.controller.login));
    this.router.post('/logout', catcherror(this.controller.logout));
    this.router.get('/refresh-token', catcherror(this.controller.refreshToken));
  }

  getRouter(): Router {
    return this.router;
  }
}
