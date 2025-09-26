import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protectRoute = async (req,res,next)=>{
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({ message: "Unauthorized-- no token provided" });
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        // console.log("decoded : ", decoded);
        if(!decoded){
            return res.status(401).json({ message: "Unauthorized-- invalid token" });
        }  
        const user = await User.findById(decoded.userId).select("-password");
         // removes the password field from the user object
        if(!user){
            return res.status(401).json({ message: "Unauthorized-- user not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("error in the protectRoute middleware",error.message)
        return res.status(500).json({message:"internal server error"})
    }
}