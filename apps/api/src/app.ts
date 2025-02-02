import cors from 'cors';
import express, {
  Express,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import { PORT } from './config';
// import { SampleRouter } from './routers/sample.router';
import { ApiError } from './errors/interface';
import { EventRouter } from './routers/event.router';

export default class App {
  private version = '1.0.0';
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private logerror(err: Error) {
    console.log('Error Msg: ', err.message);
    console.error('Error : ', err.stack);
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).json({
          error: {
            message: 'the resource you are looking for cannot be found',
          },
        });
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          switch (true) {
            // handle api error
            case err instanceof ApiError: {
              if (err.status === 500) this.logerror(err);
              res.status(err.status).json({
                error: {
                  message:
                    'sorry the server encountered problem and cannot procces your request',
                  detail: err.errdetail,
                },
              });
              break;
            }

            // handle other error
            default: {
              this.logerror(err);
              res.status(500).json({
                error: {
                  message:
                    'sorry the server encountered problem and cannot procces your request',
                },
              });
              break;
            }
          }
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    // const sampleRouter = new SampleRouter();
    const eventRouter = new EventRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.json({
        status: 'available',
        system_info: {
          environment: process.env.NODE_ENV,
          version: this.version,
        },
      });
    });

    // this.app.use('/api/samples', sampleRouter.getRouter());
    this.app.use('/api/events', eventRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
