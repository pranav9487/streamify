import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useNavigate, useParams } from "react-router";
import PageLoader from "../components/PageLoader.jsx";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  CallingState,
  useCallStateHooks,
  CallState,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setclient] = useState(null);
  const [call, setcall] = useState(null);
  const [isConnecting, setisConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });
  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        console.log("Initilizing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });
        setclient(videoClient)
        setcall(callInstance)

        console.log("joined call Successfully");
      } catch (error) {
        console.error("Error in joining call", error);
        toast.error("Could not Join the Call. Please try again");
      } finally {
        setisConnecting(false);
      }
    };
    initCall();
  }, [tokenData, authUser, callId]);

  if (isConnecting || isLoading) return <PageLoader />;
  return (
    <div className="flex h-screen items-center justify-center flex-col">
      <div className="relative">
        {client && call ? (
          <>
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-full">
              <p>Could not initialize the video call. Try again</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CallPage;

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const navigation = useNavigate();

  if (callingState === CallingState.LEFT) return navigation("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};
