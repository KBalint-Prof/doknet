
'use client';

import React, { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { GlobalContext } from "../context/GlobalContext";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  description: string;
}

const API_URL = "/api/calendar";

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyEvents, setDailyEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  
  const ctx = useContext(GlobalContext);
  const user = ctx?.user;
  
  
  const canEdit = !!user && ['president', 'teacher', 'admin'].includes((user as any).role);

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Hiba az adatok letöltésekor:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const normalizedSelected = selectedDate.includes("T") ? selectedDate.split("T")[0] : selectedDate;
    setDailyEvents(events.filter(e => e.date === normalizedSelected));
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
      setSelectedDate(eventData.date);
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

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEventTitle,
          date: selectedDate,
          description: newEventDescription,
          userRole: (user as any).role
        }),
      });
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Hiba a mentésnél:", err);
    }
  };

  const handleDeleteEvent = async () => {
    if (!canEdit || !editingEventId) return;
    if (!confirm("Biztosan törölni szeretnéd ezt az eseményt?")) return;

    try {
      await fetch(`${API_URL}/${editingEventId}`, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userRole: (user as any).role })
      });
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error("Hiba a törlésnél:", err);
    }
  };

  return (
    <div style={{ maxWidth: 950, margin: "20px auto", fontFamily: "sans-serif", padding: "20px" }}>
      <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="hu"
          buttonText={{ today: "ma" }}
          eventColor="#d1417a" 
          events={events.map(e => ({
            id: String(e.id),
            title: e.title,
            start: e.date,
            allDay: true,
            backgroundColor: "#d1417a",
            borderColor: "#d1417a",
            textColor: "#ffffff"
          }))}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
        />

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
          <div style={{ marginTop: 15 }}>
            {dailyEvents.length === 0 ? <p>Nincs esemény.</p> : dailyEvents.map(e => (
              <div key={e.id} style={eventListItemStyle}>
                <strong>{e.title}</strong>
                <p style={{ margin: "5px 0 0", fontSize: "14px", color: "#555" }}>{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && canEdit && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0 }}>{editingEventId ? "Szerkesztés" : "Új esemény"}</h3>
            <input style={inputStyle} value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Esemény neve" />
            <textarea style={{...inputStyle, marginTop: 10, minHeight: 80}} value={newEventDescription} onChange={e => setNewEventDescription(e.target.value)} placeholder="Leírás" />
            <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
              {editingEventId && <button onClick={handleDeleteEvent} style={{...okButtonStyle, background: "#ff4d4d", marginRight: "auto"}}>Törlés</button>}
              <button onClick={() => setIsModalOpen(false)} style={cancelButtonStyle}>Mégse</button>
              <button onClick={handleSaveEvent} style={okButtonStyle}>Mentés</button>
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