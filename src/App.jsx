import { RouterProvider, createBrowserRouter, Navigate } from "react-router";
import Login from "./pages/Login";

function Sidebar() {
  return (
    <aside className="bg-white w-64 h-screen p-6 flex flex-col gap-6 shadow-lg rounded-r-xl">
      <div className="font-bold text-xl mb-8">FileHub</div>
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

function Topbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white shadow rounded-b-xl">
      <div className="text-lg font-semibold">Admin User</div>
      <div className="flex items-center gap-4">
        <button className="relative">
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            2
          </span>
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <img
            src="/avatar.jpg"
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-medium">John Smith</span>
        </div>
      </div>
    </header>
  );
}

function AdminUser() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">Welcome to Admin User page.</main>
      </div>
    </div>
  );
}

function SearchDocument() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">Search Document page.</main>
      </div>
    </div>
  );
}

function UploadDocument() {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">Upload Document page.</main>
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin-user",
    element: <AdminUser />,
  },
  {
    path: "/search-document",
    element: <SearchDocument />,
  },
  {
    path: "/upload-document",
    element: <UploadDocument />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
