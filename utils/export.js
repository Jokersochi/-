/**
 * Export Utilities
 * Export generations in various formats
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

/**
 * Download single image
 */
export async function downloadImage(url, filename = 'design.jpg') {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    saveAs(blob, filename);
  } catch (error) {
    console.error('Failed to download image:', error);
    throw error;
  }
}

/**
 * Download multiple images as ZIP
 */
export async function downloadAsZip(images, zipName = 'designs.zip') {
  try {
    const zip = new JSZip();
    const folder = zip.folder('designs');

    // Add each image to ZIP
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const response = await fetch(image.url);
      const blob = await response.blob();
      const filename = image.name || `design-${i + 1}.jpg`;
      folder.file(filename, blob);
    }

    // Generate ZIP file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipName);
  } catch (error) {
    console.error('Failed to create ZIP:', error);
    throw error;
  }
}

/**
 * Generate PDF report
 */
export async function generatePDFReport(data) {
  try {
    // This would integrate with a PDF library like jsPDF or PDFKit
    // For now, we'll create a simple HTML-based approach
    
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('RoomGenius AI - Design Report', 20, 20);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);

    // Add user info
    doc.setFontSize(12);
    doc.text(`User: ${data.userName}`, 20, 40);
    doc.text(`Email: ${data.userEmail}`, 20, 47);

    // Add statistics
    doc.text('Statistics:', 20, 60);
    doc.setFontSize(10);
    doc.text(`Total Generations: ${data.totalGenerations}`, 25, 68);
    doc.text(`Favorite Style: ${data.favoriteStyle}`, 25, 75);
    doc.text(`Total Credits Used: ${data.creditsUsed}`, 25, 82);

    // Add images (thumbnail size)
    let yPos = 95;
    for (const generation of data.generations.slice(0, 5)) {
      if (yPos > 250) break; // Page limit

      try {
        const img = await loadImage(generation.imageUrl);
        doc.addImage(img, 'JPEG', 20, yPos, 60, 40);
        doc.text(`Style: ${generation.style}`, 90, yPos + 10);
        doc.text(`Created: ${new Date(generation.createdAt).toLocaleDateString()}`, 90, yPos + 18);
        yPos += 50;
      } catch (error) {
        console.error('Failed to add image to PDF:', error);
      }
    }

    // Save PDF
    doc.save('roomgenius-report.pdf');
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}

/**
 * Load image as base64
 */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Export collection as CSV
 */
export function exportToCSV(data, filename = 'data.csv') {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row =>
    Object.values(row)
      .map(value => `"${value}"`)
      .join(',')
  );
  
  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  saveAs(blob, filename);
}

/**
 * Share to social media
 */
export function shareToSocial(platform, data) {
  const { title, text, url, imageUrl } = data;
  
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(text)}`,
    vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&image=${encodeURIComponent(imageUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
  };

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}
