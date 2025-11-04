import { useState } from 'react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Download, Share2, FileImage, FileText, Calendar, Sparkles } from 'lucide-react';
import { exportToPDF, exportToImage } from '@/utils/exportTimetable';
import { generateShareableLink, copyToClipboard } from '@/utils/shareTimetable';
import { exportToGoogleCalendar } from '@/utils/googleCalendar';
import { Course, TimeSlot } from '@/types/timetable';
import { useToast } from '@/hooks/use-toast';

interface ExportShareMenuProps {
  courses: Course[];
  slots: TimeSlot[];
  onAISuggest: () => void;
}

export const ExportShareMenu = ({ courses, slots, onAISuggest }: ExportShareMenuProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportToPDF('timetable-grid', 'my-timetable.pdf');
      toast({
        title: 'Exported successfully',
        description: 'Your timetable has been saved as PDF',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export timetable as PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportToImage('timetable-grid', 'my-timetable.png');
      toast({
        title: 'Exported successfully',
        description: 'Your timetable has been saved as PNG',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export timetable as image',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      const link = generateShareableLink(courses, slots);
      const success = await copyToClipboard(link);
      
      if (success) {
        toast({
          title: 'Link copied!',
          description: 'Share this link to let others view your timetable',
        });
      } else {
        toast({
          title: 'Failed to copy',
          description: 'Please try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to generate link',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleCalendar = () => {
    try {
      exportToGoogleCalendar(courses, slots);
      toast({
        title: 'Opening Google Calendar',
        description: 'Add events to your calendar',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error instanceof Error ? error.message : 'Failed to export to Google Calendar',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={onAISuggest}
        variant="secondary"
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        AI Suggest
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleExportPDF} disabled={isExporting}>
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportImage} disabled={isExporting}>
            <FileImage className="h-4 w-4 mr-2" />
            Export as Image
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleGoogleCalendar}>
            <Calendar className="h-4 w-4 mr-2" />
            Add to Google Calendar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleShare} variant="outline" className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
};
