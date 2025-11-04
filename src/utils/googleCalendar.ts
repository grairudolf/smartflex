import { Course, TimeSlot, DAYS } from '@/types/timetable';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  description: string;
}

const getDayOfWeek = (day: string): number => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days.indexOf(day);
};

const getNextDate = (dayOfWeek: number): Date => {
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntilTarget = (dayOfWeek - currentDay + 7) % 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntilTarget);
  return targetDate;
};

export const createCalendarEvents = (courses: Course[], slots: TimeSlot[]): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  
  const assignedSlots = slots.filter(s => s.courseId);
  
  // Group consecutive slots for the same course on the same day
  const groupedSlots: { [key: string]: TimeSlot[] } = {};
  
  assignedSlots.forEach(slot => {
    const key = `${slot.day}-${slot.courseId}`;
    if (!groupedSlots[key]) {
      groupedSlots[key] = [];
    }
    groupedSlots[key].push(slot);
  });
  
  Object.values(groupedSlots).forEach(slotGroup => {
    if (slotGroup.length === 0) return;
    
    const firstSlot = slotGroup[0];
    const course = courses.find(c => c.id === firstSlot.courseId);
    if (!course) return;
    
    const dayOfWeek = getDayOfWeek(firstSlot.day);
    const startDate = getNextDate(dayOfWeek);
    startDate.setHours(firstSlot.startTime, 0, 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(firstSlot.startTime + course.duration, 0, 0, 0);
    
    events.push({
      title: course.name,
      start: startDate,
      end: endDate,
      description: `Lecturer: ${course.lecturer}`
    });
  });
  
  return events;
};

export const exportToGoogleCalendar = (courses: Course[], slots: TimeSlot[]) => {
  const events = createCalendarEvents(courses, slots);
  
  if (events.length === 0) {
    throw new Error('No events to export');
  }
  
  // Create the first event and open Google Calendar
  const firstEvent = events[0];
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: firstEvent.title,
    dates: `${formatDate(firstEvent.start)}/${formatDate(firstEvent.end)}`,
    details: firstEvent.description,
    recur: 'RRULE:FREQ=WEEKLY;COUNT=15' // Repeat for 15 weeks
  });
  
  const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
  window.open(url, '_blank');
};
