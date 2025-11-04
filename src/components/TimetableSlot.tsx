import { Course, TimeSlot } from '@/types/timetable';
import { Droppable } from '@hello-pangea/dnd';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface TimetableSlotProps {
  slot: TimeSlot;
  course?: Course;
  onRemove: (slotId: string) => void;
}

export const TimetableSlot = ({ slot, course, onRemove }: TimetableSlotProps) => {
  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <Droppable droppableId={slot.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`relative min-h-[60px] border border-[hsl(var(--grid-line))] p-1 transition-colors ${
            snapshot.isDraggingOver ? 'bg-[hsl(var(--slot-hover))] border-primary' : 'bg-card'
          }`}
        >
          {course ? (
            <div
              className="group relative h-full rounded p-2 shadow-sm"
              style={{ backgroundColor: course.color }}
            >
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
                onClick={() => onRemove(slot.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              <p className="font-medium text-white text-xs truncate pr-6">{course.name}</p>
              <p className="text-[10px] text-white/80 truncate">{course.lecturer}</p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
              {snapshot.isDraggingOver ? 'Drop here' : ''}
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
