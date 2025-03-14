import {nanoid} from "nanoid";
import {users,rooms} from '../sharedState/sharedState.js'

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