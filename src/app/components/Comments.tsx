'use client';

import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '@/app/context/GlobalContext';

export default function Comments({ newsId }: { newsId: number }) {
  const context = useContext(GlobalContext);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (!context) return null;
  const { user } = context;

  // 1. LEKÉRDEZÉS (Hogy lássuk a régieket)
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?newsId=${newsId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  // 2. MENTÉS (Amikor az új készül)
  const handleSend = async () => {
    if (!commentText.trim()) return;

    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: commentText,
        newsId: newsId,
        userId: user?.id,
      }),
    });

    if (response.ok) {
      setCommentText('');
      fetchComments(); // Frissítés, hogy az új is megjelenjen a kártyák között
    }
  };

  return (
    <section style={{ marginTop: '3rem', maxWidth: '800px' }}>
      {/* --- BEVITELI MEZŐ (A te korábbi kódod alapján) --- */}
      {user ? (
        <div style={{ marginBottom: '3rem' }}>
          <h3>Hozzászólás</h3>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Írd ide a kommentet..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #ddd',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              marginTop: '0.5rem',
              padding: '0.6rem 1.5rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Küldés
          </button>
        </div>
      ) : (
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          A hozzászóláshoz be kell jelentkezned.
        </p>
      )}

      {/* --- LISTA (A hírek kártya-stílusában) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
          Vélemények ({comments.length})
        </h3>

        {loading ? (
          <p>Betöltés...</p>
        ) : (
          comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: '1.2rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                }}
              >
                <strong style={{ color: '#0070f3' }}>{c.username}</strong>
                <small style={{ color: '#777' }}>
                  {new Date(c.created_at).toLocaleString('hu-HU')}
                </small>
              </div>
              <p style={{ margin: 0, color: '#333', lineHeight: '1.5' }}>
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
