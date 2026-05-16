import assert from "node:assert/strict";
import {
  buildSpeechTextFromMedicationCard,
  getSpeechLanguageLabel,
  isSupportedSpeechLanguage,
  speechLanguages
} from "../src/utils/speech";
import type { MedicationInfo } from "../src/lib/types";

const expectedCodes = ["en-US", "es-ES", "zh-CN", "fr-FR", "ar-SA", "hi-IN", "ko-KR", "vi-VN"];
assert.deepEqual(
  speechLanguages.map((language) => language.code),
  expectedCodes
);
assert.equal(isSupportedSpeechLanguage("es-ES"), true);
assert.equal(isSupportedSpeechLanguage("de-DE"), false);
assert.equal(getSpeechLanguageLabel("vi-VN"), "Vietnamese");

const info: MedicationInfo = {
  medicationName: "Amoxicillin",
  strength: "500 mg",
  form: "capsules",
  patient: "Maria Chen",
  pharmacy: "Healthy Community Pharmacy",
  prescriber: "Dr. Lee",
  rxNumber: "1842097",
  date: "05/15/2026",
  quantity: "21 capsules",
  refills: "0",
  directions: "Take 1 capsule three times daily until finished.",
  warnings: "Take with food if stomach upset occurs.",
  uncertainFields: [],
  rawText: ""
};

const speechText = buildSpeechTextFromMedicationCard(info, "Original card");
assert.ok(speechText.includes("Original card"));
assert.ok(speechText.includes("Medication: Amoxicillin."));
assert.ok(speechText.includes("Directions from label: Take 1 capsule three times daily until finished."));

console.log("speech tests passed");
