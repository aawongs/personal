import assert from "node:assert/strict";
import { normalizeForAccessibleDisplay, parsePrescription } from "../src/utils/parsePrescription";

const cleanSample = `Healthy Community Pharmacy
Rx 1842097
Patient: Maria Chen
Medication: Amoxicillin 500 mg capsules
Prescriber: Dr. Lee
Date: 05/15/2026
Directions: Take 1 capsule by mouth every 8 hours until finished.
Quantity: 21 capsules
Refills: 0
Warning: Take with food if stomach upset occurs.`;

const clean = parsePrescription(cleanSample);
assert.equal(clean.medicationName, "Amoxicillin");
assert.equal(clean.strength, "500 mg");
assert.equal(clean.form, "capsules");
assert.equal(clean.patient, "Maria Chen");
assert.equal(clean.pharmacy, "Healthy Community Pharmacy");
assert.equal(clean.prescriber, "Dr. Lee");
assert.equal(clean.rxNumber, "1842097");
assert.equal(clean.date, "05/15/2026");
assert.equal(clean.quantity, "21 capsules");
assert.equal(clean.refills, "0");
assert.equal(clean.directions, "Take 1 capsule by mouth every 8 hours until finished.");
assert.equal(clean.warnings, "Take with food if stomach upset occurs.");
assert.deepEqual(clean.uncertainFields, []);

const allCaps = parsePrescription(`CITY RX PHARMACY
RX # AB-99881
NAME: JORDAN RIVERA
DRUG: LISINOPRIL 10MG TAB
DOCTOR: K PATEL
FILLED: 5/1/26
QTY: 30
REFILLS: 2
TAKE: TAKE 1 TAB PO QD
CAUTION: MAY CAUSE DIZZINESS`);

assert.equal(allCaps.medicationName, "LISINOPRIL");
assert.equal(allCaps.strength, "10MG");
assert.equal(allCaps.form, "TAB");
assert.equal(allCaps.patient, "JORDAN RIVERA");
assert.equal(allCaps.rxNumber, "AB-99881");
assert.equal(normalizeForAccessibleDisplay(allCaps.directions), "TAKE 1 tablet by mouth once daily");

const sigLabel = parsePrescription(`Main Street Pharmacy
Rx Number: 777-123
Patient: Alex Kim
Drug: Metformin 250 mg/5 mL solution
Prescriber: Dr. Nguyen
Filled: 04-20-2026
Sig: Take 5 mL PO BID with meals
Qty: 150 mL
Refills: 1
Warning: Shake well`);

assert.equal(sigLabel.medicationName, "Metformin");
assert.equal(sigLabel.strength, "250 mg/5 mL");
assert.equal(sigLabel.form, "solution");
assert.equal(sigLabel.directions, "Take 5 mL PO BID with meals");
assert.equal(normalizeForAccessibleDisplay(sigLabel.directions), "Take 5 mL by mouth twice daily with meals");

const abbrevLabel = parsePrescription(`Neighborhood Pharmacy
Rx: X551
Patient: Sam Taylor
Medication: Albuterol 20 mcg inhaler
Doctor: R Smith
Date: 3/9/2026
Directions: Use 2 puffs TID PRN wheezing
Quantity: 1 inhaler
Refills: 3
Caution: Keep away from heat`);

assert.equal(abbrevLabel.strength, "20 mcg");
assert.equal(abbrevLabel.form, "inhaler");
assert.equal(normalizeForAccessibleDisplay(abbrevLabel.directions), "Use 2 puffs three times daily as needed wheezing");

const quantityFormats = parsePrescription(`VALUE PHARMACY
Rx # 42ZX
Name: Pat Morgan
Medication: Hydrocortisone 1% cream
Prescriber: Dr. Jones
Date: 01/02/2026
Directions: Apply thin layer BID PRN itching
Qty: 30 g
Refill: remaining 0
Warning: External use only`);

assert.equal(quantityFormats.strength, "1%");
assert.equal(quantityFormats.form, "cream");
assert.equal(quantityFormats.quantity, "30 g");
assert.equal(quantityFormats.refills, "0");
assert.equal(normalizeForAccessibleDisplay(quantityFormats.directions), "Apply thin layer twice daily as needed itching");

const missingWarning = parsePrescription(`Care Pharmacy
Rx Number: 9090
Patient: Robin Lee
Medication: Prednisone 5 MG tablets
Prescriber: Dr. Hart
Filled: 02/14/2026
Directions: Take 1 tablet by mouth daily
Quantity: 10
Refills: 0`);

assert.equal(missingWarning.medicationName, "Prednisone");
assert.equal(missingWarning.strength, "5 MG");
assert.equal(missingWarning.form, "tablets");
assert.equal(missingWarning.warnings, "");
assert.ok(missingWarning.uncertainFields.includes("warnings"));

const unitStrength = parsePrescription(`Pharmacy
Rx: I100
Patient: Jamie Fox
Medication: Insulin 100 units/mL injection
Prescriber: Dr. Ames
Date: 02/20/2026
Directions: Inject 10 units daily
Qty: 10 mL
Refills: 1
Warning: Refrigerate`);

assert.equal(unitStrength.medicationName, "Insulin");
assert.equal(unitStrength.strength, "100 units/mL");
assert.equal(unitStrength.form, "injection");
assert.equal(unitStrength.directions, "Inject 10 units daily");

const decimalStrength = parsePrescription(`Rx # D5
Patient: Casey Green
Medication: Clonazepam 0.5 mg tablet
Doctor: R. Allen
Date: 02/21/2026
Sig: Take 1 tablet PO PRN anxiety
Qty: 20
Refills: 0
Caution: May cause drowsiness`);

assert.equal(decimalStrength.strength, "0.5 mg");
assert.equal(decimalStrength.form, "tablet");
assert.equal(normalizeForAccessibleDisplay(decimalStrength.directions), "Take 1 tablet by mouth as needed anxiety");

console.log("parsePrescription tests passed");
