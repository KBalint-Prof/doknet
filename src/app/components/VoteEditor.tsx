'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '../context/GlobalContext';

export default function VoteEditor({ id }: { id?: number }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const ctx = useContext(GlobalContext);
  const [options, setOptions] = useState<string[]>([]);

  const addOption = () => {
    setOptions((prev) => [...prev, '']);
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
    setMessage('');

    try {
      const res = await fetch('/api/vote-editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        throw new Error(data.error || 'Hiba történt a mentés során.');

      router.push('/vote/');
    } catch (err) {
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
      const res = await fetch('/api/vote-editor', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          poll_id: id,
          title,
          description,
          user_id: ctx?.user?.id,
          options,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Hiba történt a módosítás során.');

      setMessage(`Sikeres módosítás! (ID: ${data.id})`);
      router.push('/');
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

      {options.map((opt, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder={`Opció ${index + 1}`}
            value={opt}
            onChange={(e) => updateOption(index, e.target.value)}
            style={{ marginTop: '1rem', marginRight: '1rem' }}
          />

          <button onClick={() => removeOption(index)}>⛌</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button type="button" onClick={addOption} style={{ marginTop: '1rem' }}>
          Új Opció hozzáadása
        </button>
      </div>

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
