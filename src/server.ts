import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';

import * as mongoose from 'mongoose';

import * as passport from 'passport';
import * as passportGithub from 'passport-github';
import * as bodyParser from 'body-parser';

import { NestFactory } from 'nest.js';
import { ApplicationModule } from './modules/app.module';

(<any>mongoose).Promise = global.Promise;
mongoose.connect(process.env.DB_ADDRESS || 'mongodb://localhost/poll-api');
mongoose.connection.on('connected', () => {
  console.log(`[server] database connection established`);
});

// Initialize express with middleware
const expressInstance = express();
passport.use(new passportGithub.Strategy({
  clientID: 'aa4289ed9ab4df542ba5',
  clientSecret: '46ab834537afbc89df72e176c5f0978cec91a25b',
  callbackURL: '//localhost:3000/auth/github/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Get and return user;
  return done(null, profile);
}));

expressInstance.use(bodyParser.json());

expressInstance.use(passport.initialize());

expressInstance.use(morgan('dev'));
expressInstance.use(cors());

const app = NestFactory.create(ApplicationModule, expressInstance);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`[server] listening on port ${port}.`));
