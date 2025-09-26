import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserByName } from "../lib/api";
import { useState } from "react";

const SearchPage = () => {
  const [searchQuery, setsearchQuery] = useState("");
  const { data = [], isLoading } = useQuery({
    queryKey: ["searchUsers", searchQuery],
    queryFn: () => getUserByName(searchQuery),
    enabled: searchQuery.length > 0,
  });
  console.log(searchQuery)
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="space-y-10 p-2 flex flex-col">
        <div className="flex justify-center items-center">
          <input
          onChange={(e)=>setsearchQuery(e.target.value)}
            type="text"
            placeholder="Type here"
            className="input input-bordered opacity-70 input-accent w-full max-w-md rounded-lg"
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
