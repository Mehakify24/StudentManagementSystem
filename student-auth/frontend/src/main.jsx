import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

function Nav() {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  return (
    <nav className="nav">
      <strong>🎓 User Management System</strong>
      <div>
        {token ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            {user && user.role === "admin" && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <a href="#" onClick={(e)=>{e.preventDefault();localStorage.clear();location.href="/login";}}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function Protected({ children, adminOnly }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;
  if (adminOnly) {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || user.role !== "admin") return <Navigate to="/dashboard" />;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Nav />
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/admin" element={<Protected adminOnly><AdminDashboard /></Protected>} />
    </Routes>
  </BrowserRouter>
);
