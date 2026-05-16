# ReadableRx

ReadableRx is an accessibility-focused prescription label reader. It runs OCR in the browser, lets users correct extracted text, and creates a large-print, high-contrast medication card.

The MVP keeps all OCR, review, display, speech, print, and PDF download logic client-side.

## Why This Matters

Prescription labels can be small, dense, and difficult to read. ReadableRx helps reformat existing label text into large-print, high-contrast, screen-reader-friendly cards.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Tesseract.js
- Browser Web Speech API
- Client-side PDF generation

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Routes:

- `/`: focused main app for upload, OCR review, card generation, accessibility tools, print, and PDF export.
- `/demo`: portfolio-friendly project overview, sample labels, safety boundaries, limitations, and future improvements.

## Demo Mode

The homepage includes three synthetic sample labels for quick portfolio review:

- Antibiotic: Amoxicillin, three times daily
- Blood pressure medication: Lisinopril, once daily
- As-needed medication: Albuterol inhaler, as needed

Click any sample to populate the review fields and generate an accessible card.

## Screenshots

Suggested screenshots for GitHub or portfolio pages:

- `docs/screenshots/homepage.png`: Homepage with Demo Mode visible.
- `docs/screenshots/review-step.png`: OCR review with structured editable fields and verification checkbox.
- `docs/screenshots/medication-card.png`: Large-print medication card with schedule helper.
- `docs/screenshots/pdf-output.png`: Downloaded large-print PDF preview.

To capture them, run the app locally, load a Demo Mode sample, and save browser screenshots into `docs/screenshots/`.

## Safety

ReadableRx does not provide medical advice, diagnose conditions, or change prescription instructions. It only reformats text from an existing prescription label. Users must compare the output with the original label and ask a pharmacist or clinician if anything is unclear.

## Safety Boundaries

- Does not provide medical advice
- Does not change instructions
- Does not check drug interactions
- Does not diagnose
- Requires user verification against original label

## Future Improvements

- Pharmacy template recognition
- Verified translation workflow
- Caregiver sharing mode
- Medication card QR code
- Integration with accessibility audits
 
