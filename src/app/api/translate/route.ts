import { NextResponse } from "next/server";
import {
  flattenMedicationCardForTranslation,
  mapToGoogleTarget,
  rebuildTranslatedMedicationCard,
  translationUnavailableMessage,
  type TranslatableMedicationCard,
  type TranslationLanguageCode
} from "@/utils/translateMedicationCard";

type TranslateRequest = {
  targetLanguage: TranslationLanguageCode;
  card: TranslatableMedicationCard;
};

export async function POST(request: Request) {
  const apiKey = process.env.TRANSLATION_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json({ error: translationUnavailableMessage }, { status: 503 });
  }

  let body: TranslateRequest;
  try {
    body = (await request.json()) as TranslateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid translation request." }, { status: 400 });
  }

  const { values, keys } = flattenMedicationCardForTranslation(body.card);
  if (!values.length) {
    return NextResponse.json({
      translation: rebuildTranslatedMedicationCard(body.card, [], [])
    });
  }

  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      q: values,
      target: mapToGoogleTarget(body.targetLanguage),
      format: "text"
    })
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Translation request failed. Try again later." }, { status: 502 });
  }

  const data = (await response.json()) as {
    data?: { translations?: Array<{ translatedText?: string }> };
  };
  const translatedValues = data.data?.translations?.map((item) => item.translatedText ?? "") ?? [];

  return NextResponse.json({
    translation: rebuildTranslatedMedicationCard(body.card, translatedValues, keys)
  });
}
