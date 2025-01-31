import { EventController } from '@/controllers/event.controller';
import { fileUpload } from '@/middlewares/file-upload.middleware';
import { Router } from 'express';
import catcherror from 'express-async-handler';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', catcherror(this.eventController.create));
    this.router.post(
      '/upload-banner',
      fileUpload,
      catcherror(this.eventController.uploadBannerTemp),
    );
    this.router.post(
      '/upload-description-assets',
      fileUpload,
      catcherror(this.eventController.uploadDescriptionAsset),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
