import { HttpServer as IHttpServer } from '../../domain/interfaces/http-server';
import express, { Application } from 'express';
import cors from 'cors';
import { HttpRouter } from './router';
import { Depot as CommandBus } from 'depot-command-bus';

export class HttpServer implements IHttpServer {
  port: string;
  server: Application;
  serverInstance: any;
  commandBus: CommandBus;

  constructor(port: string, commandBus: CommandBus) {
    this.port = port;
    this.commandBus = commandBus;

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(HttpRouter.create(this.commandBus));
    this.server = app;
  }

  public start(): void {
    this.serverInstance = this.server.listen(this.port, () => {
      console.log('HTTP server on port', this.port);
    });
  }

  public stop(): void {
    this.serverInstance.close();
  }

  static create(port: string, commandBus: CommandBus) {
    return new HttpServer(port, commandBus);
  }
}
