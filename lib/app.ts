import * as express from 'express';
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
require('dotenv').config();

// tests

import ConvertRoute from './routes/convert';
import FccTestingRoute from './routes/fcc-testing';

class App {
  public app: express.Application = express();
  public convertRoute: ConvertRoute = new ConvertRoute();
  public fccTestingRoute: FccTestingRoute = new FccTestingRoute();
  constructor() {
    this.app.use(helmet());
    this.app.use(helmet.noSniff()); // prevent client to guess(sniff) the MIME type.
    this.app.use(helmet.xssFilter());
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.use(cors({ optionSuccessStatus: 200 }));
    this.app.use(bodyParser.json());

    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    this.fccTestingRoute.routes(this.app);
    this.convertRoute.routes(this.app);
    //404 Not Found Middleware
    this.app.use((req, res, next) => {
      res
        .status(404)
        .type('text')
        .send('Not Found');
    });
  }
}

export default new App().app;
