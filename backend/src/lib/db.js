import mongoose from "mongoose";

export const connectDb = async ()=>{
    try{
   const conn = await mongoose.connect(process.env.MONGODB_URI)
   console.log(`mogodb connection : ${conn.connection.host}`)
    }
    catch(error){
    console.log("connection wtih mongodb failed",error)
    process.exit(1);
    }
}