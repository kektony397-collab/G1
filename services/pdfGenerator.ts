import { Trip, LocationPoint } from '../types';

declare const jspdf: any;

export const generateTripPdf = (trip: Trip): void => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  // Theme colors
  const primaryColor = '#4f46e5';
  const textColor = '#374151';
  const headerColor = '#111827';
  const mutedColor = '#6b7280';

  // Header
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, 210, 30, 'F');
  doc.setFontSize(22);
  doc.setTextColor('#FFFFFF');
  doc.setFont('helvetica', 'bold');
  doc.text('GeoLogger Pro Trip Report', 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(trip.name, 105, 24, { align: 'center' });

  // Summary section
  doc.setTextColor(headerColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Trip Summary', 14, 45);
  doc.setDrawColor(primaryColor);
  doc.line(14, 47, 196, 47);

  const avgSpeed = trip.distance > 0 && trip.duration > 0
    ? (trip.distance / (trip.duration / 3600)).toFixed(2)
    : '0.00';

  const summaryData = [
    { label: 'Date', value: new Date(trip.startTime).toLocaleDateString() },
    { label: 'Start Time', value: new Date(trip.startTime).toLocaleTimeString() },
    { label: 'End Time', value: new Date(trip.endTime).toLocaleTimeString() },
    { label: 'Duration', value: `${(trip.duration / 60).toFixed(2)} minutes` },
    { label: 'Total Distance', value: `${trip.distance.toFixed(3)} km` },
    { label: 'Average Speed', value: `${avgSpeed} km/h` },
    { label: 'Area Covered', value: `${(trip.area / 1000000).toFixed(6)} sq. km` },
    { label: 'Start Location', value: trip.startLocation || 'N/A' },
    { label: 'End Location', value: trip.endLocation || 'N/A' },
  ];

  let yPos = 55;
  doc.setFontSize(12);
  summaryData.forEach(item => {
    // Prevent long location names from overflowing
    const valueLines = doc.splitTextToSize(item.value, 140); 
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(item.label + ':', 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(mutedColor);
    doc.text(valueLines, 50, yPos);
    yPos += (valueLines.length * 6) + 2; // Adjust yPos based on number of lines
  });

  // Data Points Table
  doc.setTextColor(headerColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Recorded Data Points', 14, yPos + 5);
  doc.setDrawColor(primaryColor);
  doc.line(14, yPos + 7, 196, yPos + 7);
  
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
    startY: yPos + 10,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: '#FFFFFF',
      fontStyle: 'bold',
    },
    styles: {
      cellPadding: 2,
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: '#f3f4f6',
    },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(mutedColor);
    doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: 'center' });
    doc.text(`Report generated on ${new Date().toLocaleString()}`, 14, 287);
  }
  
  doc.save(`GeoLogger-Report-${trip.name.replace(/\s+/g, '-')}.pdf`);
};