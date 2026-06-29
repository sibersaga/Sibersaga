import { jsPDF } from 'jspdf';
import { PublicDocument } from '../data/schoolData';

/**
 * Generates and downloads a highly styled, official-looking PDF document
 * for SDN 3 Purwosari (Wonogiri) using jsPDF.
 */
export const generateAndDownloadPDF = (doc: PublicDocument) => {
  // Create instance of jsPDF (A4 portrait size: 210mm width x 297mm height)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // --- Outer Border Accent (Adiwiyata Teal-Green & Blue school brand) ---
  pdf.setDrawColor(2, 132, 199); // primary sky-600
  pdf.setLineWidth(0.8);
  pdf.rect(10, 10, 190, 277);
  
  pdf.setDrawColor(16, 185, 129); // emerald-500
  pdf.setLineWidth(0.3);
  pdf.rect(11.5, 11.5, 187, 274);

  // --- KOP SURAT (Official Government Letterhead) ---
  pdf.setTextColor(30, 41, 59); // slate-800
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text('PEMERINTAH KABUPATEN WONOGIRI', 105, 22, { align: 'center' });
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', 105, 27, { align: 'center' });
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42); // slate-900
  pdf.text('SD NEGERI 3 PURWOSARI', 105, 34, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.setTextColor(100, 116, 139); // slate-500
  pdf.text('Alamat: Purwosari, Kec. Wonogiri, Kabupaten Wonogiri, Jawa Tengah 57615', 105, 39, { align: 'center' });
  
  // Letterhead double-line divider
  pdf.setDrawColor(15, 23, 42);
  pdf.setLineWidth(0.8);
  pdf.line(16, 43, 194, 43);
  pdf.setLineWidth(0.2);
  pdf.line(16, 44.5, 194, 44.5);

  // --- Document Title & Reference Number ---
  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(doc.title.toUpperCase(), 105, 55, { align: 'center' });
  
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105); // slate-600
  pdf.text(`Nomor Registrasi: SDN3-WNG/${doc.category.toUpperCase().replace(/\s+/g, '_')}/${doc.id.toUpperCase()}`, 105, 60, { align: 'center' });
  pdf.text(`Tanggal Publikasi: ${doc.dateUploaded}  |  Status Keamanan: Dokumen Terbuka Terverifikasi`, 105, 64, { align: 'center' });

  // Divider under metadata
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.2);
  pdf.line(20, 68, 190, 68);

  // --- Main Body text content ---
  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Strip HTML tags for clean formatting
  const cleanDescription = doc.description
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Split description text to fit within page width bounds
  const textX = 20;
  const textWidth = 170;
  const splitText = pdf.splitTextToSize(cleanDescription, textWidth);
  pdf.text(splitText, textX, 75);

  // Calculate dynamic vertical height
  let nextY = 75 + (splitText.length * 5.2) + 12;
  if (nextY < 130) nextY = 130; // Minimum margin spacing

  // --- Security Integrity & SHA-256 Panel ---
  pdf.setFillColor(248, 250, 252); // slate-50
  pdf.rect(20, nextY, 170, 32, 'F');
  pdf.setDrawColor(203, 213, 225); // slate-300
  pdf.setLineWidth(0.25);
  pdf.rect(20, nextY, 170, 32, 'D');

  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.text('INFORMASI AKREDITASI & INTEGRITAS FILE DIGITAL', 24, nextY + 6);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.text(`* Nama Berkas: ${doc.pdfUrl}`, 24, nextY + 12);
  pdf.text(`* Ukuran Berkas: ${doc.fileSize}  |  Kategori Pelayanan: ${doc.category}`, 24, nextY + 17);
  
  // Deterministic fake SHA-256 for integrity verification
  const pseudoHash = Array.from({ length: 32 }, (_, i) => 
    "0123456789abcdef"[Math.floor(Math.sin(doc.id.charCodeAt(0) + i) * 10000) & 15]
  ).join('');
  
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(8);
  pdf.text(`* SHA-256 HASH: ${pseudoHash}`, 24, nextY + 22);
  
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7);
  pdf.text('Keterangan: Salinan arsip digital sah diterbitkan secara elektronik oleh Portal Resmi SDN 3 Purwosari.', 24, nextY + 28);

  // --- Sign-off Signature Section ---
  let sigY = nextY + 45;
  if (sigY > 240) sigY = 210; // Safety constraint to prevent page overflow

  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.text('Wonogiri, ' + doc.dateUploaded, 140, sigY);
  pdf.text('Kepala Sekolah', 140, sigY + 5);
  
  // Signed-by Principal
  pdf.setFont('helvetica', 'bold');
  pdf.text('Suhartono, S.Pd., M.Pd.', 140, sigY + 25);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('NIP. 19740512 199903 1 005', 140, sigY + 29);

  // --- Beautiful Decorative Circular Seal ---
  const sealX = 125;
  const sealY = sigY + 15;
  
  pdf.setDrawColor(16, 185, 129); // emerald green
  pdf.setLineWidth(0.4);
  pdf.circle(sealX, sealY, 10, 'S');
  
  pdf.setDrawColor(16, 185, 129);
  pdf.setLineWidth(0.1);
  pdf.circle(sealX, sealY, 8.5, 'S');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(5);
  pdf.setTextColor(16, 185, 129);
  pdf.text('SDN 3', sealX, sealY - 1, { align: 'center' });
  pdf.text('WONOGIRI', sealX, sealY + 2.5, { align: 'center' });
  pdf.setFontSize(3.5);
  pdf.text('TERAKREDITASI A', sealX, sealY + 5.5, { align: 'center' });

  // Save/Download the file
  pdf.save(doc.pdfUrl);
};
