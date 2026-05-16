import type { UiLabels } from "./i18n";
import type { ScheduleEntry } from "./schedule";
import type { MedicationInfo } from "./types";
import { normalizeForAccessibleDisplay } from "@/utils/parsePrescription";

type PdfOptions = {
  info: MedicationInfo;
  labels: UiLabels;
  scheduleEntries: ScheduleEntry[];
  translatedInfo?: MedicationInfo | null;
  translationWarning?: string;
};

type PdfCard = {
  medicationName: string;
  strength: string;
  form: string;
  patient?: string;
  pharmacy?: string;
  prescriber?: string;
  rxNumber?: string;
  date?: string;
  quantity: string;
  refills: string;
  directions: string;
  warnings: string;
};

const pageWidth = 1275;
const pageHeight = 1650;
const margin = 88;

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (context.measureText(word).width > maxWidth) {
      if (line) {
        lines.push(line);
        line = "";
      }

      let segment = "";
      for (const character of Array.from(word)) {
        const testSegment = `${segment}${character}`;
        if (context.measureText(testSegment).width <= maxWidth) {
          segment = testSegment;
        } else {
          if (segment) lines.push(segment);
          segment = character;
        }
      }
      if (segment) line = segment;
      continue;
    }

    const test = line ? `${line} ${word}` : word;
    if (context.measureText(test).width <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function makePage() {
  const canvas = document.createElement("canvas");
  canvas.width = pageWidth;
  canvas.height = pageHeight;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, pageWidth, pageHeight);
  context.fillStyle = "#111827";
  context.textBaseline = "top";

  return { canvas, context };
}

function buildCanvasPages({ info, labels, scheduleEntries, translatedInfo, translationWarning }: PdfOptions) {
  const pages: HTMLCanvasElement[] = [];
  let { canvas, context } = makePage();
  let y = margin;

  const newPage = () => {
    pages.push(canvas);
    const page = makePage();
    canvas = page.canvas;
    context = page.context;
    y = margin;
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - margin) {
      newPage();
    }
  };

  const drawText = (text: string, size: number, weight = "400", gap = 18) => {
    context.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
    const lines = wrapText(context, text || labels.checkOriginalLabel, pageWidth - margin * 2);
    const lineHeight = Math.round(size * 1.25);
    ensureSpace(lines.length * lineHeight + gap);
    for (const line of lines) {
      context.fillText(line, margin, y);
      y += lineHeight;
    }
    y += gap;
  };

  const drawPair = (label: string, value: string, normalize = false) => {
    drawText(label, 34, "700", 5);
    const displayValue = value ? (normalize ? normalizeForAccessibleDisplay(value) : value) : labels.uncertainField;
    drawText(displayValue, 42, "400", 22);
  };

  const drawCard = (title: string, card: PdfCard, entries: ScheduleEntry[], normalize = true) => {
    drawText(title, 42, "700", 24);
    drawPair(labels.medication, card.medicationName, normalize);
    drawPair(labels.strength, card.strength, normalize);
    drawPair(labels.form, card.form, normalize);
    drawPair(labels.patient, card.patient ?? "");
    drawPair(labels.pharmacy, card.pharmacy ?? "");
    drawPair(labels.prescriber, card.prescriber ?? "");
    drawPair(labels.rxNumber, card.rxNumber ?? "");
    drawPair(labels.date, card.date ?? "");
    drawPair(labels.quantity, card.quantity, normalize);
    drawPair(labels.refills, card.refills, normalize);
    drawPair(labels.directionsFromLabel, card.directions, normalize);
    drawPair(labels.warningOrCautionText, card.warnings, normalize);

    drawText(labels.scheduleHelper, 42, "700", 12);
    for (const entry of entries) {
      drawText(entry.text, 34, "700", 8);
    }
  };

  drawText("ReadableRx", 58, "700", 10);
  drawCard(translatedInfo ? "Original medication card" : labels.accessibleMedicationCard, info, scheduleEntries);

  if (translatedInfo) {
    drawText(translationWarning ?? "", 36, "700", 18);
    drawCard("Translated medication card", translatedInfo, [], false);
  }

  drawText(labels.importantSafetyNotice, 42, "700", 12);
  drawText(labels.safetyBody, 32, "400", 10);
  drawText(labels.safetyVerify, 32, "700", 18);
  drawText(`${labels.dateGenerated}: ${new Date().toLocaleString()}`, 30, "400", 0);

  pages.push(canvas);
  return pages;
}

function binaryFromBase64(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function asciiBytes(text: string) {
  const bytes = new Uint8Array(text.length);
  for (let index = 0; index < text.length; index += 1) {
    bytes[index] = text.charCodeAt(index) & 0xff;
  }
  return bytes;
}

function concatBytes(chunks: Uint8Array[]) {
  const length = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function imageToPdf(images: Uint8Array[]) {
  const chunks: Uint8Array[] = [asciiBytes("%PDF-1.4\n")];
  const offsets: number[] = [0];
  let byteLength = chunks[0].length;

  const appendObject = (id: number, parts: Uint8Array[]) => {
    offsets[id] = byteLength;
    const objectBytes = concatBytes([asciiBytes(`${id} 0 obj\n`), ...parts, asciiBytes("\nendobj\n")]);
    chunks.push(objectBytes);
    byteLength += objectBytes.length;
  };

  const pageCount = images.length;
  const catalogId = 1;
  const pagesId = 2;
  const firstPageId = 3;
  const pageIds = images.map((_, index) => firstPageId + index * 3);

  appendObject(catalogId, [asciiBytes("<< /Type /Catalog /Pages 2 0 R >>")]);
  appendObject(pagesId, [
    asciiBytes(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageCount} >>`)
  ]);

  images.forEach((image, index) => {
    const pageId = firstPageId + index * 3;
    const contentId = pageId + 1;
    const imageId = pageId + 2;
    const drawCommand = `q\n612 0 0 792 0 0 cm\n/Im${index} Do\nQ`;

    appendObject(pageId, [
      asciiBytes(
        `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /XObject << /Im${index} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`
      )
    ]);
    appendObject(contentId, [asciiBytes(`<< /Length ${drawCommand.length} >>\nstream\n${drawCommand}\nendstream`)]);
    appendObject(imageId, [
      asciiBytes(
        `<< /Type /XObject /Subtype /Image /Width ${pageWidth} /Height ${pageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`
      ),
      image,
      asciiBytes("\nendstream")
    ]);
  });

  const xrefOffset = byteLength;
  const objectCount = firstPageId + pageCount * 3;
  let xref = `xref\n0 ${objectCount}\n0000000000 65535 f \n`;
  for (let id = 1; id < objectCount; id += 1) {
    xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  chunks.push(asciiBytes(xref));

  return new Blob([concatBytes(chunks)], { type: "application/pdf" });
}

export function downloadMedicationCardPdf(options: PdfOptions) {
  const pages = buildCanvasPages(options);
  const images = pages.map((page) => binaryFromBase64(page.toDataURL("image/jpeg", 0.92).split(",")[1]));
  const blob = imageToPdf(images);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const medication = options.info.medicationName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "medication-card";
  link.href = url;
  link.download = options.translatedInfo
    ? `ReadableRx-${medication}-original-and-translated.pdf`
    : `ReadableRx-${medication}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
