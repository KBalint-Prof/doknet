'use client';

import { useState, useEffect, useContext, useRef } from 'react';
import { GlobalContext } from '../context/GlobalContext';

interface Message {
    id: number;
    username: string;
    message: string;
    created_at: string;
}

export default function ChatPage() {
    const ctx = useContext(GlobalContext);
    const user = ctx?.user;
    
    
    const canChat = !!user && ['member', 'president', 'teacher', 'admin'].includes((user as any).role);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        if (!canChat) return;
        try {
            const res = await fetch("/api/chat");
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data.reverse());
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
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                    userRole: (user as any).role
                })
            });
            setNewMessage("");
            fetchMessages();
        } catch (err) {
            alert("Hiba az üzenet küldésekor.");
        }
    };

    
    if (!user || !canChat) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', padding: '20px' }}>
                <h2 style={{ color: '#d1417a' }}>🔒 Zárt körű chat</h2>
                <p>Ezt a felületet csak a DÖK munkatársai érhetik el.</p>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h2 style={{ borderBottom: '2px solid #d1417a', paddingBottom: '10px', color: '#333' }}>
                DÖKChat
            </h2>
            
            <div style={chatBoxStyle}>
                {messages.map((m) => {
                    const isOwnMessage = m.username === user.username;
                    return (
                        <div key={m.id} style={{
                            ...msgStyle,
                            alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
                            backgroundColor: isOwnMessage ? '#d1417a' : '#f0f0f0',
                            color: isOwnMessage ? 'white' : '#333',
                            borderBottomRightRadius: isOwnMessage ? '2px' : '15px',
                            borderBottomLeftRadius: isOwnMessage ? '15px' : '2px',
                        }}>
                            <strong style={{ fontSize: '11px', display: 'block', marginBottom: '4px', opacity: 0.8 }}>
                                {m.username}
                            </strong>
                            {m.message}
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <form onSubmit={sendMessage} style={inputAreaStyle}>
                <input 
                    style={inputStyle}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Írj egy üzenetet..."
                />
                <button type="submit" style={buttonStyle}>Küldés</button>
            </form>
        </div>
    );
}

// --- Stílusok ---
const containerStyle: React.CSSProperties = {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    height: '85vh'
};
    
const chatBoxStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    border: '1px solid #eee',
    borderRadius: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: '#fff',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '15px'
};

const msgStyle: React.CSSProperties = { 
    padding: '10px 15px',
    borderRadius: '15px',
    maxWidth: '75%',
    wordWrap: 'break-word',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

const inputAreaStyle: React.CSSProperties = { 
    display: 'flex',
    gap: '10px',
    background: '#fff',
    padding: '10px',
    borderRadius: '30px',
    border: '1px solid #ddd' 
};

const inputStyle: React.CSSProperties = { 
    flex: 1,
    padding: '10px 15px',
    border: 'none',
    outline: 'none',
    fontSize: '16px'
};

const buttonStyle: React.CSSProperties = {
    background: '#d1417a',
    color: 'white',
    border: 'none',
    padding: '0 25px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
};