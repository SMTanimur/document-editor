import * as pdfjsLib from 'pdfjs-dist';
import * as mammoth from 'mammoth';

// Set workerSrc for pdfjs-dist using a hardcoded, known-good CDN path
// Using version 4.4.168 as an example - check cdnjs for the latest stable if needed.
const pdfjsVersion = '4.4.168'; 
const pdfWorkerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.mjs`; // Use .mjs

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

/**
 * Extracts text content from a PDF file.
 * @param file The PDF file object.
 * @returns A promise that resolves with the extracted text content.
 */
async function extractTextFromPDF(file: File): Promise<string> {
  // Ensure workerSrc is set (redundant if top-level works, safe fallback)
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      console.warn("Setting PDF worker source inside extract function.");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let textContent = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    // Join text items, potentially adding spaces or newlines as needed
    textContent += text.items.map((item: any) => item.str).join(' ') + '\n'; 
  }

  return textContent;
}

/**
 * Extracts text content from a DOCX file.
 * Note: Mammoth extracts content as HTML. This function extracts text from that HTML.
 *       For preserving formatting, you might want to use the raw HTML output.
 * @param file The DOCX file object.
 * @returns A promise that resolves with the extracted text content.
 */
async function extractTextFromDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  // const result = await mammoth.convertToHtml({ arrayBuffer }); // Use this for HTML
  return result.value; // The raw text
  // return result.value; // The HTML string - if using convertToHtml
}

/**
 * Extracts text from various file types (PDF, DOCX, TXT).
 * @param file The file object.
 * @returns A promise that resolves with the extracted text content.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
    return extractTextFromDocx(file);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return file.text();
  } else {
    throw new Error('Unsupported file type. Please select a PDF, DOCX, or TXT file.');
  }
} 