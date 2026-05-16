import assert from "node:assert/strict";
import { defaultReminderTimes, generateSchedule } from "../src/lib/schedule";

function labelsFor(directions: string) {
  return generateSchedule(directions, "Amoxicillin");
}

assert.deepEqual(
  labelsFor("Take 1 tablet once daily").entries.map((entry) => entry.label),
  ["Once daily"]
);

assert.deepEqual(
  labelsFor("Take 1 tablet daily").entries.map((entry) => entry.label),
  ["Once daily"]
);

assert.deepEqual(
  labelsFor("Take 1 tablet every day").entries.map((entry) => entry.label),
  ["Once daily"]
);

assert.deepEqual(
  labelsFor("Take 1 tablet QD").entries.map((entry) => entry.label),
  ["Once daily"]
);

assert.deepEqual(
  labelsFor("Take 1 tablet BID").entries.map((entry) => entry.label),
  ["Morning", "Evening"]
);

assert.deepEqual(
  labelsFor("Take 1 tablet two times daily").entries.map((entry) => entry.label),
  ["Morning", "Evening"]
);

assert.deepEqual(
  labelsFor("Take 1 tablet TID").entries.map((entry) => entry.label),
  ["Morning", "Afternoon", "Night"]
);

assert.deepEqual(
  labelsFor("Take 1 tablet QID").entries.map((entry) => entry.label),
  ["Morning", "Midday", "Evening", "Bedtime"]
);

assert.equal(labelsFor("Take 1 capsule every 4 hours").entries[0].label, "Every 4 hours as written on label");
assert.equal(labelsFor("Take 1 capsule every 6 hours").entries[0].label, "Every 6 hours as written on label");
assert.equal(labelsFor("Take 1 capsule every 8 hours").entries[0].label, "Every 8 hours as written on label");
assert.equal(labelsFor("Take 1 capsule every 12 hours").entries[0].label, "Every 12 hours as written on label");
assert.equal(labelsFor("Take 1 tablet at bedtime").entries[0].label, "Bedtime");
assert.equal(labelsFor("Take 1 tablet HS").entries[0].label, "Bedtime");
assert.equal(labelsFor("Take 1 tablet PRN pain").entries[0].label, "As needed — follow the original label exactly");
assert.equal(labelsFor("Take 1 tablet as needed for pain").entries[0].label, "As needed — follow the original label exactly");

const unclear = labelsFor("Take as directed");
assert.equal(unclear.confidence, "low");
assert.deepEqual(unclear.entries, []);

const withTimes = generateSchedule("Take 1 tablet BID", "Amoxicillin", true, {
  ...defaultReminderTimes,
  morning: "7:30 AM",
  evening: "8:15 PM"
});

assert.deepEqual(
  withTimes.entries.map((entry) => entry.text),
  [
    "Morning (7:30 AM): Amoxicillin - Take 1 tablet twice daily",
    "Evening (8:15 PM): Amoxicillin - Take 1 tablet twice daily"
  ]
);

const withoutTimes = generateSchedule("Take 1 tablet BID", "Amoxicillin");
assert.deepEqual(
  withoutTimes.entries.map((entry) => entry.text),
  ["Morning: Amoxicillin - Take 1 tablet twice daily", "Evening: Amoxicillin - Take 1 tablet twice daily"]
);

console.log("generateSchedule tests passed");
