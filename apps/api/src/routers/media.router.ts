import { MediaControllers } from '@/controllers/media.controller';
import { withAuthentication, withRole } from '@/middlewares/auth.middleware';
import { withFileUpload } from '@/middlewares/file-upload.middleware';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class MediaRouter {
  private router: Router;
  private controller: MediaControllers;

  constructor() {
    this.controller = new MediaControllers();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/events/banners',
      withAuthentication,
      withRole('ORGANIZER'),
      withFileUpload,
      catcherror(this.controller.uploadEventBanner),
    );
    this.router.post(
      '/events/assets',
      withAuthentication,
      withFileUpload,
      catcherror(this.controller.uploadEventAsset),
    );
    this.router.post(
      '/users/profile',
      withAuthentication,
      withFileUpload,
      catcherror(this.controller.uploadEventAsset),
    );

    this.router.post(
      '/users/payment',
      withAuthentication,
      withFileUpload,
      catcherror(this.controller.uploadPaymentProof),
    );

    this.router.delete(
      '/',
      withAuthentication,
      catcherror(this.controller.remove),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
