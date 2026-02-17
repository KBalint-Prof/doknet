'use client';

import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '../context/GlobalContext';

const TinyMCEEditor = dynamic(
  () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
  { ssr: false },
);

export default function VoteEditor({ id }: { id?: number }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const ctx = useContext(GlobalContext);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      console.log(ctx?.user?.id);
      const res = await fetch('/api/news-editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          title,
          description,
          user_id: ctx?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Hiba történt a mentés során.');

      setMessage(`Sikeres mentés! (ID: ${data.id})`);
      router.push('/news/' + data.id);
    } catch (err: any) {
      console.error(err);
      setMessage('Hiba a mentés során!');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    setMessage('');

    try {
      console.log(ctx?.user?.id);
      const res = await fetch('/api/news-editor', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          news_id: id,
          title,
          description,
          user_id: ctx?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Hiba történt a módosítás során.');

      setMessage(`Sikeres módosítás! (ID: ${data.id})`);
      router.push('/news/' + id);
    } catch (err: any) {
      console.error(err);
      setMessage('Hiba a módosítás során!');
    } finally {
      setSaving(false);
    }
  };

  const getVoteById = async () => {
    try {
      const result = await fetch(`/api/vote-editor/${id}`);
      const data = await result.json();

      console.log('VOTE BY ID:', data);

      if (!result.ok || data.votes.length === 0)
        throw new Error(
          data.error || 'Hiba történt a szavazás betöltése során.',
        );

      setDescription(data.votes[0].description);
      setTitle(data.votes[0].title);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (id) getVoteById();
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{id ? `Szavazás szerkesztése ${id}` : 'Új szavazás létrehozása'}</h1>

      <input
        type="text"
        placeholder="Szavazás címe"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        style={{ marginTop: '2rem', overflow: 'hidden' }}
        placeholder="Szavazás leírása"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          style={{ marginTop: '1rem' }}
          onClick={id ? handleUpdate : handleSave}
          disabled={saving}
        >
          {saving ? 'Mentés folyamatban...' : 'Mentés'}
        </button>
      </div>
    </div>
  );
}
