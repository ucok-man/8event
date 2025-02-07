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
      '/upload-banner',
      fileUpload,
      catcherror(this.controller.uploadBannerTemp),
    );
    this.router.post(
      '/upload-assets',
      fileUpload,
      catcherror(this.controller.uploadAsset),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
