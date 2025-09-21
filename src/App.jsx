import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import AdminCreateUser from "./pages/AdminCreateUser";
import SearchDocument from "./pages/SearchDocument";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/admin-user" element={<AdminCreateUser />} />
          <Route path="/search-document" element={<SearchDocument />} />
          <Route
            path="/upload-document"
            element={<div>Upload Document page.</div>}
          />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
