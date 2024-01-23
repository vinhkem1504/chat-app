import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDatabase } from './configs/db';

config();

const app: Express = express();
const PORT = process.env.SERVER_PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database connect
connectDatabase();

//App route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});
