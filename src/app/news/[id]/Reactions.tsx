'use client';

import { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import { NewsType, ReactionTypeType } from './page';

export default function Reactions({
  news,
  reactionTypes,
  getNewsById,
}: {
  news: NewsType;
  reactionTypes: ReactionTypeType[];
  getNewsById: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const ctx = useContext(GlobalContext);

  console.log(news.reactions ?? 'news.reactions még nincs definiálva');

  const handleReaction = async (reactionTypeId: number) => {
    if (!ctx?.user) return;

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          news_id: news.id,
          user_id: ctx.user.id,
          reaction_type_id: reactionTypeId,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || 'Hiba történt a reakció mentése során.');

      setMessage('Sikeres mentés!');
      getNewsById();
    } catch (err: any) {
      console.error(err);
      setMessage('Hiba a mentés során!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {reactionTypes.map((rt) => (
          <button
            key={rt.id}
            onClick={() => handleReaction(rt.id)}
            disabled={saving}
          >
            {news.reactions.reduce(
              (count, r) => (r.reaction_type_id === rt.id ? count + 1 : count),
              0,
            )}{' '}
            {rt.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
