"use client";

import type { UiLabels } from "@/lib/i18n";

type ImageUploadProps = {
  imagePreview: string;
  labels: UiLabels;
  onFileSelected: (file: File) => void;
};

export function ImageUpload({ imagePreview, labels, onFileSelected }: ImageUploadProps) {
  return (
    <section aria-labelledby="upload-title" className="bg-white p-5 shadow-sm">
      <h2 id="upload-title" className="text-3xl font-bold">
        1. {labels.uploadPhoto}
      </h2>
      <p className="mt-2 text-lg leading-relaxed">
        Choose a clear photo of the prescription label. OCR runs in your browser.
      </p>
      <label htmlFor="label-photo" className="mt-5 block text-lg font-bold">
        Prescription label photo
      </label>
      <input
        id="label-photo"
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFileSelected(file);
          }
        }}
        className="mt-2 block w-full rounded border-2 border-ink bg-paper p-3 text-lg"
      />
      {imagePreview ? (
        <figure className="mt-5">
          {/* Uploaded object URLs are local previews, so Next image optimization is not useful here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagePreview}
            alt="Uploaded prescription label preview"
            className="max-h-96 w-full object-contain border-2 border-ink bg-paper"
          />
          <figcaption className="mt-2 text-base">Original label preview</figcaption>
        </figure>
      ) : null}
    </section>
  );
}
