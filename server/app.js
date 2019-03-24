import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import codes from './helpers/statusCode';
import Response from './helpers/Response';
import router from './routes/apiRoutes';
import Question from './database/Question';
import Quiz from './database/Quiz';
import mkdirp from 'mkdirp';
import os from 'os';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3030;

// Question.drop();
Question.sync();
// Quiz.drop();
Quiz.sync();

mkdirp.sync(os.homedir() + '/.sulvme/public/images');

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/../public'));
app.use(express.static(os.homedir() + '/.sulvme/public'));

app.get('/', async (req, res) => {
  console.log(req.url);
  Response.send(res, codes.success, {
    data: {
      message: 'The app is running',
    },
  });
});

app.use('/', router);

app.listen(PORT);

// eslint-disable-next-line no-console
console.log('app running on port ', PORT);
export default app;
