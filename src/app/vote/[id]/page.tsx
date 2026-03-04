"use client";

import Reactions from "@/app/vote/[id]/Options";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GlobalContext } from "../../context/GlobalContext";
import Options from "./Options";
import Vote_close from "./Vote_close";

export interface VotesType {
  id: number;
  title: string;
  description: string;
  created_at: string;
  author_name: string;
  is_active: number;
  modified_at: string | null;
  options: {
    vote_option_id: number;
    option_text: string;
    user_id: number;
  }[];
}

export interface VoteOptionsType {
  id: number;
  option_text: string;
  vote_id: number;
}

export default function VotePage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [isOpen, setIsOpen] = useState(false);
  const ctx = useContext(GlobalContext);
  const [vote, setVote] = useState<VotesType | null>(null);
  const [voteOptions, setVoteOptions] = useState<VoteOptionsType[]>([]);

  const [notExists, setNotExists] = useState(false);

  const router = useRouter();

  const getVoteById = async () => {
    try {
      const result = await fetch(`/api/vote/${id}`);
      const data = await result.json();

      console.log("VOTE BY ID:", data);

      if (result.status === 404) {
        setNotExists(true);
        return;
      }

      setVote(data.votes[0]);

      setVoteOptions(data.vote_options);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleClose = async () => {
    try {
      const res = await fetch(`/api/vote_close`, {
        method: "PATCH",
        body: JSON.stringify({ vote_id: id, is_active: 1 }),
      });

      if (!res.ok) throw new Error("Lezárás sikertelen");

      toast.success("Sikeres lezárás!", {
        style: { marginTop: "3.5rem" },
      });

      router.push("/vote");
    } catch (err) {
      console.error(err);
      alert("Nem sikerült lezárni a szavazást.");
    }
  };

  useEffect(() => {
    getVoteById();
  }, [id]);

  if (notExists) {
    return (
      <main style={{ padding: "2rem" }}>
        <div style={{ color: "red", marginBottom: "1rem" }}>
          Ez a szavazás nem létezik vagy már törölve lett.
        </div>
        <button onClick={() => router.push("/")}>Vissza a főoldalra</button>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem" }}>
      {!vote && <div>Betöltés...</div>}

      {vote && (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={
                vote.is_active === 1
                  ? "/covers/szavazas_lezart.png"
                  : "/covers/szavazas.png"
              }
              alt="Borítókép"
              style={{
                width: "100%",
                maxWidth: "700px",
                height: "25rem",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <h1 style={{ fontFamily: "Arial", margin: 0 }}>{vote.title}</h1>

            {ctx?.user &&
              ["admin", "teacher", "president"].includes(
                (ctx.user as any).role,
              ) && (
                <>
                  <button onClick={() => setIsOpen(true)}>Lezárás</button>
                </>
              )}
          </div>

          <article
            className="news-content"
            dangerouslySetInnerHTML={{ __html: vote.description }}
            style={{ marginTop: "1rem", fontSize: "1.2rem", lineHeight: "1.6" }}
          ></article>

          <div
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #ddd",
              paddingTop: "1rem",
            }}
          ></div>

          <small
            style={{
              marginTop: "0.75rem",
              color: "#777",
              display: "grid",
              gridTemplateColumns: "1fr 5fr",
              gap: "0.25rem 0.75rem",
              lineHeight: 1.4,
              fontSize: "0.8rem",
            }}
          >
            <span>
              Közzétéve:{" "}
              <time dateTime={vote.created_at}>
                {new Date(vote.created_at).toLocaleString("hu-HU")}
              </time>
            </span>

            {vote.modified_at && (
              <span>
                Utoljára módosítva:{" "}
                <strong style={{ fontWeight: 500 }}>
                  {new Date(vote.modified_at).toLocaleString("hu-HU")}
                </strong>{" "}
              </span>
            )}

            <span>
              Közzétette:{" "}
              <strong style={{ fontWeight: 500 }}>
                {vote.author_name ?? "Ismeretlen"}
              </strong>
            </span>
          </small>
          <div
            style={{
              marginTop: "2rem",
              borderTop: "1px solid #ddd",
              paddingTop: "1rem",
            }}
          ></div>
          <Options
            votes={vote}
            voteOptions={voteOptions}
            getVotesById={getVoteById}
          />

          <Vote_close
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleClose}
            title="Szavazás lezárása"
            description="Biztosan lezárod ezt a szavazást? Ez nem visszavonható."
          />
        </>
      )}
    </main>
  );
}
