"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [eduID, setEduID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const ctx = useContext(GlobalContext);

  useEffect(() => {
    if (ctx?.user) {
      router.replace("/");
    }
  }, [ctx]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ username, eduID, email, password }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Hiba történt a regisztráció során.");

      router.push("/login");
      setMessage(`Sikeres egisztráció! (ID: ${data.id})`);
    } catch (err: any) {
      console.error(err);
      setMessage("Hiba a regisztráció során!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "400px",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <h1>Regisztráció</h1>

      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="text"
        placeholder="Oktatási azonosító"
        value={eduID}
        onChange={(e) => setEduID(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Jelszó"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSave} disabled={saving}>
        {saving ? "Regisztráció folyamatban..." : "Regisztráció"}
      </button>

      <p>{message}</p>
    </div>
  );
}
