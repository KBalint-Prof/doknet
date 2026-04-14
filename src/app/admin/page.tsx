"use client";

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const ctx = useContext(GlobalContext);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (err) {
      console.error("Hiba:", err);
    }
  };

  useEffect(() => {
    if (ctx?.user && (ctx.user as any).role === "admin") {
      fetchUsers();
    }
  }, [ctx?.user]);

  const updateRole = async (userId: number, newRole: string) => {
    if (!ctx?.user) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          newRole: newRole,
          adminRole: (ctx.user as any).role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        alert("Sikeres módosítás!");
      } else {
        alert("Hiba: " + (data.error || "Ismeretlen hiba történt."));
      }
    } catch (err) {
      alert("Hálózati hiba történt a módosítás során.");
    }
  };

  if (!ctx?.user || (ctx.user as any).role !== "admin") {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Hozzáférés megtagadva!
      </p>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        color: "var(--text-color)",
      }}
    >
      <h1 style={{ borderBottom: "2px solid #d1417a" }}>Admin Panel</h1>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr
            style={{
              textAlign: "left",
              borderBottom: "2px solid var(--border-color)",
            }}
          >
            <th style={{ padding: "10px" }}>Név</th>
            <th style={{ padding: "10px" }}>Rang</th>
            <th style={{ padding: "10px" }}>Művelet</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u.id}
              style={{ borderBottom: "1px solid var(--border-color)" }}
            >
              <td style={{ padding: "10px" }}>{u.username}</td>
              <td style={{ padding: "10px" }}>
                <b>{u.role}</b>
              </td>
              <td style={{ padding: "10px" }}>
                <select
                  value={u.role}
                  onChange={(e) => updateRole(u.id, e.target.value)}
                  style={{
                    padding: "5px",
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                  }}
                >
                  <option value="student">Diák</option>
                  <option value="member">Tag</option>
                  <option value="president">Elnök</option>
                  <option value="teacher">Tanár</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
