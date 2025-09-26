import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getUserFriends } from "../lib/api";
import PageLoader from "../components/PageLoader";
import { FriendCard } from "../components/FriendCard";
import { Link } from "react-router";
import { Search } from "lucide-react";

const FriendsPage = () => {
  const { data: friendsData = [], isPending } = useQuery({
    queryFn: getUserFriends,
  });
  console.log(friendsData);
  if (isPending) return <PageLoader />;

  return (
    <div className="bg-base-100 p-4 sm:p-6 lg:p-8 min-h-[90vh]">
      <div className="container mx-auto space-y-10 flex flex-col">
         <h2 className="font-bold text-xl">Find New Learners</h2>
        <div className="min-w-full flex justify-center items-center">
            <Link className="btn btn-outline flex gap-2" to="/search">
            <Search className="size-6 text-primary t"/>
            Search here
            </Link>

        </div>
        <div className="flex flex-col space-y-10">
        <h2 className="font-bold tracking-tight text-2xl sm:text-3xl">
          Your Friends
        </h2>
        {friendsData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friendsData.map((friend) => {
                return <FriendCard friend={friend} />
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center items-center">
              <p className="font-mono opacity-70 text-sm">No Friends Yet</p>
            </div>
          </>
        )}
        </div>

       
      </div>
    </div>
  );
};

export default FriendsPage;
