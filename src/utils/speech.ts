import type { MedicationInfo } from "@/lib/types";

export type SpeechLanguageCode = "en-US" | "es-ES" | "zh-CN" | "fr-FR" | "ar-SA" | "hi-IN" | "ko-KR" | "vi-VN";

export type SpeechLanguage = {
  code: SpeechLanguageCode;
  label: string;
};

export const speechLanguages: SpeechLanguage[] = [
  { code: "en-US", label: "English" },
  { code: "es-ES", label: "Spanish" },
  { code: "zh-CN", label: "Simplified Chinese" },
  { code: "fr-FR", label: "French" },
  { code: "ar-SA", label: "Arabic" },
  { code: "hi-IN", label: "Hindi" },
  { code: "ko-KR", label: "Korean" },
  { code: "vi-VN", label: "Vietnamese" }
];

export function isSupportedSpeechLanguage(code: string): code is SpeechLanguageCode {
  return speechLanguages.some((language) => language.code === code);
}

export function getSpeechLanguageLabel(code: SpeechLanguageCode) {
  return speechLanguages.find((language) => language.code === code)?.label ?? "English";
}

export function buildSpeechTextFromMedicationCard(info: MedicationInfo, label = "ReadableRx medication card") {
  return [
    label,
    info.medicationName && `Medication: ${info.medicationName}.`,
    info.strength && `Strength: ${info.strength}.`,
    info.form && `Form: ${info.form}.`,
    info.directions && `Directions from label: ${info.directions}.`,
    info.warnings && `Warning or caution text: ${info.warnings}.`,
    info.quantity && `Quantity: ${info.quantity}.`,
    info.refills && `Refills: ${info.refills}.`
  ]
    .filter(Boolean)
    .join(" ");
}
