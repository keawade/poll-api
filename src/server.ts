import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';

import { NestFactory } from 'nest.js';
import { ApplicationModule } from './modules/app.module';

// Initialize express with middleware
const expressInstance = express();
expressInstance.use(morgan('dev'));
expressInstance.use(cors());

const app = NestFactory.create(ApplicationModule, expressInstance);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`[server.ts] listening on port ${port}.`));
