"use client";

import type { UiLabels } from "@/lib/i18n";
import type { MedicationInfo, OcrStatus } from "@/lib/types";

type EditableReviewField =
  | "medicationName"
  | "strength"
  | "form"
  | "patient"
  | "pharmacy"
  | "prescriber"
  | "rxNumber"
  | "date"
  | "directions"
  | "quantity"
  | "refills"
  | "warnings";

type OcrReviewProps = {
  text: string;
  status: OcrStatus;
  progress: number;
  labels: UiLabels;
  reviewInfo: MedicationInfo | null;
  hasCompared: boolean;
  onChange: (text: string) => void;
  onFieldChange: (field: EditableReviewField, value: string) => void;
  onComparedChange: (checked: boolean) => void;
  onGenerate: () => void;
};

export function OcrReview({
  text,
  status,
  progress,
  labels,
  reviewInfo,
  hasCompared,
  onChange,
  onFieldChange,
  onComparedChange,
  onGenerate
}: OcrReviewProps) {
  const hasText = Boolean(text.trim());
  const hasUncertainFields = Boolean(reviewInfo?.uncertainFields.length);
  const canGenerate = Boolean(reviewInfo) && hasCompared;

  return (
    <section aria-labelledby="review-title" className="bg-white p-5 shadow-sm">
      <h2 id="review-title" className="text-3xl font-bold">
        2. {labels.reviewExtractedText}
      </h2>
      <p className="mt-2 text-lg leading-relaxed">
        Correct OCR mistakes before generating the card. The card should match the original label. ReadableRx
        does not silently correct or change medical instructions.
      </p>
      {status === "working" ? (
        <div className="mt-4" role="status" aria-live="polite">
          <p className="text-lg font-bold">Extracting text: {Math.round(progress * 100)}%</p>
          <progress className="mt-2 h-4 w-full" value={progress} max={1}>
            {Math.round(progress * 100)}%
          </progress>
        </div>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="mt-4 border-2 border-warning bg-orange-50 p-3 text-lg font-bold">
          OCR could not read this image. You can type the label text manually.
        </p>
      ) : null}

      {hasUncertainFields ? (
        <div role="alert" className="mt-5 border-2 border-warning bg-orange-50 p-4 text-lg font-bold">
          Some fields were not confidently detected. Please check the original label before using the card.
        </div>
      ) : null}

      <div className="mt-5 border-2 border-ink bg-paper p-4">
        <h3 className="text-2xl font-bold">Structured preview</h3>
        <p className="mt-2 text-lg leading-relaxed">
          Edit these fields directly if OCR or parsing is wrong. Do not change dose amounts unless you are
          copying the correction from the original label.
        </p>
        <div className="mt-4 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label htmlFor="review-medication" className="block text-lg font-bold">
                {labels.medication}
              </label>
              <input
                id="review-medication"
                value={reviewInfo?.medicationName ?? ""}
                onChange={(event) => onFieldChange("medicationName", event.target.value)}
                className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-xl"
              />
            </div>
            <div>
              <label htmlFor="review-strength" className="block text-lg font-bold">
                {labels.strength}
              </label>
              <input
                id="review-strength"
                value={reviewInfo?.strength ?? ""}
                onChange={(event) => onFieldChange("strength", event.target.value)}
                className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-xl"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="review-form" className="block text-lg font-bold">
                {labels.form}
              </label>
              <input
                id="review-form"
                value={reviewInfo?.form ?? ""}
                onChange={(event) => onFieldChange("form", event.target.value)}
                className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-xl"
              />
            </div>
          </div>
          <div>
            <label htmlFor="review-directions" className="block text-lg font-bold">
              {labels.directionsFromLabel}
            </label>
            <textarea
              id="review-directions"
              value={reviewInfo?.directions ?? ""}
              onChange={(event) => onFieldChange("directions", event.target.value)}
              rows={4}
              className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-xl leading-relaxed"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="review-quantity" className="block text-lg font-bold">
                {labels.quantity}
              </label>
              <input
                id="review-quantity"
                value={reviewInfo?.quantity ?? ""}
                onChange={(event) => onFieldChange("quantity", event.target.value)}
                className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-xl"
              />
            </div>
            <div>
              <label htmlFor="review-refills" className="block text-lg font-bold">
                {labels.refills}
              </label>
              <input
                id="review-refills"
                value={reviewInfo?.refills ?? ""}
                onChange={(event) => onFieldChange("refills", event.target.value)}
                className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-xl"
              />
            </div>
          </div>
          <div>
            <label htmlFor="review-warnings" className="block text-lg font-bold">
              {labels.warningOrCautionText}
            </label>
            <textarea
              id="review-warnings"
              value={reviewInfo?.warnings ?? ""}
              onChange={(event) => onFieldChange("warnings", event.target.value)}
              rows={3}
              className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-xl leading-relaxed"
            />
          </div>

          <details className="rounded border-2 border-ink bg-white p-4">
            <summary className="cursor-pointer text-lg font-bold">Additional label details</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="review-patient" className="block text-base font-bold">
                  {labels.patient}
                </label>
                <input
                  id="review-patient"
                  value={reviewInfo?.patient ?? ""}
                  onChange={(event) => onFieldChange("patient", event.target.value)}
                  className="mt-1 w-full rounded border-2 border-ink bg-white p-3 text-lg"
                />
              </div>
              <div>
                <label htmlFor="review-pharmacy" className="block text-base font-bold">
                  {labels.pharmacy}
                </label>
                <input
                  id="review-pharmacy"
                  value={reviewInfo?.pharmacy ?? ""}
                  onChange={(event) => onFieldChange("pharmacy", event.target.value)}
                  className="mt-1 w-full rounded border-2 border-ink bg-white p-3 text-lg"
                />
              </div>
              <div>
                <label htmlFor="review-prescriber" className="block text-base font-bold">
                  {labels.prescriber}
                </label>
                <input
                  id="review-prescriber"
                  value={reviewInfo?.prescriber ?? ""}
                  onChange={(event) => onFieldChange("prescriber", event.target.value)}
                  className="mt-1 w-full rounded border-2 border-ink bg-white p-3 text-lg"
                />
              </div>
              <div>
                <label htmlFor="review-rx-number" className="block text-base font-bold">
                  {labels.rxNumber}
                </label>
                <input
                  id="review-rx-number"
                  value={reviewInfo?.rxNumber ?? ""}
                  onChange={(event) => onFieldChange("rxNumber", event.target.value)}
                  className="mt-1 w-full rounded border-2 border-ink bg-white p-3 text-lg"
                />
              </div>
              <div>
                <label htmlFor="review-date" className="block text-base font-bold">
                  {labels.date}
                </label>
                <input
                  id="review-date"
                  value={reviewInfo?.date ?? ""}
                  onChange={(event) => onFieldChange("date", event.target.value)}
                  className="mt-1 w-full rounded border-2 border-ink bg-white p-3 text-lg"
                />
              </div>
            </div>
          </details>
        </div>
      </div>

      <details className="mt-5 rounded border-2 border-ink bg-white p-4">
        <summary className="cursor-pointer text-lg font-bold">Original extracted text</summary>
        <label htmlFor="ocr-text" className="mt-4 block text-lg font-bold">
          Original extracted text
        </label>
        <textarea
          id="ocr-text"
          value={text}
          onChange={(event) => onChange(event.target.value)}
          rows={11}
          className="mt-2 w-full rounded border-2 border-ink bg-paper p-4 text-xl leading-relaxed"
          placeholder="Extracted medication label text will appear here."
        />
      </details>

      <label className="mt-5 flex items-start gap-3 rounded border-2 border-ink bg-white p-4 text-lg font-bold">
        <input
          type="checkbox"
          checked={hasCompared}
          onChange={(event) => onComparedChange(event.target.checked)}
          className="mt-1 h-6 w-6"
        />
        <span>I compared the extracted text with the original label.</span>
      </label>
      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate}
        className="mt-4 w-full rounded bg-ink px-5 py-3 text-xl font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500 sm:w-auto"
      >
        {labels.generateAccessibleCard}
      </button>
      {!hasCompared && hasText ? (
        <p className="mt-3 text-lg font-semibold text-warning">
          Confirm that you compared the extracted text with the original label before generating the card.
        </p>
      ) : null}
    </section>
  );
}
