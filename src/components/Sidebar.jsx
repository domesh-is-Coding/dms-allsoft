import React from "react";
import { NavLink } from "react-router";
import { X } from "lucide-react";

export default function Sidebar({ mobile = false, overlay = false, onClose }) {
  return (
    <aside
      className={
        overlay
          ? "block md:block p-2 sticky left-0 top-0 pr-0 h-screen"
          : mobile
          ? "block md:hidden w-full bg-white p-2 mb-1"
          : "hidden md:block p-2 sticky left-0 top-0 pr-0 h-screen"
      }
    >
      <div
        className={
          overlay
            ? "w-full bg-white flex flex-col p-4 gap-6 h-full"
            : mobile
            ? "flex flex-row items-center justify-between gap-2"
            : "w-64 bg-white shadow-gray-50 flex flex-col p-4 gap-6 rounded-xl h-full"
        }
      >
        <div
          className={
            overlay
              ? "mb-8 flex items-center justify-between gap-2"
              : mobile
              ? "flex items-center gap-2"
              : "mb-8 flex items-center gap-2"
          }
        >
          <span className="text-xl font-bold text-blue-700">DMS</span>
          {overlay && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
        </div>
        <nav
          className={
            overlay
              ? "flex flex-col gap-2"
              : mobile
              ? "flex flex-row gap-2"
              : "flex flex-col gap-2"
          }
        >
          <NavLink
            to="/admin-user"
            className={({ isActive }) =>
              `font-semibold text-sm rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-900 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            Admin User
          </NavLink>
          <NavLink
            to="/search-document"
            className={({ isActive }) =>
              `font-semibold text-sm rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-900 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            Search Document
          </NavLink>
          <NavLink
            to="/upload-document"
            className={({ isActive }) =>
              `font-semibold text-sm rounded-md px-3 py-2 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-900 hover:bg-blue-100 hover:text-blue-600"
              }`
            }
          >
            Upload Document
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
