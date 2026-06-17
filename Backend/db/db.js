const mongoose = require('mongoose');

function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('✅ Connected to MongoDB successfully!');
        })
        .catch(err => {
            console.error('MongoDB Error:', err);
        });
}

module.exports = connectToDb;