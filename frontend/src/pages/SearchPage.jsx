import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserByName } from "../lib/api";
import { useState } from "react";
import { Search } from "lucide-react";
import { FriendCard } from "../components/FriendCard";

const SearchPage = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const { data:searchResults = [], isLoading } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: () => getUserByName(searchQuery),
    enabled: searchQuery.length > 0,
  });
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
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
            <div className="space-y-4">
              <h3 className="font-semibold">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((user) => (
                  <FriendCard key={user._id} friend={user} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
