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

<<<<<<< HEAD
=======
const normalizeDate = (dateStr: string) => dateStr.split("T")[0];

>>>>>>> 6892180fdf8e192aeba6352879a2dbbd1ef65b7a
const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dailyEvents, setDailyEvents] = useState<CalendarEvent[]>([]);

  
  const fetchEvents = async () => {
    try {
      const res = await fetch(API_URL);
      const data: CalendarEvent[] = await res.json();
      setEvents(data);

      if (selectedDate) {
        setDailyEvents(data.filter(e => e.date === selectedDate));
      }
    } catch (err) {
      console.error("Hiba az események lekérésénél:", err);
    }
  };

  
  const handleDateClick = async (info: DateClickArg) => {
    const title = prompt("Esemény neve:");
    if (!title) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date: info.dateStr }),
      });
      const data = await res.json();
      console.log("POST response:", data);

<<<<<<< HEAD
      setSelectedDate(info.dateStr);
=======
      setSelectedDate(normalizeDate(info.dateStr));
>>>>>>> 6892180fdf8e192aeba6352879a2dbbd1ef65b7a
      await fetchEvents();
    } catch (err) {
      console.error("Hiba új esemény létrehozásakor:", err);
    }
  };

  
  const handleEventClick = async (info: EventClickArg) => {
    console.log("Clicked event:", info.event.id, info.event.title);

    const id = Number(info.event.id);
    if (isNaN(id)) {
      console.error("Érvénytelen ID:", info.event.id);
      return;
    }

    const newTitle = prompt("Új esemény neve (üres = törlés):", info.event.title);
    if (newTitle === null) return;

    try {
      if (newTitle === "") {
        
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        const data = await res.json();
        console.log("DELETE response:", data);
      } else {
        
        const res = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
          body: JSON.stringify({ title: newTitle, date: info.event.startStr }),
=======
          body: JSON.stringify({ title: newTitle, date: normalizeDate(info.event.startStr) }),
>>>>>>> 6892180fdf8e192aeba6352879a2dbbd1ef65b7a
        });
        const data = await res.json();
        console.log("PUT response:", data);
      }

      await fetchEvents();
<<<<<<< HEAD
      setSelectedDate(info.event.startStr);
=======
      setSelectedDate(normalizeDate(info.event.startStr));
>>>>>>> 6892180fdf8e192aeba6352879a2dbbd1ef65b7a
    } catch (err) {
      console.error("Hiba szerkesztés/törlés során:", err);
    }
  };

  
  const handleDaySelect = (info: DateClickArg) => {
<<<<<<< HEAD
    setSelectedDate(info.dateStr);
=======
    setSelectedDate(normalizeDate(info.dateStr));
>>>>>>> 6892180fdf8e192aeba6352879a2dbbd1ef65b7a
    setDailyEvents(events.filter(e => e.date === info.dateStr));
  };

  
  useEffect(() => {
    fetchEvents();
  }, []);

  
  useEffect(() => {
    setDailyEvents(events.filter(e => e.date === selectedDate));
  }, [selectedDate, events]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="hu"
        headerToolbar={{ left: "prev,next today", center: "title", right: "" }}
        events={events.map(e => ({ id: String(e.id), title: e.title, date: e.date }))}
        dateClick={info => { handleDateClick(info); handleDaySelect(info); }}
        eventClick={handleEventClick}
        height="auto"
      />

      {selectedDate && (
        <div style={{ marginTop: 20, padding: 10, border: "1px solid #ccc" }}>
          <h3>Események {selectedDate} napra:</h3>
          {dailyEvents.length === 0 ? (
            <p>Nincs esemény.</p>
          ) : (
            <ul>
              {dailyEvents.map(e => (
                <li key={e.id}>{e.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
