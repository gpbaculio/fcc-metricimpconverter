"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
var cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const uuidv1 = require('uuid/v1');
require('dotenv').config();
// tests
const convert_1 = require("./routes/convert");
const fcc_testing_1 = require("./routes/fcc-testing");
class App {
    constructor() {
        this.app = express();
        this.convertRoute = new convert_1.default();
        this.fccTestingRoute = new fcc_testing_1.default();
        this.app.use(helmet());
        this.app.use(helmet.noSniff()); // prevent client to guess(sniff) the MIME type.
        // secure cookies with express-session
        const sessionConfig = {
            secret: process.env.SECRET_KEY,
            genid: () => uuidv1(),
            cookie: {},
            resave: true,
            saveUninitialized: true
        };
        if (process.env.NODE_ENV === 'production') {
            this.app.set('trust proxy', 1); // trust first proxy
            sessionConfig.cookie.secure = true; // serve secure cookies
        }
        this.app.use(session(sessionConfig));
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
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
exports.default = new App().app;
//# sourceMappingURL=app.js.map