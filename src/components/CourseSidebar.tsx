import { Course } from '@/types/timetable';
import { CourseCard } from './CourseCard';
import { Button } from './ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { Droppable } from '@hello-pangea/dnd';

interface CourseSidebarProps {
  courses: Course[];
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export const CourseSidebar = ({ courses, onAddCourse, onEditCourse, onDeleteCourse }: CourseSidebarProps) => {
  return (
    <div className="w-full lg:w-80 bg-card border-r border-[hsl(var(--border))] p-4 lg:p-6 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <BookOpen className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-xl font-bold">Courses</h2>
        </div>
        <Button onClick={onAddCourse} size="sm" className="shadow-sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <Droppable droppableId="courses-list">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 overflow-y-auto space-y-2"
          >
            {courses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No courses yet</p>
                <p className="text-xs mt-1">Click "Add" to create your first course</p>
              </div>
            ) : (
              courses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  onEdit={onEditCourse}
                  onDelete={onDeleteCourse}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
