import type { MedicationInfo, PrescriptionField } from "@/lib/types";

const knownLabels = [
  "Medication",
  "Drug",
  "Medicine",
  "Rx",
  "Rx #",
  "Rx Number",
  "Patient",
  "Name",
  "Prescriber",
  "Doctor",
  "Provider",
  "Date",
  "Filled",
  "Qty",
  "Quantity",
  "Refills",
  "Refill",
  "Directions",
  "Instructions",
  "Sig",
  "Take",
  "Warning",
  "Warnings",
  "Caution"
];

const labelGroups = {
  medicationName: ["Medication", "Drug", "Medicine"],
  patient: ["Patient", "Name"],
  prescriber: ["Prescriber", "Doctor", "Provider"],
  rxNumber: ["Rx Number", "Rx #", "Rx"],
  date: ["Date", "Filled"],
  quantity: ["Quantity", "Qty"],
  refills: ["Refills", "Refill"],
  directions: ["Directions", "Instructions", "Sig", "Take"],
  warnings: ["Warning", "Warnings", "Caution"]
} satisfies Record<string, string[]>;

const formAliases: Record<string, string> = {
  tab: "tablet",
  tabs: "tablets",
  tablet: "tablet",
  tablets: "tablets",
  cap: "capsule",
  caps: "capsules",
  capsule: "capsule",
  capsules: "capsules",
  solution: "solution",
  suspension: "suspension",
  syrup: "syrup",
  inhaler: "inhaler",
  cream: "cream",
  ointment: "ointment",
  drops: "drops",
  patch: "patch",
  injection: "injection"
};

const formPattern = new RegExp(`\\b(${Object.keys(formAliases).join("|")})\\b`, "i");
const strengthPattern = /\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|mL|units?|%)(?:\s*\/\s*(?:\d+(?:\.\d+)?\s*)?(?:mg|mcg|g|ml|mL|units?|%))?(?=$|\s|[.,;)])/i;
const likelyNamePattern = /\b(?:amoxicillin|lisinopril|metformin|atorvastatin|levothyroxine|amlodipine|albuterol|insulin|prednisone|omeprazole|gabapentin|sertraline|losartan)\b/i;

function normalizeRawText(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/[|]/g, "I")
    .replace(/\u00a0/g, " ")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripLabel(line: string, labels: string[]) {
  for (const label of labels) {
    const escaped = escapeRegExp(label).replace(/\\ /g, "\\s*");
    const pattern = new RegExp(`^\\s*${escaped}\\s*(?:#|number|no\\.)?\\s*[:\\-]?\\s*(.+)$`, "i");
    const match = line.match(pattern);
    if (match?.[1]) {
      return cleanValue(match[1]);
    }
  }

  return "";
}

function startsWithKnownLabel(line: string) {
  return knownLabels.some((label) => {
    const escaped = escapeRegExp(label).replace(/\\ /g, "\\s*");
    return new RegExp(`^\\s*${escaped}\\s*(?:#|number|no\\.)?\\s*[:\\-]?`, "i").test(line);
  });
}

function cleanValue(value: string) {
  return value
    .replace(/^[#:\-\s]+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function linesFrom(text: string) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

function findLabeledValue(lines: string[], labels: string[], multiline = false) {
  for (let index = 0; index < lines.length; index += 1) {
    const value = stripLabel(lines[index], labels);
    if (!value) continue;

    if (!multiline) return value;

    const parts = [value];
    for (let next = index + 1; next < lines.length; next += 1) {
      if (startsWithKnownLabel(lines[next])) break;
      parts.push(lines[next]);
    }
    return cleanValue(parts.join(" "));
  }

  return "";
}

function findInline(pattern: RegExp, text: string) {
  return cleanValue(text.match(pattern)?.[1] ?? "");
}

function extractStrength(value: string) {
  return cleanValue(value.match(strengthPattern)?.[0] ?? "");
}

function extractForm(value: string) {
  return cleanValue(value.match(formPattern)?.[1] ?? "");
}

function stripStrengthAndForm(value: string, strength: string, form: string) {
  let output = value;
  if (strength) output = output.replace(strength, " ");
  if (form) output = output.replace(new RegExp(`\\b${escapeRegExp(form)}\\b`, "i"), " ");
  return cleanValue(output.replace(/\(\s*\)/g, ""));
}

function findPharmacy(lines: string[]) {
  const pharmacyLine = lines.find((line) => /\bpharmacy\b/i.test(line));
  if (pharmacyLine) return cleanValue(pharmacyLine);

  const candidate = lines.find(
    (line) =>
      /\b(rx|drug|patient|prescriber|doctor|date|filled|qty|quantity|refills|sig|directions|warning|caution)\b/i.test(
        line
      ) === false &&
      /[A-Za-z]/.test(line)
  );

  return candidate ?? "";
}

function findMedicationLine(lines: string[], explicitMedication: string) {
  if (explicitMedication) return explicitMedication;

  const candidate = lines.find((line) => {
    if (startsWithKnownLabel(line)) return false;
    if (/\b(take|use|apply|warning|caution|refills?|quantity|qty|patient|doctor|prescriber|pharmacy)\b/i.test(line)) {
      return false;
    }
    return strengthPattern.test(line) || likelyNamePattern.test(line);
  });

  return candidate ?? "";
}

function normalizeRxNumber(value: string) {
  return cleanValue(value.match(/[A-Z0-9][A-Z0-9-]*/i)?.[0] ?? value);
}

function normalizeQuantity(value: string) {
  return cleanValue(value.replace(/^(disp|dispense)\s*[:\-]?\s*/i, ""));
}

function normalizeRefills(value: string) {
  return cleanValue(value.replace(/^(remaining|left)\s*[:\-]?\s*/i, ""));
}

export function getUncertainPrescriptionFields(info: Omit<MedicationInfo, "uncertainFields">) {
  const fields: PrescriptionField[] = [
    "medicationName",
    "strength",
    "form",
    "patient",
    "pharmacy",
    "prescriber",
    "rxNumber",
    "date",
    "quantity",
    "refills",
    "directions",
    "warnings"
  ];

  return fields.filter((field) => !info[field]);
}

export function parsePrescription(rawText: string): MedicationInfo {
  const normalized = normalizeRawText(rawText);
  const lines = linesFrom(normalized);
  const fullText = lines.join("\n");

  const explicitMedication = findLabeledValue(lines, labelGroups.medicationName);
  const medicationLine = findMedicationLine(lines, explicitMedication);
  const strength = extractStrength(medicationLine);
  const form = extractForm(medicationLine);
  const medicationName = stripStrengthAndForm(medicationLine, strength, form);

  const directions =
    findLabeledValue(lines, labelGroups.directions, true) ||
    findInline(/\b(take\s+[^\n]+)/i, fullText);

  const warningText = findLabeledValue(lines, labelGroups.warnings, true);

  const parsedWithoutUncertainty = {
    medicationName,
    strength,
    form,
    patient: findLabeledValue(lines, labelGroups.patient),
    pharmacy: findPharmacy(lines),
    prescriber: findLabeledValue(lines, labelGroups.prescriber),
    rxNumber: normalizeRxNumber(findLabeledValue(lines, labelGroups.rxNumber) || findInline(/\bRx\s*#?\s*([A-Z0-9-]+)/i, fullText)),
    date: findLabeledValue(lines, labelGroups.date) || findInline(/\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})\b/, fullText),
    quantity: normalizeQuantity(findLabeledValue(lines, labelGroups.quantity) || findInline(/\b(?:qty|quantity)\s*[:#\-]?\s*([A-Z0-9 ./-]+)/i, fullText)),
    refills: normalizeRefills(findLabeledValue(lines, labelGroups.refills) || findInline(/\brefills?\s*[:#\-]?\s*([A-Z0-9 ./-]+)/i, fullText)),
    directions,
    warnings: warningText,
    rawText: normalized
  };

  return {
    ...parsedWithoutUncertainty,
    uncertainFields: getUncertainPrescriptionFields(parsedWithoutUncertainty)
  };
}

const accessibilityReplacements: Array<[RegExp, string | ((match: string) => string)]> = [
  [/\btabs?\b/gi, (match: string) => (match.toLowerCase() === "tab" ? "tablet" : "tablets")],
  [/\bcaps?\b/gi, (match: string) => (match.toLowerCase() === "cap" ? "capsule" : "capsules")],
  [/\bPO\b/g, "by mouth"],
  [/\bBID\b/g, "twice daily"],
  [/\bTID\b/g, "three times daily"],
  [/\bQID\b/g, "four times daily"],
  [/\bQD\b/g, "once daily"],
  [/\bPRN\b/g, "as needed"]
];

export function normalizeForAccessibleDisplay(value: string) {
  return accessibilityReplacements.reduce<string>((current, [pattern, replacement]) => {
    if (typeof replacement === "function") {
      return current.replace(pattern, replacement);
    }
    return current.replace(pattern, replacement);
  }, value);
}
