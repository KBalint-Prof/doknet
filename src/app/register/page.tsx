"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const ctx = useContext(GlobalContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSave();
  };

  useEffect(() => {
    if (ctx?.user) {
      router.replace("/");
    }
  }, [ctx]);

  const handleSave = async () => {
    if (password !== passwordCheck) {
      toast.error("A két jelszó nem egyezik!", {
        style: { marginTop: "4.5rem" },
      });
      setMessage("A két jelszó nem egyezik!");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Hiba történt a regisztráció során.");

      toast.success("Sikeres Regisztráció!", {
        style: { marginTop: "4.5rem" },
      });

      router.push("/login");
      setMessage(`Sikeres regisztráció! (ID: ${data.id})`);
    } catch (err: any) {
      console.error(err);
      setMessage("Hiba a regisztráció során!");
      toast.error("Hiba a Regisztráció során!", {
        style: { marginTop: "4.5rem" },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
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
      <input
        type="password"
        placeholder="Jelszó megerősítése"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
      />

      <button type="submit" disabled={saving}>
        {saving ? "Regisztráció folyamatban..." : "Regisztráció"}
      </button>

      <p>{message}</p>
    </form>
  );
}
