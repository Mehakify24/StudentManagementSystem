import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { request } from "../api";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const { token, user } = await request("/auth/login", { method: "POST", body: form });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "admin") {
        nav("/admin");
      } else {
        nav("/dashboard");
      }
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="container">
      <h1>Welcome back</h1>
      <p className="subtitle">Login with your email or College ID.</p>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <div className="field"><label>Email or College ID</label>
          <input required value={form.identifier} onChange={set("identifier")} /></div>
        <div className="field"><label>Password</label>
          <input type="password" required value={form.password} onChange={set("password")} /></div>
        <button className="primary" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}
