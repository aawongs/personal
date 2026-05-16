"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ImageUpload } from "@/components/ImageUpload";
import { MedicationCard } from "@/components/MedicationCard";
import { OcrReview } from "@/components/OcrReview";
import { SafetyDisclaimer } from "@/components/SafetyDisclaimer";
import { ScheduleGenerator } from "@/components/ScheduleGenerator";
import { downloadMedicationCardPdf } from "@/lib/pdf";
import {
  buildScheduleEntries,
  defaultReminderTimes,
  reminderTimes,
  type ReminderTimeId
} from "@/lib/schedule";
import { interfaceLanguageOptions, uiText, type InterfaceLanguage } from "@/lib/i18n";
import { parseMedicationText } from "@/lib/parseMedication";
import { demoSampleLabels, type DemoSampleLabel } from "@/lib/sampleLabel";
import type { MedicationInfo, OcrStatus } from "@/lib/types";
import { getUncertainPrescriptionFields } from "@/utils/parsePrescription";
import { buildSpeechTextFromMedicationCard, speechLanguages, type SpeechLanguageCode } from "@/utils/speech";
import {
  buildTranslatableMedicationCard,
  translatedCardToMedicationInfo,
  translationLanguages,
  translationSafetyWarning,
  type TranslatableMedicationCard,
  type TranslationLanguageCode
} from "@/utils/translateMedicationCard";

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

type SidebarTool = "schedule" | "read" | "language" | "export" | "translate";

const sidebarTools: Array<{ id: SidebarTool; label: string }> = [
  { id: "schedule", label: "Schedule" },
  { id: "read", label: "Read aloud" },
  { id: "language", label: "Language" },
  { id: "export", label: "Export" },
  { id: "translate", label: "Translate" }
];

export default function Home() {
  const [imagePreview, setImagePreview] = useState("");
  const [ocrText, setOcrText] = useState("");
  const [ocrStatus, setOcrStatus] = useState<OcrStatus>("idle");
  const [ocrProgress, setOcrProgress] = useState(0);
  const [reviewInfo, setReviewInfo] = useState<MedicationInfo | null>(null);
  const [hasCompared, setHasCompared] = useState(false);
  const [medicationInfo, setMedicationInfo] = useState<MedicationInfo | null>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<SpeechLanguageCode>("en-US");
  const [interfaceLanguage, setInterfaceLanguage] = useState<InterfaceLanguage>("en");
  const [useReminderTimes, setUseReminderTimes] = useState(false);
  const [customReminderTimes, setCustomReminderTimes] = useState(defaultReminderTimes);
  const [generatedDate, setGeneratedDate] = useState("");
  const [openTool, setOpenTool] = useState<SidebarTool | null>("schedule");
  const [speechMessage, setSpeechMessage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState<TranslationLanguageCode>("es-ES");
  const [translationConsent, setTranslationConsent] = useState(false);
  const [translatedCard, setTranslatedCard] = useState<TranslatableMedicationCard | null>(null);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationError, setTranslationError] = useState("");
  const uploadInputRef = useRef<HTMLDivElement>(null);
  const labels = uiText[interfaceLanguage];
  const currentStep = medicationInfo ? "card" : reviewInfo ? "review" : "upload";

  const readAloudText = useMemo(
    () => (medicationInfo ? buildSpeechTextFromMedicationCard(medicationInfo) : ocrText),
    [medicationInfo, ocrText]
  );
  const generatedSchedule = useMemo(
    () => buildScheduleEntries(medicationInfo, labels, useReminderTimes, customReminderTimes),
    [customReminderTimes, labels, medicationInfo, useReminderTimes]
  );
  const translatedInfo = useMemo(
    () => (translatedCard && medicationInfo ? translatedCardToMedicationInfo(translatedCard, medicationInfo) : null),
    [medicationInfo, translatedCard]
  );

  useEffect(() => {
    setGeneratedDate(new Date().toLocaleString());
  }, [medicationInfo]);

  useEffect(() => {
    setTranslatedCard(null);
    setTranslationConsent(false);
    setTranslationError("");
  }, [medicationInfo]);

  const runOcr = async (file: File) => {
    setImagePreview(URL.createObjectURL(file));
    setOcrStatus("working");
    setOcrProgress(0);
    setReviewInfo(null);
    setHasCompared(false);
    setMedicationInfo(null);

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") {
            setOcrProgress(message.progress);
          }
        }
      });
      const extractedText = result.data.text.trim();
      setOcrText(extractedText);
      setReviewInfo(parseMedicationText(extractedText));
      setOcrStatus("complete");
      setOcrProgress(1);
    } catch {
      setOcrStatus("error");
    }
  };

  const handleOcrTextChange = (text: string) => {
    setOcrText(text);
    setReviewInfo(text.trim() ? parseMedicationText(text) : null);
    setHasCompared(false);
    setMedicationInfo(null);
  };

  const handleReviewFieldChange = (field: EditableReviewField, value: string) => {
    setReviewInfo((current) => {
      const base = current ?? parseMedicationText(ocrText);
      const updatedWithoutUncertainty = {
        ...base,
        [field]: value
      };

      return {
        ...updatedWithoutUncertainty,
        uncertainFields: getUncertainPrescriptionFields(updatedWithoutUncertainty)
      };
    });
    setHasCompared(false);
    setMedicationInfo(null);
  };

  const generateCard = () => {
    if (!reviewInfo || !hasCompared) {
      return;
    }

    setMedicationInfo(reviewInfo);
  };

  const loadDemoSample = (sample: DemoSampleLabel) => {
    const parsedSample = parseMedicationText(sample.text);
    setOcrText(sample.text);
    setReviewInfo(parsedSample);
    setHasCompared(true);
    setMedicationInfo(parsedSample);
    setOcrStatus("complete");
    setOcrProgress(1);
    setImagePreview("");
    uploadInputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const printCard = () => {
    window.print();
  };

  const downloadPdf = () => {
    if (!medicationInfo) {
      return;
    }

    downloadMedicationCardPdf({
      info: medicationInfo,
      labels,
      scheduleEntries: generatedSchedule.entries
    });
  };

  const downloadCombinedPdf = () => {
    if (!medicationInfo || !translatedInfo) {
      return;
    }

    downloadMedicationCardPdf({
      info: medicationInfo,
      labels,
      scheduleEntries: generatedSchedule.entries,
      translatedInfo,
      translationWarning: translationSafetyWarning
    });
  };

  const translateCard = async () => {
    if (!medicationInfo || !translationConsent) {
      return;
    }

    setTranslationLoading(true);
    setTranslationError("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          targetLanguage,
          card: buildTranslatableMedicationCard(medicationInfo)
        })
      });
      const data = (await response.json()) as {
        translation?: TranslatableMedicationCard;
        error?: string;
      };

      if (!response.ok || !data.translation) {
        setTranslationError(data.error ?? "Translation request failed. Try again later.");
        return;
      }

      setTranslatedCard(data.translation);
    } catch {
      setTranslationError("Translation request failed. Try again later.");
    } finally {
      setTranslationLoading(false);
    }
  };

  const clearTranslation = () => {
    setTranslatedCard(null);
    setTranslationError("");
  };

  const handleCustomReminderTimeChange = (id: ReminderTimeId, value: string) => {
    setCustomReminderTimes((current) => ({
      ...current,
      [id]: value
    }));
  };

  const stepClass = (step: "upload" | "review" | "card") =>
    [
      "rounded-full px-3 py-2 text-sm font-black sm:text-base",
      currentStep === step ? "bg-ink text-white" : "bg-white text-ink ring-2 ring-ink"
    ].join(" ");

  const toggleTool = (tool: SidebarTool) => {
    setOpenTool((current) => (current === tool ? null : tool));
  };

  const speak = (text: string, language: string) => {
    setSpeechMessage("");
    if (!("speechSynthesis" in window) || !text.trim()) {
      setSpeechMessage("Text-to-speech is not available in this browser.");
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    const hasMatchingVoice =
      voices.length === 0 || voices.some((voice) => voice.lang.toLowerCase().startsWith(language.toLowerCase().split("-")[0]));
    if (!hasMatchingVoice) {
      setSpeechMessage("A voice for this language may not be available in your browser.");
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <main className="min-h-screen">
      <header className="no-print border-b-2 border-ink bg-white">
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

      <section className="no-print bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 py-6 sm:py-8">
          <h1 className="text-4xl font-black leading-none sm:text-6xl">ReadableRx</h1>
          <p className="mt-3 max-w-3xl text-xl font-semibold leading-snug sm:text-2xl">
            Create a large-print, accessible medication card from a prescription label.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="#upload"
              className="rounded bg-white px-5 py-3 text-center text-lg font-bold text-ink"
              onClick={() => uploadInputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              {labels.uploadLabelPhoto}
            </a>
            <button
              type="button"
              onClick={() => loadDemoSample(demoSampleLabels[0])}
              className="rounded border-2 border-white px-5 py-3 text-lg font-bold text-white"
            >
              {labels.trySampleLabel}
            </button>
          </div>
          <Link href="/demo" className="mt-4 inline-block text-base font-bold underline">
            View demo/about page
          </Link>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-5 px-5 py-6">
        <SafetyDisclaimer labels={labels} compact />

        <nav aria-label="Progress" className="no-print">
          <ol className="flex flex-wrap items-center gap-2">
            <li className={stepClass("upload")}>Upload</li>
            <li aria-hidden="true" className="font-black">&gt;</li>
            <li className={stepClass("review")}>Review</li>
            <li aria-hidden="true" className="font-black">&gt;</li>
            <li className={stepClass("card")}>Card</li>
          </ol>
        </nav>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 gap-5">
            <div id="upload" ref={uploadInputRef} className="no-print">
              <ImageUpload imagePreview={imagePreview} labels={labels} onFileSelected={runOcr} />
            </div>

            <div className="no-print">
              <OcrReview
                text={ocrText}
                status={ocrStatus}
                progress={ocrProgress}
                labels={labels}
                reviewInfo={reviewInfo}
                hasCompared={hasCompared}
                onChange={handleOcrTextChange}
                onFieldChange={handleReviewFieldChange}
                onComparedChange={setHasCompared}
                onGenerate={generateCard}
              />
            </div>

            <div className="print-card">
              {translatedInfo ? (
                <div className="grid gap-5 xl:grid-cols-2">
                  <MedicationCard
                    info={medicationInfo}
                    labels={labels}
                    title="Original medication card"
                    idPrefix="original-card"
                  />
                  <MedicationCard
                    info={translatedInfo}
                    labels={labels}
                    title="Translated medication card"
                    warning={translationSafetyWarning}
                    idPrefix="translated-card"
                  />
                </div>
              ) : (
                <MedicationCard info={medicationInfo} labels={labels} idPrefix="original-card" />
              )}

              <div className="print-only">
                <ScheduleGenerator
                  labels={labels}
                  schedule={generatedSchedule}
                  useReminderTimes={useReminderTimes}
                  customTimes={customReminderTimes}
                  onUseReminderTimesChange={setUseReminderTimes}
                  onCustomTimeChange={handleCustomReminderTimeChange}
                />
                <div className="bg-white p-5 text-ink">
                  <SafetyDisclaimer labels={labels} />
                  <p className="mt-4 text-xl font-bold">
                    {labels.dateGenerated}: {generatedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="no-print h-fit bg-white p-4 shadow-sm lg:sticky lg:top-5" aria-labelledby="tools-title">
            <h2 id="tools-title" className="text-xl font-black">
              Tools
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {sidebarTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  aria-expanded={openTool === tool.id}
                  aria-controls={`tool-panel-${tool.id}`}
                  className={[
                    "rounded border-2 px-3 py-3 text-left text-base font-black",
                    openTool === tool.id ? "border-ink bg-ink text-white" : "border-ink bg-paper text-ink"
                  ].join(" ")}
                >
                  {tool.label}
                </button>
              ))}
            </div>

            {openTool ? (
              <div id={`tool-panel-${openTool}`} className="mt-4 rounded border-2 border-ink bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-black">{sidebarTools.find((tool) => tool.id === openTool)?.label}</h3>
                  <button
                    type="button"
                    onClick={() => setOpenTool(null)}
                    className="rounded border-2 border-ink bg-paper px-3 py-1 text-sm font-bold"
                  >
                    Close
                  </button>
                </div>

                {openTool === "schedule" ? (
                  <div className="mt-4 grid gap-4">
                    <p className="text-base font-semibold text-warning">Visual aid only. Follow the original label.</p>
                    {generatedSchedule.confidence === "low" ? (
                      <p role="alert" className="border-2 border-warning bg-orange-50 p-3 text-base font-bold">
                        Schedule could not be confidently generated. Please follow the original label or ask your pharmacist.
                      </p>
                    ) : null}
                    <ol className="grid gap-2" aria-label={labels.generatedSchedule}>
                      {generatedSchedule.entries.map((entry) => (
                        <li key={entry.id} className="border-l-4 border-action bg-teal-50 p-3 text-base font-bold">
                          {entry.text}
                        </li>
                      ))}
                    </ol>
                    <label className="flex items-start gap-3 text-base font-bold">
                      <input
                        type="checkbox"
                        checked={useReminderTimes}
                        onChange={(event) => setUseReminderTimes(event.target.checked)}
                        className="mt-1 h-5 w-5"
                      />
                      <span>Add reminder clock times</span>
                    </label>
                    {useReminderTimes ? (
                      <div className="grid gap-3">
                        {reminderTimes.map((item) => (
                          <div key={item.id}>
                            <label htmlFor={`sidebar-reminder-${item.id}`} className="block text-sm font-bold">
                              {item.label}
                            </label>
                            <input
                              id={`sidebar-reminder-${item.id}`}
                              value={customReminderTimes[item.id]}
                              onChange={(event) => handleCustomReminderTimeChange(item.id, event.target.value)}
                              className="mt-1 w-full rounded border-2 border-ink bg-white p-2 text-base"
                            />
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {openTool === "read" ? (
                  <div className="mt-4 grid gap-4">
                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={() => speak(readAloudText, voiceLanguage)}
                        disabled={!readAloudText.trim()}
                        className="rounded bg-action px-4 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                      >
                        Read original
                      </button>
                      <button
                        type="button"
                        onClick={stopSpeaking}
                        className="rounded border-2 border-ink bg-white px-4 py-3 text-base font-bold text-ink"
                      >
                        {labels.stop}
                      </button>
                    </div>
                    <div>
                      <label htmlFor="voice-language" className="block text-base font-bold">
                        {labels.readAloudVoiceLanguage}
                      </label>
                      <select
                        id="voice-language"
                        value={voiceLanguage}
                        onChange={(event) => setVoiceLanguage(event.target.value as SpeechLanguageCode)}
                        className="mt-2 w-full rounded border-2 border-ink bg-white p-2 text-base"
                      >
                        {speechLanguages.map((language) => (
                          <option key={language.code} value={language.code}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-base font-semibold text-warning">
                      Voice language affects pronunciation only. It does not translate medication text.
                    </p>
                    {speechMessage ? (
                      <p role="status" className="text-base font-bold text-warning">
                        {speechMessage}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                {openTool === "language" ? (
                  <div className="mt-4 grid gap-4">
                    <div>
                      <label htmlFor="interface-language" className="block text-base font-bold">
                        {labels.interfaceLanguage}
                      </label>
                      <select
                        id="interface-language"
                        value={interfaceLanguage}
                        onChange={(event) => setInterfaceLanguage(event.target.value as InterfaceLanguage)}
                        className="mt-2 w-full rounded border-2 border-ink bg-white p-2 text-base"
                      >
                        {interfaceLanguageOptions.map((language) => (
                          <option key={language.code} value={language.code}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-base font-semibold text-warning">
                      Medication instructions remain in the original extracted language.
                    </p>
                  </div>
                ) : null}

                {openTool === "export" ? (
                  <div className="mt-4 grid gap-3">
                    <button
                      type="button"
                      onClick={printCard}
                      disabled={!medicationInfo}
                      className="rounded border-2 border-ink bg-paper px-4 py-3 text-base font-bold disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-500"
                    >
                      Print Card
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      disabled={!medicationInfo}
                      className="rounded bg-action px-4 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                    >
                      Download original card only
                    </button>
                    <button
                      type="button"
                      onClick={downloadCombinedPdf}
                      disabled={!medicationInfo || !translatedInfo}
                      className="rounded bg-action px-4 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                    >
                      Download original + translated
                    </button>
                  </div>
                ) : null}

                {openTool === "translate" ? (
                  <div className="mt-4 grid gap-4">
                    <p className="border-2 border-warning bg-orange-50 p-3 text-base font-bold text-ink">
                      {translationSafetyWarning}
                    </p>
                    <div>
                      <label htmlFor="target-language" className="block text-base font-bold">
                        Target language
                      </label>
                      <select
                        id="target-language"
                        value={targetLanguage}
                        onChange={(event) => setTargetLanguage(event.target.value as TranslationLanguageCode)}
                        className="mt-2 w-full rounded border-2 border-ink bg-white p-2 text-base"
                      >
                        {translationLanguages.map((language) => (
                          <option key={language.code} value={language.code}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="flex items-start gap-3 text-base font-bold">
                      <input
                        type="checkbox"
                        checked={translationConsent}
                        onChange={(event) => setTranslationConsent(event.target.checked)}
                        className="mt-1 h-5 w-5"
                      />
                      <span>
                        I understand that this translation may contain errors and does not replace the original prescription label.
                      </span>
                    </label>
                    <div className="grid gap-3">
                      <button
                        type="button"
                        onClick={translateCard}
                        disabled={!medicationInfo || !translationConsent || translationLoading}
                        className="rounded bg-action px-4 py-3 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                      >
                        {translationLoading ? "Translating..." : labels.translateMedicationCard}
                      </button>
                      {translatedCard ? (
                        <button
                          type="button"
                          onClick={clearTranslation}
                          className="rounded border-2 border-ink bg-white px-4 py-3 text-base font-bold text-ink"
                        >
                          Clear translation
                        </button>
                      ) : null}
                    </div>
                    <div aria-live="polite" className="min-h-6">
                      {translationLoading ? <p className="text-base font-bold">Translation in progress.</p> : null}
                      {translationError ? (
                        <p role="alert" className="text-base font-bold text-warning">
                          {translationError}
                        </p>
                      ) : null}
                      {translatedCard && !translationError ? (
                        <p className="text-base font-bold text-action">Translated card is shown next to the original.</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  );
}
