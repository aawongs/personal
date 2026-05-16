"use client";

import { useEffect, useState } from "react";

type ReadAloudButtonProps = {
  text: string;
  language: string;
  readLabel: string;
  stopLabel: string;
};

export function ReadAloudButton({ text, language, readLabel, stopLabel }: ReadAloudButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = () => {
    if (!isSupported || !text.trim()) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.85;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={speak}
        disabled={!isSupported || !text.trim()}
        className="rounded bg-action px-5 py-3 text-lg font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-500"
      >
        {readLabel}
      </button>
      <button
        type="button"
        onClick={stop}
        disabled={!isSpeaking}
        className="rounded border-2 border-ink bg-white px-5 py-3 text-lg font-bold text-ink disabled:cursor-not-allowed disabled:border-gray-400 disabled:text-gray-500"
      >
        {stopLabel}
      </button>
      {!isSupported ? (
        <p role="status" className="text-base font-semibold text-warning">
          Text-to-speech is not available in this browser.
        </p>
      ) : null}
    </div>
  );
}
