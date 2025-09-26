import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream api key or secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    if(!userData || !userData.id){
        throw new Error("user id is missing from the userdata")
    }
    try {
          await streamClient.upsertUsers([userData]); //sending as an array is better
  return userData
    } catch (error) {
        console.log(" Error in upserting In Steam",error)
    }

};

export const generateSteamToken = (userId)=>{
  try {
    //ensure user id as a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("error in generateSteamTokens stream: ",error.message);
    res.status(500).json({message:"internal server error"})
  }
}