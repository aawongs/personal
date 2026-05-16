"use client";

import type { UiLabels } from "@/lib/i18n";
import {
  reminderTimes,
  type GeneratedSchedule,
  type ReminderTimeId
} from "@/lib/schedule";

type ScheduleGeneratorProps = {
  labels: UiLabels;
  schedule: GeneratedSchedule;
  useReminderTimes: boolean;
  customTimes: Record<ReminderTimeId, string>;
  onUseReminderTimesChange: (checked: boolean) => void;
  onCustomTimeChange: (id: ReminderTimeId, value: string) => void;
};

export function ScheduleGenerator({
  labels,
  schedule,
  useReminderTimes,
  customTimes,
  onUseReminderTimesChange,
  onCustomTimeChange
}: ScheduleGeneratorProps) {
  return (
    <section aria-labelledby="schedule-title" className="bg-white p-5 shadow-sm">
      <h2 id="schedule-title" className="text-2xl font-black">
        {labels.scheduleHelper}
      </h2>
      <p className="mt-2 text-base font-semibold text-warning">Visual aid only. Follow the original label.</p>

      {schedule.confidence === "low" ? (
        <p role="alert" className="mt-5 border-2 border-warning bg-orange-50 p-4 text-lg font-bold">
          Schedule could not be confidently generated. Please follow the original label or ask your pharmacist.
        </p>
      ) : null}

      <div className="no-print mt-4 rounded border-2 border-ink bg-paper p-4">
        <label className="flex items-start gap-3 text-lg font-bold">
          <input
            type="checkbox"
            checked={useReminderTimes}
            onChange={(event) => onUseReminderTimesChange(event.target.checked)}
            className="mt-1 h-6 w-6"
          />
          <span>Add optional reminder clock times</span>
        </label>
        {useReminderTimes ? (
          <fieldset className="mt-5">
            <legend className="text-lg font-bold">{labels.reminderTimes}</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {reminderTimes.map((item) => (
                <div key={item.id}>
                  <label htmlFor={`reminder-${item.id}`} className="block text-base font-bold">
                    {item.label}
                  </label>
                  <input
                    id={`reminder-${item.id}`}
                    value={customTimes[item.id]}
                    onChange={(event) => onCustomTimeChange(item.id, event.target.value)}
                    className="mt-1 w-full rounded border-2 border-ink bg-white p-3 text-lg"
                  />
                </div>
              ))}
            </div>
          </fieldset>
        ) : null}
      </div>

      <ol className="mt-5 grid gap-3" aria-label={labels.generatedSchedule}>
        {schedule.entries.map((entry) => (
          <li key={entry.id} className="border-l-4 border-action bg-teal-50 p-3 text-xl font-bold">
            {entry.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
