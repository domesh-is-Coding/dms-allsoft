import React from "react";
import { Bell } from "lucide-react";

export default function Topbar({ title }) {
  return (
    <header className="p-2 w-full sticky left-0 top-0">
      <div className="bg-white shadow-gray-50 flex items-center justify-between px-4 py-3 rounded-xl">
        <div className="flex items-center gap-2">
          <h1 className="font-medium text-sm p-0.5">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification icon */}
          <span className="relative">
            <Bell size={24} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
              2
            </span>
          </span>
          {/* User info */}
          <div className="flex items-center gap-2">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-medium text-sm text-gray-700">
              John Smith
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
