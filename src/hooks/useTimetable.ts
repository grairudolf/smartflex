import { useState, useEffect } from 'react';
import { Course, TimeSlot, DAYS, TIME_SLOTS } from '@/types/timetable';

const STORAGE_KEY = 'smartflex-timetable';

interface TimetableData {
  courses: Course[];
  slots: TimeSlot[];
}

export const useTimetable = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  // Initialize slots on first load
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data: TimetableData = JSON.parse(savedData);
      setCourses(data.courses || []);
      setSlots(data.slots || []);
    } else {
      // Create empty slots
      const initialSlots: TimeSlot[] = [];
      DAYS.forEach((day) => {
        TIME_SLOTS.forEach((time) => {
          initialSlots.push({
            id: `${day}-${time}`,
            day,
            startTime: time,
          });
        });
      });
      setSlots(initialSlots);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (slots.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ courses, slots }));
    }
  }, [courses, slots]);

  const addCourse = (course: Omit<Course, 'id'>) => {
    const newCourse = { ...course, id: Date.now().toString() };
    setCourses([...courses, newCourse]);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
    // Remove course from all slots
    setSlots(slots.map(s => s.courseId === id ? { ...s, courseId: undefined } : s));
  };

  const assignCourseToSlot = (courseId: string, slotId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    // Clear previous assignment of this course
    const updatedSlots = slots.map(s => 
      s.courseId === courseId ? { ...s, courseId: undefined } : s
    );

    // Assign to new slot(s) based on duration
    const slotIndex = updatedSlots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) return;

    for (let i = 0; i < course.duration && slotIndex + i < updatedSlots.length; i++) {
      const targetSlot = updatedSlots[slotIndex + i];
      if (targetSlot.day === slot.day && !targetSlot.courseId) {
        targetSlot.courseId = courseId;
      }
    }

    setSlots(updatedSlots);
  };

  const removeCourseFromSlot = (slotId: string) => {
    setSlots(slots.map(s => s.id === slotId ? { ...s, courseId: undefined } : s));
  };

  return {
    courses,
    slots,
    addCourse,
    updateCourse,
    deleteCourse,
    assignCourseToSlot,
    removeCourseFromSlot,
  };
};
