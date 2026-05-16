"use client";

import { interfaceLanguageOptions, type InterfaceLanguage, type UiLabels } from "@/lib/i18n";

type LanguageSelectorProps = {
  voiceLanguage: string;
  interfaceLanguage: InterfaceLanguage;
  labels: UiLabels;
  onVoiceLanguageChange: (value: string) => void;
  onInterfaceLanguageChange: (value: InterfaceLanguage) => void;
};

const voiceLanguages = [
  { code: "en-US", label: "English (US)" },
  { code: "es-US", label: "Spanish (US)" },
  { code: "fr-FR", label: "French" },
  { code: "zh-CN", label: "Chinese (Mandarin)" }
];

export function LanguageSelector({
  voiceLanguage,
  interfaceLanguage,
  labels,
  onVoiceLanguageChange,
  onInterfaceLanguageChange
}: LanguageSelectorProps) {
  return (
    <div className="grid gap-5">
      <div>
        <label htmlFor="interface-language" className="block text-lg font-bold">
          {labels.interfaceLanguage}
        </label>
        <select
          id="interface-language"
          value={interfaceLanguage}
          onChange={(event) => onInterfaceLanguageChange(event.target.value as InterfaceLanguage)}
          className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-lg"
        >
          {interfaceLanguageOptions.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="voice-language" className="block text-lg font-bold">
          {labels.readAloudVoiceLanguage}
        </label>
        <select
          id="voice-language"
          value={voiceLanguage}
          onChange={(event) => onVoiceLanguageChange(event.target.value)}
          className="mt-2 w-full rounded border-2 border-ink bg-white p-3 text-lg"
        >
          {voiceLanguages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
        <p className="mt-2 text-base font-semibold text-warning">
          Voice language affects pronunciation only. It does not translate medication text.
        </p>
      </div>
    </div>
  );
}
