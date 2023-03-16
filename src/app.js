const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./routes/');
const cors = require('cors');
const config = require('./config');

app.use(cors())
app.use(express.json())
app.use('/api', routes)

app.use(function (_, res, next) {
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

