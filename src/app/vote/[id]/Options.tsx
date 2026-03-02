"use client";

import { useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import { VotesType, VoteOptionsType } from "./page";

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
  const [message, setMessage] = useState("");
  const ctx = useContext(GlobalContext);

  console.log(votes.options ?? "votes.options még nincs definiálva");

  const handleOption = async (optionId: number) => {
    if (!ctx?.user) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          vote_id: votes.id,
          user_id: ctx.user.id,
          option_id: optionId,
        }),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.error || "Hiba történt a választás mentése során.",
        );

      setMessage("Sikeres mentés!");
      getVotesById();
    } catch (err: any) {
      console.error(err);
      setMessage("Hiba a mentés során!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "1rem 2rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {voteOptions
          .filter((vo) => vo.vote_id === votes.id)
          .map((vo) => (
            <button
              key={vo.id}
              onClick={() => handleOption(vo.id)}
              disabled={saving}
            >
              {votes.options.reduce(
                (count, v) => (v.vote_option_id === vo.id ? count + 1 : count),
                0,
              )}{" "}
              {vo.option_text}
            </button>
          ))}
      </div>
    </div>
  );
}
