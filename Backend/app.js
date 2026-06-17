const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();

const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



connectToDb();

app.use(cors());

app.get('/', (req, res)=>{
    res.send('hello world');
});
app.use('/users', userRoutes);

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

module.exports = app;