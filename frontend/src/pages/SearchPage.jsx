import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOutGoingFriendReqs,
  getUserByName,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { useState } from "react";
import { CheckCircleIcon, Search, UserPlusIcon } from "lucide-react";
import { FriendCard, getLanguageFlag } from "../components/FriendCard";
import { capitaliseLan } from "../lib/utils";

const SearchPage = () => {
  const queryClient = useQueryClient();

  const [isFriendRequest, setisFriendRequest] = useState(new Set());
  const [friendList, setfriendList] = useState([]);
  const [searchQuery, setsearchQuery] = useState("");

  const { data: friends = [], isPending: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });


  const [finalSearchResults, setfinalSearchResults] = useState(null);

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: () => getUserByName(searchQuery),
    enabled: searchQuery.length > 0,
  });
  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqsInSearch"],
    queryFn: getOutGoingFriendReqs,
  });
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["outgoingFriendReqsInSearch"],
      });
    },
  });
  useEffect(() => {
    const temp = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((element) => {
        temp.add(element.recipient._id);
      });
      setisFriendRequest(temp);
    }
  }, [outgoingFriendReqs]);
  console.log(searchResults);
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-base-100">
      <div className="space-y-10 p-2 flex flex-col">
        <div className="flex justify-center items-center">
          <label className="input input-bordered flex items-center gap-2 opacity-70 input-accent w-full max-w-md rounded-lg">
            <Search />
            <input
              onChange={(e) => setsearchQuery(e.target.value)}
              type="text"
              placeholder="Search here"
              className=""
            />{" "}
          </label>
        </div>
        <div>
          {searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((user) => {
                const hasRequestBeenSent = isFriendRequest.has(user._id);
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
                              <MapPinIcon className=" mr-2 size-4" />
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
                      {user.bio && (
                        <p className="text-xs opacity-70">{user.bio}</p>
                      )}
                      {/* ACTION BUTTON */}
                      <button
                        className={`w-full btn mt-2 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => {
                          sendRequestMutation(user._id);
                        }}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
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
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
