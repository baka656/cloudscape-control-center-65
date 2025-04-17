// Add to utils/pdf.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ControlAssessment } from '@/services/aws-service';

export const generateValidationPDF = (
  submissionId: string,
  controls: ControlAssessment[]
) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(`Validation Report: ${submissionId}`, 14, 15);
  
  // Add summary
  doc.setFontSize(12);
  const passedControls = controls.filter(c => c.ControlPassFail === 'pass').length;
  const totalControls = controls.length;
  doc.text(
    `Summary: ${passedControls}/${totalControls} controls passed`, 
    14, 
    25
  );
  
  // Prepare table data
  const tableData = controls.map(control => [
    control.ControlID,
    control.ControlTitle,
    control.ControlStatus,
    `${(control.ConfidenceScore * 100).toFixed(1)}%`,
    control.ControlPassFail.toUpperCase(),
    control.ControlPassFailReason
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Control ID', 'Title', 'Status', 'Confidence', 'Result', 'Reason']],
    body: tableData,
    startY: 30,
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 40 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 20 },
      5: { cellWidth: 'auto' }
    }
  });
  
  return doc;
};
