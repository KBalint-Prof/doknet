'use client';

import { useContext } from 'react';
import { GlobalContext } from '@/app/context/GlobalContext';

export default function Comments({ newsId }: { newsId: number }) {
  const context = useContext(GlobalContext);

  if (!context) return null;

  const { user } = context;

  if (!user) return null;

  return (
    <section style={{ marginTop: '3rem' }}>
      <h3>Hozzászólás</h3>

      <textarea
        placeholder="Írd ide a kommentet..."
        style={{ width: '100%', minHeight: '100px' }}
      />

      <button style={{ marginTop: '0.5rem' }}>Küldés</button>
    </section>
  );
}
