import React, { useRef, useState } from 'react';
import { Check, User, Activity, Calendar, Clock, CheckSquare, History, FolderOpen, ShieldCheck, Upload } from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { parseFullName, constructFullName, PsychiatricAssessment } from '../../types/assessment';
import { DebouncedInput } from './DebouncedInput';
import { DebouncedTextarea } from './DebouncedTextarea';
import { saveToLocalHistory } from '../../utils/storage';

const Step1PatientAndComplaintComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  errors,
  onBlurField,
  toggleArrayItem,
  handleDurationChange,
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
      // Auto-map marital status for นาง -> สมรส
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
    // คำนำหน้า พลฯ -> เพศชาย และ อาชีพ พลทหาร อัตโนมัติ
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
          // Load directly into the active form without silently saving to local history
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
      {/* Admission Settings & Fast Fill Toolbar (Redundant top header with emblem removed) */}
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
                    generalAppearance: 'Normal', heent: 'Normal', cvsRs: 'Normal', abdomen: 'Normal', extremities: 'Normal',
                    cranialNerves: 'Grossly intact', motorPower: 'Grade V all', tone: 'Normal', sensory: 'Intact', reflexes: 'Normal', cerebellar: 'Normal'
                  });
                }}
                className="clay-btn clay-btn-pastel-rose px-3.5 py-2 text-xs font-bold gap-1.5"
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
                    generalAppearance: 'Normal', heent: 'Normal', cvsRs: 'Normal', abdomen: 'Normal', extremities: 'Normal',
                    cranialNerves: 'Grossly intact', motorPower: 'Grade V all', tone: 'Normal', sensory: 'Intact', reflexes: 'Normal', cerebellar: 'Normal'
                  });
                }}
                className="clay-btn clay-btn-pastel-purple px-3.5 py-2 text-xs font-bold gap-1.5"
                title="Psychosis Relapse with Agitation & IPD Admission"
              >
                <span>🧠 Psychosis Relapse</span>
              </button>

              {/* Preset 3: Mania Episode */}
              <button
                type="button"
                onClick={() => {
                  onChange({
                    admissionType: 'IPD',
                    chiefComplaint: ['อารมณ์ดีผิดปกติ/พูดมาก', 'นอนน้อยไม่เพลีย'],
                    duration: '1-4 สัปดาห์',
                    onset: 'เฉียบพลัน (Acute)',
                    course: 'แย่ลงเรื่อยๆ (Progressive)',
                    precipitatingFactors: ['ขาดยา'],
                    associatedSymptoms: ['ก้าวร้าว/หงุดหงิด', 'พฤติกรรมแปลกไปจากเดิม'],
                    appearanceBehavior: ['Restless/Agitated'],
                    speech: ['Talkative/Pressured'],
                    moodAffect: ['Elevated/Expansive'],
                    thoughtProcess: ['Flight of ideas'],
                    thoughtContent: ['Delusion'],
                    delusionDetail: 'Grandiose delusion',
                    perception: ['Normal'],
                    suicideRisk: 'No Risk',
                    violenceRisk: 'High Risk',
                    admissionIndications: ['เป็นอันตรายต่อผู้อื่น (Risk of Harm to Others)'],
                    safetyPlan: ['Admit สังเกตอาการใกล้ชิด', 'Restraint/Seclusion'],
                    standardizedAssessmentStatus: 'ประเมิน',
                    diagnosticCategory: ['F30-F39 Mood d/o'],
                    primaryDiagnosis: 'Bipolar I Disorder, Current Episode Manic with Psychotic Features (F31.2)',
                    pharmPlan: 'ปรับ/เริ่มยาใหม่',
                    medicationGroups: ['Mood Stabilizers', 'Antipsychotics'],
                    medicationDetails: 'Lithium Carbonate (300) 1x2 po pc, Olanzapine (10) 1 tab po hs',
                    generalAppearance: 'Normal', heent: 'Normal', cvsRs: 'Normal', abdomen: 'Normal', extremities: 'Normal',
                    cranialNerves: 'Grossly intact', motorPower: 'Grade V all', tone: 'Normal', sensory: 'Intact', reflexes: 'Normal', cerebellar: 'Normal'
                  });
                }}
                className="clay-btn clay-btn-pastel-amber px-3.5 py-2 text-xs font-bold gap-1.5"
                title="Bipolar Mania Episode with Agitation & IPD Admission"
              >
                <span>🔥 Mania Episode</span>
              </button>
            </div>
          </div>
        </div>

      {/* 100% Client-Side Privacy & Zero-Server Security Assurance Banner */}
      <div className="clay-card p-4 sm:p-5 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-slate-50 border-2 border-emerald-200/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-xs shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-extrabold text-slate-900">
                มาตรการรักษาความลับข้อมูลผู้ป่วย (100% Client-Side Privacy · ไม่ผ่าน Server)
              </h4>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 text-white text-[11px] font-extrabold rounded-full shadow-2xs">
                <span>Zero Server Storage</span>
              </span>
            </div>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
              ระบบนี้ประมวลผลบนเบราว์เซอร์ของอุปกรณ์นี้เท่านั้น <strong>ไม่มีการส่งหรือจัดเก็บข้อมูลผู้ป่วยขึ้น Server หรือฐานข้อมูลกลางใดๆ ทั้งสิ้น</strong> และ<strong>ไม่มีการบันทึกประวัติใดๆ</strong> จนกว่าท่านจะกด <strong>"บันทึก & PDF"</strong> ลงในเครื่องของท่านเอง
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Browse Saved Records in localStorage */}
          <button
            type="button"
            onClick={() => onOpenHistoryModal && onOpenHistoryModal()}
            className="clay-btn clay-btn-secondary px-3.5 py-2 text-xs font-bold gap-1.5"
            title="เปิดดูรายการประวัติที่เคยบันทึกและดาวน์โหลดลงในเครื่องนี้"
          >
            <FolderOpen className="w-4 h-4 text-slate-600" />
            <span>ประวัติที่บันทึกลงเครื่อง</span>
          </button>

          {/* Hidden File Input for Native JSON Local File Browsing */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleDirectFileImport}
            className="sr-only"
          />

          {/* Browse Local File (.json) directly */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="clay-btn clay-btn-secondary px-3.5 py-2 text-xs font-bold gap-1.5"
            title="เปิดไฟล์แบบประเมิน .json จากเครื่องของคุณ"
          >
            <Upload className="w-4 h-4 text-slate-600" />
            <span>เปิดไฟล์จากเครื่อง (.json)</span>
          </button>
        </div>
      </div>

      {/* SECTION A: Patient Identification (Mirrors A4 Document Page 1 Box 1) */}
      <section id="section-a" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              A. Patient Identification (ข้อมูลทั่วไป)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">ส่วนข้อมูลประจำตัวผู้ป่วย</span>
        </div>

        <div className="p-6 space-y-4">
          {/* Row 1: Identification & Name (HN, AN, First Name, Last Name) */}
          <div className="flex flex-wrap items-start gap-3.5">
            {/* HN */}
            <div className="w-32 shrink-0">
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
              <input
                id="field-hn"
                type="text"
                value={data.hn}
                onChange={e => onChange({ hn: e.target.value.trim() })}
                onBlur={e => onBlurField && onBlurField('hn', e.target.value)}
                placeholder="เช่น 67001234"
                className={`w-full text-sm font-mono font-bold bg-white border rounded-lg px-3 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.hn
                    ? 'border-red-500 bg-red-50/50'
                    : !data.hn?.trim()
                    ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />
              {errors.hn && <p className="text-xs text-red-600 mt-1 font-medium">{errors.hn}</p>}
            </div>

            {/* AN */}
            <div className="w-28 shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                AN (ถ้ามี)
              </label>
              <input
                type="text"
                value={data.an}
                onChange={e => onChange({ an: e.target.value.trim() })}
                onBlur={e => onBlurField && onBlurField('an', e.target.value)}
                placeholder="เช่น 67/0123"
                className="w-full text-sm font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            {/* First Name */}
            <div className="w-48 shrink-0">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>
                  ชื่อ <span className="text-red-500">*</span>
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
                maxLength={45}
                value={data.firstName || (data.fullName ? parseFullName(data.fullName).firstName : '')}
                onChangeValue={val => {
                  let currentTitle = data.titlePrefix || (data.fullName ? parseFullName(data.fullName).titlePrefix : '');
                  const currentLast = data.lastName || (data.fullName ? parseFullName(data.fullName).lastName : '');
                  let actualFirst = val;
                  const extraUpdates: Partial<PsychiatricAssessment> = {};

                  // Auto-detect if user typed prefix into first name field
                  const parsed = parseFullName(val);
                  if (parsed.titlePrefix && !currentTitle) {
                    currentTitle = parsed.titlePrefix;
                    actualFirst = parsed.firstName;
                    if (
                      parsed.titlePrefix === 'พลฯ' ||
                      parsed.titlePrefix === 'พลทหาร' ||
                      parsed.titlePrefix.startsWith('พลฯ')
                    ) {
                      extraUpdates.gender = 'ชาย';
                      extraUpdates.occupation = 'พลทหาร';
                    } else if (['นาย', 'ด.ช.', 'เด็กชาย'].includes(parsed.titlePrefix)) {
                      extraUpdates.gender = 'ชาย';
                    } else if (['นาง', 'นางสาว', 'ด.ญ.', 'เด็กหญิง'].includes(parsed.titlePrefix)) {
                      extraUpdates.gender = 'หญิง';
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
              {errors.firstName && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.firstName}</p>
              )}
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
                    : !(data.lastName?.trim() || (data.fullName ? parseFullName(data.fullName).lastName.trim() : ''))
                    ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Row 2: Demographics - คำนำหน้า, เพศ, สถานภาพสมรส และ อายุ (กรอกในลำดับต่อเนื่องกัน) */}
          <div className="flex flex-wrap items-start gap-4 pt-1">
            {/* Title Prefix (4 bubbles: นาย, นาง, นางสาว, อื่นๆ) */}
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
                  <div className="flex flex-wrap items-center gap-1.5 animate-fadeIn mt-0.5">
                    <DebouncedInput
                      type="text"
                      value={
                        ['นาย', 'นาง', 'นางสาว'].includes(effectiveTitle)
                          ? ''
                          : effectiveTitle
                      }
                      onChangeValue={handleCustomTitleChange}
                      onBlur={e => onBlurField && onBlurField('titlePrefix', e.target.value)}
                      placeholder="พิมพ์คำนำหน้า เช่น พลฯ..."
                      className="w-32 text-xs bg-white border border-blue-400 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-600 focus:outline-none font-medium"
                      autoFocus
                    />
                    {/* Quick suggestion chips: พลฯ (เลือกเพศชายอัตโนมัติ), ด.ช., ด.ญ. (ไม่มีพลทหารซ้ำ, ไม่มี น.ส. ซ้ำ, และไม่มียศใน dropdown) */}
                    <div className="flex items-center gap-1">
                      {(['พลฯ', 'ด.ช.', 'ด.ญ.'] as const).map(quick => (
                        <button
                          key={quick}
                          type="button"
                          onClick={() => handleCustomTitleChange(quick)}
                          className={`px-2 py-0.5 text-xs rounded-md border transition-all cursor-pointer font-medium ${
                            effectiveTitle === quick
                              ? quick === 'พลฯ'
                                ? 'bg-sky-700 text-white border-sky-700 font-bold shadow-2xs'
                                : quick === 'ด.ช.'
                                ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                                : 'bg-purple-600 text-white border-purple-600 font-bold shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                          title={
                            quick === 'พลฯ'
                              ? 'เลือกคำนำหน้า พลฯ (เลือกเพศชาย และ อาชีพพลทหาร อัตโนมัติ)'
                              : quick === 'ด.ช.'
                              ? 'เลือกคำนำหน้า ด.ช. (เลือกเพศชายอัตโนมัติ)'
                              : 'เลือกคำนำหน้า ด.ญ. (เลือกเพศหญิงอัตโนมัติ)'
                          }
                        >
                          {quick}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Gender (ชาย / หญิง) */}
            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                เพศ <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1">
                {(['ชาย', 'หญิง'] as const).map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onChange({ gender: g })}
                    className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                      data.gender === g
                        ? g === 'ชาย'
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                          : 'bg-rose-500 text-white border-rose-500 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Marital Status */}
            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                สถานภาพสมรส
              </label>
              <div className="flex flex-wrap gap-1">
                {(['โสด', 'สมรส', 'หม้าย/หย่า/แยก'] as const).map(m => {
                  const isSelected = (data.maritalStatus || 'โสด') === m;
                  const activeCls =
                    m === 'โสด'
                      ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                      : m === 'สมรส'
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                      : 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs';
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => onChange({ maritalStatus: m })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        isSelected
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Age */}
            <div className="w-24 shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>
                  อายุ <span className="text-red-500">*</span>
                </span>
                {!data.age?.trim() && (
                  <span className="text-[10px] font-semibold text-rose-600">จำเป็น</span>
                )}
              </label>
              <input
                id="field-age"
                type="number"
                min="0"
                max="130"
                value={data.age}
                onChange={e => onChange({ age: e.target.value })}
                onBlur={e => onBlurField && onBlurField('age', e.target.value)}
                placeholder="เช่น 35"
                className={`w-full text-sm bg-white border rounded-lg px-2.5 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                  errors.age
                    ? 'border-red-500 bg-red-50/50'
                    : !data.age?.trim()
                    ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                    : 'border-slate-300'
                }`}
              />
              {errors.age && (
                <p className="text-[11px] text-red-600 mt-0.5 font-medium">{errors.age}</p>
              )}
            </div>
          </div>

          {/* Row 3: อาชีพ และ ระดับการศึกษาสูงสุด อยู่ในบรรทัดเดียวกันเพื่อความต่อเนื่องของ Idea */}
          <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100">
            {/* Occupation: เรียงจาก ว่างงาน ข้าราชการ เอกชน และพลทหาร เป็นลำดับสุดท้าย */}
            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                อาชีพ (Occupation) <span className="text-slate-400 font-normal text-[11px]">(Default: ว่างงาน)</span>
              </label>
              <div className="flex flex-wrap gap-1">
                {(['ว่างงาน', 'ข้าราชการ', 'เอกชน', 'พลทหาร'] as const).map(occ => {
                  const isSelected = (data.occupation || 'ว่างงาน') === occ;
                  const activeCls =
                    occ === 'ว่างงาน'
                      ? 'bg-slate-600 text-white border-slate-600 font-bold shadow-xs'
                      : occ === 'ข้าราชการ'
                      ? 'bg-sky-700 text-white border-sky-700 font-bold shadow-xs'
                      : occ === 'เอกชน'
                      ? 'bg-teal-700 text-white border-teal-700 font-bold shadow-xs'
                      : 'bg-indigo-700 text-white border-indigo-700 font-bold shadow-xs';
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => onChange({ occupation: occ })}
                      className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
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

            {/* Education Level */}
            <div className="shrink-0">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                ระดับการศึกษาสูงสุด (Education)
              </label>
              <div className="flex flex-wrap gap-1">
                {(['ประถมศึกษา', 'มัธยมศึกษา', 'ปริญญาตรีหรือสูงกว่า'] as const).map(edu => {
                  const isSelected = (data.educationLevel || 'มัธยมศึกษา') === edu;
                  const activeCls =
                    edu === 'ประถมศึกษา'
                      ? 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs'
                      : edu === 'มัธยมศึกษา'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                      : 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs';
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
            {/* Informant */}
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

            {/* Informant Detail if relative */}
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

            {/* Reliability */}
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

      {/* SECTION B: Chief Complaint & HPI (Mirrors A4 Document Page 1 Box 2) */}
      <section id="section-b" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-6 py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">
              B. Chief Complaint & History of Present Illness (อาการสำคัญและประวัติปัจจุบัน)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">อาการสำคัญและประวัติเจ็บป่วย</span>
        </div>

        <div className="p-6 space-y-5">
          {/* 1. Chief Complaint */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              อาการสำคัญ (Chief Complaint) <span className="text-xs font-normal text-slate-500">(เลือกได้มากกว่า 1 ข้อ)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'ซึมเศร้า/ท้อแท้', activeCls: 'bg-blue-600 text-white border-blue-600 shadow-xs' },
                { name: 'หงุดหงิด/ก้าวร้าว', activeCls: 'bg-orange-600 text-white border-orange-600 shadow-xs ring-1 ring-orange-300' },
                { name: 'หูแว่ว/ประสาทหลอน', activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs' },
                { name: 'หวาดระแวง/หลงผิด', activeCls: 'bg-violet-600 text-white border-violet-600 shadow-xs' },
                { name: 'สับสน/หลงลืม', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                { name: 'ทำร้ายตนเอง', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-400/50' },
                { name: 'มีปัญหาพฤติกรรม', activeCls: 'bg-teal-600 text-white border-teal-600 shadow-xs' },
              ].map(({ name: item, activeCls }) => {
                const isSelected = (data.chiefComplaint || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem('chiefComplaint', item)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                      isSelected
                        ? activeCls
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-slate-400/80 shrink-0" />
                    )}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 space-y-1 max-w-md">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">ระบุอาการสำคัญอื่นๆ เพิ่มเติม (ถ้ามี)</span>
              </div>
              <DebouncedInput
                type="text"
                value={data.chiefComplaintOther}
                onChangeValue={val => onChange({ chiefComplaintOther: val })}
                onBlur={e => onBlurField && onBlurField('chiefComplaintOther', e.target.value)}
                placeholder="ระบุอาการสำคัญอื่นๆ สั้นๆ..."
                className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 2. อาการร่วมที่สำคัญ (Associated symptoms) - กรอกเรียงก่อน HPI details ตามหลักคลินิก */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              อาการร่วมที่สำคัญ (Associated symptoms) <span className="text-xs font-normal text-slate-500">(เลือกได้มากกว่า 1 ข้อ)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'นอนไม่หลับ', activeCls: 'bg-indigo-600 text-white border-indigo-600 shadow-xs' },
                { name: 'เบื่ออาหาร', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                { name: 'น้ำหนักลด/เพิ่ม', activeCls: 'bg-sky-600 text-white border-sky-600 shadow-xs' },
                { name: 'อ่อนเพลีย', activeCls: 'bg-slate-600 text-white border-slate-600 shadow-xs' },
                { name: 'แยกตัว', activeCls: 'bg-violet-600 text-white border-violet-600 shadow-xs' },
                { name: 'พฤติกรรมแปลกไปจากเดิม', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-300' },
              ].map(({ name: item, activeCls }) => {
                const isSelected = (data.associatedSymptoms || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem('associatedSymptoms', item)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                      isSelected
                        ? activeCls
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-slate-400/80 shrink-0" />
                    )}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. รายละเอียดประวัติปัจจุบัน (HPI Details) พร้อมระยะเวลา ลักษณะการเกิด และการดำเนินโรค */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap items-start gap-4">
              {/* Duration */}
              <div className="shrink-0">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  ระยะเวลาที่มีอาการ (Duration)
                </label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { dur: '1 วัน', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
                    { dur: '< 1 สัปดาห์', activeCls: 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs' },
                    { dur: '1-4 สัปดาห์', activeCls: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs' },
                    { dur: '1-6 เดือน', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
                    { dur: '> 6 เดือน', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
                  ].map(({ dur, activeCls }) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => handleDurationChange(dur as any)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        data.duration === dur
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Onset */}
              <div className="shrink-0">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  ลักษณะการเกิดอาการ (Onset)
                </label>
                <div className="flex gap-1">
                  {[
                    { onset: 'เฉียบพลัน (Acute)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
                    { onset: 'ค่อยเป็นค่อยไป (Gradual)', activeCls: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs' },
                  ].map(({ onset, activeCls }) => (
                    <button
                      key={onset}
                      type="button"
                      onClick={() => onChange({ onset: onset as any })}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        (data.onset || 'ค่อยเป็นค่อยไป (Gradual)') === onset
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {onset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course */}
              <div className="shrink-0">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  การดำเนินโรค (Course)
                </label>
                <div className="flex flex-wrap gap-1">
                  {[
                    { course: 'แย่ลงเรื่อยๆ (Progressive)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-400' },
                    { course: 'ดีขึ้นสลับแย่ลง (Fluctuating)', activeCls: 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs' },
                    { course: 'คงที่ (Stable)', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs' },
                  ].map(({ course, activeCls }) => (
                    <button
                      key={course}
                      type="button"
                      onClick={() => onChange({ course: course as any })}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        (data.course || 'แย่ลงเรื่อยๆ (Progressive)') === course
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {course}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                รายละเอียดประวัติปัจจุบันเพิ่มเติม (HPI Details)
              </label>
              <DebouncedTextarea
                rows={3}
                value={data.hpiDetails}
                onChangeValue={val => onChange({ hpiDetails: val })}
                onBlur={e => onBlurField && onBlurField('hpiDetails', e.target.value)}
                placeholder="บันทึกเรื่องราวการเจ็บป่วย เหตุการณ์นำมา ลำดับอาการ พฤติกรรมที่สังเกตได้..."
                className="w-full text-sm bg-white border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 4. ปัจจัยกระตุ้น (Precipitating factors) - กรอกเรียงถัดจาก HPI details */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              ปัจจัยกระตุ้น (Precipitating factors) <span className="text-xs font-normal text-slate-500">(เลือกได้มากกว่า 1 ข้อ)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'ขาดยา', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-300' },
                { name: 'ใช้สารเสพติด', activeCls: 'bg-orange-600 text-white border-orange-600 shadow-xs' },
                { name: 'โรคทางกายกำเริบ', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                { name: 'ปัญหาครอบครัว/ความสัมพันธ์', activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs' },
                { name: 'การเงิน/การงาน', activeCls: 'bg-sky-600 text-white border-sky-600 shadow-xs' },
                { name: 'ไม่พบปัจจัยชัดเจน', activeCls: 'bg-slate-600 text-white border-slate-600 shadow-xs' },
              ].map(({ name: item, activeCls }) => {
                const isSelected = (data.precipitatingFactors || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem('precipitatingFactors', item)}
                    className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                      isSelected
                        ? activeCls
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-slate-400/80 shrink-0" />
                    )}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Previous treatment & response */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                การรักษาก่อนหน้า
              </label>
              <div className="flex flex-wrap gap-1">
                {(['ไม่เคยรักษาจิตเวชมาก่อน', 'เคยรักษา'] as const).map(pt => {
                  const isSelected = (data.previousTreatment || 'ไม่เคยรักษาจิตเวชมาก่อน') === pt;
                  const activeCls =
                    pt === 'เคยรักษา'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                      : 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs';
                  return (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => {
                        onChange({
                          previousTreatment: pt,
                          ...(pt === 'ไม่เคยรักษาจิตเวชมาก่อน' ? { previousHospital: '', previousResponse: '' } : {}),
                        });
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? activeCls
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {pt}
                    </button>
                  );
                })}
              </div>
            </div>

            {data.previousTreatment === 'เคยรักษา' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    เคยรักษาที่ (ระบุ รพ./คลินิก)
                  </label>
                  <DebouncedInput
                    type="text"
                    value={data.previousHospital}
                    onChangeValue={val => onChange({ previousHospital: val })}
                    placeholder="ระบุสถานพยาบาลเดิม"
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    ผลการรักษาเดิม
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { resp: 'ร่วมมือดี อาการสงบ', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs' },
                      { resp: 'ขาดยาบ่อย', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
                      { resp: 'ปฏิเสธการเจ็บป่วย/ไม่ยอมทานยา', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-400' },
                    ].map(({ resp, activeCls }) => (
                      <button
                        key={resp}
                        type="button"
                        onClick={() => onChange({ previousResponse: resp as any })}
                        className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          data.previousResponse === resp
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {resp}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const Step1PatientAndComplaint = React.memo(Step1PatientAndComplaintComponent, (prevProps, nextProps) => {
  const step1Keys: (keyof typeof prevProps.data)[] = [
    'assessmentDate',
    'assessmentTime',
    'admissionType',
    'fullName',
    'age',
    'gender',
    'hn',
    'an',
    'maritalStatus',
    'occupation',
    'educationLevel',
    'informant',
    'informantDetail',
    'reliability',
    'chiefComplaint',
    'chiefComplaintOther',
    'duration',
    'onset',
    'course',
    'precipitatingFactors',
    'precipitatingFactorsOther',
    'associatedSymptoms',
    'hpiDetails',
    'previousTreatment',
    'previousHospital',
    'previousResponse'
  ];

  for (const key of step1Keys) {
    if (prevProps.data[key] !== nextProps.data[key]) {
      return false;
    }
  }

  const errorKeys = ['hn', 'fullName', 'age', 'gender'];
  for (const key of errorKeys) {
    if (prevProps.errors[key] !== nextProps.errors[key]) {
      return false;
    }
  }

  return true;
});
