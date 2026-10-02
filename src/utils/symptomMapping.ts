import { PsychiatricAssessment } from '../types/assessment';

export type DiagnosticGroup =
  | 'psychotic'
  | 'depressive'
  | 'bipolar'
  | 'substance'
  | 'neurocognitive'
  | 'anxiety'
  | 'all';

export interface SymptomItem {
  name: string;
  activeCls: string;
  description?: string;
}

export interface DiagnosticGroupConfig {
  id: DiagnosticGroup;
  label: string;
  shortLabel: string;
  iconName: string;
  badge: string;
  chiefComplaints: SymptomItem[];
  associatedSymptoms: SymptomItem[];
}

export const DIAGNOSTIC_GROUPS: Record<Exclude<DiagnosticGroup, 'all'>, DiagnosticGroupConfig> = {
  psychotic: {
    id: 'psychotic',
    label: 'กลุ่มอาการโรคจิต / จิตเภท (Schizophrenia & Psychotic Disorders)',
    shortLabel: 'โรคจิต/จิตเภท',
    iconName: 'Brain',
    badge: '🧠 จิตเภท / อาการโรคจิต',
    chiefComplaints: [
      { name: 'หูแว่ว/ประสาทหลอน', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'หวาดระแวง/หลงผิด', activeCls: 'bg-violet-600 text-white border-violet-600 font-bold shadow-xs' },
      { name: 'คิดว่ามีคนมาทำร้าย', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
      { name: 'คิดว่าตนเองมีพลังพิเศษ', activeCls: 'bg-fuchsia-600 text-white border-fuchsia-600 font-bold shadow-xs' },
      { name: 'พูดคนเดียว/หัวเราะคนเดียว', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'ตอบไม่ตรงคำถาม', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'แสดงพฤติกรรมแปลกๆ', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'หงุดหงิด/ก้าวร้าว', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs ring-1 ring-orange-300' },
      { name: 'แยกตัว', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
      { name: 'ไม่ดูแลตัวเอง', activeCls: 'bg-amber-700 text-white border-amber-700 font-bold shadow-xs' },
      { name: 'นอนไม่หลับ', activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs' },
      { name: 'ขาดยา/ปฏิเสธการกินยา', activeCls: 'bg-red-700 text-white border-red-700 font-bold shadow-xs' },
    ],
    associatedSymptoms: [
      { name: 'หูแว่วได้ยินเสียงคนพูดคุย', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'เห็นภาพหลอน', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'คิดว่ามีคนมาทำร้าย', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
      { name: 'คิดว่าตนเองมีพลังพิเศษ', activeCls: 'bg-fuchsia-600 text-white border-fuchsia-600 font-bold shadow-xs' },
      { name: 'พูดคนเดียว', activeCls: 'bg-violet-600 text-white border-violet-600 font-bold shadow-xs' },
      { name: 'ตอบไม่ตรงคำถาม', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'แสดงพฤติกรรมแปลกๆ', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'แยกตัว', activeCls: 'bg-slate-600 text-white border-slate-600 font-bold shadow-xs' },
      { name: 'ไม่ดูแลตัวเอง', activeCls: 'bg-amber-700 text-white border-amber-700 font-bold shadow-xs' },
      { name: 'นอนไม่หลับ', activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs' },
      { name: 'หวาดระแวงสะกดรอย', activeCls: 'bg-red-600 text-white border-red-600 font-bold shadow-xs' },
      { name: 'คิดว่าความคิดถูกควบคุม (Passivity)', activeCls: 'bg-purple-700 text-white border-purple-700 font-bold shadow-xs' },
      { name: 'อารมณ์เฉยเมยไม่สบตา', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
      { name: 'พฤติกรรมก้าวร้าว/เอะอะโวยวาย', activeCls: 'bg-orange-700 text-white border-orange-700 font-bold shadow-xs' },
    ],
  },
  depressive: {
    id: 'depressive',
    label: 'กลุ่มโรคซึมเศร้า (Depressive Disorders / MDD)',
    shortLabel: 'ซึมเศร้า',
    iconName: 'CloudRain',
    badge: '🌧️ โรคซึมเศร้า',
    chiefComplaints: [
      { name: 'ซึมเศร้า/ท้อแท้', activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs' },
      { name: 'อยากตาย/พยายามทำร้ายตนเอง', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-2 ring-rose-400/50' },
      { name: 'เบื่อหน่ายไม่เพลิดเพลิน (Anhedonia)', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'ร้องไห้บ่อยผิดปกติ', activeCls: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs' },
      { name: 'นอนไม่หลับ', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
      { name: 'เบื่ออาหาร/น้ำหนักลด', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'อ่อนเพลีย/หมดแรง', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'รู้สึกไร้ค่า/เป็นภาระคนอื่น', activeCls: 'bg-violet-600 text-white border-violet-600 font-bold shadow-xs' },
      { name: 'วิตกกังวล/กระสับกระส่าย', activeCls: 'bg-amber-700 text-white border-amber-700 font-bold shadow-xs' },
      { name: 'แยกตัว', activeCls: 'bg-slate-600 text-white border-slate-600 font-bold shadow-xs' },
    ],
    associatedSymptoms: [
      { name: 'นอนไม่หลับ', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'เบื่ออาหาร', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'น้ำหนักลด/เพิ่ม', activeCls: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs' },
      { name: 'อ่อนเพลีย', activeCls: 'bg-slate-600 text-white border-slate-600 font-bold shadow-xs' },
      { name: 'แยกตัว', activeCls: 'bg-violet-600 text-white border-violet-600 font-bold shadow-xs' },
      { name: 'รู้สึกผิด/ตำหนิตนเอง', activeCls: 'bg-blue-700 text-white border-blue-700 font-bold shadow-xs' },
      { name: 'สมาธิและความจำลดลง', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'เชื่องช้าลง (Retardation)', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
      { name: 'กระวนกระวายใจ (Agitation)', activeCls: 'bg-amber-700 text-white border-amber-700 font-bold shadow-xs' },
      { name: 'ตื่นเช้ากว่าปกติมาก (Early awakening)', activeCls: 'bg-blue-800 text-white border-blue-800 font-bold shadow-xs' },
      { name: 'ความคิดอยากตายซ้ำๆ', activeCls: 'bg-rose-700 text-white border-rose-700 font-bold shadow-xs ring-1 ring-rose-300' },
      { name: 'ไม่อยากทำสิ่งที่เคยชอบ', activeCls: 'bg-teal-700 text-white border-teal-700 font-bold shadow-xs' },
    ],
  },
  bipolar: {
    id: 'bipolar',
    label: 'กลุ่มโรคอารมณ์สองขั้ว / แมเนีย (Bipolar I / Manic Episode)',
    shortLabel: 'ไบโพลาร์/แมเนีย',
    iconName: 'Zap',
    badge: '⚡ ไบโพลาร์ / แมเนีย',
    chiefComplaints: [
      { name: 'อารมณ์ครึกครื้นผิดปกติ', activeCls: 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs' },
      { name: 'พูดมาก/ไม่ยอมนอน', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
      { name: 'ใช้จ่ายฟุ่มเฟือย/แจกของ', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'หงุดหงิด/ก้าวร้าว', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
      { name: 'เชื่อมั่นในตนเองสูงเกินจริง', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'มีพลังงานล้น/อยู่ไม่นิ่ง', activeCls: 'bg-yellow-600 text-white border-yellow-600 font-bold shadow-xs' },
      { name: 'วู่วาม/ยับยั้งชั่งใจไม่ได้', activeCls: 'bg-red-600 text-white border-red-600 font-bold shadow-xs' },
      { name: 'มีโครงการเยอะผิดปกติ', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'แสดงพฤติกรรมแปลกๆ', activeCls: 'bg-fuchsia-600 text-white border-fuchsia-600 font-bold shadow-xs' },
    ],
    associatedSymptoms: [
      { name: 'นอนน้อยแต่ไม่เพลีย', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'ความคิดแล่นเร็ว (Flight of ideas)', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'วอกแวกง่าย (Distractibility)', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
      { name: 'พูดเร็ว/พูดไม่หยุด (Pressured speech)', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'พฤติกรรมเสี่ยงอันตราย', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
      { name: 'อารมณ์แปรปรวนง่าย', activeCls: 'bg-pink-600 text-white border-pink-600 font-bold shadow-xs' },
      { name: 'แต่งกายฉูดฉาดแปลกตา', activeCls: 'bg-fuchsia-600 text-white border-fuchsia-600 font-bold shadow-xs' },
      { name: 'หงุดหงิดรุนแรงเมื่อถูกขัดใจ', activeCls: 'bg-red-600 text-white border-red-600 font-bold shadow-xs' },
      { name: 'ใช้เงินเกินตัว/ขับรถเร็ว', activeCls: 'bg-amber-700 text-white border-amber-700 font-bold shadow-xs' },
      { name: 'ความต้องการทางเพศเพิ่มขึ้น', activeCls: 'bg-rose-700 text-white border-rose-700 font-bold shadow-xs' },
    ],
  },
  substance: {
    id: 'substance',
    label: 'กลุ่มโรคจากสารเสพติด / สุรา (Substance-Related & Addiction)',
    shortLabel: 'สารเสพติด/สุรา',
    iconName: 'Flame',
    badge: '🧪 สารเสพติด / สุรา',
    chiefComplaints: [
      { name: 'อาการถอน/ลงแดง (Withdrawal)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
      { name: 'หูแว่ว/หวาดระแวงหลังใช้สาร', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'ก้าวร้าว/อาละวาด', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
      { name: 'สั่น/เหงื่อแตก/กระวนกระวาย', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'ชักหลังหยุดสาร/สุรา', activeCls: 'bg-red-700 text-white border-red-700 font-bold shadow-xs ring-2 ring-red-400' },
      { name: 'สับสนเพ้อคลั่ง (Delirium tremens)', activeCls: 'bg-violet-700 text-white border-violet-700 font-bold shadow-xs' },
      { name: 'อยากยาอย่างรุนแรง (Craving)', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'นอนไม่หลับ', activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs' },
      { name: 'มีปัญหาพฤติกรรม', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
    ],
    associatedSymptoms: [
      { name: 'มือสั่น/ตัวสั่น (Tremor)', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'ใจสั่น/ชีพจรเต้นเร็ว', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
      { name: 'เหงื่อแตกพลั่ก (Diaphoresis)', activeCls: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs' },
      { name: 'คลื่นไส้/อาเจียน', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'หวาดระแวงคนจะมาจับ', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'หูแว่วเสียงคนขู่ด่า', activeCls: 'bg-violet-600 text-white border-violet-600 font-bold shadow-xs' },
      { name: 'กระสับกระส่ายอยู่ไม่สุข', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
      { name: 'นอนไม่หลับ', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'ความดันโลหิตสูงขึ้น', activeCls: 'bg-red-600 text-white border-red-600 font-bold shadow-xs' },
      { name: 'สับสนจำเวลาไม่ได้', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
    ],
  },
  neurocognitive: {
    id: 'neurocognitive',
    label: 'กลุ่มสมองเสื่อม / สับสนเพ้อ (Neurocognitive & Dementia / Delirium)',
    shortLabel: 'สมองเสื่อม/เพ้อ',
    iconName: 'Clock',
    badge: '👴 สมองเสื่อม / Delirium',
    chiefComplaints: [
      { name: 'สับสน/หลงลืมรุนแรง', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'เดินเร่ร่อน/หลงทางนอกบ้าน', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
      { name: 'ก้าวร้าวช่วงพลบค่ำ (Sundowning)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
      { name: 'ระแวงว่ามีคนมาขโมยของ', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'เห็นภาพหลอนคนในบ้าน', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'ช่วยตนเองไม่ได้ในชีวิตประจำวัน', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'พูดซ้ำๆ ถามคำถามเดิมซ้ำๆ', activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs' },
      { name: 'สับสนเพ้อลอย (Delirium)', activeCls: 'bg-red-700 text-white border-red-700 font-bold shadow-xs' },
      { name: 'นอนไม่หลับ', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
    ],
    associatedSymptoms: [
      { name: 'จำชื่อลูกหลานไม่ได้', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'นอนสลับกลางวันกลางคืน', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'กลั้นปัสสาวะ/อุจจาระไม่ได้', activeCls: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs' },
      { name: 'กระสับกระส่ายช่วงค่ำ', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
      { name: 'ระแวงคนดูแล/คู่สมรส', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'เก็บสะสมของไร้ประโยชน์ (Hoarding)', activeCls: 'bg-slate-600 text-white border-slate-600 font-bold shadow-xs' },
      { name: 'สูญเสียการตัดสินใจ', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
      { name: 'การทรงตัวไม่ดี/หกล้มบ่อย', activeCls: 'bg-red-600 text-white border-red-600 font-bold shadow-xs' },
      { name: 'เฉยเมยไม่สนใจสิ่งรอบข้าง', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
      { name: 'พูดจาไม่เป็นภาษา/หาคำศัพท์ไม่เจอ', activeCls: 'bg-blue-700 text-white border-blue-700 font-bold shadow-xs' },
    ],
  },
  anxiety: {
    id: 'anxiety',
    label: 'กลุ่มวิตกกังวล / ตื่นตระหนก (Anxiety, Panic & Stress Disorders)',
    shortLabel: 'วิตกกังวล/Panic',
    iconName: 'HeartPulse',
    badge: '😰 วิตกกังวล / Panic',
    chiefComplaints: [
      { name: 'กังวลใจตลอดเวลา/คุมไม่ได้', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'ตกใจกลัวรุนแรงกะทันหัน (Panic)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
      { name: 'ใจสั่น/แน่นหน้าอก/หายใจไม่อิ่ม', activeCls: 'bg-red-600 text-white border-red-600 font-bold shadow-xs' },
      { name: 'กลัวตาย/กลัวเป็นบ้าเฉียบพลัน', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'นอนไม่หลับ/ผวาตื่น', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'ภาพอดีตตามหลอกหลอน (Flashback)', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'ย้ำคิดย้ำทำ (OCD)', activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs' },
      { name: 'อาการทางกายซ้ำซากตรวจไม่พบโรค', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
    ],
    associatedSymptoms: [
      { name: 'ใจสั่น/ชีพจรเต้นเร็ว (Palpitation)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
      { name: 'มือสั่น/ตัวสั่น', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
      { name: 'เหงื่อแตก/เหงื่อออกมือ', activeCls: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs' },
      { name: 'เวียนศีรษะ/มึนงง', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
      { name: 'กล้ามเนื้อตึงปวดต้นคอ/หลัง', activeCls: 'bg-slate-600 text-white border-slate-600 font-bold shadow-xs' },
      { name: 'หายใจตื้น/หอบเหนื่อย', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
      { name: 'ชาปลายมือปลายเท้า/รอบปาก', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
      { name: 'สะดุ้งตกใจง่าย (Hypervigilance)', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
      { name: 'หลีกเลี่ยงสถานที่ที่กลัว', activeCls: 'bg-blue-700 text-white border-blue-700 font-bold shadow-xs' },
      { name: 'กระวนกระวายใจอยู่ไม่สุข', activeCls: 'bg-amber-700 text-white border-amber-700 font-bold shadow-xs' },
    ],
  },
};

/**
 * Detects the diagnostic group automatically based on Step 1 diagnostic input.
 */
export function detectDiagnosticGroup(data: PsychiatricAssessment): Exclude<DiagnosticGroup, 'all'> {
  const cat = (data.diagnosticCategory || []).join(' ').toLowerCase();
  const otherCat = (data.diagnosticCategoryOther || '').toLowerCase();
  const dx = (data.primaryDiagnosis || '').toLowerCase();
  const diff = (data.differentialDiagnosis || '').toLowerCase();
  const fullText = `${cat} ${otherCat} ${dx} ${diff}`.trim();

  // 1. Schizophrenia & Psychosis (Priority check for Psychotic disorders)
  const isPsychotic =
    cat.includes('f20') ||
    cat.includes('schizo') ||
    fullText.includes('schizo') ||
    fullText.includes('psychot') ||
    fullText.includes('delusion') ||
    fullText.includes('hallucina') ||
    fullText.includes('paranoid') ||
    fullText.includes('จิตเภท') ||
    fullText.includes('โรคจิต') ||
    fullText.includes('หลงผิด') ||
    fullText.includes('หูแว่ว') ||
    /f2[0-9]/i.test(fullText);

  if (isPsychotic) {
    return 'psychotic';
  }

  // 2. Bipolar & Mania (Ensure exact boundary check so F30-F39 is not falsely matched as bipolar)
  const isBipolar =
    fullText.includes('bipolar') ||
    fullText.includes('manic') ||
    fullText.includes('mania') ||
    fullText.includes('f31') ||
    fullText.includes('ไบโพลาร์') ||
    fullText.includes('แมเนีย') ||
    fullText.includes('อารมณ์สองขั้ว') ||
    /\bf30\b|\bf30\./i.test(fullText);

  if (isBipolar) {
    return 'bipolar';
  }

  // 3. Depressive Disorders (F30-F39 general Mood d/o or F32/F33 MDD)
  const isDepressive =
    cat.includes('f30-f39') ||
    cat.includes('mood') ||
    fullText.includes('depress') ||
    fullText.includes('mdd') ||
    fullText.includes('dysthym') ||
    fullText.includes('f32') ||
    fullText.includes('f33') ||
    fullText.includes('f34') ||
    fullText.includes('ซึมเศร้า') ||
    fullText.includes('ท้อแท้');

  if (isDepressive) {
    return 'depressive';
  }

  // 4. Substance-Related Disorders
  const isSubstance =
    cat.includes('f10-f19') ||
    cat.includes('substance') ||
    fullText.includes('substance') ||
    fullText.includes('alcohol') ||
    fullText.includes('meth') ||
    fullText.includes('amphetamine') ||
    fullText.includes('cannabis') ||
    fullText.includes('opioid') ||
    fullText.includes('withdrawal') ||
    fullText.includes('สารเสพติด') ||
    fullText.includes('ยาบ้า') ||
    fullText.includes('สุรา') ||
    fullText.includes('เหล้า') ||
    fullText.includes('แอลกอฮอล์') ||
    fullText.includes('กัญชา') ||
    /f1[0-9]/i.test(fullText);

  if (isSubstance) {
    return 'substance';
  }

  // 5. Neurocognitive Disorders
  const isNeurocognitive =
    cat.includes('f00-f09') ||
    cat.includes('neurocognitive') ||
    fullText.includes('dementia') ||
    fullText.includes('delirium') ||
    fullText.includes('alzheimer') ||
    fullText.includes('cognitive') ||
    fullText.includes('สมองเสื่อม') ||
    fullText.includes('เพ้อ') ||
    fullText.includes('สับสน') ||
    /f0[0-9]/i.test(fullText);

  if (isNeurocognitive) {
    return 'neurocognitive';
  }

  // 6. Anxiety / Somatoform / Stress
  const isAnxiety =
    cat.includes('f40-f48') ||
    cat.includes('anxiety') ||
    fullText.includes('anxiety') ||
    fullText.includes('panic') ||
    fullText.includes('phobia') ||
    fullText.includes('ptsd') ||
    fullText.includes('gad') ||
    fullText.includes('obsess') ||
    fullText.includes('ocd') ||
    fullText.includes('somato') ||
    fullText.includes('adjustment') ||
    fullText.includes('วิตกกังวล') ||
    fullText.includes('แพนิค') ||
    fullText.includes('ตื่นตระหนก') ||
    /f4[0-8]/i.test(fullText);

  if (isAnxiety) {
    return 'anxiety';
  }

  // Default fallback if no specific pattern matched
  return 'psychotic';
}

/**
 * Returns the combined Chief Complaints & Associated Symptoms for a given group or 'all'.
 */
export function getSymptomsByGroup(group: DiagnosticGroup): {
  chiefComplaints: SymptomItem[];
  associatedSymptoms: SymptomItem[];
} {
  if (group === 'all') {
    const ccMap = new Map<string, SymptomItem>();
    const asMap = new Map<string, SymptomItem>();

    Object.values(DIAGNOSTIC_GROUPS).forEach(cfg => {
      cfg.chiefComplaints.forEach(item => {
        if (!ccMap.has(item.name)) ccMap.set(item.name, item);
      });
      cfg.associatedSymptoms.forEach(item => {
        if (!asMap.has(item.name)) asMap.set(item.name, item);
      });
    });

    return {
      chiefComplaints: Array.from(ccMap.values()),
      associatedSymptoms: Array.from(asMap.values()),
    };
  }

  const config = DIAGNOSTIC_GROUPS[group] || DIAGNOSTIC_GROUPS.psychotic;
  return {
    chiefComplaints: config.chiefComplaints,
    associatedSymptoms: config.associatedSymptoms,
  };
}
