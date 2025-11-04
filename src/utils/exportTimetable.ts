import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (elementId: string, filename = 'timetable.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(filename);
};

export const exportToImage = async (elementId: string, filename = 'timetable.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};
