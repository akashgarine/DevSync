import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign } = pkg;
import User from '../models/User.js';
import {nanoid} from "nanoid";
import {users,rooms} from '../sharedState/sharedState.js'
export async function signup(req, res) {
    const {username,email,password}=req.body;
    console.log(req.body);
    try {
        // Check if the email is already taken
        const existingUser = await User.findOne({email});
        if (existingUser) { 
            return res.status(400).json({ message: 'Email already exists' });
        }
        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });

       
        await newUser.save();
       
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
}


export async function login(req,res){
    const {email,password}=req.body;
    try{
        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, userId: user._id, message: 'User logged in' });
    } 
    catch(error){
        return res.status(500).json({ message: 'Error logging in', error });
    }
}


export async function joinRoom(req,res){
    const {userId} = req.body;
    const {roomCode} = req.body;
    if(rooms[roomCode] == null) 
        return res.status(404).json({message: "Room not found",success:false});
    rooms[roomCode].push(userId);
    users[userId] = roomCode;
    res.status(200).json({message:`User Joined ${userId} - ${userId} `, success:true})
}

export async function createRoom(req,res){
    const {userId} = req.body;
    try{
        const roomCode = nanoid(8);
        rooms[roomCode] =[];
        rooms[roomCode].push(userId);
        users[userId] = roomCode;
        return res.status(200).json({message:`Room created `,roomCode,success:true})
    }
    catch(err){
        return  res.status(500).json({message:"Error",success:false});
    }
}