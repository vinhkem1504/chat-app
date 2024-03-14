import express, { Express, Request, Response } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDatabase } from './configs/db';
import { authRoute } from './routes/auth.route';
import { userRoute } from './routes/user.route';
import { errorHandler } from './middlewares/errorHandler';
config();

const app: Express = express();
const PORT = process.env.SERVER_PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database connect
connectDatabase();

//App route
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

//Handle error
app.use(errorHandler);
app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
});
