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
  const [selectedDate, setSelectedDate] = useState<string>("");
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
    const clickedDate = info.dateStr; 
    setSelectedDate(clickedDate);
    
    
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
          description: newEventDescription 
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
              description: eventToUpdate ? eventToUpdate.description : "" 
          }),
        });
      }
      await fetchEvents();
    } catch (err) {
      console.error("Hiba:", err);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    setDailyEvents(events.filter(e => normalizeDate(e.date) === selectedDate));
  }, [selectedDate, events]);

  return (
    <div style={{ maxWidth: "950px", margin: "20px auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="hu"
        headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
        eventDisplay="block"
        eventColor="#d1417a"
        events={events.map(e => ({
          id: String(e.id),
          title: e.title,
          start: e.date,
          allDay: true
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        height="auto"
      />

      {selectedDate && (
        <div style={{ marginTop: 20, padding: 15, border: "1px solid #ccc", borderRadius: "8px" }}>
          <h3>Események - {selectedDate}</h3>
          {dailyEvents.length === 0 ? <p>Nincs esemény.</p> : (
            <ul>
              {dailyEvents.map(e => <li key={e.id}>{e.title} - *{e.description}*</li>)}
            </ul>
          )}
        </div>
      )}

      {}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            {}
            <h3>Új esemény hozzáadása: {selectedDate}</h3>
            
            <div style={{ marginBottom: 15 }}>
              <label htmlFor="eventTitle">Esemény neve:</label>
              <input 
                id="eventTitle"
                type="text" 
                value={newEventTitle} 
                onChange={(e) => setNewEventTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            {}
            <div style={{ marginBottom: 25 }}>
              <label htmlFor="eventDescription">Esemény leírása:</label>
              <textarea
                id="eventDescription"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
                style={textareaStyle}
              ></textarea>
            </div>

            <div style={buttonGroupStyle}>
              <button onClick={handleCloseModal} style={cancelButtonStyle}>Mégse</button>
              <button onClick={handleSaveEvent} style={okButtonStyle} disabled={!newEventTitle}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle: React.CSSProperties = {
  background: "white",
  padding: "30px",
  borderRadius: "8px",
  width: "90%",
  maxWidth: "400px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 0 0",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 0 0",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid #ccc",
  resize: "vertical",
  minHeight: "80px",
};

const buttonGroupStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "20px",
};

const okButtonStyle: React.CSSProperties = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#d1417a",
  color: "white",
  cursor: "pointer",
};

const cancelButtonStyle: React.CSSProperties = {
  padding: "10px 15px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "#f0f0f0",
  cursor: "pointer",
};