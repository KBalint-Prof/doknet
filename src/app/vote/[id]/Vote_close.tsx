"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface CloseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
}

export default function Close({
  isOpen,
  onClose,
  onConfirm,
  title = "Biztosan lezárod a szavazást?",
  description = "Ez a művelet végleges.",
}: CloseModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>

        <p style={{ color: "#555", marginTop: "0.5rem" }}>{description}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
            marginTop: "1.75rem",
          }}
        >
          <button onClick={onClose}>Mégse</button>

          <button
            onClick={onConfirm}
            style={{
              background: "#d11a2a",
              color: "#fff",
              border: "none",
              padding: "0.45rem 1.1rem",
              borderRadius: "999px",
              cursor: "pointer",
            }}
          >
            Törlés
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
