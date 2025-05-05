import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  color?: string;
}

interface CalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => string;
  removeEvent: (id: string) => boolean;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => boolean;
  getEventById: (id: string) => CalendarEvent | undefined;
  getEventsByDate: (date: Date) => CalendarEvent[];
  getUpcomingEvents: (count?: number) => CalendarEvent[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

// Sample events for demonstration
const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync-up',
    startDate: new Date(new Date().setHours(10, 0, 0, 0)),
    endDate: new Date(new Date().setHours(11, 0, 0, 0)),
    color: '#4f46e5'
  },
  {
    id: '2',
    title: 'Project Deadline',
    description: 'Complete the TaskTribe MVP',
    startDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    allDay: true,
    color: '#ef4444'
  }
];

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);

  const addEvent = (newEvent: Omit<CalendarEvent, 'id'>): string => {
    const id = Date.now().toString();
    const eventWithId = { ...newEvent, id };
    
    setEvents(prev => [...prev, eventWithId]);
    return id;
  };

  const removeEvent = (id: string): boolean => {
    const initialLength = events.length;
    setEvents(prev => prev.filter(event => event.id !== id));
    return events.length !== initialLength;
  };

  const updateEvent = (id: string, updatedFields: Partial<CalendarEvent>): boolean => {
    let updated = false;
    
    setEvents(prev => 
      prev.map(event => {
        if (event.id === id) {
          updated = true;
          return { ...event, ...updatedFields };
        }
        return event;
      })
    );
    
    return updated;
  };

  const getEventById = (id: string): CalendarEvent | undefined => {
    return events.find(event => event.id === id);
  };

  const getEventsByDate = (date: Date): CalendarEvent[] => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const targetDateEnd = new Date(targetDate);
    targetDateEnd.setHours(23, 59, 59, 999);
    
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      return (
        (eventStart >= targetDate && eventStart <= targetDateEnd) ||
        (eventEnd >= targetDate && eventEnd <= targetDateEnd) ||
        (eventStart <= targetDate && eventEnd >= targetDateEnd)
      );
    });
  };

  const getUpcomingEvents = (count: number = 5): CalendarEvent[] => {
    const now = new Date();
    
    return events
      .filter(event => new Date(event.startDate) >= now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, count);
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        removeEvent,
        updateEvent,
        getEventById,
        getEventsByDate,
        getUpcomingEvents
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}; 