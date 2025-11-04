import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { Course } from '@/types/timetable';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AISuggestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  onApplySuggestions: (suggestions: any[]) => void;
}

export const AISuggestDialog = ({
  open,
  onOpenChange,
  courses,
  onApplySuggestions,
}: AISuggestDialogProps) => {
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (courses.length === 0) {
      toast({
        title: 'No courses',
        description: 'Please add some courses first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSuggestions(null);

    try {
      const { data, error } = await supabase.functions.invoke('suggest-schedule', {
        body: { courses, preferences },
      });

      if (error) throw error;

      if (data.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        toast({
          title: 'Suggestions generated!',
          description: `Found ${data.suggestions.length} scheduling suggestions`,
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI suggestion error:', error);
      toast({
        title: 'Failed to generate suggestions',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (suggestions) {
      onApplySuggestions(suggestions);
      onOpenChange(false);
      setSuggestions(null);
      setPreferences('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Schedule Suggestions
          </DialogTitle>
          <DialogDescription>
            Let AI help you create an optimal timetable based on your preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="preferences">Your Preferences (Optional)</Label>
            <Textarea
              id="preferences"
              placeholder="e.g., I prefer morning classes, need breaks between lectures, avoid Friday afternoons..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          {suggestions && suggestions.length > 0 && (
            <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-2">
              <p className="font-semibold text-sm">Suggested Schedule:</p>
              <div className="space-y-1 text-sm max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => {
                  const course = courses.find(c => c.id === suggestion.courseId);
                  return (
                    <div key={index} className="py-1 border-b border-border/50 last:border-0">
                      <span className="font-medium">{course?.name}</span>
                      <span className="text-muted-foreground">
                        {' '}- {suggestion.day} at {suggestion.startTime}:00
                      </span>
                      {suggestion.reason && (
                        <p className="text-xs text-muted-foreground mt-1">{suggestion.reason}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          {!suggestions ? (
            <Button onClick={handleGetSuggestions} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Suggestions
            </Button>
          ) : (
            <Button onClick={handleApply}>
              Apply Schedule
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
