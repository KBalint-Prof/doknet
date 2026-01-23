
"use client";

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './gallery.css';

interface GalleryImage {
  id: number;
  image: string;
  filename: string;
  uploaded_by: string;
  created_at: string;
}

export default function GaleriaPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Hiba a galéria betöltésekor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const formData = new FormData();
    Array.from(e.target.files).forEach(file => formData.append('images', file));

    const id = toast.loading("Képek feltöltése...");
    try {
      const res = await fetch('/api/gallery', { method: 'POST', body: formData });
      if (res.ok) {
        toast.update(id, { render: "Sikeres feltöltés!", type: "success", isLoading: false, autoClose: 2000 });
        fetchImages();
      }
    } catch (err) {
      toast.update(id, { render: "Hiba történt", type: "error", isLoading: false, autoClose: 2000 });
    }
  };

  return (
    <div className="galeria-section text-black">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tight">
            DÖK<span className="text-[#800020]">Net</span> Galéria
        </h1>
        <div className="w-24 h-1.5 bg-[#800020] mx-auto mt-4 rounded-full"></div>
      </header>

      {/* INTERAKTÍV FELTÖLTŐ ZÓNA */}
      <div className="upload-container group">
        <div className="flex flex-col items-center">
            <div className="text-5xl mb-4 transition-transform group-hover:scale-125 duration-300">📁</div>
            <h2 className="text-2xl font-bold text-gray-700">Oszd meg az élményeket!</h2>
            <p className="text-gray-500 mt-2">Kattints a gombra a galéria bővítéséhez</p>
            
            <label className="upload-button mt-6">
                Fájlok kiválasztása
                <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleUpload} 
                    accept="image/*" 
                />
            </label>
        </div>
      </div>

      {/* GALÉRIA RÁCS */}
      {loading ? (
        <div className="text-center py-10 italic text-gray-400">Képek betöltése...</div>
      ) : (
        <div className="image-grid">
          {images.map((img) => (
            <div key={img.id} className="image-card">
              <img 
                src={`/uploads/gallery/${img.image}`} 
                alt={img.filename} 
              />
              <div className="image-overlay">
                <p className="image-name">{img.filename}</p>
                <div className="text-white/80 text-xs mt-2">
                  <p>Feltöltő: {img.uploaded_by}</p>
                  <p>{new Date(img.created_at).toLocaleDateString('hu-HU')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="text-center py-20 bg-gray-100 rounded-3xl">
            <p className="text-gray-400">Még nincsenek feltöltött képek.</p>
        </div>
      )}
    </div>
  );
}