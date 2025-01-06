const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const app = express();

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
module.exports = router;