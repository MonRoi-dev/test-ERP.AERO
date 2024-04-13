import express from 'express';
import authRouter from './routes/authRoute.mjs';
import fileRouter from './routes/fileRoute.mjs';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(authRouter);
app.use('/file', fileRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App started on port: ${port}`));
