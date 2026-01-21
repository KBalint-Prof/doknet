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
    setNewEventTitle("");
    setNewEventDescription("");
    setIsModalOpen(true);
  };

  const handleSaveEvent = async () => {
    if (!newEventTitle || !selectedDate) {
      alert("Az esemény címe és dátuma kötelező.");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newEventTitle,
          date: selectedDate,
          description: newEventDescription,
        }),
      });

      handleCloseModal();
      await fetchEvents();
    } catch (err) {
      console.error("Hiba a mentés során:", err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewEventTitle("");
    setNewEventDescription("");
  };

  const handleEventClick = async (info: EventClickArg) => {
    const id = info.event.id;
    const currentTitle = info.event.title;
    const eventDate = normalizeDate(info.event.startStr);

    const newTitle = prompt("Módosítás (üres = törlés):", currentTitle);
    if (newTitle === null) return;

    try {
      if (newTitle === "") {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      } else {
        const eventToUpdate = events.find(e => String(e.id) === id);

        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newTitle,
            date: eventDate,
            description: eventToUpdate?.description ?? "",
          }),
        });
      }

      await fetchEvents();
    } catch (err) {
      console.error("Hiba:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    setDailyEvents(
      events.filter(e => normalizeDate(e.date) === selectedDate)
    );
  }, [selectedDate, events]);

  return (
    <div style={{ maxWidth: 950, margin: "20px auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="hu"
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

      {selectedDate && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #ccc",
            borderRadius: 8,
          }}
        >
          <h3>Események – {selectedDate}</h3>
          {dailyEvents.length === 0 ? (
            <p>Nincs esemény.</p>
          ) : (
            <ul>
              {dailyEvents.map(e => (
                <li key={e.id}>
                  {e.title} – <em>{e.description}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Új esemény hozzáadása: {selectedDate}</h3>

            <div style={{ marginBottom: 15 }}>
              <label>Esemény neve:</label>
              <input
                type="text"
                value={newEventTitle}
                onChange={e => setNewEventTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label>Esemény leírása:</label>
              <textarea
                value={newEventDescription}
                onChange={e => setNewEventDescription(e.target.value)}
              />
            </div>

            <div style={buttonGroupStyle}>
              <button onClick={handleCloseModal}>Mégse</button>
              <button
                onClick={handleSaveEvent}
                disabled={!newEventTitle}
              >
                OK
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
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: "#fff",
  padding: "30px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "420px",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
};
