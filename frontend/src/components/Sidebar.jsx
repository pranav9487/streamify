import React from "react";
import useAuthUser from "../hooks/useAuthUser";
import { Link, useLocation } from "react-router";
import { BellIcon, HomeIcon, ShipWheelIcon, UsersIcon } from "lucide-react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPage = location.pathname;
  return (
    <aside
      className="w-64 bg-base-200 border-r border-base-300 h-screen hidden lg:flex flex-col
      sticky top-0"
    >
      <div className="pl-5">
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
      <nav className="flex-1 flex-col p-4 space-y-1 ">
        <Link to="/" className={` flex gap-3 justify-start btn btn-ghost w-full px-3 normal-case
          ${currentPage ==='/' ? "btn-active":""}`}>
        <HomeIcon className="opacity-70 size-5 text-base"/>
        <span>Home</span>
        </Link>
        <Link to="/friends" className={` flex gap-3 justify-start btn btn-ghost w-full px-3 normal-case
          ${currentPage ==='/friends' ? "btn-active":""}`}>
        <UsersIcon className="opacity-70 size-5 text-base"/>
        <span>Friends</span>
        </Link>
        <Link to="/notifications" className={` flex gap-3 justify-start btn btn-ghost w-full px-3 normal-case
          ${currentPage ==='/notifications' ? "btn-active":""}`}>
        <BellIcon className="opacity-70 size-5 text-base"/>
        <span>Notifications</span>
        </Link>
      </nav>
      {/* USER PROFILE SECTION*/}
      <div className="p-4 bg-base-300 border-t">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1 flex-col">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <span className="bg-success size-2 rounded-full" />
              Online
            </p>

          </div>
        </div>
      </div>
      
    </aside>
  );
};

export default Sidebar;
