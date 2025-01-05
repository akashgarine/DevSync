import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv"
import connectDB from "./connection/connect.js";
import User from "./model/models.js";
import cors from "cors";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

app.post("/signup", async (req, res) => {
    ///TODO: Add validation
    // Check if User exists or not
    // if user is new add to repo
    // for res message of 200 -> "User created"
});
 
app.post("/login", async(req,res) =>{
    //TODO: Add validation dont change the res message of 200, you can modify the rest
    const {email} = req.body;
    const exist = User.findOne({email});
    if(!exist) return res.status(404).json({message: "User not found"})
    else{
        return res.status(200).json({message:"Logged In successfully"})
    }    
})

app.listen(6969,() => {
    connectDB();
    console.log("I 'm listening on port 6969!");
})