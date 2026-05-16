import type { MedicationInfo } from "./types";
import type { UiLabels } from "./i18n";
import { normalizeForAccessibleDisplay } from "../utils/parsePrescription";

export type ReminderTimeId = "morning" | "afternoon" | "midday" | "evening" | "bedtime";

export type ReminderTime = {
  id: ReminderTimeId;
  label: string;
  defaultTime: string;
};

export type ScheduleEntry = {
  id: string;
  label: string;
  detail: string;
  reminderTimeId?: ReminderTimeId;
  reminderTime?: string;
  text: string;
};

export type GeneratedSchedule = {
  confidence: "high" | "low";
  reason: string;
  entries: ScheduleEntry[];
};

export const reminderTimes: ReminderTime[] = [
  { id: "morning", label: "Morning", defaultTime: "8:00 AM" },
  { id: "afternoon", label: "Afternoon", defaultTime: "12:00 PM" },
  { id: "midday", label: "Midday", defaultTime: "12:00 PM" },
  { id: "evening", label: "Evening", defaultTime: "6:00 PM" },
  { id: "bedtime", label: "Bedtime", defaultTime: "10:00 PM" }
];

export const defaultReminderTimes = reminderTimes.reduce<Record<ReminderTimeId, string>>(
  (times, reminder) => ({
    ...times,
    [reminder.id]: reminder.defaultTime
  }),
  {
    morning: "8:00 AM",
    afternoon: "12:00 PM",
    midday: "12:00 PM",
    evening: "6:00 PM",
    bedtime: "10:00 PM"
  }
);

function entry(
  id: string,
  label: string,
  detail: string,
  medicationName: string,
  directions: string,
  reminderTimeId?: ReminderTimeId
): ScheduleEntry {
  return {
    id,
    label,
    detail,
    reminderTimeId,
    text: `${label}: ${medicationName} - ${directions}`
  };
}

function withTimes(entries: ScheduleEntry[], useReminderTimes: boolean, customTimes: Record<ReminderTimeId, string>) {
  return entries.map((item) => {
    const reminderTime = useReminderTimes && item.reminderTimeId ? customTimes[item.reminderTimeId] : undefined;
    const label = reminderTime ? `${item.label} (${reminderTime})` : item.label;

    return {
      ...item,
      reminderTime,
      text: `${label}: ${item.text.split(": ").slice(1).join(": ")}`
    };
  });
}

export function generateSchedule(
  directions: string,
  medicationName = "Medication",
  useReminderTimes = false,
  customTimes: Record<ReminderTimeId, string> = defaultReminderTimes
): GeneratedSchedule {
  const accessibleDirections = normalizeForAccessibleDisplay(directions).trim();
  const lower = directions.toLowerCase();
  const normalizedLower = accessibleDirections.toLowerCase();

  if (!directions.trim()) {
    return {
      confidence: "low",
      reason: "No directions available.",
      entries: []
    };
  }

  let entries: ScheduleEntry[] = [];
  let reason = "";

  if (/\b(as needed|prn)\b/i.test(directions)) {
    entries = [
      entry("as-needed", "As needed — follow the original label exactly", accessibleDirections, medicationName, accessibleDirections)
    ];
    reason = "Detected as-needed directions.";
  } else if (/\bevery\s*4\s*hours?\b/i.test(lower)) {
    entries = [entry("every-4-hours", "Every 4 hours as written on label", accessibleDirections, medicationName, accessibleDirections)];
    reason = "Detected every 4 hours.";
  } else if (/\bevery\s*6\s*hours?\b/i.test(lower)) {
    entries = [entry("every-6-hours", "Every 6 hours as written on label", accessibleDirections, medicationName, accessibleDirections)];
    reason = "Detected every 6 hours.";
  } else if (/\bevery\s*8\s*hours?\b/i.test(lower)) {
    entries = [entry("every-8-hours", "Every 8 hours as written on label", accessibleDirections, medicationName, accessibleDirections)];
    reason = "Detected every 8 hours.";
  } else if (/\bevery\s*12\s*hours?\b/i.test(lower)) {
    entries = [entry("every-12-hours", "Every 12 hours as written on label", accessibleDirections, medicationName, accessibleDirections)];
    reason = "Detected every 12 hours.";
  } else if (/\b(at bedtime|hs)\b/i.test(lower)) {
    entries = [entry("bedtime", "Bedtime", accessibleDirections, medicationName, accessibleDirections, "bedtime")];
    reason = "Detected bedtime directions.";
  } else if (/\b(three times daily|three times a day|tid)\b/i.test(lower) || /\bthree times daily\b/i.test(normalizedLower)) {
    entries = [
      entry("morning", "Morning", accessibleDirections, medicationName, accessibleDirections, "morning"),
      entry("afternoon", "Afternoon", accessibleDirections, medicationName, accessibleDirections, "afternoon"),
      entry("night", "Night", accessibleDirections, medicationName, accessibleDirections, "bedtime")
    ];
    reason = "Detected three times daily.";
  } else if (/\b(four times daily|four times a day|qid)\b/i.test(lower) || /\bfour times daily\b/i.test(normalizedLower)) {
    entries = [
      entry("morning", "Morning", accessibleDirections, medicationName, accessibleDirections, "morning"),
      entry("midday", "Midday", accessibleDirections, medicationName, accessibleDirections, "midday"),
      entry("evening", "Evening", accessibleDirections, medicationName, accessibleDirections, "evening"),
      entry("bedtime", "Bedtime", accessibleDirections, medicationName, accessibleDirections, "bedtime")
    ];
    reason = "Detected four times daily.";
  } else if (/\b(twice daily|twice a day|two times daily|bid)\b/i.test(lower) || /\btwice daily\b/i.test(normalizedLower)) {
    entries = [
      entry("morning", "Morning", accessibleDirections, medicationName, accessibleDirections, "morning"),
      entry("evening", "Evening", accessibleDirections, medicationName, accessibleDirections, "evening")
    ];
    reason = "Detected twice daily.";
  } else if (/\b(once daily|daily|every day|qd)\b/i.test(lower) || /\bonce daily\b/i.test(normalizedLower)) {
    entries = [entry("once-daily", "Once daily", accessibleDirections, medicationName, accessibleDirections, "morning")];
    reason = "Detected once daily.";
  }

  if (!entries.length) {
    return {
      confidence: "low",
      reason: "Directions did not match a supported schedule pattern.",
      entries: []
    };
  }

  return {
    confidence: "high",
    reason,
    entries: withTimes(entries, useReminderTimes, customTimes)
  };
}

export function buildScheduleEntries(
  info: MedicationInfo | null,
  labels: Pick<UiLabels, "medication">,
  useReminderTimes = false,
  customTimes: Record<ReminderTimeId, string> = defaultReminderTimes
): GeneratedSchedule {
  return generateSchedule(info?.directions ?? "", info?.medicationName || labels.medication, useReminderTimes, customTimes);
}
