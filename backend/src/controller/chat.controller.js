import {generateSteamToken} from "../lib/stream.js"

export async function getStreamToken(req,res) {
    try {
        const token  = generateSteamToken(req.user._id)
       return res.status(200).json({token})
    } catch (error) {
        console.error("error in the getStreamToken controller: ",error.message);
       return res.status(500).json({message:"internal server error"})
    }
}