import { Course, TimeSlot } from '@/types/timetable';

export const generateShareableLink = (courses: Course[], slots: TimeSlot[]): string => {
  const data = {
    courses,
    slots: slots.filter(s => s.courseId) // Only include assigned slots
  };
  
  const encoded = btoa(JSON.stringify(data));
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?shared=${encoded}`;
};

export const loadSharedTimetable = (): { courses: Course[]; slots: TimeSlot[] } | null => {
  const params = new URLSearchParams(window.location.search);
  const shared = params.get('shared');
  
  if (!shared) return null;
  
  try {
    const decoded = atob(shared);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to load shared timetable:', error);
    return null;
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
