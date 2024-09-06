const express = require('express');
const connectDB = require('./config/dbConnect');
const router = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use('/api/v1', router)
connectDB()

app.listen(PORT, () => {
    console.log(`App started at: http://localhost:${PORT}`)
    //process.exit(0)
})