import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import {
  getOutGoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserIcon, UserPlusIcon } from "lucide-react";
import NofriendsFound from "../components/NofriendsFound.jsx";
import {FriendCard,getLanguageFlag} from "../components/FriendCard.jsx"
import { capitaliseLan } from "../lib/utils.js";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestIds, setoutgoingRequestIds] = useState(new Set());

  const { data: friends = [], isPending: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });
  const { data: recommendedUsers = [], isPending: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutGoingFriendReqs,
  });
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
  });
  useEffect(() => {
    const outgoingFriendRequestSet = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((item) => {
        outgoingFriendRequestSet.add(item.recipient._id);
      });
      console.log(outgoingFriendRequestSet)
      setoutgoingRequestIds(outgoingFriendRequestSet);
    }
  }, [outgoingFriendReqs]);
  // console.log(friends)
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-base-100 min-h-screen">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row  justify-between items-start sm:items-center gap-4">
          <h2 className="font-bold tracking-tight text-2xl sm:text-3xl">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm ">
            <UserIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {loadingFriends ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NofriendsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
            {friends.map((friend) => {
             return ( <FriendCard key={friend._id} friend={friend} />)
            })}
          </div>
        )}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col  justify-between items-start  gap-1">
              <h2 className="font-semibold text-2xl sm:text-3xl">
                Meet new Learners
              </h2>
              <p className="opacity-70 ">
                Discover perfect language exchange partners on your profile
              </p>
            </div>
          </div>
          {loadingUsers ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No Recommendations</h3>
              <p className="text-base-content opacity-70">
                cheque back later for new language partners!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedUsers.map((user) => {
                // console.log(outgoingRequestIds)
                const hasRequestBeenSent = outgoingRequestIds.has(user._id);
                return (
                  
                  <div
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                    key={user._id}
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full overflow-hidden  avatar size-16">
                          <img src={user.profilePic} alt="avatar of the user" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex  items-center opacity-70 mt-1 text-xs">
                              <MapPinIcon  className=" mr-2 size-4" />
                              <span className="">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="badge badge-secondary text-xs">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native : {capitaliseLan(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-outline text-xs">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning : {capitaliseLan(user.learningLanguage)}
                        </span>
                      </div>
                      {user.bio && (<p className="text-xs opacity-70">{user.bio}</p>)}
                      {/* ACTION BUTTON */}
                      <button className={`w-full btn mt-2 ${
                        hasRequestBeenSent ? "btn-disabled" :"btn-primary"
                      }`}
                      onClick={()=>{sendRequestMutation(user._id)}}
                      disabled = {hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                          <CheckCircleIcon className="size-4 mr-2" />
                          Request Sent
                          </>
                        ):(
                          <>
                          <UserPlusIcon className="size-4 mr-2" />
                          Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;


