import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getFriendRequest, acceptFriendRequest } from "../lib/api";
import { BellDotIcon, BellIcon, Clock2Icon, MessageSquareMore, UserCheck } from "lucide-react";
import NoNotifications from "../components/NoNotifications.jsx";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { data: friendRequest, isLoading } = useQuery({
    queryKey: ["friendRequest"],
    queryFn: getFriendRequest,
  });
  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["friendRequest"]);
      queryClient.invalidateQueries(["friends"]);
    },
  });
  const incomingRequest = friendRequest?.incomingReqs || [];
  const acceptedRequest = friendRequest?.acceptedReqs || [];
  console.log(incomingRequest)
  console.log(acceptedRequest)
  // console.log(friendRequest);

  return (
    <div className="p-4 sm:p-6 lg:p-8 ">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl sm:text-3xl tracking-tight font-bold">
          Notifications
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner text-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequest.length > 0 && (
              <section className="space-y-4">
                <h2 className="flex gap-2 mx-4 mt-6 items-center font-semibold text-xl ">
                  <UserCheck className="size-5 text-primary " />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingRequest.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {incomingRequest.map((request) => {
                    return (
                      <div
                        key={request._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-14 avatar h-14 rounded-full bg-base-300 overflow-hidden">
                                <img
                                  src={request.sender.profilePic}
                                  alt="profile pic of the friend"
                                />
                              </div>
                              <div className="flex justify-start flex-col">
                                <h3 className="font-semibold text-xl">
                                  {request.sender.fullName}
                                </h3>
                                <div className="space-x-2 mt-2">
                                  <div className="badge badge-secondary badge-sm">
                                    Native: {request.sender.nativeLanguage}
                                  </div>
                                  <div className="badge badge-outline badge-sm">
                                    Learning: {request.sender.learningLanguage}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                acceptRequestMutation(request._id);
                              }}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            {/* USER ACCEPTED REQUESTS */}
            {acceptedRequest.length > 0 && (
              <section className="space-y-4">
                <h2 className="flex gap-2 items-center font-semibold text-xl p-1">
                  <BellIcon className="size-5 text-success" />
                  New Connections
                </h2>
                <div className="space-y-3">
                  {acceptedRequest.map((notification)=>{
                    return (
                      <div className="card bg-base-200 shadow-sm"
                      key={notification._id}
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start ">
                            <div className="size-14 avatar rounded-full overflow-hidden">
                              <img src={notification.recipient.profilePic} alt="image of the friend" />
                            </div>
                            <div className="mx-3 flex flex-col flex-1 justify-center space-y-0.5">
                              <h3 className="font-semibold text-xl">{notification.recipient.fullName}</h3>
                              <p className="opacity-80 text-sm">{notification.recipient.fullName} accepted your friend request</p>
                              <p className="opacity-70 text-xs flex items-center gap-0.5 ">
                                <Clock2Icon className="size-3"/>
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-primary badge-sm p-2">
                              <MessageSquareMore className="size-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>

                      </div>
                    )
                  })}
                </div>
              </section>
            )}
            {incomingRequest.length ===0 && acceptedRequest.length===0 && (
              <NoNotifications />
            )}

          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
