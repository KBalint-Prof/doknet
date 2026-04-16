'use client';

import { useContext, useState } from 'react';
import { GlobalContext } from '../../context/GlobalContext';
import { VotesType, VoteOptionsType } from './page';

export default function Options({
  votes,
  voteOptions,
  getVotesById,
}: {
  votes: VotesType;
  voteOptions: VoteOptionsType[];
  getVotesById: () => Promise<void>;
}) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const ctx = useContext(GlobalContext);

  console.log(votes.options ?? 'votes.options még nincs definiálva');

  const handleOption = async (optionId: number) => {
    if (!ctx?.user) return;

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          vote_id: votes.id,
          user_id: ctx.user.id,
          option_id: optionId,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.error || 'Hiba történt a választás mentése során.',
        );

      setMessage('Sikeres mentés!');
      getVotesById();
    } catch (err: any) {
      console.error(err);
      setMessage('Hiba a mentés során!');
    } finally {
      setSaving(false);
    }
  };

  const getResults = () => {
    const counts: Record<number, { text: string; count: number }> = {};

    // CSAK az adott szavazás opciói
    const filteredOptions = voteOptions.filter((vo) => vo.vote_id === votes.id);

    // inicializálás
    filteredOptions.forEach((vo) => {
      counts[vo.id] = {
        text: vo.option_text,
        count: 0,
      };
    });

    // szavazatok számolása
    votes.options.forEach((v) => {
      if (counts[v.vote_option_id]) {
        counts[v.vote_option_id].count++;
      }
    });

    const values = Object.values(counts);
    if (values.length === 0) return null;

    const max = Math.max(...values.map((v) => v.count));
    const winners = values.filter((v) => v.count === max);

    return { winners, max };
  };

  return (
    <div style={{ padding: '1rem 2rem' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        {votes.is_active === 1 &&
          (() => {
            const result = getResults();
            if (!result) return null;

            return (
              <div
                style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #ddd',
                  textAlign: 'center',
                }}
              >
                <h3>Eredmény</h3>

                {result.winners.length === 1 ? (
                  <p>
                    Győztes: <strong>{result.winners[0].text}</strong> (
                    {result.max} szavazat)
                  </p>
                ) : (
                  <>
                    <p>Döntetlen ({result.max} szavazat):</p>
                    {result.winners.map((w, i) => (
                      <div key={i}>{w.text}</div>
                    ))}
                  </>
                )}
              </div>
            );
          })()}
        {voteOptions
          .filter((vo) => vo.vote_id === votes.id)
          .map((vo) => (
            <button
              key={vo.id}
              onClick={() => handleOption(vo.id)}
              disabled={saving || votes.is_active === 1}
            >
              {vo.option_text}
              {' : '}
              {votes.options.reduce(
                (count, v) => (v.vote_option_id === vo.id ? count + 1 : count),
                0,
              )}
              {' szavazat '}
            </button>
          ))}
      </div>
    </div>
  );
}
