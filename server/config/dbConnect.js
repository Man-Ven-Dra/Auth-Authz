const mongoose = require('mongoose');
require('dotenv').config

const connectDB = () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        console.log('Database Connection Successfull')
    })
    .catch((error) => {
        console.log('Database Connection Failed')
        console.log(error)
        process.exit(1)
    })
}

module.exports = connectDB;