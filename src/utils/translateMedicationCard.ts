import type { MedicationInfo } from "@/lib/types";
import type { SpeechLanguageCode } from "@/utils/speech";

export type TranslationLanguageCode = SpeechLanguageCode;

export type TranslationLanguage = {
  code: TranslationLanguageCode;
  label: string;
  googleTarget: string;
};

export type TranslatableMedicationCard = Pick<
  MedicationInfo,
  "medicationName" | "strength" | "form" | "directions" | "quantity" | "refills" | "warnings"
>;

export const translationSafetyWarning =
  "Translation is provided for accessibility only. Use the original prescription label as the source of truth. Ask a pharmacist or clinician if anything is unclear.";

export const translationUnavailableMessage = "Translation is unavailable because no translation API key is configured.";

export const translationLanguages: TranslationLanguage[] = [
  { code: "en-US", label: "English", googleTarget: "en" },
  { code: "es-ES", label: "Spanish", googleTarget: "es" },
  { code: "zh-CN", label: "Simplified Chinese", googleTarget: "zh-CN" },
  { code: "fr-FR", label: "French", googleTarget: "fr" },
  { code: "ar-SA", label: "Arabic", googleTarget: "ar" },
  { code: "hi-IN", label: "Hindi", googleTarget: "hi" },
  { code: "ko-KR", label: "Korean", googleTarget: "ko" },
  { code: "vi-VN", label: "Vietnamese", googleTarget: "vi" }
];

export function mapToGoogleTarget(code: TranslationLanguageCode) {
  return translationLanguages.find((language) => language.code === code)?.googleTarget ?? "en";
}

export function buildTranslatableMedicationCard(info: MedicationInfo): TranslatableMedicationCard {
  return {
    medicationName: info.medicationName,
    strength: info.strength,
    form: info.form,
    directions: info.directions,
    quantity: info.quantity,
    refills: info.refills,
    warnings: info.warnings
  };
}

export function flattenMedicationCardForTranslation(card: TranslatableMedicationCard) {
  const values: string[] = [];
  const keys: Array<keyof TranslatableMedicationCard> = [];

  (Object.keys(card) as Array<keyof TranslatableMedicationCard>).forEach((key) => {
    const value = card[key];
    if (value.trim()) {
      values.push(value);
      keys.push(key);
    }
  });

  return { values, keys };
}

export function rebuildTranslatedMedicationCard(
  original: TranslatableMedicationCard,
  translatedValues: string[],
  keys: Array<keyof TranslatableMedicationCard>
): TranslatableMedicationCard {
  const translated: TranslatableMedicationCard = {
    medicationName: "",
    strength: "",
    form: "",
    directions: "",
    quantity: "",
    refills: "",
    warnings: ""
  };

  (Object.keys(translated) as Array<keyof TranslatableMedicationCard>).forEach((key) => {
    translated[key] = original[key] ? original[key] : "";
  });

  keys.forEach((key, index) => {
    translated[key] = translatedValues[index] ?? "";
  });

  return translated;
}

export function translatedCardToMedicationInfo(card: TranslatableMedicationCard, source: MedicationInfo): MedicationInfo {
  return {
    ...source,
    medicationName: card.medicationName,
    strength: card.strength,
    form: card.form,
    directions: card.directions,
    quantity: card.quantity,
    refills: card.refills,
    warnings: card.warnings,
    uncertainFields: source.uncertainFields,
    rawText: source.rawText
  };
}
