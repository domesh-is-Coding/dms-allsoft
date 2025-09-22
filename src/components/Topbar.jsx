import React, { useState, useEffect, useRef } from "react";
import { Bell, Menu, LogOut } from "lucide-react";
import { useAuthStore } from "../store/auth";

export default function Topbar({ title, onToggleMobileSidebar }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { setToken } = useAuthStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setToken("");
    setShowProfileDropdown(false);
    // You might want to redirect to login page here
  };

  return (
    <header className="w-full sticky left-0 top-0">
      <div className="bg-white shadow-gray-50 flex items-center justify-between px-4 py-3 rounded-xl gap-2">
        <div className="flex items-center gap-2 sm:justify-start">
          {/* Hamburger menu and DMS logo for small screens */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onToggleMobileSidebar}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
            <span className="text-xl font-bold text-blue-700">DMS</span>
          </div>
          <h1 className="hidden md:block font-medium text-sm p-0.5">{title}</h1>
        </div>
        <div className="flex items-center gap-3 sm:gap-2 w-full sm:w-auto justify-end relative">
          {/* Notification icon */}
          <span className="relative flex items-center justify-end min-w-[32px] min-h-[32px]">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              2
            </span>
          </span>
          {/* User info - clickable on all screen sizes */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 rounded-md px-2 py-1"
            >
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden sm:inline font-medium text-sm text-gray-700">
                John Smith
              </span>
            </button>
            {/* Profile dropdown for all screen sizes */}
            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      John Smith
                    </p>
                    <p className="text-xs text-gray-500">john@example.com</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
