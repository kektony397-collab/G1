import { Trip, LocationPoint } from '../types';

declare const jspdf: any;

export const generateTripPdf = (trip: Trip): void => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  
  // Corporate Style Color Palette
  const primaryColor = '#1e3a8a'; // A deep, corporate blue
  const secondaryColor = '#475569'; // Slate gray for secondary text
  const borderColor = '#e2e8f0'; // Light gray for borders
  const headerTextColor = '#ffffff';
  const bodyTextColor = '#1e293b'; // Very dark gray for body text

  // Constants
  const margin = 14;
  const headerHeight = 30;
  const footerHeight = 15;

  const addHeader = () => {
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(headerTextColor);
    doc.text('GeoLogger Pro', margin, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Trip Detail Report', margin, 23);
    doc.setFont('helvetica', 'bold');
    const tripNameText = doc.splitTextToSize(trip.name, 80);
    doc.text(tripNameText, pageWidth - margin, 16, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(trip.startTime).toLocaleDateString(), pageWidth - margin, 23, { align: 'right' });
  };
  
  const addFooter = (pageNumber: number, pageCount: number) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor);
    
    const footerY = pageHeight - footerHeight + 5;
    doc.setDrawColor(borderColor);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);
    
    doc.text(`GeoLogger Pro © ${new Date().getFullYear()}`, margin, footerY);

    const footerCredit = 'Created by Yash K Pathak';
    const textWidth = doc.getStringUnitWidth(footerCredit) * doc.getFontSize() / doc.internal.scaleFactor;
    doc.text(footerCredit, (pageWidth / 2) - (textWidth / 2), footerY);

    doc.text(`Page ${pageNumber} of ${pageCount}`, pageWidth - margin, footerY, { align: 'right' });
  };

  // --- START PAGE 1 CONTENT ---
  addHeader();

  let yPos = headerHeight + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(bodyTextColor);
  doc.text('Trip Overview', margin, yPos);
  yPos += 5;
  doc.setDrawColor(borderColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  const avgSpeed = trip.distance > 0 && trip.duration > 0 ? (trip.distance / (trip.duration / 3600)).toFixed(2) : '0.00';
  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h > 0 ? `${h}h ` : ''}${m > 0 ? `${m}m ` : ''}${s}s`;
  };

  // --- OVERVIEW IN COLUMNS ---
  const summaryCol1 = [
    { label: 'Total Distance:', value: `${trip.distance.toFixed(3)} km` },
    { label: 'Total Duration:', value: formatDuration(trip.duration) },
    { label: 'Average Speed:', value: `${avgSpeed} km/h` },
  ];
  const summaryCol2 = [
    { label: 'Start Time:', value: new Date(trip.startTime).toLocaleString() },
    { label: 'End Time:', value: new Date(trip.endTime).toLocaleString() },
    { label: 'Area Covered:', value: `${(trip.area / 1000000).toFixed(6)} sq. km` },
  ];
  
  doc.setFontSize(11);

  const drawSummaryColumn = (column: {label: string, value: string}[], x: number) => {
    let currentY = yPos;
    column.forEach(item => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(bodyTextColor);
      doc.text(item.label, x, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(secondaryColor);
      doc.text(item.value, x + 38, currentY);
      currentY += 8;
    });
    return currentY;
  };
  
  const y1 = drawSummaryColumn(summaryCol1, margin);
  const y2 = drawSummaryColumn(summaryCol2, pageWidth / 2);
  yPos = Math.max(y1, y2);
  
  // --- LOCATIONS (WRAPPED TEXT) ---
  const drawWrappedText = (label: string, value: string, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(bodyTextColor);
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(secondaryColor);
    const valueLines = doc.splitTextToSize(value, pageWidth - margin * 2 - 38);
    doc.text(valueLines, margin + 38, y);
    return y + valueLines.length * 5 + 3;
  };
  
  yPos = drawWrappedText('Start Location:', trip.startLocation || 'N/A', yPos);
  yPos = drawWrappedText('End Location:', trip.endLocation || 'N/A', yPos);
  yPos += 5;

  // --- DETAILED LOG TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(bodyTextColor);
  doc.text('Detailed Log', margin, yPos);
  yPos += 5;
  doc.setDrawColor(borderColor);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 2;

  const tableData = trip.path.map((point: LocationPoint, index: number) => [
    index + 1,
    point.lat.toFixed(6),
    point.lng.toFixed(6),
    point.speed ? `${(point.speed * 3.6).toFixed(2)} km/h` : 'N/A',
    new Date(point.timestamp).toLocaleTimeString(),
  ]);

  (doc as any).autoTable({
    head: [['#', 'Latitude', 'Longitude', 'Speed', 'Timestamp']],
    body: tableData,
    startY: yPos,
    theme: 'grid',
    margin: { left: margin, right: margin, bottom: footerHeight + 5 },
    headStyles: {
      fillColor: primaryColor,
      textColor: headerTextColor,
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      cellPadding: 2,
      fontSize: 9,
      textColor: bodyTextColor,
    },
    alternateRowStyles: {
      fillColor: '#f8fafc', // Very light gray
    },
  });

  // --- ADD HEADERS AND FOOTERS TO ALL PAGES ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Add header to all pages AFTER the first one
    if (i > 1) {
      addHeader();
    }
    addFooter(i, pageCount);
  }
  
  doc.save(`GeoLogger-Report-${trip.name.replace(/\s+/g, '-')}.pdf`);
};
