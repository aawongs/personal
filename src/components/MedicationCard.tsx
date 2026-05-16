import type { MedicationInfo } from "@/lib/types";
import type { UiLabels } from "@/lib/i18n";
import { normalizeForAccessibleDisplay } from "@/utils/parsePrescription";

type MedicationCardProps = {
  info: MedicationInfo | null;
  labels: UiLabels;
  title?: string;
  warning?: string;
  idPrefix?: string;
};

export function MedicationCard({ info, labels, title, warning, idPrefix = "medication-card" }: MedicationCardProps) {
  const valueFor = (field: keyof MedicationInfo) => {
    if (!info) return labels.uncertainField;
    const value = info[field];
    if (typeof value !== "string" || !value) return labels.uncertainField;
    return field === "directions" || field === "warnings" || field === "form"
      ? normalizeForAccessibleDisplay(value)
      : value;
  };

  if (!info) {
    return (
      <section aria-labelledby="card-title" className="bg-white p-5 shadow-sm">
        <h2 id="card-title" className="text-3xl font-bold">
          3. {labels.generateAccessibleCard}
        </h2>
        <p className="mt-3 text-lg">Upload or type label text, then generate the card.</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="card-title" className="bg-ink p-5 text-white shadow-sm">
      <h2 id={`${idPrefix}-title`} className="text-3xl font-bold">
        {title ?? `3. ${labels.accessibleMedicationCard}`}
      </h2>
      {warning ? (
        <p className="mt-4 border-2 border-warning bg-orange-50 p-4 text-lg font-bold text-ink">{warning}</p>
      ) : null}
      <article className="mt-5 rounded bg-white p-5 text-ink">
        <p className="text-xl font-bold">{labels.medication}</p>
        <h3 className="text-4xl font-black leading-tight">{valueFor("medicationName")}</h3>
        <dl className="mt-4 grid gap-4 text-xl sm:grid-cols-2">
          <div className="rounded border-2 border-ink bg-paper p-3">
            <dt className="font-black">{labels.strength} / {labels.form}</dt>
            <dd>{valueFor("strength")} {valueFor("form")}</dd>
          </div>
        </dl>
        <section aria-labelledby={`${idPrefix}-directions-title`} className="mt-6 border-t-4 border-ink pt-5">
          <h4 id={`${idPrefix}-directions-title`} className="text-2xl font-black">
            {labels.directionsFromLabel}
          </h4>
          <p className="mt-2 text-3xl font-bold leading-snug">{valueFor("directions")}</p>
        </section>
        <section aria-labelledby={`${idPrefix}-warnings-title`} className="mt-6 border-4 border-warning bg-orange-50 p-4">
          <h4 id={`${idPrefix}-warnings-title`} className="text-2xl font-black">
            {labels.warningOrCautionText}
          </h4>
          <p className="mt-2 text-2xl font-bold leading-snug">{valueFor("warnings")}</p>
        </section>
        <dl className="mt-6 grid gap-4 text-xl sm:grid-cols-2">
          <div>
            <dt className="font-bold">{labels.quantity}</dt>
            <dd>{valueFor("quantity")}</dd>
          </div>
          <div>
            <dt className="font-bold">{labels.refills}</dt>
            <dd>{valueFor("refills")}</dd>
          </div>
        </dl>
        <details className="mt-6 rounded border-2 border-ink bg-paper p-4">
          <summary className="cursor-pointer text-xl font-black">Label details</summary>
          <dl className="mt-4 grid gap-3 text-lg sm:grid-cols-2">
            <div>
              <dt className="font-bold">{labels.patient}</dt>
              <dd>{valueFor("patient")}</dd>
            </div>
            <div>
              <dt className="font-bold">{labels.pharmacy}</dt>
              <dd>{valueFor("pharmacy")}</dd>
            </div>
            <div>
              <dt className="font-bold">{labels.prescriber}</dt>
              <dd>{valueFor("prescriber")}</dd>
            </div>
            <div>
              <dt className="font-bold">{labels.rxNumber}</dt>
              <dd>{valueFor("rxNumber")}</dd>
            </div>
            <div>
              <dt className="font-bold">{labels.date}</dt>
              <dd>{valueFor("date")}</dd>
            </div>
          </dl>
        </details>
        {info.uncertainFields.length ? (
          <section aria-labelledby={`${idPrefix}-uncertain-title`} className="mt-6 border-2 border-ink bg-paper p-4">
            <h4 id={`${idPrefix}-uncertain-title`} className="text-xl font-black">
              {labels.uncertainField}
            </h4>
            <p className="mt-2 text-lg">{info.uncertainFields.join(", ")}</p>
          </section>
        ) : null}
      </article>
    </section>
  );
}
