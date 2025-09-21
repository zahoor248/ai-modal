import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// @ts-ignore
import { jsPDF } from "jspdf";

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bookData, storyId } = await req.json();

    if (!bookData || !bookData.title) {
      return NextResponse.json({
        error: "Book data and title are required"
      }, { status: 400 });
    }

    // Get theme data
    const { data: themes } = await supabase
      .from('book_themes')
      .select('*');

    const currentTheme = themes?.find(t => t.id === bookData.theme_id);
    const coverTheme = themes?.find(t => t.id === bookData.cover_theme_id);

    // Create PDF
    const pdf = await generatePDF(bookData, currentTheme, coverTheme);

    // Save export record
    if (storyId) {
      await supabase
        .from('books')
        .upsert({
          user_id: user.id,
          story_id: storyId,
          title: bookData.title,
          subtitle: bookData.subtitle,
          author_name: bookData.author_name,
          isbn: bookData.isbn,
          dimensions: bookData.dimensions,
          theme_id: bookData.theme_id,
          cover_theme_id: bookData.cover_theme_id,
          total_pages: bookData.pages?.length || 0,
          status: 'exported',
          metadata: bookData.metadata
        });
    }

    // Return PDF as blob
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${sanitizeFilename(bookData.title)}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (err: any) {
    console.error('PDF Export Error:', err);
    return NextResponse.json(
      { error: err.message || "PDF generation failed" },
      { status: 500 }
    );
  }
}

async function generatePDF(bookData: any, currentTheme: any, coverTheme: any) {
  // Get page dimensions
  const dimensions = getPageDimensions(bookData.dimensions);
  
  // Create PDF with custom dimensions
  const pdf = new jsPDF({
    orientation: dimensions.width > dimensions.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: [dimensions.width, dimensions.height]
  });

  // Set initial font
  pdf.setFont('helvetica');

  let pageAdded = false;

  // Generate pages
  for (let i = 0; i < bookData.pages.length; i++) {
    const page = bookData.pages[i];
    
    if (pageAdded) {
      pdf.addPage();
    }
    pageAdded = true;

    // Apply theme styles
    const theme = page.page_type === 'cover' && coverTheme ? coverTheme : currentTheme;
    applyThemeStyles(pdf, theme, page.page_type);

    // Generate page content based on type
    switch (page.page_type) {
      case 'cover':
        generateCoverPage(pdf, bookData, page, dimensions);
        break;
      case 'content':
        generateContentPage(pdf, page, dimensions, i + 1);
        break;
      case 'end':
        generateEndPage(pdf, bookData, page, dimensions);
        break;
      default:
        generateContentPage(pdf, page, dimensions, i + 1);
    }
  }

  return pdf;
}

function getPageDimensions(dimensionType: string) {
  switch (dimensionType) {
    case 'A4':
      return { width: 210, height: 297 };
    case 'Letter':
      return { width: 216, height: 279 };
    case '6x9':
      return { width: 152, height: 229 };
    case '8.5x11':
      return { width: 216, height: 279 };
    case '5x8':
      return { width: 127, height: 203 };
    case '7x10':
      return { width: 178, height: 254 };
    default:
      return { width: 210, height: 297 }; // A4 default
  }
}

function applyThemeStyles(pdf: any, theme: any, pageType: string) {
  if (!theme?.template_data) return;

  const data = theme.template_data;
  
  // Set background color if specified
  if (data.colors?.background && data.colors.background !== '#ffffff') {
    pdf.setFillColor(data.colors.background);
    pdf.rect(0, 0, pdf.internal.pageSize.width, pdf.internal.pageSize.height, 'F');
  }

  // Set text color
  if (data.colors?.text) {
    pdf.setTextColor(data.colors.text);
  } else if (data.colors?.primary) {
    pdf.setTextColor(data.colors.primary);
  }
}

function generateCoverPage(pdf: any, bookData: any, page: any, dimensions: any) {
  const pageWidth = dimensions.width;
  const pageHeight = dimensions.height;
  const margin = 20;

  // Title
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  const title = bookData.title || 'Book Title';
  const titleLines = pdf.splitTextToSize(title, pageWidth - (margin * 2));
  const titleHeight = titleLines.length * 10;
  pdf.text(titleLines, pageWidth / 2, pageHeight / 2 - titleHeight, { align: 'center' });

  // Subtitle
  if (bookData.subtitle) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    const subtitle = pdf.splitTextToSize(bookData.subtitle, pageWidth - (margin * 2));
    pdf.text(subtitle, pageWidth / 2, pageHeight / 2 + 20, { align: 'center' });
  }

  // Author
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`by ${bookData.author_name || 'Author'}`, pageWidth / 2, pageHeight - 40, { align: 'center' });
}

function generateContentPage(pdf: any, page: any, dimensions: any, pageNumber: number) {
  const pageWidth = dimensions.width;
  const pageHeight = dimensions.height;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let currentY = margin;

  // Page title
  if (page.title) {
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(page.title, pageWidth / 2, currentY + 10, { align: 'center' });
    currentY += 25;
  }

  // Content
  if (page.content) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const lines = pdf.splitTextToSize(page.content, contentWidth);
    const lineHeight = 6;
    const maxLines = Math.floor((pageHeight - currentY - 30) / lineHeight);
    
    // Take only the lines that fit on the page
    const contentLines = lines.slice(0, maxLines);
    
    contentLines.forEach((line: string, index: number) => {
      pdf.text(line, margin, currentY + (index * lineHeight));
    });
  }

  // Page number
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const isEvenPage = pageNumber % 2 === 0;
  pdf.text(
    pageNumber.toString(), 
    isEvenPage ? margin : pageWidth - margin, 
    pageHeight - 10,
    { align: isEvenPage ? 'left' : 'right' }
  );
}

function generateEndPage(pdf: any, bookData: any, page: any, dimensions: any) {
  const pageWidth = dimensions.width;
  const pageHeight = dimensions.height;
  const margin = 20;

  // End page title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(page.title || 'The End', pageWidth / 2, pageHeight / 2 - 40, { align: 'center' });

  // Content
  if (page.content) {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    const contentLines = pdf.splitTextToSize(page.content, pageWidth - (margin * 2));
    pdf.text(contentLines, pageWidth / 2, pageHeight / 2 - 10, { align: 'center' });
  }

  // Book information
  let infoY = pageHeight - 80;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  if (bookData.title) {
    pdf.text(bookData.title, pageWidth / 2, infoY, { align: 'center' });
    infoY += 8;
  }

  if (bookData.author_name) {
    pdf.text(`by ${bookData.author_name}`, pageWidth / 2, infoY, { align: 'center' });
    infoY += 8;
  }

  if (bookData.isbn) {
    pdf.text(`ISBN: ${bookData.isbn}`, pageWidth / 2, infoY, { align: 'center' });
    infoY += 8;
  }

  if (bookData.metadata?.publisher) {
    pdf.text(bookData.metadata.publisher, pageWidth / 2, infoY, { align: 'center' });
    infoY += 8;
  }

  if (bookData.metadata?.copyright) {
    pdf.text(`© ${bookData.metadata.copyright}`, pageWidth / 2, infoY, { align: 'center' });
  }

  // Simple barcode representation
  if (bookData.metadata?.include_barcode && bookData.isbn) {
    pdf.setFontSize(8);
    pdf.setFont('courier', 'normal');
    pdf.text(`||| ||| ||| ${bookData.isbn} ||| ||| |||`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  }
}

function sanitizeFilename(filename: string): string {
  if (!filename) return 'book';
  
  return filename
    .replace(/[^a-zA-Z0-9\-_\s]/g, '') // Remove special chars
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .substring(0, 100) // Limit length
    .toLowerCase() || 'book'; // Fallback
}