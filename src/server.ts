import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';

import { NestFactory } from 'nest.js';
import { ApplicationModule } from './modules/app.module';

const dbUser = process.env.DB_USER || '';
const dbPass = process.env.DB_PASS || '';
const dbAddr = process.env.DB_ADDR || 'localhost';
const dbName = process.env.DB_NAME || 'poll-api';

(mongoose as any).Promise = global.Promise;
mongoose.connect(`mongodb://${dbUser && dbPass ? `${dbUser}:${dbPass}@` : ''}${dbAddr}/${dbName}`);
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
