import  mongoose from "mongoose";

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI )
        console.log(`Database connected, ${conn.connection.id}`);
    }
    catch{
        console.error("Error connecting to database");
    }
}
export default connectDB;