import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from HTML element (frontend)
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - Name for the downloaded PDF file
 * @param {Object} options - Additional options for PDF generation
 */
export const generatePDFFromElement = async (element, filename = 'cover-letter.pdf', options = {}) => {
  try {
    // Default options
    const {
      format = 'a4',
      orientation = 'portrait',
      margin = 20,
      quality = 1.0,
    } = options;

    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png', quality);
    
    // Calculate dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // PDF dimensions in mm (A4)
    const pdfWidth = format === 'a4' ? 210 : 297; // A4 width in mm
    const pdfHeight = format === 'a4' ? 297 : 210; // A4 height in mm
    
    // Calculate scaling to fit page
    const ratio = Math.min(
      (pdfWidth - margin * 2) / (imgWidth * 0.264583), // Convert px to mm
      (pdfHeight - margin * 2) / (imgHeight * 0.264583)
    );
    
    const scaledWidth = imgWidth * 0.264583 * ratio;
    const scaledHeight = imgHeight * 0.264583 * ratio;
    
    // Center on page
    const xOffset = (pdfWidth - scaledWidth) / 2;
    const yOffset = margin;

    // Create PDF
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format,
    });

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

    // Save PDF
    pdf.save(filename);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

/**
 * Generate PDF from cover letter content (text-based)
 * @param {string} content - The cover letter content
 * @param {string} filename - Name for the downloaded PDF file
 */
export const generatePDFFromText = (content, filename = 'cover-letter.pdf') => {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Set font
    pdf.setFont('helvetica');
    pdf.setFontSize(11);

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;

    // Split content into lines
    const lines = pdf.splitTextToSize(content, maxWidth);
    
    let y = margin;
    const pageHeightLimit = pageHeight - margin;

    // Add text line by line
    lines.forEach((line) => {
      if (y + lineHeight > pageHeightLimit) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += lineHeight;
    });

    // Save PDF
    pdf.save(filename);
    
    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

