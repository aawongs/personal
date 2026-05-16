import Link from "next/link";
import { demoSampleLabels } from "@/lib/sampleLabel";

const safetyBoundaries = [
  "Does not provide medical advice",
  "Does not change instructions",
  "Does not check drug interactions",
  "Does not diagnose",
  "Requires user verification against original label"
];

const features = [
  "OCR extraction",
  "Editable verification",
  "Large-print card",
  "Schedule builder",
  "Text-to-speech",
  "Multilingual interface labels",
  "Print/PDF export"
];

const limitations = [
  "OCR can make mistakes",
  "Does not verify prescriptions",
  "Does not translate prescription instructions as source of truth",
  "Does not check drug interactions"
];

const futureImprovements = [
  "Verified side-by-side translation",
  "Caregiver sharing mode",
  "More robust pharmacy label parsing",
  "QR code card sharing"
];

export default function DemoPage() {
  return (
    <main className="min-h-screen">
      <header className="border-b-2 border-ink bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
          <Link href="/" className="text-xl font-black">
            ReadableRx
          </Link>
          <div className="flex gap-3 text-base font-bold">
            <Link href="/" className="underline">
              Main App
            </Link>
            <Link href="/demo" className="underline">
              Demo/About
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <h1 className="text-5xl font-black leading-tight">ReadableRx Demo/About</h1>
          <p className="mt-4 max-w-3xl text-2xl font-semibold leading-snug">
            An accessibility-focused prescription label reader that reformats existing label text into
            large-print, high-contrast medication cards.
          </p>
          <Link href="/" className="mt-6 inline-block rounded bg-white px-5 py-3 text-lg font-bold text-ink">
            Open Main App
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-6">
        <section className="bg-white p-5 shadow-sm" aria-labelledby="what-title">
          <h2 id="what-title" className="text-3xl font-bold">
            What ReadableRx does
          </h2>
          <p className="mt-3 text-xl leading-relaxed">
            Users upload a prescription label photo, review OCR output, correct structured fields, and
            generate an accessible medication card with optional read-aloud, schedule, print, and PDF tools.
          </p>
        </section>

        <section className="bg-white p-5 shadow-sm" aria-labelledby="why-title">
          <h2 id="why-title" className="text-3xl font-bold">
            Why prescription-label accessibility matters
          </h2>
          <p className="mt-3 text-xl leading-relaxed">
            Prescription labels can be small, dense, and difficult to read. ReadableRx helps reformat
            existing label text into large-print, high-contrast, screen-reader-friendly cards.
          </p>
        </section>

        <section className="bg-white p-5 shadow-sm" aria-labelledby="safety-title">
          <h2 id="safety-title" className="text-3xl font-bold">
            Safety boundaries
          </h2>
          <ul className="mt-4 grid gap-2 text-xl font-semibold">
            {safetyBoundaries.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-5 shadow-sm" aria-labelledby="samples-title">
          <h2 id="samples-title" className="text-3xl font-bold">
            Demo sample labels
          </h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {demoSampleLabels.map((sample) => (
              <article key={sample.id} className="rounded border-2 border-ink bg-paper p-4">
                <h3 className="text-2xl font-black">{sample.title}</h3>
                <p className="mt-2 text-lg font-semibold">{sample.subtitle}</p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-base font-bold">View sample text</summary>
                  <pre className="mt-3 whitespace-pre-wrap rounded border-2 border-ink bg-white p-3 text-sm leading-relaxed">
                    {sample.text}
                  </pre>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <div className="bg-white p-5 shadow-sm">
            <h2 className="text-3xl font-bold">Feature list</h2>
            <ul className="mt-4 grid gap-2 text-lg font-semibold">
              {features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="text-3xl font-bold">Limitations</h2>
            <ul className="mt-4 grid gap-2 text-lg font-semibold">
              {limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-5 shadow-sm">
            <h2 className="text-3xl font-bold">Future improvements</h2>
            <ul className="mt-4 grid gap-2 text-lg font-semibold">
              {futureImprovements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
