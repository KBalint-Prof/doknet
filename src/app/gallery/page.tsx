"use client";
import { useState, useEffect } from "react";
import "./gallery.css";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Képek betöltése
  const load = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Hiba a betöltéskor:", e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Feltöltés
  const upload = async (e: any) => {
    const formData = new FormData();
    Array.from(e.target.files!).forEach((f: any) => formData.append("images", f));
    await fetch("/api/gallery", { method: "POST", body: formData });
    load();
  };

  // Kijelöltek törlése
  const deleteSelected = async () => {
    if (selectedIds.length === 0) {
      setIsEditMode(false);
      return;
    }
    if (!confirm(`Biztosan törlöd a kijelölt ${selectedIds.length} képet?`)) return;

    const res = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds })
    });

    if (res.ok) {
      setSelectedIds([]);
      setIsEditMode(false);
      load();
    }
  };

  // Kijelölés váltása
  const toggleSelect = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="gallery-layout">
      <header className="gallery-header">
        <h1>Galéria</h1>
        <div className="top-controls">
          <input type="file" id="up" multiple onChange={upload} hidden />
          <label htmlFor="up" className="btn-bordo">Képek hozzáadása</label>

          <button 
            className={`btn-trash-main ${isEditMode ? 'active' : ''}`} 
            onClick={() => isEditMode ? deleteSelected() : setIsEditMode(true)}
          >
            🗑️ {isEditMode && selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
          </button>

          {isEditMode && (
            <button className="btn-cancel" onClick={() => { setIsEditMode(false); setSelectedIds([]); }}>
              Mégse
            </button>
          )}
        </div>
      </header>

      <main className="image-grid">
        {images.map((img, idx) => {
          const isSelected = selectedIds.includes(img.id);
          return (
            <div 
              key={img.id} 
              className={`img-box ${isSelected ? 'selected' : ''}`} 
              onClick={() => {
                if (isEditMode) toggleSelect(img.id, { stopPropagation: () => {} } as any);
                else { setSelectedIndex(idx); setZoom(1); }
              }}
            >
              <img src={img.image_path} alt="galéria kép" />
              
              {isEditMode && (
                <div className="checkbox-layer" onClick={(e) => toggleSelect(img.id, e)}>
                  <div className={`check-circle ${isSelected ? 'checked' : ''}`}>
                    {isSelected && "✓"}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Lightbox rögzített vezérlőkkel */}
      {selectedIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setSelectedIndex(null)}>
          <button className="l-nav prev" onClick={(e) => { 
            e.stopPropagation(); 
            setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
            setZoom(1);
          }}>❮</button>
          
          <div className="l-viewport" onClick={(e) => e.stopPropagation()}>
            <img 
              src={images[selectedIndex].image_path} 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }} 
              alt="nagyított kép" 
            />
          </div>

          {/* FIXÁLT VEZÉRLŐK - Nem tűnnek el nagyításkor */}
          <div className="l-fixed-controls" onClick={(e) => e.stopPropagation()}>
             <div className="zoom-bar">
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>-</button>
                <span className="zoom-text">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(4, z + 0.2))}>+</button>
             </div>
             <a href={images[selectedIndex].image_path} download className="btn-dl">📥 Letöltés</a>
          </div>

          <button className="l-nav next" onClick={(e) => { 
            e.stopPropagation(); 
            setSelectedIndex((selectedIndex + 1) % images.length);
            setZoom(1);
          }}>❯</button>
          
          <span className="close-x" onClick={() => setSelectedIndex(null)}>×</span>
        </div>
      )}
    </div>
  );
}