export type InterfaceLanguage = "en" | "es" | "zh";

export type UiLabels = {
  accessibleLabelReader: string;
  uploadLabelPhoto: string;
  trySampleLabel: string;
  mainSections: string;
  uploadPhoto: string;
  reviewExtractedText: string;
  generateAccessibleCard: string;
  accessibleMedicationCard: string;
  readTranslatePrint: string;
  medication: string;
  strength: string;
  form: string;
  patient: string;
  pharmacy: string;
  prescriber: string;
  rxNumber: string;
  date: string;
  quantity: string;
  refills: string;
  directionsFromLabel: string;
  warningOrCautionText: string;
  scheduleHelper: string;
  reminderTimes: string;
  generatedSchedule: string;
  readAloud: string;
  stop: string;
  printCard: string;
  downloadCard: string;
  translateMedicationCard: string;
  comingSoon: string;
  importantSafetyNotice: string;
  interfaceLanguage: string;
  readAloudVoiceLanguage: string;
  speechLanguageHelp: string;
  noTranslationHelp: string;
  safetyTranslationNote: string;
  translationComingSoon: string;
  checkOriginalLabel: string;
  uncertainField: string;
  dateGenerated: string;
  safetyBody: string;
  safetyVerify: string;
};

export const uiText: Record<InterfaceLanguage, UiLabels> = {
  en: {
    accessibleLabelReader: "Accessible label reader",
    uploadLabelPhoto: "Upload Label Photo",
    trySampleLabel: "Try Sample Label",
    mainSections: "Main sections",
    uploadPhoto: "Upload photo",
    reviewExtractedText: "Review extracted text",
    generateAccessibleCard: "Generate accessible card",
    accessibleMedicationCard: "Accessible medication card",
    readTranslatePrint: "Read aloud / translate / print",
    medication: "Medication",
    strength: "Strength",
    form: "Form",
    patient: "Patient",
    pharmacy: "Pharmacy",
    prescriber: "Prescriber",
    rxNumber: "Rx number",
    date: "Date",
    quantity: "Quantity",
    refills: "Refills",
    directionsFromLabel: "Directions from label",
    warningOrCautionText: "Warning or caution text",
    scheduleHelper: "Schedule helper",
    reminderTimes: "Reminder times",
    generatedSchedule: "Generated schedule",
    readAloud: "Read aloud",
    stop: "Stop",
    printCard: "Print Card",
    downloadCard: "Download Large-Print PDF",
    translateMedicationCard: "Translate Medication Card",
    comingSoon: "Coming soon",
    importantSafetyNotice: "Important Safety Notice",
    interfaceLanguage: "Interface language",
    readAloudVoiceLanguage: "Read-aloud voice language",
    speechLanguageHelp: "This controls browser speech pronunciation only.",
    noTranslationHelp: "This does not translate the prescription text.",
    safetyTranslationNote:
      "For safety, medication instructions remain in the original extracted language unless a verified translation feature is added.",
    translationComingSoon:
      "Medication translation is safety-sensitive. A future version should show the original and translated text side-by-side and warn users to verify with a pharmacist.",
    checkOriginalLabel: "Check original label",
    uncertainField: "Not confidently detected. Check the original label.",
    dateGenerated: "Date generated",
    safetyBody:
      "ReadableRx does not provide medical advice, does not diagnose conditions, and does not change prescription instructions. It only reformats text from an existing prescription label.",
    safetyVerify:
      "Compare the output with the original label. Ask a pharmacist or clinician if anything is unclear, missing, or different from your prescription."
  },
  es: {
    accessibleLabelReader: "Lector de etiquetas accesible",
    uploadLabelPhoto: "Subir foto de la etiqueta",
    trySampleLabel: "Probar etiqueta de ejemplo",
    mainSections: "Secciones principales",
    uploadPhoto: "Subir foto",
    reviewExtractedText: "Revisar texto extraido",
    generateAccessibleCard: "Generar tarjeta accesible",
    accessibleMedicationCard: "Tarjeta de medicamento accesible",
    readTranslatePrint: "Leer en voz alta / traducir / imprimir",
    medication: "Medicamento",
    strength: "Concentracion",
    form: "Forma",
    patient: "Paciente",
    pharmacy: "Farmacia",
    prescriber: "Profesional que receta",
    rxNumber: "Numero Rx",
    date: "Fecha",
    quantity: "Cantidad",
    refills: "Repeticiones",
    directionsFromLabel: "Indicaciones de la etiqueta",
    warningOrCautionText: "Advertencia o precaucion",
    scheduleHelper: "Ayuda de horario",
    reminderTimes: "Horarios de recordatorio",
    generatedSchedule: "Horario generado",
    readAloud: "Leer en voz alta",
    stop: "Detener",
    printCard: "Imprimir tarjeta",
    downloadCard: "Descargar PDF de letra grande",
    translateMedicationCard: "Traducir tarjeta de medicamento",
    comingSoon: "Proximamente",
    importantSafetyNotice: "Aviso importante de seguridad",
    interfaceLanguage: "Idioma de la interfaz",
    readAloudVoiceLanguage: "Idioma de voz para lectura",
    speechLanguageHelp: "Esto solo controla la pronunciacion de voz del navegador.",
    noTranslationHelp: "Esto no traduce el texto de la receta.",
    safetyTranslationNote:
      "Por seguridad, las indicaciones del medicamento permanecen en el idioma extraido original hasta que se agregue una funcion de traduccion verificada.",
    translationComingSoon:
      "La traduccion de medicamentos es sensible para la seguridad. Una version futura debe mostrar el texto original y traducido lado a lado y advertir a los usuarios que lo verifiquen con un farmaceutico.",
    checkOriginalLabel: "Revise la etiqueta original",
    uncertainField: "Not confidently detected. Check the original label.",
    dateGenerated: "Fecha de generacion",
    safetyBody:
      "ReadableRx no brinda asesoramiento medico, no diagnostica condiciones y no cambia las instrucciones de la receta. Solo reformatea texto de una etiqueta de receta existente.",
    safetyVerify:
      "Compare el resultado con la etiqueta original. Pregunte a un farmaceutico o profesional clinico si algo no esta claro, falta o es diferente de su receta."
  },
  zh: {
    accessibleLabelReader: "无障碍药品标签读取器",
    uploadLabelPhoto: "上传标签照片",
    trySampleLabel: "试用示例标签",
    mainSections: "主要部分",
    uploadPhoto: "上传照片",
    reviewExtractedText: "检查提取的文字",
    generateAccessibleCard: "生成无障碍卡片",
    accessibleMedicationCard: "无障碍药品卡片",
    readTranslatePrint: "朗读 / 翻译 / 打印",
    medication: "药品",
    strength: "规格",
    form: "剂型",
    patient: "患者",
    pharmacy: "药房",
    prescriber: "开方人员",
    rxNumber: "处方编号",
    date: "日期",
    quantity: "数量",
    refills: "续配次数",
    directionsFromLabel: "标签上的用药说明",
    warningOrCautionText: "警告或注意事项",
    scheduleHelper: "用药时间助手",
    reminderTimes: "提醒时间",
    generatedSchedule: "生成的时间表",
    readAloud: "朗读",
    stop: "停止",
    printCard: "打印卡片",
    downloadCard: "下载大字版 PDF",
    translateMedicationCard: "翻译药品卡片",
    comingSoon: "即将推出",
    importantSafetyNotice: "重要安全提示",
    interfaceLanguage: "界面语言",
    readAloudVoiceLanguage: "朗读语音语言",
    speechLanguageHelp: "这只控制浏览器朗读发音。",
    noTranslationHelp: "这不会翻译处方文字。",
    safetyTranslationNote: "出于安全考虑，药品说明会保持原始提取语言，直到加入经过验证的翻译功能。",
    translationComingSoon:
      "药品翻译涉及安全风险。未来版本应并排显示原文和译文，并提醒用户向药剂师核实。",
    checkOriginalLabel: "请核对原始标签",
    uncertainField: "Not confidently detected. Check the original label.",
    dateGenerated: "生成日期",
    safetyBody:
      "ReadableRx 不提供医疗建议，不诊断疾病，也不更改处方说明。它只重新排版现有处方标签中的文字。",
    safetyVerify: "请将输出内容与原始标签进行比较。如有不清楚、缺失或与处方不同之处，请咨询药剂师或临床医生。"
  }
};

export const interfaceLanguageOptions = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Simplified Chinese" }
] satisfies Array<{ code: InterfaceLanguage; label: string }>;
