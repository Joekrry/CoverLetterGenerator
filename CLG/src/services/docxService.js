import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generate DOCX from cover letter content
 * @param {string} content - The cover letter content
 * @param {string} filename - Name for the downloaded DOCX file
 */
export const generateDOCXFromText = async (content, filename = 'cover-letter.docx') => {
  try {
    // Split content into paragraphs (by double newlines or single newlines)
    const paragraphs = content
      .split(/\n\s*\n/) // Split by double newlines first
      .filter(p => p.trim().length > 0)
      .map(paragraph => {
        // Split each paragraph by single newlines to handle line breaks
        const lines = paragraph.split('\n').filter(line => line.trim().length > 0);
        
        if (lines.length === 0) return null;
        
        // First line might be a heading (if it's short and doesn't end with punctuation)
        const firstLine = lines[0].trim();
        const isHeading = firstLine.length < 100 && !firstLine.match(/[.!?]$/);
        
        if (isHeading && lines.length > 1) {
          // Create heading paragraph
          const heading = new Paragraph({
            text: firstLine,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 },
          });
          
          // Create body paragraphs from remaining lines
          const bodyParagraphs = lines.slice(1).map(line => 
            new Paragraph({
              children: [new TextRun(line.trim())],
              spacing: { after: 120 },
            })
          );
          
          return [heading, ...bodyParagraphs];
        } else {
          // Regular paragraph - combine lines with line breaks
          const textRuns = lines.map((line, index) => 
            new TextRun({
              text: line.trim(),
              break: index < lines.length - 1 ? 1 : 0, // Add line break except for last line
            })
          );
          
          return new Paragraph({
            children: textRuns,
            spacing: { after: 120 },
          });
        }
      })
      .flat()
      .filter(p => p !== null);

    // If no paragraphs were created, create a single paragraph with all content
    if (paragraphs.length === 0) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(content)],
        })
      );
    }

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Generate and save the DOCX file
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    
    return doc;
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX. Please try again.');
  }
};

/**
 * Generate DOCX with better formatting for cover letters
 * @param {string} content - The cover letter content
 * @param {string} filename - Name for the downloaded DOCX file
 * @param {Object} options - Additional options
 */
export const generateDOCXFromContent = async (
  content, 
  filename = 'cover-letter.docx',
  options = {}
) => {
  try {
    const {
      includeDate = false,
      includeSignature = true,
    } = options;

    const paragraphs = [];

    // Add date if requested
    if (includeDate) {
      const date = new Date().toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      paragraphs.push(
        new Paragraph({
          text: date,
          alignment: AlignmentType.RIGHT,
          spacing: { after: 400 },
        })
      );
    }

    // Process content into paragraphs
    const contentLines = content.split('\n').filter(line => line.trim().length > 0);
    
    contentLines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return;
      
      // Check if it's a greeting or closing (common patterns)
      const isGreeting = /^(Dear|Hello|Hi|To)\s+/i.test(trimmedLine);
      const isClosing = /^(Sincerely|Best regards|Regards|Yours sincerely|Thank you)/i.test(trimmedLine);
      
      if (isGreeting) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(trimmedLine)],
            spacing: { before: 0, after: 200 },
          })
        );
      } else if (isClosing) {
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(trimmedLine)],
            spacing: { before: 400, after: 200 },
          })
        );
      } else {
        // Regular paragraph
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(trimmedLine)],
            spacing: { after: 200 },
          })
        );
      }
    });

    // Add signature line if requested
    if (includeSignature && !contentLines.some(line => /^(Sincerely|Best regards|Regards)/i.test(line.trim()))) {
      paragraphs.push(
        new Paragraph({
          text: 'Sincerely,',
          spacing: { before: 400, after: 400 },
        })
      );
    }

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,    // 1 inch in twips (20th of a point)
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate and save the DOCX file
    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    
    return doc;
  } catch (error) {
    console.error('Error generating DOCX:', error);
    throw new Error('Failed to generate DOCX. Please try again.');
  }
};

