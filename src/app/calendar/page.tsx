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

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      
      setEvents(data);
    } catch (err) {
      console.error("Hiba:", err);
    }
  };

  const handleDateClick = async (info: DateClickArg) => {
    
    const clickedDate = info.dateStr; 
    setSelectedDate(clickedDate);

    const title = prompt(`${clickedDate} - Új esemény:`);
    if (!title) return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date: clickedDate }),
      });
      await fetchEvents();
    } catch (err) {
      console.error("Hiba:", err);
    }
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
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle, date: eventDate }),
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
              {dailyEvents.map(e => <li key={e.id}>{e.title}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;