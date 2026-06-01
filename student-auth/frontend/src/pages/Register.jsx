import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { request } from "../api";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", dob: "", address: "", collegeId: "", contact: "", password: "",
  });
  const [file, setFile] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (file) formData.append("profilePicture", file);

      const { token, user } = await request("/auth/register", { method: "POST", body: formData });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      nav("/dashboard");
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="container">
      <h1>Create your account</h1>
      <p className="subtitle">Register as a student to access the portal.</p>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <div className="field"><label>Full name *</label>
          <input required value={form.name} onChange={set("name")} /></div>
        <div className="field"><label>Email *</label>
          <input type="email" required value={form.email} onChange={set("email")} /></div>
        <div className="field"><label>Date of Birth</label>
          <input type="date" value={form.dob} onChange={set("dob")} /></div>
        <div className="field"><label>Address</label>
          <input value={form.address} onChange={set("address")} /></div>
        <div className="field"><label>College ID *</label>
          <input required value={form.collegeId} onChange={set("collegeId")} /></div>
        <div className="field"><label>Contact Number</label>
          <input type="tel" value={form.contact} onChange={set("contact")} /></div>
        <div className="field"><label>Password *</label>
          <input type="password" required minLength={6} value={form.password} onChange={set("password")} /></div>
        <div className="field"><label>Profile Picture</label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} /></div>
        <button className="primary" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
