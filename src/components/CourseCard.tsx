import { Course } from '@/types/timetable';
import { Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';

interface CourseCardProps {
  course: Course;
  index: number;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
}

export const CourseCard = ({ course, index, onEdit, onDelete, isDragging }: CourseCardProps) => {
  return (
    <Draggable draggableId={course.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group relative rounded-xl p-3 mb-2 transition-all border-2 border-transparent ${
            snapshot.isDragging 
              ? 'shadow-[hsl(var(--shadow-elevated))] scale-105 rotate-2 border-white/30' 
              : 'shadow-[hsl(var(--shadow-card))] hover:shadow-[hsl(var(--shadow-hover))] hover:scale-102'
          }`}
          style={{
            backgroundColor: course.color,
            ...provided.draggableProps.style,
          }}
        >
          <div className="flex items-start gap-2">
            <div
              {...provided.dragHandleProps}
              className="mt-1 cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-white/70" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white text-sm truncate">{course.name}</h4>
              <p className="text-xs text-white/80 truncate">{course.lecturer}</p>
              <p className="text-xs text-white/70 mt-1">{course.duration}h duration</p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => onEdit(course)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => onDelete(course.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
