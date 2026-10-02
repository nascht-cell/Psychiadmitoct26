import React, { useRef, useState } from 'react';
import {
  Check,
  User,
  Activity,
  Calendar,
  Clock,
  CheckSquare,
  History,
  FolderOpen,
  ShieldCheck,
  Upload,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { parseFullName, constructFullName, PsychiatricAssessment } from '../../types/assessment';
import { DebouncedInput } from './DebouncedInput';
import { saveToLocalHistory } from '../../utils/storage';

const Step1PatientAndDiagnosisComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  errors,
  onBlurField,
  toggleArrayItem,
  onOpenHistoryModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOtherCustomOpen, setIsOtherCustomOpen] = useState(false);

  const effectiveTitle = data.titlePrefix ?? (data.fullName ? parseFullName(data.fullName).titlePrefix : '');
  const isStandardTitle = ['นาย', 'นาง', 'นางสาว'].includes(effectiveTitle);
  const isOtherSelected = isOtherCustomOpen || (!isStandardTitle && Boolean(effectiveTitle?.trim()));

  const handleTitlePrefixSelect = (option: 'นาย' | 'นาง' | 'นางสาว' | 'อื่นๆ') => {
    const currentFirst = data.firstName || (data.fullName ? parseFullName(data.fullName).firstName : '');
    const currentLast = data.lastName || (data.fullName ? parseFullName(data.fullName).lastName : '');

    if (option === 'อื่นๆ') {
      setIsOtherCustomOpen(true);
      if (['นาย', 'นาง', 'นางสาว'].includes(effectiveTitle)) {
        const fullName = constructFullName(currentFirst, currentLast, '');
        onChange({
          titlePrefix: '',
          firstName: currentFirst,
          lastName: currentLast,
          fullName,
        });
      }
      return;
    }

    setIsOtherCustomOpen(false);
    const fullName = constructFullName(currentFirst, currentLast, option);
    const updates: Partial<PsychiatricAssessment> = {
      titlePrefix: option,
      firstName: currentFirst,
      lastName: currentLast,
      fullName,
    };

    // Auto-map gender: นาย -> ชาย, นาง / นางสาว -> หญิง
    if (option === 'นาย') {
      updates.gender = 'ชาย';
    } else if (option === 'นาง' || option === 'นางสาว') {
      updates.gender = 'หญิง';
      if (option === 'นาง') {
        updates.maritalStatus = 'สมรส';
      }
    }

    onChange(updates);
  };

  const handleCustomTitleChange = (val: string) => {
    const currentFirst = data.firstName || (data.fullName ? parseFullName(data.fullName).firstName : '');
    const currentLast = data.lastName || (data.fullName ? parseFullName(data.fullName).lastName : '');
    const fullName = constructFullName(currentFirst, currentLast, val);
    const updates: Partial<PsychiatricAssessment> = {
      titlePrefix: val,
      firstName: currentFirst,
      lastName: currentLast,
      fullName,
    };

    const trimmed = val.trim();
    if (
      trimmed === 'พลฯ' ||
      trimmed === 'พลทหาร' ||
      trimmed === 'พล.' ||
      trimmed.startsWith('พลฯ') ||
      trimmed.startsWith('พลทหาร')
    ) {
      updates.gender = 'ชาย';
      updates.occupation = 'พลทหาร';
    } else if (trimmed === 'นาย' || trimmed === 'ด.ช.' || trimmed === 'เด็กชาย') {
      updates.gender = 'ชาย';
    } else if (trimmed === 'นาง' || trimmed === 'นางสาว' || trimmed === 'ด.ญ.' || trimmed === 'เด็กหญิง') {
      updates.gender = 'หญิง';
      if (trimmed === 'นาง') {
        updates.maritalStatus = 'สมรส';
      }
    }

    onChange(updates);
  };

  const handleDirectFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        const assessmentData = parsed.data || parsed;
        if (assessmentData && (assessmentData.hospitalName !== undefined || assessmentData.hn !== undefined)) {
          if (assessmentData.fullName && (!assessmentData.firstName || !assessmentData.lastName)) {
            const parsedName = parseFullName(assessmentData.fullName);
            assessmentData.titlePrefix = assessmentData.titlePrefix || parsedName.titlePrefix;
            assessmentData.firstName = assessmentData.firstName || parsedName.firstName;
            assessmentData.lastName = assessmentData.lastName || parsedName.lastName;
          }
          onChange(assessmentData);
        }
      } catch (err) {
        console.error('Error importing JSON file:', err);
      }
    };
    reader.readAsText(file);
    if (e.target) {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Admission Settings & Fast Fill Toolbar */}
      <div className="clay-surface p-5 bg-white border border-slate-200/80">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Left: ประเภทการรับผู้ป่วย & แผนก */}
          <div className="flex flex-wrap items-center gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                ประเภทการรับผู้ป่วย <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['OPD', 'IPD', 'ER'] as const).map(type => {
                  const isSelected = data.admissionType === type;
                  const activeCls =
                    type === 'OPD'
                      ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                      : type === 'IPD'
                      ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                      : 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-2 ring-rose-400/50';
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onChange({ admissionType: type })}
                      className={`px-4 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-40">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                แผนก
              </label>
              <input
                type="text"
                value={data.department}
                onChange={e => onChange({ department: e.target.value })}
                className="w-full text-xs clay-input px-3 py-1.5 font-medium text-slate-800"
              />
            </div>
          </div>

          {/* Right: วันที่ & เวลาประเมิน */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                วันที่ประเมิน
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 shadow-2xs">
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <input
                  type="date"
                  value={data.assessmentDate}
                  onChange={e => onChange({ assessmentDate: e.target.value })}
                  onBlur={e => onBlurField && onBlurField('assessmentDate', e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                เวลา
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-800 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <input
                  type="time"
                  value={data.assessmentTime}
                  onChange={e => onChange({ assessmentTime: e.target.value })}
                  onBlur={e => onBlurField && onBlurField('assessmentTime', e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Clinical Presets Bar for Human Input Speed */}
        <div className="pt-3.5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-amber-500 font-extrabold text-xs">⚡</span>
              <span>1 Click Fast fill (ชุดข้อมูลตัวอย่างทางคลินิก)</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {/* Preset 1: Severe MDD */}
            <button
              type="button"
              onClick={() => {
                const indications = new Set(data.admissionIndications || []);
                indications.add('เป็นอันตรายต่อตนเอง (Risk of Harm to Self)');
                onChange({
                  admissionType: 'IPD',
                  chiefComplaint: ['ซึมเศร้า/ท้อแท้', 'อยากตาย/พยายามทำร้ายตนเอง'],
                  duration: '1-4 สัปดาห์',
                  onset: 'เฉียบพลัน (Acute)',
                  course: 'แย่ลงเรื่อยๆ (Progressive)',
                  associatedSymptoms: ['นอนไม่หลับ', 'เบื่ออาหาร', 'อ่อนเพลีย'],
                  appearanceBehavior: ['Retardation'],
                  speech: ['Slow/Poverty of speech'],
                  moodAffect: ['Depressed'],
                  thoughtProcess: ['Logical/Coherent'],
                  thoughtContent: ['Suicidal ideation'],
                  perception: ['Normal'],
                  suicideRisk: 'High Risk',
                  violenceRisk: 'No Risk',
                  admissionIndications: Array.from(indications),
                  safetyPlan: ['Admit สังเกตอาการใกล้ชิด', 'แจ้งญาติดูแล 24 ชม.'],
                  standardizedAssessmentStatus: 'ประเมิน',
                  phq9Score: '24',
                  nineQScore: '22',
                  diagnosticCategory: ['F30-F39 Mood d/o'],
                  primaryDiagnosis: 'Major Depressive Episode, Severe without Psychotic Features (F32.2)',
                  pharmPlan: 'ปรับ/เริ่มยาใหม่',
                  medicationGroups: ['Antidepressants', 'Anxiolytics/Sedatives'],
                  medicationDetails: 'Sertraline (100) 1 tab po pc morning, Lorazepam (1) 1 tab po hs',
                  generalAppearance: 'Normal',
                  heent: 'Normal',
                  cvsRs: 'Normal',
                  abdomen: 'Normal',
                  extremities: 'Normal',
                  cranialNerves: 'Grossly intact',
                  motorPower: 'Grade V all',
                  tone: 'Normal',
                  sensory: 'Intact',
                  reflexes: 'Normal',
                  cerebellar: 'Normal',
                });
              }}
              className="clay-btn clay-btn-pastel-rose px-3.5 py-2 text-xs font-bold gap-1.5 cursor-pointer"
              title="Severe MDD with High Suicide Risk & IPD Admission"
            >
              <span>🚨 Severe MDD</span>
            </button>

            {/* Preset 2: Psychosis Relapse */}
            <button
              type="button"
              onClick={() => {
                onChange({
                  admissionType: 'IPD',
                  chiefComplaint: ['หูแว่ว/ประสาทหลอน', 'หวาดระแวง/หลงผิด'],
                  duration: '1-6 เดือน',
                  onset: 'ค่อยเป็นค่อยไป (Gradual)',
                  course: 'แย่ลงเรื่อยๆ (Progressive)',
                  precipitatingFactors: ['ขาดยา'],
                  associatedSymptoms: ['นอนไม่หลับ', 'พฤติกรรมแปลกไปจากเดิม'],
                  appearanceBehavior: ['Poor hygiene', 'Restless/Agitated'],
                  speech: ['Talkative/Pressured'],
                  moodAffect: ['Irritable/Angry'],
                  thoughtProcess: ['Circumstantial'],
                  thoughtContent: ['Delusion'],
                  delusionDetail: 'Persecutory delusion (ระแวงคนทำร้าย)',
                  perception: ['Auditory Hallucination'],
                  suicideRisk: 'No Risk',
                  violenceRisk: 'Moderate Risk',
                  admissionIndications: ['เป็นอันตรายต่อผู้อื่น (Risk of Harm to Others)'],
                  diagnosticCategory: ['F20-F29 Schizophrenia/Psychotic'],
                  primaryDiagnosis: 'Schizophrenia, Paranoid type (F20.0)',
                  pharmPlan: 'ปรับ/เริ่มยาใหม่',
                  medicationGroups: ['Antipsychotics'],
                  medicationDetails: 'Risperidone (2) 1 tab po hs',
                  generalAppearance: 'Normal',
                  heent: 'Normal',
                  cvsRs: 'Normal',
                  abdomen: 'Normal',
                  extremities: 'Normal',
                  cranialNerves: 'Grossly intact',
                  motorPower: 'Grade V all',
                  tone: 'Normal',
                  sensory: 'Intact',
                  reflexes: 'Normal',
                  cerebellar: 'Normal',
                });
              }}
              className="clay-btn clay-btn-pastel-purple px-3.5 py-2 text-xs font-bold gap-1.5 cursor-pointer"
              title="Psychosis Relapse with Agitation & IPD Admission"
            >
              <span>🧠 Psychosis Relapse</span>
            </button>

            {/* Preset 3: Bipolar Manic */}
            <button
              type="button"
              onClick={() => {
                onChange({
                  admissionType: 'IPD',
                  chiefComplaint: ['อารมณ์ครึกครื้นผิดปกติ', 'พูดมาก/ไม่ยอมนอน', 'ใช้จ่ายฟุ่มเฟือย'],
                  duration: '1-4 สัปดาห์',
                  onset: 'เฉียบพลัน (Acute)',
                  course: 'แย่ลงเรื่อยๆ (Progressive)',
                  associatedSymptoms: ['นอนไม่หลับ', 'หงุดหงิดง่าย', 'สมาธิสั้น'],
                  appearanceBehavior: ['Restless/Agitated'],
                  speech: ['Talkative/Pressured'],
                  moodAffect: ['Euphoric/Elated'],
                  thoughtProcess: ['Flight of ideas'],
                  thoughtContent: ['Grandiosity'],
                  perception: ['Normal'],
                  suicideRisk: 'No Risk',
                  violenceRisk: 'Moderate Risk',
                  admissionIndications: ['มีปัญหาพฤติกรรมรุนแรง ไม่สามารถดูแลตนเองได้'],
                  diagnosticCategory: ['F30-F39 Mood d/o'],
                  primaryDiagnosis: 'Bipolar I Disorder, Current episode manic (F31.1)',
                  pharmPlan: 'ปรับ/เริ่มยาใหม่',
                  medicationGroups: ['Mood Stabilizers', 'Antipsychotics'],
                  medicationDetails: 'Sodium Valproate (500) 1 tab po bid, Olanzapine (10) 1 tab po hs',
                  generalAppearance: 'Normal',
                  heent: 'Normal',
                  cvsRs: 'Normal',
                  abdomen: 'Normal',
                  extremities: 'Normal',
                  cranialNerves: 'Grossly intact',
                  motorPower: 'Grade V all',
                  tone: 'Normal',
                  sensory: 'Intact',
                  reflexes: 'Normal',
                  cerebellar: 'Normal',
                });
              }}
              className="clay-btn clay-btn-pastel-sky px-3.5 py-2 text-xs font-bold gap-1.5 cursor-pointer"
              title="Bipolar I Manic Episode with Impulsivity & IPD Admission"
            >
              <span>⚡ Bipolar I (Manic)</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: Patient Identification & Informant */}
      <section id="section-a" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              A. Patient Identification (ข้อมูลทั่วไปและผู้ให้ประวัติ)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">ข้อมูลระบุตัวตนและข้อมูลพื้นฐาน</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-4">
          {/* Row 1: HN, First Name, Last Name */}
          <div className="flex flex-wrap items-start gap-4">
            {/* HN */}
            <div className="w-40 shrink-0">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>
                  HN <span className="text-red-500">*</span>
                </span>
                {!data.hn?.trim() && (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-1 py-0.2 rounded">
                    จำเป็น
                  </span>
                )}
              </label>
              <DebouncedInput
                id="field-hn"
                type="text"
                maxLength={20}
                value={data.hn}
                onChangeValue={val => {
                  const cleaned = val.replace(/\D/g, '');
                  onChange({ hn: cleaned });
                }}
                onBlur={e => onBlurField && onBlurField('hn', e.target.value)}
                placeholder="เช่น 67001234"
                className={`w-full text-sm font-bold bg-white border rounded-lg px-3 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.hn
                    ? 'border-red-500 bg-red-50/50'
                    : !data.hn?.trim()
                    ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />
              {errors.hn && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.hn}</p>}
            </div>

            {/* First Name */}
            <div className="w-48 shrink-0">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>
                  ชื่อจริง <span className="text-red-500">*</span>
                </span>
                {!(data.firstName?.trim() || (data.fullName ? parseFullName(data.fullName).firstName.trim() : '')) && (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-1 py-0.2 rounded">
                    จำเป็น
                  </span>
                )}
              </label>
              <DebouncedInput
                id="field-firstName"
                type="text"
                maxLength={50}
                value={data.firstName || (data.fullName ? parseFullName(data.fullName).firstName : '')}
                onChangeValue={val => {
                  let currentTitle = data.titlePrefix || (data.fullName ? parseFullName(data.fullName).titlePrefix : '');
                  let actualFirst = val;
                  const currentLast = data.lastName || (data.fullName ? parseFullName(data.fullName).lastName : '');
                  const extraUpdates: Partial<PsychiatricAssessment> = {};

                  const knownTitles = ['เด็กชาย', 'เด็กหญิง', 'ด.ช.', 'ด.ญ.', 'นางสาว', 'น.ส.', 'นาง', 'นาย', 'พลฯ', 'พลทหาร', 'ร.ต.', 'ร.ท.', 'ร.อ.', 'พ.ต.', 'พ.ท.', 'พ.อ.', 'นพ.', 'พญ.'];
                  for (const t of knownTitles) {
                    if (actualFirst.startsWith(t)) {
                      currentTitle = t;
                      actualFirst = actualFirst.slice(t.length).trim();
                      if (t === 'นาย' || t === 'เด็กชาย' || t === 'ด.ช.' || t.startsWith('พล')) {
                        extraUpdates.gender = 'ชาย';
                        if (t.startsWith('พล')) extraUpdates.occupation = 'พลทหาร';
                      } else if (t === 'นาง' || t === 'นางสาว' || t === 'น.ส.' || t === 'เด็กหญิง' || t === 'ด.ญ.') {
                        extraUpdates.gender = 'หญิง';
                        if (t === 'นาง') extraUpdates.maritalStatus = 'สมรส';
                      }
                      break;
                    }
                  }

                  const fullName = constructFullName(actualFirst, currentLast, currentTitle);
                  onChange({
                    firstName: actualFirst,
                    lastName: currentLast,
                    titlePrefix: currentTitle,
                    fullName,
                    ...extraUpdates,
                  });
                }}
                onBlur={e => onBlurField && onBlurField('firstName', e.target.value)}
                placeholder="ระบุชื่อจริง"
                className={`w-full text-sm bg-white border rounded-lg px-3 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.firstName
                    ? 'border-red-500 bg-red-50/50'
                    : !(data.firstName?.trim() || (data.fullName ? parseFullName(data.fullName).firstName.trim() : ''))
                    ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />
              {errors.firstName && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="w-52 shrink-0">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>
                  นามสกุล <span className="text-red-500">*</span>
                </span>
                {!(data.lastName?.trim() || (data.fullName ? parseFullName(data.fullName).lastName : '')) && (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-1 py-0.2 rounded">
                    จำเป็น
                  </span>
                )}
              </label>
              <DebouncedInput
                id="field-lastName"
                type="text"
                maxLength={50}
                value={data.lastName || (data.fullName ? parseFullName(data.fullName).lastName : '')}
                onChangeValue={val => {
                  const currentTitle = data.titlePrefix || (data.fullName ? parseFullName(data.fullName).titlePrefix : '');
                  const currentFirst = data.firstName || (data.fullName ? parseFullName(data.fullName).firstName : '');
                  const fullName = constructFullName(currentFirst, val, currentTitle);
                  onChange({
                    firstName: currentFirst,
                    lastName: val,
                    titlePrefix: currentTitle,
                    fullName,
                  });
                }}
                onBlur={e => onBlurField && onBlurField('lastName', e.target.value)}
                placeholder="ระบุนามสกุล"
                className={`w-full text-sm bg-white border rounded-lg px-3 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.lastName
                    ? 'border-red-500 bg-red-50/50'
                    : !(data.lastName?.trim() || (data.fullName ? parseFullName(data.fullName).lastName : ''))
                    ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />
              {errors.lastName && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.lastName}</p>}
            </div>
          </div>

          {/* Row 2: Demographics - Title, Gender, Marital Status, Age */}
          <div className="flex flex-wrap items-start gap-4 pt-1">
            {/* Title Prefix */}
            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                คำนำหน้า
              </label>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1">
                  {(['นาย', 'นาง', 'นางสาว', 'อื่นๆ'] as const).map(option => {
                    const isSelected =
                      option === 'อื่นๆ'
                        ? isOtherSelected
                        : effectiveTitle === option;
                    const activeCls =
                      option === 'นาย'
                        ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                        : option === 'นาง'
                        ? 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs'
                        : option === 'นางสาว'
                        ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs'
                        : 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs';

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleTitlePrefixSelect(option)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                          isSelected
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {isOtherSelected && (
                  <input
                    type="text"
                    value={isStandardTitle ? '' : effectiveTitle}
                    onChange={e => handleCustomTitleChange(e.target.value)}
                    placeholder="เช่น พลฯ, ร.ต., ดร., เด็กชาย"
                    className="w-48 text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    autoFocus
                  />
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="shrink-0">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>
                  เพศ <span className="text-red-500">*</span>
                </span>
                {!data.gender?.trim() && (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-1 py-0.2 rounded">
                    จำเป็น
                  </span>
                )}
              </label>
              <div id="field-gender" className="flex items-center gap-1">
                {(['ชาย', 'หญิง'] as const).map(gen => {
                  const isSelected = data.gender === gen;
                  const activeCls =
                    gen === 'ชาย'
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-pink-600 text-white border-pink-600 font-bold shadow-xs';
                  return (
                    <button
                      key={gen}
                      type="button"
                      onClick={() => onChange({ gender: gen })}
                      className={`px-4 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? activeCls
                          : errors.gender
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : !data.gender?.trim()
                          ? 'border-slate-300 bg-rose-50/20'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {gen}
                    </button>
                  );
                })}
              </div>
              {errors.gender && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.gender}</p>}
            </div>

            {/* Marital Status */}
            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                สถานภาพ
              </label>
              <div className="flex items-center gap-1">
                {(['โสด', 'สมรส', 'หม้าย/หย่า/แยก'] as const).map(st => {
                  const isSelected = data.maritalStatus === st;
                  const activeCls = 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs';
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onChange({ maritalStatus: st })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age */}
            <div className="w-24 shrink-0">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>
                  อายุ (ปี) <span className="text-red-500">*</span>
                </span>
                {!data.age?.trim() && (
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-1 py-0.2 rounded">
                    จำเป็น
                  </span>
                )}
              </label>
              <DebouncedInput
                id="field-age"
                type="text"
                maxLength={3}
                value={data.age}
                onChangeValue={val => {
                  const cleaned = val.replace(/\D/g, '');
                  onChange({ age: cleaned });
                }}
                onBlur={e => onBlurField && onBlurField('age', e.target.value)}
                placeholder="เช่น 35"
                className={`w-full text-sm bg-white border rounded-lg px-3 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.age
                    ? 'border-red-500 bg-red-50/50'
                    : !data.age?.trim()
                    ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />
              {errors.age && <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.age}</p>}
            </div>
          </div>

          {/* Row 3: AN, Occupation, Education */}
          <div className="flex flex-wrap items-start gap-4 pt-1">
            <div className="w-32 shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                AN (ถ้ามี)
              </label>
              <DebouncedInput
                type="text"
                value={data.an || ''}
                onChangeValue={val => onChange({ an: val })}
                placeholder="เช่น 67/1234"
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                อาชีพ
              </label>
              <div className="flex flex-wrap gap-1">
                {(['พลทหาร', 'ข้าราชการ', 'เอกชน', 'ค้าขาย', 'ไม่ได้ทำงาน'] as const).map(occ => {
                  const isSelected = data.occupation === occ;
                  const activeCls = 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs';
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => onChange({ occupation: occ })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                การศึกษา
              </label>
              <div className="flex flex-wrap gap-1">
                {(['มัธยมศึกษา', 'ปวช./ปวส.', 'ปริญญาตรี', 'อื่นๆ'] as const).map(edu => {
                  const isSelected = data.educationLevel === edu;
                  const activeCls = 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs';
                  return (
                    <button
                      key={edu}
                      type="button"
                      onClick={() => onChange({ educationLevel: edu })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {edu}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 4: Informant & Reliability */}
          <div className="flex flex-wrap items-start gap-5 pt-2 border-t border-slate-100">
            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                ผู้ให้ข้อมูลหลัก (Informant)
              </label>
              <div className="flex gap-3 items-center h-9">
                <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-slate-800">
                  <input
                    type="radio"
                    name="informant"
                    checked={data.informant === 'ผู้ป่วยเอง'}
                    onChange={() => onChange({ informant: 'ผู้ป่วยเอง', informantDetail: '' })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>ผู้ป่วยเอง</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer text-slate-800">
                  <input
                    type="radio"
                    name="informant"
                    checked={data.informant === 'ญาติ/ผู้ดูแล'}
                    onChange={() => onChange({ informant: 'ญาติ/ผู้ดูแล' })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span>ญาติ/ผู้ดูแล</span>
                </label>
              </div>
            </div>

            {data.informant === 'ญาติ/ผู้ดูแล' && (
              <div className="w-36 shrink-0">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  ระบุความเกี่ยวข้อง
                </label>
                <DebouncedInput
                  type="text"
                  value={data.informantDetail}
                  onChangeValue={val => onChange({ informantDetail: val })}
                  placeholder="เช่น มารดา, สามี"
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            )}

            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                ความน่าเชื่อถือของข้อมูล (Reliability)
              </label>
              <div className="flex gap-1">
                {(['ดี (Good)', 'พอใช้ (Fair)', 'เชื่อถือไม่ได้ (Poor)'] as const).map(rel => {
                  const isSelected = (data.reliability || 'ดี (Good)') === rel;
                  const activeCls =
                    rel === 'ดี (Good)'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : rel === 'พอใช้ (Fair)'
                      ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs'
                      : 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-400';
                  return (
                    <button
                      key={rel}
                      type="button"
                      onClick={() => onChange({ reliability: rel })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {rel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION J: Diagnosis & Comorbidities (Placed in Step 1 to anchor clinical admission) */}
      <section id="section-j" className="bg-white rounded-xl shadow-xs border border-blue-200 overflow-hidden ring-1 ring-blue-100">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              J. Diagnosis & Comorbidities (การวินิจฉัยโรคและโรคร่วม)
            </h3>
          </div>
          <span className="text-xs text-blue-100 font-semibold hidden sm:inline">กำหนดการวินิจฉัยตั้งต้นการรับไว้รักษา</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-4">
          {/* Diagnostic Category */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>กลุ่มโรคหลัก (Diagnostic Category)</span>
              <span className="text-[11px] text-blue-600 font-semibold normal-case">
                ✨ เลือกระบบจะนำไปสร้าง Bubbles อาการในขั้นตอนที่ 2 อัตโนมัติ
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  key: 'F20-F29 Schizophrenia/Psychotic',
                  label: '🧠 F20-F29 Schizophrenia / จิตเภท & โรคจิต',
                },
                {
                  key: 'F30-F39 Mood d/o',
                  label: '🌧️ F30-F39 Mood Disorders / โรคซึมเศร้า',
                },
                {
                  key: 'F10-F19 Substance-related',
                  label: '🧪 F10-F19 Substance / สารเสพติดและสุรา',
                },
                {
                  key: 'F00-F09 Neurocognitive d/o',
                  label: '👴 F00-F09 Neurocognitive / สมองเสื่อม & สับสน',
                },
                {
                  key: 'F40-F48 Anxiety/Somatoform',
                  label: '😰 F40-F48 Anxiety / วิตกกังวล & Panic',
                },
              ].map(({ key, label }) => {
                const isSelected = (data.diagnosticCategory || []).includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleArrayItem('diagnosticCategory', key)}
                    className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none rounded-xl ${
                      isSelected ? 'clay-pill-active' : 'clay-pill-inactive'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-slate-400/80 shrink-0" />
                    )}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={data.diagnosticCategoryOther}
              onChange={e => onChange({ diagnosticCategoryOther: e.target.value })}
              placeholder="กลุ่มโรคอื่นๆ เช่น F50-F59, F60-F69, F70-F79, F90-F98..."
              className="w-full text-xs border border-slate-300 rounded px-3 py-1.5 mt-2 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Primary Diagnosis & Quick ICD-10 Chips */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>
                รายละเอียดการวินิจฉัยหลัก (Primary Diagnosis / ICD-10)
              </span>
            </label>

            {/* Quick Diagnosis Chips */}
            <div className="mb-2 flex flex-wrap gap-1">
              <span className="text-[11px] font-bold text-slate-500 w-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                คลิกเพื่อเลือก ICD-10 ด่วน (ระบุโรคพร้อมผูกกลุ่มอาการอัตโนมัติ):
              </span>
              {[
                {
                  label: '🧠 Schizophrenia (จิตเภท)',
                  value: 'Schizophrenia, Paranoid type (F20.0)',
                  category: 'F20-F29 Schizophrenia/Psychotic',
                  isSevere: false,
                },
                {
                  label: '🚨 Severe MDD (ซึมเศร้ารุนแรง)',
                  value: 'Major Depressive Episode, Severe without Psychotic Features (F32.2)',
                  category: 'F30-F39 Mood d/o',
                  isSevere: true,
                },
                {
                  label: '⚡ Bipolar I, Manic (ไบโพลาร์)',
                  value: 'Bipolar I Disorder, Current episode manic (F31.1)',
                  category: 'F30-F39 Mood d/o',
                  isSevere: false,
                },
                {
                  label: '😰 GAD (วิตกกังวลทั่วไป)',
                  value: 'Generalized Anxiety Disorder (F41.1)',
                  category: 'F40-F48 Anxiety/Somatoform',
                  isSevere: false,
                },
                {
                  label: '🌧️ Adjustment d/o (การปรับตัวผิดปกติ)',
                  value: 'Adjustment Disorder with depressed mood (F43.21)',
                  category: 'F40-F48 Anxiety/Somatoform',
                  isSevere: false,
                },
                {
                  label: '🧪 Stimulant psychosis (โรคจิตจากสาร)',
                  value: 'Other stimulants including caffeine, Psychotic disorder, Schizophrenia-like (F15.50)',
                  category: 'F10-F19 Substance-related',
                  comorbid: 'Stimulant dependence (F15.2)',
                  isSevere: false,
                },
              ].map(dx => (
                <button
                  key={dx.value}
                  type="button"
                  onClick={() => {
                    const newCategories = new Set(data.diagnosticCategory || []);
                    if (dx.category) newCategories.add(dx.category);

                    if (dx.isSevere) {
                      const indications = new Set(data.admissionIndications || []);
                      indications.add('เป็นอันตรายต่อตนเอง (Risk of Harm to Self)');
                      onChange({
                        primaryDiagnosis: dx.value,
                        diagnosticCategory: Array.from(newCategories),
                        ...(dx.comorbid ? { comorbidDiagnosis: dx.comorbid } : {}),
                        suicideRisk: 'High Risk',
                        admissionIndications: Array.from(indications),
                        admissionType: 'IPD',
                      });
                    } else {
                      onChange({
                        primaryDiagnosis: dx.value,
                        diagnosticCategory: Array.from(newCategories),
                        ...(dx.comorbid ? { comorbidDiagnosis: dx.comorbid } : {}),
                      });
                    }
                  }}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded transition-all cursor-pointer ${
                    dx.isSevere
                      ? 'bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold border border-rose-300 shadow-2xs'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
                  }`}
                >
                  {dx.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={data.primaryDiagnosis}
              onChange={e => onChange({ primaryDiagnosis: e.target.value })}
              onBlur={e => onBlurField && onBlurField('primaryDiagnosis', e.target.value)}
              placeholder="เช่น Major Depressive Disorder (F32.1)"
              className={`w-full text-sm font-semibold bg-white border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                errors.primaryDiagnosis ? 'border-red-500 bg-red-50' : 'border-slate-300'
              }`}
            />
          </div>

          {/* Differential Diagnosis & Comorbidity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Differential Diagnosis */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Differential Diagnosis (การวินิจฉัยแยกโรค)
              </label>
              <input
                type="text"
                value={data.differentialDiagnosis}
                onChange={e => onChange({ differentialDiagnosis: e.target.value })}
                onBlur={e => onBlurField && onBlurField('differentialDiagnosis', e.target.value)}
                placeholder="เช่น Adjustment disorder, Schizophreniform disorder"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* Comorbidity */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Comorbidity (โรคร่วมทางจิตเวช / โรคประจำตัวเดิม)
              </label>
              <input
                type="text"
                value={data.comorbidDiagnosis || ''}
                onChange={e => onChange({ comorbidDiagnosis: e.target.value })}
                onBlur={e => onBlurField && onBlurField('comorbidDiagnosis', e.target.value)}
                placeholder="เช่น Stimulant dependence (F15.2), HT, DM, DLP"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const Step1PatientAndDiagnosis = React.memo(Step1PatientAndDiagnosisComponent);
