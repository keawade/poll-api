import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';

import { NestFactory } from 'nest.js';
import { ApplicationModule } from './modules/app.module';

(mongoose as any).Promise = global.Promise;
mongoose.connect(process.env.DB_ADDRESS || 'mongodb://localhost/poll-api');
mongoose.connection.on('connected', () => {
  console.log(`[server] database connection established`);
});

// Initialize express with middleware
const expressInstance = express();
expressInstance.use(bodyParser.json());
expressInstance.use(morgan('dev'));
expressInstance.use(cors());

const app = NestFactory.create(ApplicationModule, expressInstance);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`[server] listening on port ${port}.`));
