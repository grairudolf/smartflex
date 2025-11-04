import { Course, TimeSlot, DAYS, TIME_SLOTS } from '@/types/timetable';
import { TimetableSlot } from './TimetableSlot';

interface TimetableGridProps {
  slots: TimeSlot[];
  courses: Course[];
  onRemoveCourse: (slotId: string) => void;
}

export const TimetableGrid = ({ slots, courses, onRemoveCourse }: TimetableGridProps) => {
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}${period}`;
  };

  const getSlot = (day: string, time: number) => {
    return slots.find(s => s.day === day && s.startTime === time);
  };

  const getCourse = (courseId?: string) => {
    return courses.find(c => c.id === courseId);
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[90px_repeat(6,minmax(140px,1fr))] gap-0 border-b-2 border-[hsl(var(--grid-line))] bg-muted/30">
          <div className="p-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground">Time</div>
          {DAYS.map((day) => (
            <div key={day} className="p-3 font-semibold text-sm text-center border-l border-[hsl(var(--grid-line))]">
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        {TIME_SLOTS.map((time) => (
          <div
            key={time}
            className="grid grid-cols-[90px_repeat(6,minmax(140px,1fr))] gap-0 border-b border-[hsl(var(--grid-line))] hover:bg-[hsl(var(--slot-hover))] transition-colors"
          >
            <div className="p-3 text-xs font-semibold text-[hsl(var(--time-label))] text-right pr-4 bg-muted/20">
              {formatTime(time)}
            </div>
            {DAYS.map((day) => {
              const slot = getSlot(day, time);
              const course = slot ? getCourse(slot.courseId) : undefined;
              return slot ? (
                <TimetableSlot
                  key={slot.id}
                  slot={slot}
                  course={course}
                  onRemove={onRemoveCourse}
                />
              ) : null;
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
