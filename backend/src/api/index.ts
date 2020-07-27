import express, { Express } from 'express';

export class App {
  private server: Express;
  private port = 4000;

  constructor() {
    this.server = express();
    this.server.get('/', (_req, res) => {
      res.send('Hello World!');
    });
  }

  start() {
    this.server.listen(this.port, () =>
      console.log(`App listening at http://localhost:${this.port}`)
    );
  }
}
