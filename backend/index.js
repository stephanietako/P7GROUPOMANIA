import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import userRouter from './routes/userRoute.js';
import postRouter from './routes/postRoute.js';
import path from 'path';
dotenv.config();

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use('/users', userRouter);
app.use('/posts', postRouter);
app.use('/client', express.static(path.join('./client')));
app.listen(process.env.PORT, () => {
  console.log('Server running ! Enjoy !');
});
