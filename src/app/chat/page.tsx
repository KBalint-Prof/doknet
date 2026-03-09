"use client";

import { useState, useEffect, useContext, useRef } from "react";
import { GlobalContext } from "../context/GlobalContext";

interface Message {
  id: number;
  username: string;
  message: string;
  created_at: string;
}

export default function ChatPage() {
  const ctx = useContext(GlobalContext);
  const user = ctx?.user;

  const canChat =
    !!user &&
    ["member", "president", "teacher", "admin"].includes((user as any).role);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!canChat) return;

    try {
      const res = await fetch("/api/chat");
      const data = await res.json();

      if (Array.isArray(data)) {
        const newMessages = data.reverse();

        setMessages((prev) => {
          if (prev.length === 0) return newMessages;

          const prevLastId = prev[prev.length - 1]?.id;
          const newLastId = newMessages[newMessages.length - 1]?.id;

          if (prevLastId === newLastId) return prev;

          return newMessages;
        });
      }
    } catch (err) {
      console.error("Chat hiba:", err);
    }
  };

  useEffect(() => {
    if (canChat) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [canChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !canChat || !newMessage.trim()) return;

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          message: newMessage,
          userRole: (user as any).role,
        }),
      });

      setNewMessage("");
      fetchMessages();
    } catch (err) {
      alert("Hiba az üzenet küldésekor.");
    }
  };

  if (!user || !canChat) {
    return (
      <div className="chat-locked">
        <h2>🔒 Zárt körű chat</h2>
        <p>Ezt a felületet csak a DÖK munkatársai érhetik el.</p>
        <button onClick={() => (window.location.href = "/")}>
          Vissza a főoldalra
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container page-animate">
      <h2 className="chat-title">DÖKChat</h2>

      <div className="chat-box" ref={scrollRef}>
        {messages.map((m) => {
          const isOwnMessage = m.username === user.username;

          return (
            <div
              key={m.id}
              className={`chat-message ${isOwnMessage ? "own" : "other"}`}
            >
              <span className="chat-username">{m.username}</span>

              {m.message}
            </div>
          );
        })}
      </div>

      <form onSubmit={sendMessage} className="chat-input-area">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Írj egy üzenetet..."
        />

        <button type="submit">Küldés</button>
      </form>
    </div>
  );
}
