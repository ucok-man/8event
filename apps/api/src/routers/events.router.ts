import { EventsController } from '@/controllers/events.controller';
import { fileUpload } from '@/middlewares/file-upload.middleware';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class EventsRouter {
  private router: Router;
  private controller: EventsController;

  constructor() {
    this.controller = new EventsController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', catcherror(this.controller.getAll));
    this.router.post('/', catcherror(this.controller.create));
    this.router.post(
      '/upload-banner',
      fileUpload,
      catcherror(this.controller.uploadBannerTemp),
    );
    this.router.post(
      '/upload-description-assets',
      fileUpload,
      catcherror(this.controller.uploadDescriptionAsset),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
