"use client";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import "./gallery.css";
import { createPortal } from "react-dom";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const ctx = useContext(GlobalContext);

  // --- SCROLL LOCK LOGIKA ---
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'; // Tiltás
    } else {
      document.body.style.overflow = 'unset'; // Visszaállítás
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedIndex]);

  const load = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (e) { console.error('Hiba:', e); }
  };

  useEffect(() => { load(); }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const formData = new FormData();
    Array.from(e.target.files).forEach((f) => formData.append('images', f));
    await fetch('/api/gallery', { method: 'POST', body: formData });
    load();
  };

  const deleteSelected = async () => {
    if (selectedIds.length === 0) { setIsEditMode(false); return; }
    if (!confirm(`Biztosan törlöd a kijelölt ${selectedIds.length} képet?`)) return;

    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds }),
    });

    if (res.ok) {
      setSelectedIds([]);
      setIsEditMode(false);
      load();
    }
  };

  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [selectedIndex]);

  return (
    <div className="gallery-layout">
      <header className="gallery-header">
        <h1>Galéria</h1>
        <div className="top-controls">
          <input type="file" id="up" multiple onChange={upload} hidden />
          {ctx?.user && ['admin', 'teacher', 'president'].includes((ctx.user as any).role) && (
            <>
              <label htmlFor="up" className="btn-bordo">Képek hozzáadása</label>
              <button
                className={`btn-trash-main ${isEditMode ? 'active' : ''}`}
                onClick={() => isEditMode ? deleteSelected() : setIsEditMode(true)}
              >
                🗑️ {isEditMode && selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
              </button>
            </>
          )}
          {isEditMode && (
            <button className="btn-cancel" onClick={() => { setIsEditMode(false); setSelectedIds([]); }}>
              Mégse
            </button>
          )}
        </div>
      </header>

      <div className="gallery-box">
        <main className="image-grid">
          {images.map((img, idx) => {
            const isSelected = selectedIds.includes(img.id);
            return (
              <div
                key={img.id}
                className={`img-box ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  if (isEditMode) toggleSelect(img.id, { stopPropagation: () => {} } as any);
                  else { setSelectedIndex(idx); setZoom(1); }
                }}
              >
                <img src={img.image_path} alt="galéria" />
                {isEditMode && (
                  <div className="checkbox-layer" onClick={(e) => toggleSelect(img.id, e)}>
                    <div className={`check-circle ${isSelected ? 'checked' : ''}`}>{isSelected && '✓'}</div>

                  </div>
                )}
              </div>
            );
          })}
        </main>
      </div>
      {/* --- LIGHTBOX (FIXÁLT ÉS GÖRGETÉSMENTES) --- */}
      {selectedIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setSelectedIndex(null)}>
          <button className="l-nav prev" onClick={(e) => {
            e.stopPropagation();
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
            setZoom(1);
          }}>❮</button>

          <div className="l-main-container" onClick={(e) => e.stopPropagation()}>
            <div className="l-viewer">
              <img
                src={images[selectedIndex].image_path}
                style={{ transform: `scale(${zoom})` }}
                alt="nagyított"
              />
            </div>
            
            <div className="l-controls-bar">
              <div className="zoom-group">
                <button className="btn-circle" onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(0.5, z - 0.2)); }}>−</button>
                <span className="zoom-label">{Math.round(zoom * 100)}%</span>
                <button className="btn-circle" onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(4, z + 0.2)); }}>+</button>
              </div>
              <a href={images[selectedIndex].image_path} download className="btn-dl">📥 Mentés</a>
            </div>
          </div>

          <button className="l-nav next" onClick={(e) => {
            e.stopPropagation();
            setSelectedIndex((selectedIndex + 1) % images.length);
            setZoom(1);
          }}>❯</button>
          
          <span className="close-x" onClick={() => setSelectedIndex(null)}>&times;</span>
        </div>
      )}
    </div>
  );
}
