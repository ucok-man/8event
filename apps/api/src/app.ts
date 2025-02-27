import cors from 'cors';
import express, {
  Express,
  json,
  NextFunction,
  Request,
  Response,
  urlencoded,
} from 'express';
import { FRONTEND_URL, NODE_ENV, PORT } from './config';
// import { SampleRouter } from './routers/sample.router';
import cookies from 'cookie-parser';
import { ApiError } from './errors/interface';
import { AuthRouter } from './routers/auth.router';
import { EventsRouter } from './routers/events.router';
import { MediaRouter } from './routers/media.router';
import { TicketRouter } from './routers/ticket.router';
import { TransactionRouter } from './routers/transaction.router';
import { UserRouter } from './routers/user.router';

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
    this.app.use(
      cors({
        origin: FRONTEND_URL,
        credentials: true,
      }),
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookies());
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
              if (err.status === 500)
                this.logerror(new Error(err._errinternal));
              res.status(err.status).json({
                error: {
                  message: err.errmsg,
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
    const eventsRouter = new EventsRouter();
    const mediaRouter = new MediaRouter();
    const ticketRouter = new TicketRouter();
    const userRouter = new UserRouter();
    const transactionRouter = new TransactionRouter();
    const authRouter = new AuthRouter();

    this.app.get('/api', (req: Request, res: Response) => {
      res.json({
        status: 'available',
        system_info: {
          environment: NODE_ENV,
          version: this.version,
        },
      });
    });

    this.app.use('/api/events', eventsRouter.getRouter());
    this.app.use('/api/media', mediaRouter.getRouter());
    this.app.use('/api/tickets', ticketRouter.getRouter());
    this.app.use('/api/users', userRouter.getRouter());
    this.app.use('/api/transactions', transactionRouter.getRouter());
    this.app.use('/api/auth', authRouter.getRouter());
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
