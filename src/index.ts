import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import routes from './routes/_index';
import cors from 'cors';
import config from './config';
import access from './middlewares/access.middleware'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { RequestHandler } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';
import handleError from './error/handleError';
import bodyParser from 'body-parser';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

const app: Application = express();

app.use(cors())
// app.use(rateLimit(limiter))
app.use(helmet())
app.use((access as unknown) as RequestHandler<ParamsDictionary, any, any, Query>)

// webhook payload must be sent raw
app.use("/api/v1/checkout/webhook", bodyParser.raw({ type: '*/*' }));

app.use(express.json())
// app.use((access as unknown) as RequestHandler<ParamsDictionary, any, any, Query>)

app.use('/api', routes)

app.use((_, res, next) => {
    res.status(404).send({ message: 'PAGE_NOT_FOUND' })
    next()
})

app.use(handleError);

const PORT = config.port || 6006;
const DB = config.db.uri.replace("<password>", config.db.pass)

mongoose.set('strictQuery', false);
mongoose.connect(DB, (err) => {
    if (err) return console.log("err: ", err);

    app.listen(PORT, () => console.log("Server is running on PORT: ", PORT))
})
