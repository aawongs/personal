export type DemoSampleLabel = {
  id: string;
  title: string;
  subtitle: string;
  text: string;
};

export const demoSampleLabels: DemoSampleLabel[] = [
  {
    id: "antibiotic",
    title: "Antibiotic",
    subtitle: "Amoxicillin, three times daily",
    text: `Healthy Community Pharmacy
Rx 1842097
Patient: Maria Chen
Medication: Amoxicillin 500 mg capsules
Prescriber: Dr. Lee
Date: 05/15/2026
Directions: Take 1 capsule by mouth three times daily until finished.
Quantity: 21 capsules
Refills: 0
Warning: Take with food if stomach upset occurs. Complete the full course unless your clinician tells you otherwise.`
  },
  {
    id: "blood-pressure",
    title: "Blood pressure medication",
    subtitle: "Lisinopril, once daily",
    text: `City Care Pharmacy
Rx # BP-44091
Patient: Jordan Rivera
Drug: Lisinopril 10mg tablet
Doctor: K. Patel
Filled: 05/12/2026
Sig: Take 1 tablet PO QD
Quantity: 30 tablets
Refills: 2
Caution: May cause dizziness.`
  },
  {
    id: "as-needed",
    title: "As-needed medication",
    subtitle: "Albuterol inhaler, as needed",
    text: `Neighborhood Pharmacy
Rx Number: A77819
Patient: Sam Taylor
Medication: Albuterol 20 mcg inhaler
Prescriber: Dr. Smith
Date: 05/10/2026
Directions: Use 2 puffs PRN wheezing.
Qty: 1 inhaler
Refills: 3
Warning: Follow the original label exactly and ask your pharmacist if symptoms are unclear.`
  }
];

export const sampleLabelText = demoSampleLabels[0].text;
