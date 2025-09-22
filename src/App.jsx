import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import AdminCreateUser from "./pages/AdminCreateUser";
import SearchDocument from "./pages/SearchDocument";
import UploadDocument from "./pages/UploadDocument";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin-user" element={<AdminCreateUser />} />
          <Route path="/search-document" element={<SearchDocument />} />
          <Route path="/upload-document" element={<UploadDocument />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
