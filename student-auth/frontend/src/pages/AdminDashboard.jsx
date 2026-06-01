import React, { useEffect, useState } from "react";
import { request, BASE_URL } from "../api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    request("/auth/users", { token })
      .then((d) => setUsers(d.users))
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <div className="container wide">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">Manage and view all registered users.</p>
      {err && <div className="error">{err}</div>}
      
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Picture</th>
              <th>Name</th>
              <th>Email</th>
              <th>College ID</th>
              <th>Contact</th>
              <th>DOB</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>
                  {u.profilePicture ? (
                    <img src={`${BASE_URL}${u.profilePicture}`} alt={u.name} className="avatar" />
                  ) : (
                    <span className="avatar placeholder">NA</span>
                  )}
                </td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.collegeId || "-"}</td>
                <td>{u.contact || "-"}</td>
                <td>{u.dob ? new Date(u.dob).toLocaleDateString() : "-"}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: "center"}}>No students registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
