'use client';

import { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import { NewsType } from './page';

export default function Comments({
  news,
  getNewsById,
}: {
  news: NewsType;
  getNewsById: () => Promise<void>;
}) {
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const ctx = useContext(GlobalContext);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      console.log(ctx?.user?.id);
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          content,
          news_id: news.id,
          user_id: ctx?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Hiba történt a komment mentése során.');

      setMessage(`Sikeres mentés! (ID: ${data.id})`);
      getNewsById();
    } catch (err: any) {
      console.error(err);
      setMessage('Hiba a mentés során!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ paddingTop: '2rem' }}>
      <button
        style={{ marginLeft: '1rem' }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Kommentelés folyamatban...' : 'Like'}
      </button>
      <button
        style={{ marginLeft: '1rem' }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Kommentelés folyamatban...' : 'Dislike'}
      </button>
      <button
        style={{ marginLeft: '1rem' }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Kommentelés folyamatban...' : 'Love'}
      </button>
      <button
        style={{ marginLeft: '1rem' }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Kommentelés folyamatban...' : 'Wow'}
      </button>
      <button
        style={{ marginLeft: '1rem' }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Kommentelés folyamatban...' : 'Sad'}
      </button>
    </div>
  );
}
