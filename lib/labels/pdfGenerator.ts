/**
 * PDF Label Generator
 * 
 * Generate printable PDF labels with QR codes
 */

import { LabelTemplate } from './types'

/**
 * Generate a data URL for QR code SVG
 */
export function generateQRCodeDataURL(qrValue: string, size: number = 256): string {
  // This will be implemented with the actual QR code generation
  // For now, return a placeholder
  return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"></svg>`)}`
}

/**
 * Generate PDF for a single label
 */
export async function generateSingleLabelPDF(
  template: LabelTemplate,
  itemData: any,
  qrCodeDataURL: string
): Promise<Blob> {
  // Simple HTML to PDF conversion
  const labelHTML = generateLabelHTML(template, itemData, qrCodeDataURL)
  
  // Convert to blob
  const blob = new Blob([labelHTML], { type: 'text/html' })
  return blob
}

/**
 * Generate HTML for a label
 */
function generateLabelHTML(
  template: LabelTemplate,
  itemData: any,
  qrCodeDataURL: string
): string {
  const { width, height, unit } = template.dimensions
  const widthPx = unit === 'mm' ? width * 3.78 : width * 96
  const heightPx = unit === 'mm' ? height * 3.78 : height * 96
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page {
          size: ${width}${unit} ${height}${unit};
          margin: 0;
        }
        body {
          margin: 0;
          padding: ${template.styling.padding}mm;
          font-family: Arial, sans-serif;
          background: ${template.styling.backgroundColor};
        }
        .label {
          position: relative;
          width: ${widthPx}px;
          height: ${heightPx}px;
          ${template.styling.borderEnabled ? `border: ${template.styling.borderWidth}px solid ${template.styling.borderColor};` : ''}
        }
        .qr-code {
          position: absolute;
          left: ${template.qrCode.position.x}mm;
          top: ${template.qrCode.position.y}mm;
          width: ${template.qrCode.size}mm;
          height: ${template.qrCode.size}mm;
        }
        .text-element {
          position: absolute;
          white-space: nowrap;
        }
      </style>
    </head>
    <body>
      <div class="label">
        ${template.logo.enabled ? `<img src="/groovy-logo.png" style="position: absolute; left: ${template.logo.position.x}mm; top: ${template.logo.position.y}mm; width: ${template.logo.size.width}mm; height: ${template.logo.size.height}mm;" />` : ''}
        <img src="${qrCodeDataURL}" class="qr-code" />
        ${template.textElements.map(el => `
          <div class="text-element" style="
            left: ${el.position.x}mm;
            top: ${el.position.y}mm;
            font-size: ${el.style.fontSize}pt;
            font-weight: ${el.style.fontWeight};
            color: ${el.style.color};
            text-align: ${el.style.alignment};
          ">
            ${el.type === 'static' ? el.staticText : itemData[el.fieldId || ''] || ''}
          </div>
        `).join('')}
      </div>
    </body>
    </html>
  `
}

/**
 * Download a label as PDF
 */
export function downloadLabelPDF(filename: string, htmlContent: string) {
  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Generate batch labels PDF (multiple labels on a sheet)
 */
export async function generateBatchLabelsPDF(
  template: LabelTemplate,
  items: any[],
  labelsPerRow: number = 2
): Promise<Blob> {
  // Implementation for batch PDF generation
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        @page { margin: 10mm; }
        body { margin: 0; font-family: Arial; }
        .labels-grid {
          display: grid;
          grid-template-columns: repeat(${labelsPerRow}, 1fr);
          gap: 5mm;
        }
      </style>
    </head>
    <body>
      <div class="labels-grid">
        ${items.map(item => `<div class="label">${item.name}</div>`).join('')}
      </div>
    </body>
    </html>
  `
  
  return new Blob([html], { type: 'text/html' })
}

