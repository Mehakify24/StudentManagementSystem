import React, { useEffect, useState } from "react";
import { request, BASE_URL } from "../api";

export default function Dashboard() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    request("/auth/me", { token })
      .then((d) => {
        setUser(d.user);
        localStorage.setItem("user", JSON.stringify(d.user));
      })
      .catch((e) => setErr(e.message));
  }, []);

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="profile-header">
        {user.profilePicture ? (
          <img src={`${BASE_URL}${user.profilePicture}`} alt="Profile" className="profile-pic" />
        ) : (
          <div className="profile-pic placeholder">No Image</div>
        )}
        <div>
          <h1>Hi, {user.name} 👋</h1>
          <p className="subtitle">Your profile dashboard</p>
        </div>
      </div>
      
      {err && <div className="error">{err}</div>}
      <dl className="profile card">
        <dt>Email</dt><dd>{user.email}</dd>
        {user.dob && <><dt>Date of Birth</dt><dd>{new Date(user.dob).toLocaleDateString()}</dd></>}
        {user.address && <><dt>Address</dt><dd>{user.address}</dd></>}
        {user.collegeId && <><dt>College ID</dt><dd>{user.collegeId}</dd></>}
        {user.contact && <><dt>Contact</dt><dd>{user.contact}</dd></>}
        <dt>Role</dt><dd className="badge">{user.role}</dd>
      </dl>
    </div>
  );
}
