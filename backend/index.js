const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');   
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

//mongoDB connection
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI )
        console.log(`Database connected, ${conn.connection.id}`);
    }
    catch{
        console.error("Error connecting to database");
    }
}


//Import routes
const authRoutes = require('./routes/authRoutes.js');


//Routes
app.use('/api', authRoutes);


app.listen(6969,() => {
    connectDB();
    console.log("I 'm listening on port 6969!");
})