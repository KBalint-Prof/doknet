'use client';

import { useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '../../context/GlobalContext';

const TinyMCEEditor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { ssr: false },
);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Edit({ open, onClose }: Props) {
  if (!open) return null;

  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [uploadedCover, setUploadedCover] = useState<string | null>(null);
  const defaultCovers = [
    '/covers/bejelentes.png',
    '/covers/felhivas.png',
    '/covers/fontos.png',
    '/covers/szavazas.png',
  ];
  const router = useRouter();
  const ctx = useContext(GlobalContext);

  console.log('MENTÉS:', {
    title,
    content,
    selectedCover,
  });
  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      console.log(ctx?.user?.id);
      const res = await fetch('/api/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
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
        throw new Error(data.error || 'Hiba történt a mentés során.');

      setMessage(`Sikeres mentés! (ID: ${data.id})`);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setMessage('Hiba a mentés során!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          minWidth: '300px',
          minHeight: '150px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Hír szerkesztése</h3>

        <input
          style={{
            width: '97%',
            padding: '0.7rem 0.9rem',
            marginBottom: '1rem',
          }}
          type="text"
          placeholder="Hír címe"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
          {defaultCovers.map((img) => (
            <div
              key={img}
              onClick={() => setSelectedCover(img)}
              style={{
                width: '15rem',
                height: '10rem',
                border:
                  selectedCover === img
                    ? '3px solid #0070f3'
                    : '1px solid #ccc',
                borderRadius: '8px',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              <img
                src={img}
                alt="Borítókép"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>

        {
          <TinyMCEEditor
            apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
            init={{
              language: 'hu_HU',
              language_url: '/hu_HU.js',
              height: 500,
              resize: false,
              entity_encoding: 'raw',
              menubar: true,
              plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'help',
                'wordcount',
              ],
              toolbar:
                'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | image media link | removeformat | help',
              images_upload_handler: (blobInfo: any) =>
                new Promise((resolve) => {
                  const base64 =
                    'data:' +
                    blobInfo.blob().type +
                    ';base64,' +
                    blobInfo.base64();
                  resolve(base64);
                }),
              automatic_uploads: true,
              file_picker_types: 'image',
              image_class_list: [
                { title: 'None', value: '' },
                { title: 'Float left (wrap text)', value: 'img-left' },
                { title: 'Float right (wrap text)', value: 'img-right' },
                { title: 'Centered', value: 'img-center' },
              ],
              image_dimensions: true,
              content_style: `
          body {
            font-family: Arial, sans-serif;
            font-size: 16px;
          }
            img { max-width: 100%; height: auto; }
            .img-left { float: left; margin: 1rem; }
            .img-right { float: right; margin: 1rem; }
            .img-center { display: block; margin: 1rem auto; float: none; }
          `,
              placeholder: 'Írd ide a hír tartalmát...',
            }}
            onEditorChange={(newContent) => setContent(newContent)}
          />
        }

        <button onClick={onClose} style={{ marginTop: '1rem' }}>
          Bezárás
        </button>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Mentés folyamatban...' : 'Mentés'}
        </button>
      </div>
    </div>
  );
}
