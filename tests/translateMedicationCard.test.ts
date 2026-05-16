import assert from "node:assert/strict";
import type { MedicationInfo } from "../src/lib/types";
import {
  buildTranslatableMedicationCard,
  flattenMedicationCardForTranslation,
  mapToGoogleTarget,
  rebuildTranslatedMedicationCard,
  translatedCardToMedicationInfo,
  translationLanguages,
  translationSafetyWarning
} from "../src/utils/translateMedicationCard";

assert.deepEqual(
  translationLanguages.map((language) => language.code),
  ["en-US", "es-ES", "zh-CN", "fr-FR", "ar-SA", "hi-IN", "ko-KR", "vi-VN"]
);
assert.equal(mapToGoogleTarget("es-ES"), "es");
assert.equal(mapToGoogleTarget("zh-CN"), "zh-CN");
assert.equal(mapToGoogleTarget("vi-VN"), "vi");
assert.ok(translationSafetyWarning.includes("source of truth"));

const source: MedicationInfo = {
  medicationName: "Lisinopril",
  strength: "10 mg",
  form: "tablet",
  patient: "Jordan Rivera",
  pharmacy: "Main Street Pharmacy",
  prescriber: "Dr. Patel",
  rxNumber: "RX12345",
  date: "05/15/2026",
  quantity: "30",
  refills: "2",
  directions: "Take 1 tablet once daily.",
  warnings: "",
  uncertainFields: ["warnings"],
  rawText: "Drug: Lisinopril 10 mg tablet"
};

const card = buildTranslatableMedicationCard(source);
assert.deepEqual(card, {
  medicationName: "Lisinopril",
  strength: "10 mg",
  form: "tablet",
  directions: "Take 1 tablet once daily.",
  quantity: "30",
  refills: "2",
  warnings: ""
});

const flattened = flattenMedicationCardForTranslation(card);
assert.deepEqual(flattened.keys, ["medicationName", "strength", "form", "directions", "quantity", "refills"]);
assert.deepEqual(flattened.values, ["Lisinopril", "10 mg", "tablet", "Take 1 tablet once daily.", "30", "2"]);

const rebuilt = rebuildTranslatedMedicationCard(
  card,
  ["Lisinopril", "10 mg", "tableta", "Tome 1 tableta una vez al dia.", "30", "2"],
  flattened.keys
);
assert.equal(rebuilt.warnings, "");
assert.equal(rebuilt.directions, "Tome 1 tableta una vez al dia.");

const translatedInfo = translatedCardToMedicationInfo(rebuilt, source);
assert.equal(translatedInfo.patient, source.patient);
assert.equal(translatedInfo.prescriber, source.prescriber);
assert.equal(translatedInfo.directions, "Tome 1 tableta una vez al dia.");
assert.deepEqual(translatedInfo.uncertainFields, ["warnings"]);

console.log("translateMedicationCard tests passed");
