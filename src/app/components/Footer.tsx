"use client";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";

export default function Footer() {
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === "dark";

  return (
    <footer
      style={{
        backgroundColor: isDark
          ? "var(--nav-bg, #1f1f1f)"
          : "var(--nav-bg, #e2e2e2)",
        color: "var(--text-color, #333)",
        borderTop: "1px solid var(--border-color, #ddd)",
        padding: "2.5rem 1.5rem",
        transition: "all 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "30px",
          }}
        >
          <div style={{ flex: "1 1 300px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>
              Szent János Görögkatolikus Gimnázium, Szakgimnázium, Technikum,
              Kollégium és Óvoda
            </h4>
            <div style={{ fontSize: "0.9rem", marginTop: "10px" }}>
              📍3780 Edelény, Borsodi út 34.
            </div>
          </div>

          <div style={{ flex: "1 1 200px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>
              Elérhetőség
            </h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "0.9rem",
              }}
            >
              <a
                href="https://sztjg.hu"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                🌐 sztjg.hu
              </a>
              <a
                href="tel:+3648525032"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                📞 Főigazgatói titkárság mobil: (30) 311-4110
              </a>
            </div>
          </div>

          <div style={{ flex: "1 1 150px" }}>
            <h4 style={{ margin: "0 0 10px 0", fontSize: "1rem" }}>DÖKNet</h4>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "0.9rem",
              }}
            >
              <a href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Főoldal
              </a>
              <a
                href="/calendar"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Naptár
              </a>
              <a
                href="/gallery"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Galéria
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            paddingTop: "20px",
            borderTop: "1px solid var(--border-color, #eee)",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.8rem",
            opacity: 0.6,
          }}
        >
          <span>© {new Date().getFullYear()} DÖKNet - Edelény</span>
          <span>Fejlesztve a DÖK számára</span>
        </div>
      </div>
    </footer>
  );
}
