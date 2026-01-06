"use client";

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(false);

  const router = useRouter();

  const ctx = useContext(GlobalContext);

  useEffect(() => {
    if (ctx?.user) {
      router.replace("/");
    }
  }, [ctx]);

  const handleLogin = async () => {
    setLogin(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("API válasz:", data);

      if (!res.ok)
        throw new Error(data.error || "Hiba történt a Bejelentkezés során.");

      localStorage.setItem("user", JSON.stringify(data.user));

      ctx?.setUser(data.user);

      toast.success(`Sikeres Bejelentkezés! (ID: ${data.user.id})`);

      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error("Hiba a Bejelentkezés során!");
    } finally {
      setLogin(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: ctx?.user ? "#84a316ff" : "#ffffff",
        transition: "0.4s ease",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "400px",
        margin: "0 auto",
        alignItems: "center",
      }}
    >
      <h1>Bejelentkezés</h1>

      <input
        type="text"
        placeholder="Felhasználónév"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Jelszó"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={login}>
        {login ? "Bejelentkezés folyamatban..." : "Bejelentkezés"}
      </button>
    </div>
  );
}
