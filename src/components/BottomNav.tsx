// components/BottomNav.tsx
import {
    FaHome,
    FaBriefcase,
    FaBookmark,
    FaUser,
  } from "react-icons/fa";
  import NavLink from "./NavLink";
  
  const BottomNav = () => {
    return (
      <div className="fixed bottom-0 left-0 w-full bg-stone-950 shadow-md border-t border-black z-50">
        <div className="flex justify-around p-3">
          {/* Home */}
          <NavLink
            href="/home"
            icon={<FaHome className="w-6 h-6" />}
            label="Home"
          />
          {/* Jobs */}
          <NavLink
            href="/jobs"
            icon={<FaBriefcase className="w-6 h-6" />}
            label="Jobs"
          />
          {/* Simpan */}
          <NavLink
            href="/simpan"
            icon={<FaBookmark className="w-6 h-6" />}
            label="Simpan"
          />
          {/* Profile */}
          <NavLink
            href="/profile"
            icon={<FaUser className="w-6 h-6" />}
            label="Profile"
          />
        </div>
      </div>
    );
  };
  
  export default BottomNav;
  