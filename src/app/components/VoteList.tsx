"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface VoteType {
  id: number;
  title: string;
  description: string;
  created_at: string;
  author_name: string;
}

export default function VoteList() {
  const [voteList, setVoteList] = useState<VoteType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVoteList = async () => {
    try {
      const res = await fetch("/api/vote");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Hiba történt a szavazások betöltésekor.",
        );
      }

      setVoteList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteList();
  }, []);

  if (loading) {
    return <p>Szavazások betöltése…</p>;
  }

  return (
    <>
      {voteList.map((vote) => {
        const plainText =
          vote.description.replace(/<[^>]+>/g, "").slice(0, 600) + "...";

        return (
          <Link
            key={vote.id}
            href={`/vote/${vote.id}`}
            style={{
              display: "flex",
              gap: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "10px",
              marginBottom: "1rem",
              textDecoration: "none",
              color: "inherit",
              alignItems: "stretch",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ margin: "0 0 0.5rem 0" }}>{vote.title}</h2>
                <p style={{ margin: 0, color: "#444" }}>{plainText}</p>
              </div>

              <small
                style={{
                  marginTop: "0.75rem",
                  color: "#777",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  lineHeight: 1.4,
                }}
              >
                <span>
                  Közzétéve:{" "}
                  <time dateTime={vote.created_at}>
                    {new Date(vote.created_at).toLocaleString("hu-HU")}
                  </time>
                </span>

                <span>
                  Közzétette:{" "}
                  <strong style={{ fontWeight: 500 }}>
                    {vote.author_name ?? "Ismeretlen"}
                  </strong>
                </span>
              </small>
            </div>
          </Link>
        );
      })}
    </>
  );
}
