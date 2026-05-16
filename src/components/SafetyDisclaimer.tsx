import type { UiLabels } from "@/lib/i18n";

type SafetyDisclaimerProps = {
  labels: UiLabels;
  compact?: boolean;
};

export function SafetyDisclaimer({ labels, compact = false }: SafetyDisclaimerProps) {
  if (compact) {
    return (
      <aside className="border-l-4 border-warning bg-white p-4 text-ink shadow-sm">
        <p className="text-base font-bold">
          ReadableRx does not provide medical advice or change prescription instructions. Always compare the
          output with the original label.
        </p>
        <details className="mt-2">
          <summary className="cursor-pointer text-base font-bold">Read full safety note</summary>
          <p className="mt-2 text-base leading-relaxed">{labels.safetyBody}</p>
          <p className="mt-2 text-base font-semibold leading-relaxed">{labels.safetyVerify}</p>
        </details>
      </aside>
    );
  }

  return (
    <section
      aria-labelledby="safety-title"
      className="border-l-8 border-warning bg-white p-5 text-ink shadow-sm"
    >
      <h2 id="safety-title" className="text-2xl font-bold">
        {labels.importantSafetyNotice}
      </h2>
      <p className="mt-3 text-lg leading-relaxed">
        {labels.safetyBody}
      </p>
      <p className="mt-3 text-lg font-semibold leading-relaxed">
        {labels.safetyVerify}
      </p>
    </section>
  );
}
