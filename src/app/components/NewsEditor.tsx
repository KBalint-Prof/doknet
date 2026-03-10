"use client";

import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

const TinyMCEEditor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false },
);

export default function NewsEditor({ id }: { id?: number }) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const defaultCovers = [
    "/covers/bejelentes.png",
    "/covers/felhivas.png",
    "/covers/fontos.png",
  ];
  const router = useRouter();
  const ctx = useContext(GlobalContext);
  const isDark = ctx?.theme === "dark";

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    try {
      console.log(ctx?.user?.id);
      const res = await fetch("/api/news-editor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          title,
          content,
          cover_img: selectedCover,
          user_id: ctx?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Hiba történt a mentés során.");

      setMessage(`Sikeres mentés! (ID: ${data.id})`);
      router.push("/news/" + data.id);
      toast.success("Sikeres mentés!", {
        style: { marginTop: "4.5rem" },
      });
    } catch (err: any) {
      console.error(err);
      setMessage("Hiba a mentés során!");
      toast.error("Hiba a mentés során!", {
        style: { marginTop: "4.5rem" },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setMessage("");

    try {
      console.log(ctx?.user?.id);
      const res = await fetch("/api/news-editor", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          news_id: id,
          title,
          content,
          cover_img: selectedCover,
          user_id: ctx?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Hiba történt a módosítás során.");

      setMessage(`Sikeres módosítás! (ID: ${data.id})`);
      router.push("/news/" + id);
    } catch (err: any) {
      console.error(err);
      setMessage("Hiba a módosítás során!");
    } finally {
      setSaving(false);
    }
  };

  const getNewsById = async () => {
    try {
      const result = await fetch(`/api/news-editor/${id}`);
      const data = await result.json();

      console.log("NEWS BY ID:", data);

      if (!result.ok || data.news.length === 0)
        throw new Error(data.error || "Hiba történt a hír betöltése során.");

      setContent(data.news[0].content);
      setSelectedCover(data.news[0].cover_img);
      setTitle(data.news[0].title);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) getNewsById();
  }, [id]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{id ? `Szerkesztés ${id}` : "Új hír létrehozása"}</h1>

      <input
        type="text"
        placeholder="Hír címe"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <h3>Borítókép kiválasztása</h3>

      <div style={{ display: "flex", gap: "1rem" }}>
        {defaultCovers.map((img) => (
          <div
            key={img}
            onClick={() => setSelectedCover(img)}
            style={{
              width: "15rem",
              height: "10rem",
              marginBottom: "1rem",
              border:
                selectedCover === img ? "3px solid #0070f3" : "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            <img src={img} alt="Borítókép" className="cover-preview" />
          </div>
        ))}
      </div>

      <TinyMCEEditor
        key={isDark ? "dark" : "light"}
        apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
        init={{
          skin: isDark ? "oxide-dark" : "oxide",
          content_css: isDark ? "dark" : "default",
          language: "hu_HU",
          language_url: "/hu_HU.js",
          height: 750,
          resize: false,
          entity_encoding: "raw",
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | " +
            "bullist numlist outdent indent | image media link | removeformat | help",
          images_upload_handler: (blobInfo: any) =>
            new Promise((resolve) => {
              const base64 =
                "data:" + blobInfo.blob().type + ";base64," + blobInfo.base64();
              resolve(base64);
            }),
          automatic_uploads: true,
          file_picker_types: "image",
          image_class_list: [
            { title: "None", value: "" },
            { title: "Float left (wrap text)", value: "img-left" },
            { title: "Float right (wrap text)", value: "img-right" },
            { title: "Centered", value: "img-center" },
          ],
          image_dimensions: true,
          content_style: `
          body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            background: ${isDark ? "#121212" : "#ffffff"};
            color: ${isDark ? "#ffffff" : "#000000"};
          }
            img { max-width: 100%; height: auto; }
            .img-left { float: left; margin: 1rem; }
            .img-right { float: right; margin: 1rem; }
            .img-center { display: block; margin: 1rem auto; float: none; }
            .mce-content-body[data-mce-placeholder]:not(.mce-visualblocks)::before {
            color: var(--placeholder);
          `,
          placeholder: "Írd ide a hír tartalmát...",
        }}
        onEditorChange={(newContent) => setContent(newContent)}
        value={content}
      />

      <button
        style={{ marginTop: "1rem" }}
        onClick={id ? handleUpdate : handleSave}
        disabled={saving}
      >
        {saving ? "Mentés folyamatban..." : "Mentés"}
      </button>
    </div>
  );
}
