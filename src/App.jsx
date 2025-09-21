import { RouterProvider } from "react-router";
import { createBrowserRouter, Navigate } from "react-router";
import Login from "./pages/Login";
import AdminCreateUser from "./pages/AdminCreateUser";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin-user",
    element: <AdminCreateUser />,
  },
  {
    path: "/search-document",
    element: (
      <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">Search Document page.</main>
        </div>
      </div>
    ),
  },
  {
    path: "/upload-document",
    element: (
      <div className="flex flex-col h-screen">
        <Topbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-8">Upload Document page.</main>
        </div>
      </div>
    ),
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
