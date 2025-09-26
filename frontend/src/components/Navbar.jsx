import React from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import { Link, useLocation } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  // console.log(isChatPage);

  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return (
    <nav className="bg-base-200 sticky top-0 border-b border-base-300 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-end w-full">
          {/* LOGO ONLY IF IN THE CHAT PAGE */}
          {isChatPage && (
            <>
              <div className="mb-4 flex items-center justify-start left-0 gap-2">
                <Link to="/" className="flex items-center gap-2.5">
                  <ShipWheelIcon className="size-9 text-primary" />
                  <span
                    className="text-primary  font-mono text-3xl bg-clip-text text-transparent
          bg-gradient-to-r from-primary to-secondary tracking-wider"
                  >
                    Streamify
                  </span>
                </Link>
              </div>
            </>
          )}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to="/notifications" className="   btn btn-ghost btn-circle">
              <BellIcon className="opacity-70 size-5 text-base" />
            </Link>
            <ThemeSelector/>
            <div className="avatar">
              <div className="w-10 rounded-full">
              <img src={authUser.profilePic} alt="user avatar"/>
              </div>
            </div>
            <div className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="size-5 opacity-70"/>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
