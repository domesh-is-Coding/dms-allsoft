import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router";
import { useState } from "react";

const pageTitles = {
  "/admin-user": "Admin User",
  "/search-document": "Search Document",
  "/upload-document": "Upload Document",
  // Add more routes and titles as needed
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Dashboard";
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
      {/* Sidebar: hidden on small screens, visible on md+ */}
      <div className="md:block hidden w-full md:w-56 px-2">
        <Sidebar />
      </div>
      {/* Mobile Sidebar Overlay: visible on small screens when toggled, hidden on md+ */}
      {isMobileSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-white bg-opacity-30 backdrop-blur-md"
          onClick={toggleMobileSidebar}
        >
          <div
            className="w-64 bg-white bg-opacity-90 backdrop-blur-lg h-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar mobile overlay onClose={toggleMobileSidebar} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-2 pl-4 pr-2 sm:pl-8 sm:pr-4 md:pl-12 md:pr-6 lg:pl-16 lg:pr-8">
          <Topbar title={title} onToggleMobileSidebar={toggleMobileSidebar} />
        </div>
        <main className="flex-1 overflow-auto pl-4 pr-2 sm:pl-8 sm:pr-4 md:pl-12 md:pr-6 lg:pl-16 lg:pr-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
