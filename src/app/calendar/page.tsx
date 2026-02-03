
'use client';

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  description: string;
}

interface User {
  username: string;
  role: 'student' | 'member' | 'president' | 'teacher' | 'admin';
}

const API_URL = "/api/calendar";


const normalizeDate = (dateStr: any) => {
  if (!dateStr) return "";
  const s = String(dateStr);
  return s.includes("T") ? s.split("T")[0] : s;
};


export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyEvents, setDailyEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  
  const [user, setUser] = useState<User | null>(null); 
  
  
  const canEdit = !!user && ['president', 'teacher', 'admin'].includes(user.role);

  
  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Hiba az események lekérésekor:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  
  useEffect(() => {
    const normalizedSelected = normalizeDate(selectedDate);
    setDailyEvents(events.filter(e => normalizeDate(e.date) === normalizedSelected));
  }, [selectedDate, events]);

  
  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
    if (canEdit) {
      setEditingEventId(null);
      setNewEventTitle("");
      setNewEventDescription("");
      setIsModalOpen(true);
    }
  };

  
  const handleEventClick = (info: EventClickArg) => {
    const id = info.event.id;
    const eventData = events.find(e => String(e.id) === id);
    if (eventData) {
      setSelectedDate(normalizeDate(eventData.date));
      if (canEdit) {
        setEditingEventId(id);
        setNewEventTitle(eventData.title);
        setNewEventDescription(eventData.description);
        setIsModalOpen(true);
      }
    }
  };

  
  const handleSaveEvent = async () => {
    if (!canEdit) return;
    
    try {
      const method = editingEventId ? "PUT" : "POST";
      const url = editingEventId ? `${API_URL}/${editingEventId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEventTitle,
          date: selectedDate,
          description: newEventDescription,
          userRole: user?.role
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchEvents();
      } else {
        alert("Hiba történt a mentés során.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const handleDeleteEvent = async () => {
    if (!canEdit || !editingEventId) return;
    if (!confirm("Biztosan törölni szeretnéd?")) return;

    try {
      const res = await fetch(`${API_URL}/${editingEventId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: user?.role })
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: 950, margin: "20px auto", fontFamily: "sans-serif", padding: "0 20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Eseménynaptár</h1>
      
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="hu"
        buttonText={{ today: "ma" }}
        events={events.map(e => ({
          id: String(e.id),
          title: e.title,
          start: e.date,
          allDay: true
        }))}
        eventColor="#d1417a"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />

      {}
      {selectedDate && (
        <div style={dailyEventsContainerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Események – {selectedDate}</h3>
            {canEdit && (
              <button onClick={() => { setEditingEventId(null); setIsModalOpen(true); }} style={okButtonStyle}>
                + Új esemény
              </button>
            )}
          </div>
          <div style={{ marginTop: "15px" }}>
            {dailyEvents.length === 0 ? (
              <p style={{ color: "#666 italic" }}>Nincs esemény erre a napra.</p>
            ) : (
              dailyEvents.map(e => (
                <div key={e.id} style={eventListItemStyle}>
                  <strong style={{ display: "block", fontSize: "16px" }}>{e.title}</strong>
                  <p style={{ margin: "5px 0 0", color: "#555", fontSize: "14px" }}>{e.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {}
      {isModalOpen && canEdit && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0 }}>{editingEventId ? "Esemény módosítása" : "Új esemény hozzáadása"}</h3>
            <p style={{ fontSize: "14px", color: "#666" }}>Dátum: {selectedDate}</p>
            
            <label style={labelStyle}>Cím:</label>
            <input 
              style={inputStyle} 
              value={newEventTitle} 
              onChange={e => setNewEventTitle(e.target.value)} 
              placeholder="Mi fog történni?" 
            />
            
            <label style={{ ...labelStyle, marginTop: "15px" }}>Leírás:</label>
            <textarea 
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} 
              value={newEventDescription} 
              onChange={e => setNewEventDescription(e.target.value)} 
              placeholder="Részletek..." 
            />

            <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
              {editingEventId && (
                <button onClick={handleDeleteEvent} style={{ ...buttonBaseStyle, background: "#ff4d4d", marginRight: "auto" }}>
                  Törlés
                </button>
              )}
              <button onClick={() => setIsModalOpen(false)} style={cancelButtonStyle}>Mégse</button>
              <button 
                onClick={handleSaveEvent} 
                style={{ ...okButtonStyle, opacity: newEventTitle ? 1 : 0.5 }} 
                disabled={!newEventTitle}
              >
                Mentés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: "#fff",
  padding: "30px",
  borderRadius: "20px",
  width: "90%",
  maxWidth: "450px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: "600",
  fontSize: "14px",
  color: "#444"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  alignItems: "center"
};

const buttonBaseStyle: React.CSSProperties = {
  padding: "10px 25px",
  border: "none",
  borderRadius: "25px",
  color: "white",
  fontWeight: "bold",
  fontSize: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const cancelButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  background: "linear-gradient(135deg, #6a11cb, #2575fc)",
};

const okButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  background: "linear-gradient(135deg, #d1417a, #e91e63)",
};

const dailyEventsContainerStyle: React.CSSProperties = {
  marginTop: 30,
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "12px",
  border: "1px solid #eee",
};

const eventListItemStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#fff",
  marginBottom: "10px",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  borderLeft: "4px solid #d1417a"
};