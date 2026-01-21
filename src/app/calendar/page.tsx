"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { useEffect, useState } from "react";

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  description: string;
}

const API_URL = "/api/calendar";

const normalizeDate = (dateStr: any) => {
  if (!dateStr) return "";
  const s = String(dateStr);
  return s.includes("T") ? s.split("T")[0] : s;
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyEvents, setDailyEvents] = useState<CalendarEvent[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Hiba:", err);
    }
  };

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
    setEditingEventId(null);
    setNewEventTitle("");
    setNewEventDescription("");
    setIsModalOpen(true);
  };

  const handleEventClick = (info: EventClickArg) => {
    const id = info.event.id;
    const eventData = events.find(e => String(e.id) === id);

    if (eventData) {
      
      setSelectedDate(normalizeDate(info.event.startStr));
      
      setEditingEventId(id);
      setNewEventTitle(eventData.title || "");
      setNewEventDescription(eventData.description || ""); 
      setIsModalOpen(true);
    }
  };

  const handleSaveEvent = async () => {
    if (!newEventTitle || !selectedDate) {
      alert("Az esemény címe és dátuma kötelező.");
      return;
    }

    try {
      if (editingEventId) {
        await fetch(`${API_URL}/${editingEventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newEventTitle,
            date: selectedDate,
            description: newEventDescription,
          }),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newEventTitle,
            date: selectedDate,
            description: newEventDescription,
          }),
        });
      }

      handleCloseModal();
      await fetchEvents();
    } catch (err) {
      console.error("Hiba a mentés során:", err);
    }
  };

  const handleDeleteEvent = async () => {
    if (!editingEventId) return;
    if (!confirm("Biztosan törölni szeretnéd ezt az eseményt?")) return;

    try {
      await fetch(`${API_URL}/${editingEventId}`, { method: "DELETE" });
      handleCloseModal();
      await fetchEvents();
    } catch (err) {
      console.error("Hiba a törlés során:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEventId(null);
    setNewEventTitle("");
    setNewEventDescription("");
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setDailyEvents(events.filter(e => normalizeDate(e.date) === selectedDate));
  }, [selectedDate, events]);

  return (
    <div style={{ maxWidth: 950, margin: "20px auto", fontFamily: "sans-serif" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="hu"
        buttonText={{ today: "ma" }}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        eventDisplay="block"
        eventColor="#d1417a"
        events={events.map(e => ({
          id: String(e.id),
          title: e.title,
          start: e.date,
          allDay: true,
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />

      {}
      {selectedDate && (
        <div style={dailyEventsContainerStyle}>
          <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
            Események – {selectedDate}
          </h3>
          {dailyEvents.length === 0 ? (
            <p style={{ color: "#666" }}>Nincs esemény.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {dailyEvents.map(e => (
                <li key={e.id} style={eventListItemStyle}>
                  <strong>{e.title}</strong>
                  {e.description && <p style={{ margin: "5px 0 0", fontSize: "14px", color: "#555" }}>{e.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginBottom: 20 }}>
              {editingEventId ? "Esemény módosítása" : "Új esemény hozzáadása"}: {selectedDate}
            </h3>

            <div style={{ marginBottom: 15 }}>
              <label style={labelStyle}>Esemény neve:</label>
              <input
                type="text"
                style={inputStyle}
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Esemény leírása:</label>
              <textarea
                style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                value={newEventDescription}
                onChange={e => setNewEventDescription(e.target.value)}
              />
            </div>

            <div style={buttonGroupStyle}>
              {editingEventId && (
                <button 
                  onClick={handleDeleteEvent} 
                  style={{ ...buttonBaseStyle, backgroundColor: "#ff4d4d", marginRight: "auto" }}
                >
                  Törlés
                </button>
              )}
              <button onClick={handleCloseModal} style={cancelButtonStyle}>
                Mégse
              </button>
              <button
                onClick={handleSaveEvent}
                disabled={!newEventTitle}
                style={{
                  ...okButtonStyle,
                  opacity: newEventTitle ? 1 : 0.6,
                  cursor: newEventTitle ? "pointer" : "not-allowed",
                }}
              >
                {editingEventId ? "Mentés" : "OK"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

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