import type { MedicationInfo } from "./types";
import type { UiLabels } from "./i18n";
import { normalizeForAccessibleDisplay, parsePrescription } from "@/utils/parsePrescription";

export const parseMedicationText = parsePrescription;

export function buildReadAloudText(info: MedicationInfo, labels: UiLabels) {
  return [
    "Readable R X.",
    info.medicationName && `${labels.medication}: ${normalizeForAccessibleDisplay(info.medicationName)}.`,
    info.strength && `${labels.strength}: ${info.strength}.`,
    info.form && `${labels.form}: ${normalizeForAccessibleDisplay(info.form)}.`,
    info.patient && `${labels.patient}: ${info.patient}.`,
    info.directions && `${labels.directionsFromLabel}: ${normalizeForAccessibleDisplay(info.directions)}.`,
    info.warnings && `${labels.warningOrCautionText}: ${normalizeForAccessibleDisplay(info.warnings)}.`,
    labels.safetyVerify
  ]
    .filter(Boolean)
    .join(" ");
}
