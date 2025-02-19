import { MediaControllers } from '@/controllers/media.controller';
import { fileUpload } from '@/middlewares/file-upload.middleware';
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
      fileUpload,
      catcherror(this.controller.uploadEventBanner),
    );
    this.router.post(
      '/events/assets',
      fileUpload,
      catcherror(this.controller.uploadEventAsset),
    );
    this.router.delete('/', catcherror(this.controller.remove));
  }

  getRouter(): Router {
    return this.router;
  }
}
