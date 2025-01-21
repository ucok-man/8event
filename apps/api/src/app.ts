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

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).json({
          error: 'the resource you are looking for cannot be found',
        });
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).json({
            error:
              'sorry the server encountered problem and cannot procces your request',
          });
        } else {
          next();
        }
      },
    );
  }

  private routes(): void {
    // const sampleRouter = new SampleRouter();

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
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
