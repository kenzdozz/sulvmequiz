import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';
import codes from './helpers/statusCode';
import Response from './helpers/Response';
import router from './routes/apiRoutes';

const app = express();
const PORT = process.env.PORT || 30303;

// Question.drop();
// Question.sync();

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', async (req, res) => {
  Response.send(res)
  res.status(codes.success).send({
    status: codes.success,
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
