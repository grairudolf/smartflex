import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useTimetable } from '@/hooks/useTimetable';
import { TimetableGrid } from '@/components/TimetableGrid';
import { CourseSidebar } from '@/components/CourseSidebar';
import { AddCourseModal } from '@/components/AddCourseModal';
import { ExportShareMenu } from '@/components/ExportShareMenu';
import { AISuggestDialog } from '@/components/AISuggestDialog';
import { Course } from '@/types/timetable';
import { Calendar, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { loadSharedTimetable } from '@/utils/shareTimetable';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  const { courses, slots, addCourse, updateCourse, deleteCourse, assignCourseToSlot, removeCourseFromSlot } = useTimetable();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>();
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load shared timetable if present
  useEffect(() => {
    const sharedData = loadSharedTimetable();
    if (sharedData) {
      // Clear URL params after loading
      window.history.replaceState({}, '', window.location.pathname);
      toast({
        title: 'Timetable loaded',
        description: 'Shared timetable has been loaded successfully',
      });
    }
  }, []);

  const handleAddCourse = () => {
    setEditingCourse(undefined);
    setModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleSaveCourse = (courseData: Omit<Course, 'id'>) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
      toast({
        title: 'Course updated',
        description: `${courseData.name} has been updated successfully.`,
      });
    } else {
      addCourse(courseData);
      toast({
        title: 'Course added',
        description: `${courseData.name} has been added to your courses.`,
      });
    }
  };

  const handleDeleteCourse = (id: string) => {
    const course = courses.find(c => c.id === id);
    deleteCourse(id);
    toast({
      title: 'Course deleted',
      description: `${course?.name} has been removed.`,
      variant: 'destructive',
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    // Moving from courses list to timetable
    if (source.droppableId === 'courses-list' && destination.droppableId !== 'courses-list') {
      const courseId = result.draggableId;
      assignCourseToSlot(courseId, destination.droppableId);
      toast({
        title: 'Course scheduled',
        description: 'Course has been added to your timetable.',
      });
    }
  };

  const handleApplySuggestions = (suggestions: any[]) => {
    suggestions.forEach(suggestion => {
      const slotId = `${suggestion.day}-${suggestion.startTime}`;
      assignCourseToSlot(suggestion.courseId, slotId);
    });
    
    toast({
      title: 'Schedule applied',
      description: 'AI suggestions have been applied to your timetable',
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background">
      <DragDropContext onDragEnd={handleDragEnd}>
        <CourseSidebar
          courses={courses}
          onAddCourse={handleAddCourse}
          onEditCourse={handleEditCourse}
          onDeleteCourse={handleDeleteCourse}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b border-[hsl(var(--border))] p-4 lg:p-6 bg-card shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="SmartFlex Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    SmartFlex Timetable
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Drag courses from the sidebar to schedule them
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <ExportShareMenu
                  courses={courses}
                  slots={slots}
                  onAISuggest={() => setAiDialogOpen(true)}
                />
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            <div id="timetable-grid" className="bg-card rounded-xl shadow-sm border border-border p-4">
              <TimetableGrid
                slots={slots}
                courses={courses}
                onRemoveCourse={removeCourseFromSlot}
              />
            </div>
          </main>
        </div>
      </DragDropContext>

      <AddCourseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveCourse}
        editCourse={editingCourse}
      />
      
      <AISuggestDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        courses={courses}
        onApplySuggestions={handleApplySuggestions}
      />
    </div>
  );
};

export default Index;
