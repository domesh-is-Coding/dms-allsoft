import React from "react";

export default function Sidebar() {
  return (
    <aside className="bg-white w-64 h-screen p-6 flex flex-col gap-6 shadow-lg rounded-r-xl fixed left-0 top-0 z-20">
      <nav className="flex flex-col gap-4">
        <a href="/admin-user" className="hover:text-blue-600 font-medium">
          Admin User
        </a>
        <a href="/search-document" className="hover:text-blue-600 font-medium">
          Search Document
        </a>
        <a href="/upload-document" className="hover:text-blue-600 font-medium">
          Upload Document
        </a>
      </nav>
    </aside>
  );
}
