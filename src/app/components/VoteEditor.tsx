"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

export default function VoteEditor() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const ctx = useContext(GlobalContext);
  const [options, setOptions] = useState<string[]>(["", ""]);

  const addOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const removeOption = (index: number) => {
    setOptions((prev) =>
      prev.length > 2 ? prev.filter((_, i) => i !== index) : prev,
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/vote-editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          user_id: ctx?.user?.id,
          options,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Hiba történt a mentés során.");

      router.push("/vote/");
      toast.success("Sikeres mentés!", {
        style: { marginTop: "4.5rem" },
      });
    } catch (err) {
      console.error(err);
      toast.error("Hiba a mentés során!", {
        style: { marginTop: "4.5rem" },
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Új szavazás létrehozása</h1>

      <input
        type="text"
        placeholder="Szavazás címe"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        style={{ marginTop: "2rem", overflow: "hidden" }}
        placeholder="Szavazás leírása"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      {options.map((opt, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Opció ${index + 1}`}
            value={opt}
            onChange={(e) => updateOption(index, e.target.value)}
            style={{ marginTop: "1rem", marginRight: "1rem" }}
          />

          <button onClick={() => removeOption(index)}>⛌</button>
        </div>
      ))}
      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="button" onClick={addOption} style={{ marginTop: "1rem" }}>
          Új Opció hozzáadása
        </button>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button
          style={{ marginTop: "1rem" }}
          onClick={() => handleSave()}
          disabled={saving}
        >
          {saving ? "Mentés folyamatban..." : "Mentés"}
        </button>
      </div>
    </div>
  );
}
