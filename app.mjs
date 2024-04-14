import express from 'express';
import authRouter from './routes/authRoute.mjs';
import fileRouter from './routes/fileRoute.mjs';
import { checkToken } from './middlewares/checkToken.mjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.REFRESH_SECRET));
app.use(cors());

app.use(authRouter);
app.use('/file', checkToken, fileRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App started on port: ${port}`));
