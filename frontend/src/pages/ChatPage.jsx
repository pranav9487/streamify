import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import { useQuery } from "@tanstack/react-query";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import {toast} from 'react-hot-toast'
import { StreamChat } from "stream-chat";
import { getStreamToken } from "../lib/api.js";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setchatClient] = useState(null);
  const [channel, setchannel] = useState(null);
  const [loading, setloading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only after authuser is available

    //The double exclamation marks !! are used to convert any value
    //  to a boolean in JavaScript.
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-"); //to remove duplicate chatids between two users

        const currChannel = client.channel("messaging",channelId, {
          members: [authUser._id,targetUserId],
        });
        await currChannel.watch();
        setchannel(currChannel)
        setchatClient(client)
      } catch (error) {
        console.log("error in the initializing chat",error);
        toast.error("failed to start the chat.")
      }
      finally{
        setloading(false)
      }
    };
   initChat();
  }
, [tokenData,authUser,targetUserId]);

  const handleVideoCall = ()=>{
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text:`I've started the video call.Join me here: ${callUrl}`
      });
      toast.success("Video call Link send Successfully!")
    }
  }

  if(loading || !chatClient ||!channel) return <ChatLoader/>

  return (
  <div className="h-[93vh]">
    <Chat client={chatClient} >
      <Channel channel={channel}>
        <div className="w-full relative">
          <CallButton handleVideoCall={handleVideoCall} />
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus/>
          </Window>
        </div>
        <Thread />
      </Channel>
    </Chat>
  </div>
  )
};

export default ChatPage;
