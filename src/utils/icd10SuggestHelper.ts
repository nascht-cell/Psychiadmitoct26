/**
 * AI-Assisted ICD-10 Diagnostic Code Suggestion Helper
 *
 * Analyzes clinical symptoms and narrative notes typed by clinicians,
 * and suggests ranked psychiatric ICD-10 diagnostic codes.
 *
 * Architecture:
 * 1. Primary: Calls server-side Gemini API (/api/gemini/suggest-icd10) for deep clinical contextual reasoning.
 * 2. Fallback / Instant: High-yield psychiatric rule engine matching clinical symptom keywords (Thai & English).
 */

export interface Icd10Suggestion {
  code: string;
  nameEn: string;
  nameTh: string;
  formatted: string;
  category: string;
  confidence: 'High' | 'Medium' | 'Low';
  reason: string;
  suggestedComorbid?: string;
  isOfflineRule?: boolean;
}

export interface SuggestOptions {
  currentCategory?: string[];
  symptoms?: string[];
  signal?: AbortSignal;
}

/**
 * Built-in Psychiatric Clinical Rule Engine for instant offline symptom-to-ICD-10 matching.
 */
export function suggestIcd10OfflineRules(notes: string, symptoms?: string[]): Icd10Suggestion[] {
  const text = `${notes || ''} ${(symptoms || []).join(' ')}`.toLowerCase();
  if (!text.trim()) return [];

  const results: Icd10Suggestion[] = [];

  // Helper matcher
  const has = (...keywords: string[]) => keywords.some(kw => text.includes(kw.toLowerCase()));

  // 1. Alcohol Dependence (F10.2)
  if (has('สุรา', 'เหล้า', 'แอลกอฮอล์', 'alcohol', 'ดื่มจัด', 'มือสั่นตอนขาดเหล้า', 'ลงแดง')) {
    results.push({
      code: 'F10.2',
      nameEn: 'Alcohol Dependence Syndrome',
      nameTh: 'โรคติดสุรา / กลุ่มอาการติดสุรา',
      formatted: 'F10.2 Alcohol Dependence',
      category: 'F10-F19 Substance-related',
      confidence: 'High',
      reason: 'พบประวัติการดื่มสุราต่อเนื่อง มีอาการของการติดหรือถอนสุรา',
      suggestedComorbid: 'F10.5 Alcohol induced Psychotic Disorder',
      isOfflineRule: true,
    });
  }

  // 2. Stimulant Dependence (F15.2)
  if (has('ยาบ้า', 'ไอซ์', 'สารกระตุ้น', 'meth', 'amphetamine', 'methamphetamine', 'สูบยาบ้า', 'เสพยา')) {
    results.push({
      code: 'F15.2',
      nameEn: 'Other Stimulants (Methamphetamine) Dependence',
      nameTh: 'โรคติดสารกระตุ้นประสาท (ยาบ้า / ไอซ์)',
      formatted: 'F15.2 Stimulant Dependence',
      category: 'F10-F19 Substance-related',
      confidence: 'High',
      reason: 'พบประวัติการใช้สารกระตุ้นประสาท กลุ่มแอมเฟตามีนหรือไอซ์อย่างต่อเนื่อง',
      suggestedComorbid: 'F15.5 Stimulant induced Psychotic Disorder',
      isOfflineRule: true,
    });
  }

  // 3. Cannabis Dependence (F12.2)
  if (has('กัญชา', 'cannabis', 'weed', 'thc', 'สูบกัญชา')) {
    results.push({
      code: 'F12.2',
      nameEn: 'Cannabis Dependence',
      nameTh: 'โรคติดกัญชา',
      formatted: 'F12.2 Cannabis Dependence',
      category: 'F10-F19 Substance-related',
      confidence: 'High',
      reason: 'พบประวัติการเสพหรือใช้กัญชาสม่ำเสมอจนมีผลต่อพฤติกรรม',
      suggestedComorbid: 'F12.5 Cannabis induced Psychotic Disorder',
      isOfflineRule: true,
    });
  }

  // 4. Opioid Dependence (F11.2)
  if (has('เฮโรอีน', 'ฝิ่น', 'มอร์ฟีน', 'heroin', 'opioid', 'ยาแก้ปวดเสพติด')) {
    results.push({
      code: 'F11.2',
      nameEn: 'Opioid Dependence',
      nameTh: 'โรคติดสารกลุ่มโอปิออยด์ (เฮโรอีน/ฝิ่น)',
      formatted: 'F11.2 Opioid Dependence',
      category: 'F10-F19 Substance-related',
      confidence: 'High',
      reason: 'พบประวัติการใช้สารเสพติดกลุ่มอนุพันธ์ฝิ่นหรือโอปิออยด์',
      suggestedComorbid: 'F11.5 Opioid induced Psychotic Disorder',
      isOfflineRule: true,
    });
  }

  // 5. Schizophrenia, Paranoid Type (F20.0)
  if (has('หูแว่ว', 'หวาดระแวง', 'ประสาทหลอน', 'หลงผิด', 'คนมาทำร้าย', 'สะกดรอย', 'พลังพิเศษ', 'auditory hallucination', 'persecutory', 'delusion', 'hallucination', 'จิตเภท')) {
    results.push({
      code: 'F20.0',
      nameEn: 'Schizophrenia, Paranoid type',
      nameTh: 'โรคจิตเภท ชนิดหวาดระแวง',
      formatted: 'Schizophrenia, Paranoid type (F20.0)',
      category: 'F20-F29 Schizophrenia/Psychotic',
      confidence: has('หูแว่ว', 'หลงผิด') ? 'High' : 'Medium',
      reason: 'พบอาการจิตประสาทเด่นชัด เช่น ประสาทหลอนทางหู ความคิดหลงผิดระแวงว่ามีคนปองร้าย',
      isOfflineRule: true,
    });
  }

  // 6. Major Depressive Disorder (F32.2 / F32.1)
  if (has('ซึมเศร้า', 'ท้อแท้', 'ไม่อยากมีชีวิต', 'ฆ่าตัวตาย', 'เบื่ออาหาร', 'ร้องไห้', 'anhedonia', 'depress', 'suicid', 'นอนไม่หลับ')) {
    const isSevere = has('ฆ่าตัวตาย', 'ไม่อยากมีชีวิต', 'suicid');
    results.push({
      code: isSevere ? 'F32.2' : 'F32.1',
      nameEn: isSevere
        ? 'Major Depressive Episode, Severe without Psychotic Features'
        : 'Major Depressive Episode, Moderate',
      nameTh: isSevere ? 'โรคซึมเศร้ารุนแรง ไม่มีอาการโรคจิต' : 'โรคซึมเศร้า ระดับปานกลาง',
      formatted: isSevere
        ? 'Major Depressive Episode, Severe without Psychotic Features (F32.2)'
        : 'Major Depressive Episode, Moderate (F32.1)',
      category: 'F30-F39 Mood d/o',
      confidence: isSevere ? 'High' : 'Medium',
      reason: isSevere
        ? 'พบอารมณ์ซึมเศร้าร่วมกับความคิดฆ่าตัวตายหรือเบื่อชีวิตอย่างรุนแรง'
        : 'พบอารมณ์เศร้าต่อเนื่อง สูญเสียความสนใจ และอาการทางกายร่วม',
      isOfflineRule: true,
    });
  }

  // 7. Bipolar I Disorder, Current Manic (F31.1)
  if (has('ไบโพลาร์', 'อารมณ์ดีผิดปกติ', 'คึก', 'พูดเร็ว', 'น้ำไหลไฟดับ', 'ไม่หลับไม่นอน', 'ใช้เงินเยอะ', 'manic', 'bipolar', 'pressured speech', 'grandios')) {
    results.push({
      code: 'F31.1',
      nameEn: 'Bipolar I Disorder, Current episode manic',
      nameTh: 'โรคอารมณ์สองขั้ว ระยะแมเนีย',
      formatted: 'Bipolar I Disorder, Current episode manic (F31.1)',
      category: 'F30-F39 Mood d/o',
      confidence: 'High',
      reason: 'พบพฤติกรรมคึกคัก นอนน้อย พูดเร็วไม่หยุด และความมั่นใจสูงผิดปกติ',
      isOfflineRule: true,
    });
  }

  // 8. Generalized Anxiety Disorder (F41.1) / Panic Disorder (F41.0)
  if (has('กังวล', 'วิตกกังวล', 'ใจสั่น', 'เหงื่อแตก', 'panic', 'anxiety', 'แน่นหน้าอก', 'กลัวว่าจะตาย', 'หายใจไม่อิ่ม')) {
    const isPanic = has('panic', 'แน่นหน้าอก', 'กลัวว่าจะตาย');
    results.push({
      code: isPanic ? 'F41.0' : 'F41.1',
      nameEn: isPanic ? 'Panic Disorder (Episodic Paroxysmal Anxiety)' : 'Generalized Anxiety Disorder',
      nameTh: isPanic ? 'โรคตื่นตระหนก (Panic)' : 'โรควิตกกังวลทั่วไป (GAD)',
      formatted: isPanic ? 'Panic Disorder (F41.0)' : 'Generalized Anxiety Disorder (F41.1)',
      category: 'F40-F48 Anxiety/Somatoform',
      confidence: 'Medium',
      reason: isPanic
        ? 'พบอาการตื่นตระหนกเฉียบพลัน แน่นหน้าอก ใจสั่น และกลัวการเสียชีวิต'
        : 'พบความวิตกกังวลเรื้อรังต่อหลายเรื่องในชีวิตประจำวัน',
      isOfflineRule: true,
    });
  }

  // 9. Adjustment Disorder (F43.21)
  if (has('ปรับตัว', 'เครียดเรื่องงาน', 'ทะเลาะกับแฟน', 'หย่า', 'ตกงาน', 'มีเรื่องสะเทือนใจ', 'adjustment')) {
    results.push({
      code: 'F43.21',
      nameEn: 'Adjustment Disorder with depressed mood',
      nameTh: 'การปรับตัวผิดปกติ ร่วมกับอารมณ์เศร้า',
      formatted: 'Adjustment Disorder with depressed mood (F43.21)',
      category: 'F40-F48 Anxiety/Somatoform',
      confidence: 'Medium',
      reason: 'พบความเครียดสัมพันธ์กับเหตุการณ์ชีวิตสะเทือนใจ ส่งผลต่ออารมณ์ชั่วคราว',
      isOfflineRule: true,
    });
  }

  // 10. Neurocognitive / Dementia / Delirium (F00-F09)
  if (has('สมองเสื่อม', 'หลงลืม', 'สับสน', 'จำลูกไม่ได้', 'จำวันเวลาไม่ได้', 'dementia', 'delirium', 'alzheimer', 'ความจำเสื่อม')) {
    const isAcute = has('สับสนเฉียบพลัน', 'เพ้อ', 'delirium');
    results.push({
      code: isAcute ? 'F05.9' : 'F03',
      nameEn: isAcute ? 'Delirium, unspecified' : 'Unspecified Dementia',
      nameTh: isAcute ? 'ภาวะเพ้อสับสนเฉียบพลัน (Delirium)' : 'โรคสมองเสื่อมไม่ระบุรายละเอียด',
      formatted: isAcute ? 'Delirium, unspecified (F05.9)' : 'Unspecified Dementia (F03)',
      category: 'F00-F09 Neurocognitive d/o',
      confidence: 'Medium',
      reason: 'พบปัญหาความจำถดถอยหรือภาวะสับสนต่อวันเวลาสถานที่',
      isOfflineRule: true,
    });
  }

  return results.slice(0, 5);
}

/**
 * Main helper function: Suggests ICD-10 diagnostic codes based on clinical notes & symptoms.
 * Uses an AI-assisted completion approach with seamless local rule fallback.
 */
export async function suggestIcd10FromNotes(
  notes: string,
  options: SuggestOptions = {}
): Promise<Icd10Suggestion[]> {
  const trimmed = (notes || '').trim();
  if (!trimmed && (!options.symptoms || options.symptoms.length === 0)) {
    return [];
  }

  try {
    const response = await fetch('/api/gemini/suggest-icd10', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        notes: trimmed,
        currentCategory: options.currentCategory || [],
        symptoms: options.symptoms || [],
      }),
      signal: options.signal,
    });

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        return data.suggestions;
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.warn('AI ICD-10 suggestion endpoint unavailable, using clinical rule engine fallback:', err);
  }

  // Fallback to high-yield clinical rule engine
  return suggestIcd10OfflineRules(trimmed, options.symptoms);
}
