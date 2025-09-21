import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router";

const pageTitles = {
  "/admin-user": "Admin User",
  "/search-document": "Search Document",
  "/upload-document": "Upload Document",
  // Add more routes and titles as needed
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <div className="flex w-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar title={title} />
        <main className="flex-1 flex items-center justify-center">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
