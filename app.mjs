import express from 'express';
import authRouter from './routes/authRoute.mjs';
import fileRouter from './routes/fileRoute.mjs';

const app = express();

app.use(authRouter);
app.use('/file', fileRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`App started on port: ${port}`));
