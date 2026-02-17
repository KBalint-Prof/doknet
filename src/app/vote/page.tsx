'use client';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlobalContext } from '../context/GlobalContext';
import { useParams } from 'next/navigation';

const allowed_roles = ['admin', 'teacher', 'president'];

interface NewsType {
  id: number;
  title: string;
  content: string;
  cover_img: string | null;
  created_at: string;
  author_name: string;
}

export default function HomePage() {
  const router = useRouter();
  const ctx = useContext(GlobalContext);
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  if (!ctx?.user || !allowed_roles.includes((ctx.user as any).role)) {
    return (
      <>
        <div style={{ padding: '2rem', color: 'red' }}>
          Nincs jogosultságod a szavazásszerkesztő használatához.
        </div>
        <button onClick={() => (window.location.href = '/')}>
          Vissza a főoldalra
        </button>
      </>
    );
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Szavazások</h1>
      {ctx?.user &&
        ['admin', 'teacher', 'president'].includes((ctx.user as any).role) && (
          <button onClick={() => router.push('/vote-editor/')}>
            Új szavazás
          </button>
        )}
    </main>
  );
}
