'use client';

import Comments from '@/app/news/[id]/Comments';
import Reactions from '@/app/news/[id]/Reactions';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Edit from '@/app/news/[id]/Edit';

export interface NewsType {
  id: number;
  title: string;
  content: string;
  cover_img: string | null;
  created_at: string;
  author_name: string;
  comments: {
    id: number;
    content: string;
    created_at: string;
    author_name: string;
  }[];
  reactions: {
    reaction_type_id: number;
    key: string;
    icon: string;
    user_id: number;
  }[];
}

export interface ReactionTypeType {
  id: number;
  key: string;
  label: string;
  icon: string;
  sort_order: number;
}

export default function NewsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [news, setNews] = useState<NewsType | null>(null);
  const [reactionTypes, setReactionTypes] = useState<ReactionTypeType[]>([]);

  const getNewsById = async () => {
    try {
      const result = await fetch(`/api/news/${id}`);
      const data = await result.json();

      console.log('NEWS BY ID:', data);

      if (!result.ok || data.news.length === 0)
        throw new Error(data.error || 'Hiba történt a hír betöltése során.');

      setNews(data.news[0]);

      setReactionTypes(data.reaction_types);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    getNewsById();
  }, [id]);

  return (
    <main style={{ padding: '2rem' }}>
      {!news && <div>Betöltés...</div>}

      {news && (
        <>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src={news.cover_img ?? ''}
              alt="Borítókép"
              style={{
                width: '100%',
                maxWidth: '700px',
                height: '25rem',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <h1 style={{ fontFamily: 'Arial', margin: 0 }}>{news.title}</h1>

            <button onClick={() => setIsEditOpen(true)}>Szerkesztés</button>
          </div>

          <article
            className="news-content"
            dangerouslySetInnerHTML={{ __html: news.content }}
            style={{ marginTop: '1rem', fontSize: '1.2rem', lineHeight: '1.6' }}
          ></article>
          <small
            style={{
              marginTop: '0.75rem',
              color: '#777',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              lineHeight: 1.4,
            }}
          >
            <span>
              Közzétéve:{' '}
              <time dateTime={news.created_at}>
                {new Date(news.created_at).toLocaleString('hu-HU')}
              </time>
            </span>

            <span>
              Közzétette:{' '}
              <strong style={{ fontWeight: 500 }}>
                {news.author_name ?? 'Ismeretlen'}
              </strong>
            </span>
          </small>
          <Reactions
            news={news}
            reactionTypes={reactionTypes}
            getNewsById={getNewsById}
          />
          <Comments news={news} getNewsById={getNewsById} />
        </>
      )}
      <Edit open={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </main>
  );
}
