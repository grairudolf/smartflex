export interface Course {
  id: string;
  name: string;
  lecturer: string;
  color: string;
  duration: number; // in hours
}

export interface TimeSlot {
  id: string;
  day: string;
  startTime: number; // 24h format (7-21)
  courseId?: string;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 7); // 7AM to 7PM

export const COURSE_COLORS = [
  { name: 'Blue', value: 'hsl(var(--course-blue))' },
  { name: 'Teal', value: 'hsl(var(--course-teal))' },
  { name: 'Green', value: 'hsl(var(--course-green))' },
  { name: 'Orange', value: 'hsl(var(--course-orange))' },
  { name: 'Red', value: 'hsl(var(--course-red))' },
  { name: 'Purple', value: 'hsl(var(--course-purple))' },
  { name: 'Pink', value: 'hsl(var(--course-pink))' },
  { name: 'Yellow', value: 'hsl(var(--course-yellow))' },
];
