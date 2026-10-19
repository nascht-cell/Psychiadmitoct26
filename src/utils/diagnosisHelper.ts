/**
 * Diagnosis and Comorbidity helper utilities for Psychiatric Assessments.
 * Handles automatic mapping and safe appending/replacing of F1x.2 Primary Diagnosis
 * with corresponding F1x.5 Substance-Induced Psychotic Disorders in Comorbidity,
 * ensuring preexisting medical conditions (e.g. HT, DM, DLP) are never lost or overwritten.
 */

export interface F1xSubstanceInfo {
  code: string;
  label: string;
  dependenceCode: string;
  dependenceLabel: string;
  name: string;
}

export const F1X_SUBSTANCE_MAP: Record<string, F1xSubstanceInfo> = {
  F10: {
    code: 'F10.5',
    label: 'F10.5 Alcohol induced Psychotic Disorder',
    dependenceCode: 'F10.2',
    dependenceLabel: 'F10.2 Alcohol Dependence',
    name: 'Alcohol (สุรา)',
  },
  F11: {
    code: 'F11.5',
    label: 'F11.5 Opioid induced Psychotic Disorder',
    dependenceCode: 'F11.2',
    dependenceLabel: 'F11.2 Opioid Dependence',
    name: 'Opioids (ฝิ่น/เฮโรอีน)',
  },
  F12: {
    code: 'F12.5',
    label: 'F12.5 Cannabis induced Psychotic Disorder',
    dependenceCode: 'F12.2',
    dependenceLabel: 'F12.2 Cannabis Dependence',
    name: 'Cannabis (กัญชา)',
  },
  F13: {
    code: 'F13.5',
    label: 'F13.5 Sedative induced Psychotic Disorder',
    dependenceCode: 'F13.2',
    dependenceLabel: 'F13.2 Sedative Dependence',
    name: 'Sedatives (ยานอนหลับ/ยากล่อมประสาท)',
  },
  F14: {
    code: 'F14.5',
    label: 'F14.5 Cocaine induced Psychotic Disorder',
    dependenceCode: 'F14.2',
    dependenceLabel: 'F14.2 Cocaine Dependence',
    name: 'Cocaine (โคเคน)',
  },
  F15: {
    code: 'F15.5',
    label: 'F15.5 Stimulant induced Psychotic Disorder',
    dependenceCode: 'F15.2',
    dependenceLabel: 'F15.2 Stimulant Dependence',
    name: 'Stimulants (ยาบ้า/ไอซ์/สารกระตุ้น)',
  },
  F16: {
    code: 'F16.5',
    label: 'F16.5 Hallucinogen induced Psychotic Disorder',
    dependenceCode: 'F16.2',
    dependenceLabel: 'F16.2 Hallucinogen Dependence',
    name: 'Hallucinogens (สารหลอนประสาท)',
  },
  F17: {
    code: 'F17.5',
    label: 'F17.5 Tobacco induced Psychotic Disorder',
    dependenceCode: 'F17.2',
    dependenceLabel: 'F17.2 Tobacco Dependence',
    name: 'Tobacco (ยาสูบ/บุหรี่)',
  },
  F18: {
    code: 'F18.5',
    label: 'F18.5 Volatile solvent induced Psychotic Disorder',
    dependenceCode: 'F18.2',
    dependenceLabel: 'F18.2 Volatile solvent Dependence',
    name: 'Volatile solvents (สารระเหย/ทินเนอร์)',
  },
  F19: {
    code: 'F19.5',
    label: 'F19.5 Multiple drug induced Psychotic Disorder',
    dependenceCode: 'F19.2',
    dependenceLabel: 'F19.2 Multiple Substance Dependence',
    name: 'Multiple substances (หลายชนิดร่วมกัน)',
  },
};

const F1_DEPENDENCE_REGEX = /F1(\d)\.2/i;
const EXISTING_F1X5_REGEX = /F1\d\.5(?:\s*[:\-–]\s*|\s+)[^,;\n]+|F1\d\.5/i;
const RE_DOUBLE_COMMA = /,\s*,/g;
const RE_EDGE_COMMAS = /^,\s*|,\s*$/g;
const RE_TRAILING_COMMA = /,\s*$/;

/**
 * Given a primary diagnosis string or code (e.g., 'F10.2', 'F10.2 Alcohol Dependence', 'Alcohol (F10.2)'),
 * detects if it contains an F1x.2 code and returns the corresponding F1x.5 label, or null.
 */
export function getF1x5FromPrimaryDiagnosis(primaryDx: string | undefined): string | null {
  if (!primaryDx) return null;
  const match = primaryDx.match(F1_DEPENDENCE_REGEX);
  if (!match) return null;
  const categoryKey = `F1${match[1]}`;
  return F1X_SUBSTANCE_MAP[categoryKey]?.label || null;
}

/**
 * Appends or updates the F1x.5 substance-induced psychotic disorder in Comorbidity,
 * while safely preserving all preexisting medical conditions (e.g. HT, DM, DLP, etc.).
 *
 * @param currentComorbid The existing comorbid string in assessment data.
 * @param f1x5Label The F1x.5 label to append or update (e.g. 'F10.5 Alcohol induced Psychotic Disorder').
 * @returns The updated comorbid string with medical conditions preserved.
 */
export function appendOrUpdateF1x5Comorbid(
  currentComorbid: string | undefined,
  f1x5Label: string
): string {
  const current = (currentComorbid || '').trim();
  if (!current) {
    return f1x5Label;
  }

  // If already exactly present, no modification needed
  if (current.includes(f1x5Label)) {
    return current;
  }

  if (EXISTING_F1X5_REGEX.test(current)) {
    // Replace the old F1x.5 with the new one, keeping all other medical conditions intact
    return current
      .replace(EXISTING_F1X5_REGEX, f1x5Label)
      .replace(RE_DOUBLE_COMMA, ', ')
      .replace(RE_EDGE_COMMAS, '')
      .trim();
  }

  // Otherwise append to existing comorbidities (preserving HT, DM, DLP, etc.)
  const cleanCurrent = current.replace(RE_TRAILING_COMMA, '');
  return `${cleanCurrent}, ${f1x5Label}`;
}
