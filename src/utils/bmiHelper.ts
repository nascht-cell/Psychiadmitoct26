/**
 * BMI Calculation and Clinical Nutrition / Obesity Automation Helper
 * Based on WHO / Clinical Nutrition & Psychiatric Assessment guidelines:
 * - Underweight: < 18.5 -> Impaired nutrition (Undernutrition / ขาดสารอาหาร)
 * - Healthy Weight: 18.5 - 24.9 -> Normal nutrition (Eunutrition / ปกติสมบูรณ์ดี)
 * - Overweight: 25 - 29.9 -> Normal nutrition (น้ำหนักเกิน / เฝ้าระวัง)
 * - Obese (Class I): 30 - 34.9 -> Impaired nutrition (Overnutrition / โรคอ้วนระดับ 1)
 * - Severely Obese (Class II): 35 - 39.9 -> Impaired nutrition (Overnutrition / โรคอ้วนระดับ 2)
 * - Morbidly Obese (Class III): >= 40 -> Impaired nutrition (Overnutrition / โรคอ้วนอันตราย)
 */

export interface BmiResult {
  bmi: string;
  category: string;
  isObeseClass1OrAbove: boolean;
  isUnderweight: boolean;
  obesitySeverity: string;
  badgeColorClass: string;
  nutritionStatus: 'Normal' | 'Impaired' | '';
  nutritionRationale: string;
  nutritionDetailedRationale: string;
}

export function calculateBmi(weightStr: string, heightStr: string): BmiResult {
  const w = parseFloat(weightStr);
  const h = parseFloat(heightStr);
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
    return {
      bmi: '',
      category: '',
      isObeseClass1OrAbove: false,
      isUnderweight: false,
      obesitySeverity: '',
      badgeColorClass: '',
      nutritionStatus: '',
      nutritionRationale: '',
      nutritionDetailedRationale: '',
    };
  }

  const heightM = h / 100;
  const bmiVal = w / (heightM * heightM);
  const bmi = bmiVal.toFixed(1);

  let category = '';
  let isObeseClass1OrAbove = false;
  let isUnderweight = false;
  let obesitySeverity = '';
  let badgeColorClass = '';
  let nutritionStatus: 'Normal' | 'Impaired' = 'Normal';
  let nutritionRationale = '';
  let nutritionDetailedRationale = '';

  if (bmiVal < 18.5) {
    category = 'Underweight';
    badgeColorClass = 'bg-sky-100 text-sky-800 border-sky-300 font-bold';
    isUnderweight = true;
    nutritionStatus = 'Impaired';
    nutritionRationale = 'BMI < 18.5 (Underweight): ภาวะทุพโภชนาการแบบขาดสารอาหาร (Undernutrition)';
    nutritionDetailedRationale =
      'BMI < 18.5 อยู่ในเกณฑ์น้ำหนักต่ำกว่าเกณฑ์ บ่งชี้ภาวะทุพโภชนาการแบบขาดสารอาหารและพลังงาน (Undernutrition / Protein-Energy Malnutrition) หรืออาจสัมพันธ์กับภาวะเบื่ออาหาร/ซึมเศร้า ควรได้รับการเสริมโภชนาการ';
  } else if (bmiVal <= 24.9) {
    category = 'Healthy Weight';
    badgeColorClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    nutritionStatus = 'Normal';
    nutritionRationale = 'BMI 18.5 - 24.9 (Healthy Weight): ภาวะโภชนาการปกติสมบูรณ์ดี (Eunutrition)';
    nutritionDetailedRationale =
      'BMI 18.5 - 24.9 อยู่ในเกณฑ์มาตรฐานสุขภาพดี ร่างกายได้รับสารอาหารและพลังงานอย่างสมดุล (Eunutrition) ไม่พบภาวะทุพโภชนาการ';
  } else if (bmiVal <= 29.9) {
    category = 'Overweight';
    badgeColorClass = 'bg-amber-100 text-amber-800 border-amber-300';
    nutritionStatus = 'Normal';
    nutritionRationale = 'BMI 25.0 - 29.9 (Overweight): น้ำหนักเกินเกณฑ์มาตรฐาน (เฝ้าระวัง)';
    nutritionDetailedRationale =
      'BMI 25.0 - 29.9 อยู่ในเกณฑ์น้ำหนักเกิน (Overweight) ยังไม่เข้าเกณฑ์โรคอ้วนระดับ 1 สภาพร่างกายส่วนใหญ่ยังชดเชยได้ ให้สถานะโภชนาการ Normal แต่ควรเฝ้าระวังและปรับพฤติกรรมบริโภค';
  } else if (bmiVal <= 34.9) {
    category = 'Obese (Class I)';
    isObeseClass1OrAbove = true;
    obesitySeverity = 'Obese (Class I)';
    badgeColorClass = 'bg-orange-100 text-orange-900 border-orange-400 font-bold';
    nutritionStatus = 'Impaired';
    nutritionRationale = 'BMI 30.0 - 34.9 (Obese Class I): ภาวะทุพโภชนาการเกิน (Overnutrition / Obesity)';
    nutritionDetailedRationale =
      'BMI 30.0 - 34.9 เข้าเกณฑ์โรคอ้วนระดับ 1 ทางการแพทย์จัดเป็นภาวะทุพโภชนาการเกิน (Overnutrition / Malnutrition) มีความเสี่ยงต่อ Metabolic Syndrome และโรคหลอดเลือดหัวใจ';
  } else if (bmiVal <= 39.9) {
    category = 'Severely Obese (Class II)';
    isObeseClass1OrAbove = true;
    obesitySeverity = 'Severely Obese (Class II)';
    badgeColorClass = 'bg-rose-100 text-rose-900 border-rose-400 font-bold';
    nutritionStatus = 'Impaired';
    nutritionRationale = 'BMI 35.0 - 39.9 (Severely Obese): ภาวะทุพโภชนาการเกินขั้นรุนแรง';
    nutritionDetailedRationale =
      'BMI 35.0 - 39.9 เข้าเกณฑ์โรคอ้วนระดับ 2 ภาวะทุพโภชนาการเกินขั้นรุนแรง มีความเสี่ยงต่อภาวะแทรกซ้อนทางกายสูงมาก จำเป็นต้องได้รับคำปรึกษาจากนักโภชนบำบัด';
  } else {
    category = 'Morbidly Obese (Class III)';
    isObeseClass1OrAbove = true;
    obesitySeverity = 'Morbidly Obese (Class III)';
    badgeColorClass = 'bg-rose-600 text-white border-rose-700 font-extrabold shadow-xs';
    nutritionStatus = 'Impaired';
    nutritionRationale = 'BMI ≥ 40.0 (Morbidly Obese): ภาวะทุพโภชนาการเกินขั้นอันตรายยิ่งยวด';
    nutritionDetailedRationale =
      'BMI ≥ 40.0 เข้าเกณฑ์โรคอ้วนอันตรายยิ่งยวด ภาวะทุพโภชนาการเกินขั้นวิกฤต ส่งผลกระทบต่อระบบหัวใจ หลอดเลือด และระบบหายใจ จำเป็นต้องดูแลโภชนาการอย่างเร่งด่วน';
  }

  return {
    bmi,
    category,
    isObeseClass1OrAbove,
    isUnderweight,
    obesitySeverity,
    badgeColorClass,
    nutritionStatus,
    nutritionRationale,
    nutritionDetailedRationale,
  };
}

/**
 * Automates comorbidity, nutrition, and MDT consult when BMI >= 30 (Obesity)
 * 1. Fills comorbidity according to level of obesity severity
 * 2. Sets nutrition to 'Impaired' (Overnutrition)
 * 3. Writes MDT consult specifying 'นักโภชนบำบัด ปรึกษาเรื่องน้ำหนักเกินและปรับอาหารให้เหมาะสม'
 */
export function applyObesityAutomation(
  severity: string,
  currentComorbid: string = '',
  currentMdtRoles: string[] = [],
  currentMdtOther: string = ''
) {
  // 1. Update comorbidity with level of obesity severity
  const obesityRegex =
    /(Obese \(Class I\)|Severely Obese \(Class II\)|Morbidly Obese \(Class III\)|Obesity \(Class I\)|Severe Obesity \(Class II\)|Morbid Obesity \(Class III\)|Obesity)/gi;
  let newComorbid = currentComorbid ? currentComorbid.trim() : '';
  if (obesityRegex.test(newComorbid)) {
    newComorbid = newComorbid.replace(obesityRegex, severity);
  } else if (newComorbid) {
    newComorbid = `${newComorbid}, ${severity}`;
  } else {
    newComorbid = severity;
  }

  // 2. MDT Consult
  const newMdtConsult = 'ส่ง';
  const newMdtRoles = Array.from(new Set([...(currentMdtRoles || []), 'นักโภชนบำบัด']));

  const targetNote = 'นักโภชนบำบัด ปรึกษาเรื่องน้ำหนักเกินและปรับอาหารให้เหมาะสม';
  let newMdtOther = currentMdtOther ? currentMdtOther.trim() : '';
  if (!newMdtOther) {
    newMdtOther = targetNote;
  } else if (!newMdtOther.includes('นักโภชนบำบัด') && !newMdtOther.includes('ปรับอาหาร')) {
    newMdtOther = `${newMdtOther}, ${targetNote}`;
  }

  return {
    comorbidDiagnosis: newComorbid,
    nutrition: 'Impaired' as const,
    mdtConsult: newMdtConsult as 'ส่ง',
    mdtRoles: newMdtRoles,
    mdtOther: newMdtOther,
  };
}

/**
 * Automates comorbidity, nutrition, and MDT consult when BMI < 18.5 (Underweight)
 * 1. Fills comorbidity with Underweight / Malnutrition
 * 2. Sets nutrition to 'Impaired' (Undernutrition)
 * 3. Writes MDT consult specifying 'นักโภชนบำบัด ปรึกษาเรื่องน้ำหนักต่ำกว่าเกณฑ์และเสริมโภชนาการ'
 */
export function applyUnderweightAutomation(
  currentComorbid: string = '',
  currentMdtRoles: string[] = [],
  currentMdtOther: string = ''
) {
  const underweightTerm = 'Underweight / Malnutrition (น้ำหนักต่ำกว่าเกณฑ์/ขาดสารอาหาร)';
  let newComorbid = currentComorbid ? currentComorbid.trim() : '';
  if (!newComorbid.includes('Underweight') && !newComorbid.includes('ขาดสารอาหาร')) {
    newComorbid = newComorbid ? `${newComorbid}, ${underweightTerm}` : underweightTerm;
  }

  const newMdtConsult = 'ส่ง';
  const newMdtRoles = Array.from(new Set([...(currentMdtRoles || []), 'นักโภชนบำบัด']));
  const targetNote = 'นักโภชนบำบัด ปรึกษาเรื่องน้ำหนักต่ำกว่าเกณฑ์และเสริมโภชนาการ';
  let newMdtOther = currentMdtOther ? currentMdtOther.trim() : '';
  if (!newMdtOther) {
    newMdtOther = targetNote;
  } else if (!newMdtOther.includes('นักโภชนบำบัด') && !newMdtOther.includes('น้ำหนักต่ำกว่าเกณฑ์')) {
    newMdtOther = `${newMdtOther}, ${targetNote}`;
  }

  return {
    comorbidDiagnosis: newComorbid,
    nutrition: 'Impaired' as const,
    mdtConsult: newMdtConsult as 'ส่ง',
    mdtRoles: newMdtRoles,
    mdtOther: newMdtOther,
  };
}
