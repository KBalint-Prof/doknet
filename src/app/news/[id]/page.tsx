'use client';

import Comments from '@/app/news/[id]/Comments';
import Rections from '@/app/news/[id]/Rections';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
}

export default function NewsPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [news, setNews] = useState<NewsType | null>(null);

  const getNewsById = async () => {
    try {
      const result = await fetch(`/api/news/${id}`);
      const data = await result.json();

      console.log('NEWS BY ID:', data);

      if (!result.ok || data.length === 0)
        throw new Error(data.error || 'Hiba történt a hír betöltése során.');

      setNews(data[0]);
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
          <h1 style={{ fontFamily: 'Arial', marginBottom: '1rem' }}>
            {news.title}
          </h1>
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
          <Rections news={news} getNewsById={getNewsById} />
          <Comments news={news} getNewsById={getNewsById} />
        </>
      )}
    </main>
  );
}
