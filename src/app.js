const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes/');
const cors = require('cors');
const config = require('./config');
const access = require('./middlewares/access.middleware')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(cors())
// app.use(rateLimit(limiter))
app.use(express.json())
app.use(helmet())
app.use(access)

app.use('/api', routes)

app.use((_, res, next) => {
    res.status(404).send({ message: 'PAGE_NOT_FOUND' })
    next()
})

const PORT = config.port || 6006;
const DB = config.db.uri.replace("<password>", config.db.pass)

mongoose.set('strictQuery', false);
mongoose.connect(DB, (err) => {
    if(err) return console.log("err: ", err);

    app.listen(PORT, () => console.log("Server is running on PORT: ", PORT))
})

