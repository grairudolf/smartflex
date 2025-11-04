import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Course, COURSE_COLORS } from '@/types/timetable';

interface AddCourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (course: Omit<Course, 'id'>) => void;
  editCourse?: Course;
}

export const AddCourseModal = ({ open, onOpenChange, onSave, editCourse }: AddCourseModalProps) => {
  const [name, setName] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [duration, setDuration] = useState('1');
  const [color, setColor] = useState(COURSE_COLORS[0].value);

  useEffect(() => {
    if (editCourse) {
      setName(editCourse.name);
      setLecturer(editCourse.lecturer);
      setDuration(editCourse.duration.toString());
      setColor(editCourse.color);
    } else {
      setName('');
      setLecturer('');
      setDuration('1');
      setColor(COURSE_COLORS[0].value);
    }
  }, [editCourse, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      lecturer,
      duration: parseInt(duration),
      color,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                placeholder="e.g., Data Structures"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lecturer">Lecturer</Label>
              <Input
                id="lecturer"
                placeholder="e.g., Dr. Smith"
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h} hour{h > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="grid grid-cols-4 gap-2">
                {COURSE_COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    className={`h-10 rounded-md transition-transform ${
                      color === c.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setColor(c.value)}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editCourse ? 'Update' : 'Add'} Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
