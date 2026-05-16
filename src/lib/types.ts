export type PrescriptionField =
  | "medicationName"
  | "strength"
  | "form"
  | "patient"
  | "pharmacy"
  | "prescriber"
  | "rxNumber"
  | "date"
  | "quantity"
  | "refills"
  | "directions"
  | "warnings";

export type MedicationInfo = {
  medicationName: string;
  strength: string;
  form: string;
  patient: string;
  prescriber: string;
  pharmacy: string;
  directions: string;
  quantity: string;
  refills: string;
  rxNumber: string;
  date: string;
  warnings: string;
  uncertainFields: PrescriptionField[];
  rawText: string;
};

export type OcrStatus = "idle" | "working" | "complete" | "error";
