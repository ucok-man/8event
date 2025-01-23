import { EventController } from '@/controllers/event.controller';
import { fileUpload } from '@/middlewares/file-upload.middleware';
import { Router } from 'express';
import { errhandler } from './async-wrapper';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', errhandler(this.eventController.create));
    this.router.post(
      '/upload-banner',
      fileUpload,
      errhandler(this.eventController.uploadBanner),
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
