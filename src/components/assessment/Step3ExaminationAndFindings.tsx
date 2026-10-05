import React, { useMemo } from 'react';
import {
  Brain,
  Stethoscope,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  FlaskConical,
  FileCheck,
  CheckSquare,
  Info,
} from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { DebouncedInput } from './DebouncedInput';
import {
  calculateBmi,
  applyObesityAutomation,
  applyUnderweightAutomation,
} from '../../utils/bmiHelper';
import { PsychiatricAssessment } from '../../types/assessment';

const Step3ExaminationAndFindingsComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  onApplyWnlMse,
  onApplyWnlPhysical,
  toggleArrayItem,
  toggleMseItem,
}) => {
  const bmiResult = useMemo(
    () => calculateBmi(data.weight || '', data.height || ''),
    [data.weight, data.height]
  );

  const handleWeightChange = (newWeight: string) => {
    const res = calculateBmi(newWeight, data.height || '');
    const updates: Partial<PsychiatricAssessment> = {
      weight: newWeight,
      bmi: res.bmi,
      bmiCategory: res.category,
    };

    // Auto-decide nutrition status based on clinical BMI rationale
    if (res.nutritionStatus) {
      updates.nutrition = res.nutritionStatus;
    }

    if (res.isObeseClass1OrAbove) {
      const auto = applyObesityAutomation(
        res.obesitySeverity,
        data.comorbidDiagnosis || '',
        data.mdtRoles || [],
        data.mdtOther || ''
      );
      Object.assign(updates, auto);
      if (data.medicalHistory === 'ไม่มีโรคประจำตัว') {
        updates.medicalHistory = 'มีโรคประจำตัว';
      }
    } else if (res.isUnderweight) {
      const auto = applyUnderweightAutomation(
        data.comorbidDiagnosis || '',
        data.mdtRoles || [],
        data.mdtOther || ''
      );
      Object.assign(updates, auto);
      if (data.medicalHistory === 'ไม่มีโรคประจำตัว') {
        updates.medicalHistory = 'มีโรคประจำตัว';
      }
    }

    onChange(updates);
  };

  const handleHeightChange = (newHeight: string) => {
    const res = calculateBmi(data.weight || '', newHeight);
    const updates: Partial<PsychiatricAssessment> = {
      height: newHeight,
      bmi: res.bmi,
      bmiCategory: res.category,
    };

    // Auto-decide nutrition status based on clinical BMI rationale
    if (res.nutritionStatus) {
      updates.nutrition = res.nutritionStatus;
    }

    if (res.isObeseClass1OrAbove) {
      const auto = applyObesityAutomation(
        res.obesitySeverity,
        data.comorbidDiagnosis || '',
        data.mdtRoles || [],
        data.mdtOther || ''
      );
      Object.assign(updates, auto);
      if (data.medicalHistory === 'ไม่มีโรคประจำตัว') {
        updates.medicalHistory = 'มีโรคประจำตัว';
      }
    } else if (res.isUnderweight) {
      const auto = applyUnderweightAutomation(
        data.comorbidDiagnosis || '',
        data.mdtRoles || [],
        data.mdtOther || ''
      );
      Object.assign(updates, auto);
      if (data.medicalHistory === 'ไม่มีโรคประจำตัว') {
        updates.medicalHistory = 'มีโรคประจำตัว';
      }
    }

    onChange(updates);
  };
  return (
    <div className="space-y-6">
      {/* SECTION D: Mental Status Examination (MSE) */}
      <section id="section-d" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
              <h3 className="font-bold text-white text-sm sm:text-base">
                D. Mental Status Examination (การตรวจสภาพจิต — MSE)
              </h3>
            </div>
            {onApplyWnlMse && (
              <button
                type="button"
                onClick={onApplyWnlMse}
                className="text-[11px] sm:text-xs text-blue-950 bg-white hover:bg-blue-50 border border-blue-200 font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg flex items-center gap-1 sm:gap-1.5 transition-all shadow-xs cursor-pointer"
                title="ตั้งค่า MSE ทุกข้อเป็นปกติ (Normal / WNL)"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>ปกติทั้งหมด (WNL)</span>
              </button>
            )}
          </div>
          <span className="text-xs text-blue-100 font-medium hidden sm:inline">ตารางตรวจสภาพจิต 10 หัวข้อ (Vertical Alignment Table)</span>
        </div>

        {/* Content Body: Vertical Alignment Table / Checklist (English terms, Orientation symbol toggles, Insight with Thai) */}
        <div className="p-3 sm:p-5 text-left">
          <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">

            {/* Row 1: Appearance & Psychomotor */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  1. Appearance & Psychomotor
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  ลักษณะทั่วไปและพฤติกรรม
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  {[
                    { name: 'Normal', label: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 shadow-xs' },
                    { name: 'Poor hygiene', label: 'Poor hygiene', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                    { name: 'Restless/Agitated', label: 'Restless / Agitated', activeCls: 'bg-orange-600 text-white border-orange-600 shadow-xs ring-1 ring-orange-300' },
                    { name: 'Retardation', label: 'Retardation', activeCls: 'bg-indigo-600 text-white border-indigo-600 shadow-xs' },
                    { name: 'Uncooperative', label: 'Uncooperative', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs' },
                    { name: 'EPS', label: 'EPS', activeCls: 'bg-rose-700 text-white border-rose-700 shadow-xs ring-2 ring-rose-400' },
                  ].map(({ name: item, label, activeCls }) => {
                    const isSelected =
                      data.appearanceBehavior.includes(item) ||
                      (item === 'Poor hygiene' && data.appearanceBehavior.includes('Unkempt/Poor hygiene'));
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMseItem('appearanceBehavior', item)}
                        className={`w-full min-h-[42px] px-2 py-2 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center transition-all select-none active:scale-[0.98] ${
                          isSelected
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 2: Speech */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  2. Speech
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  ลักษณะการพูดจา
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  {[
                    { name: 'Normal', label: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 shadow-xs' },
                    { name: 'Slow/Poverty of speech', label: 'Slow / Poverty', activeCls: 'bg-indigo-600 text-white border-indigo-600 shadow-xs' },
                    { name: 'Talkative/Pressured', label: 'Pressured', activeCls: 'bg-orange-600 text-white border-orange-600 shadow-xs ring-1 ring-orange-300' },
                    { name: 'Loud/Aggressive', label: 'Loud / Aggressive', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs' },
                    { name: 'Slurred', label: 'Slurred', activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs' },
                    { name: 'Mute', label: 'Mute', activeCls: 'bg-slate-700 text-white border-slate-700 shadow-xs' },
                  ].map(({ name: item, label, activeCls }) => {
                    const isSelected = data.speech.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMseItem('speech', item)}
                        className={`w-full min-h-[42px] px-2 py-2 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center transition-all select-none active:scale-[0.98] ${
                          isSelected
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 3: Mood & Affect */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  3. Mood & Affect
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  อารมณ์และการแสดงออก
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  {[
                    { name: 'Euthymic', label: 'Euthymic', activeCls: 'bg-emerald-600 text-white border-emerald-600 shadow-xs' },
                    { name: 'Depressed', label: 'Depressed', activeCls: 'bg-blue-600 text-white border-blue-600 shadow-xs' },
                    { name: 'Euphoric/Elated', label: 'Euphoric / Elated', activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs' },
                    { name: 'Irritable/Angry', label: 'Irritable / Angry', alt: 'Labile', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-300' },
                    { name: 'Anxious', label: 'Anxious', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                    { name: 'Blunted/Flat', label: 'Blunted / Flat', activeCls: 'bg-slate-600 text-white border-slate-600 shadow-xs' },
                  ].map(({ name: item, label, alt, activeCls }) => {
                    const isSelected =
                      data.moodAffect.includes(item) ||
                      (alt && data.moodAffect.includes(alt));
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          if (alt && data.moodAffect.includes(alt)) {
                            const withoutAlt = data.moodAffect.filter(i => i !== alt);
                            onChange({ moodAffect: withoutAlt });
                          }
                          toggleMseItem('moodAffect', item);
                        }}
                        className={`w-full min-h-[42px] px-2 py-2 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center transition-all select-none active:scale-[0.98] ${
                          isSelected
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 4: Thought Process */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  4. Thought Process
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  กระบวนการคิดและเชื่อมโยง
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  {[
                    { name: 'Logical/Coherent', label: 'Logical / Coherent', activeCls: 'bg-emerald-600 text-white border-emerald-600 shadow-xs' },
                    { name: 'Flight of ideas', label: 'Flight of ideas', activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs' },
                    { name: 'Loose association', label: 'Loose association', activeCls: 'bg-orange-600 text-white border-orange-600 shadow-xs' },
                    { name: 'Circumstantial', label: 'Circumstantial', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                    { name: 'Tangential', label: 'Tangential', activeCls: 'bg-indigo-600 text-white border-indigo-600 shadow-xs' },
                    { name: 'Incoherent', label: 'Incoherent', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-300' },
                  ].map(({ name: item, label, activeCls }) => {
                    const isSelected = data.thoughtProcess.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMseItem('thoughtProcess', item)}
                        className={`w-full min-h-[42px] px-2 py-2 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center transition-all select-none active:scale-[0.98] ${
                          isSelected
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 5: Thought Content */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  5. Thought Content
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  เนื้อหาความคิด
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3 space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  {[
                    { name: 'Normal', label: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 shadow-xs' },
                    { name: 'Delusion', label: 'Delusion', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-300' },
                    { name: 'Suicidal ideation', label: 'Suicidal ideation', activeCls: 'bg-rose-700 text-white border-rose-700 shadow-xs ring-2 ring-rose-400' },
                    { name: 'Homicidal ideation', label: 'Homicidal ideation', activeCls: 'bg-rose-800 text-white border-rose-800 shadow-xs ring-2 ring-rose-500' },
                    { name: 'Obsession/Phobia', label: 'Obsession / Phobia', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                    { name: 'Grandiosity', label: 'Grandiosity', activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs' },
                  ].map(({ name: item, label, activeCls }) => {
                    const isSelected = data.thoughtContent.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMseItem('thoughtContent', item)}
                        className={`w-full min-h-[42px] px-2 py-2 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center transition-all select-none active:scale-[0.98] ${
                          isSelected
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
                {data.thoughtContent.includes('Delusion') && (
                  <div className="pt-1">
                    <DebouncedInput
                      type="text"
                      value={data.delusionDetail}
                      onChangeValue={val => onChange({ delusionDetail: val })}
                      placeholder="ระบุประเภทและรายละเอียด Delusion เช่น Persecutory delusion, Delusion of control..."
                      className="w-full text-xs bg-rose-50/50 border border-rose-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Row 6: Perception */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  6. Perception
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  การรับรู้และประสาทหลอน
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  {[
                    { name: 'Normal', label: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 shadow-xs' },
                    { name: 'Auditory Hallucination', label: 'Auditory Hallucination', activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs ring-1 ring-purple-300' },
                    { name: 'Visual Hallucination', label: 'Visual Hallucination', activeCls: 'bg-indigo-600 text-white border-indigo-600 shadow-xs' },
                    { name: 'Illusion', label: 'Illusion', activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                    { name: 'Somatic Hallucination', label: 'Somatic Hallucination', activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs' },
                    { name: 'Depersonalization', label: 'Depersonalization', activeCls: 'bg-teal-600 text-white border-teal-600 shadow-xs' },
                  ].map(({ name: item, label, activeCls }) => {
                    const isSelected = data.perception.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleMseItem('perception', item)}
                        className={`w-full min-h-[42px] px-2 py-2 text-xs rounded-xl border font-bold flex items-center justify-center gap-1.5 cursor-pointer text-center transition-all select-none active:scale-[0.98] ${
                          isSelected
                            ? activeCls
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" />
                        )}
                        <span className="leading-tight">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Row 7: Orientation (1 Toggle Button per Item: Green = Intact, Red = Impaired) */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  7. Orientation
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  การรับรู้ วัน เวลา สถานที่ บุคคล
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                  {/* Item 1: Time Button */}
                  <button
                    type="button"
                    onClick={() => onChange({ orientationTime: !data.orientationTime })}
                    className={`w-full min-h-[46px] px-4 py-2.5 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                      data.orientationTime
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                        : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                    }`}
                    title={data.orientationTime ? 'Time: ปกติ (แตะเพื่อเปลี่ยนเป็นสับสน)' : 'Time: สับสน (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                  >
                    <div className="flex items-center gap-2">
                      {data.orientationTime ? (
                        <Check className="w-4 h-4 stroke-[3] shrink-0" />
                      ) : (
                        <X className="w-4 h-4 stroke-[3] shrink-0" />
                      )}
                      <span className="font-extrabold text-sm tracking-wide">Time</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                      {data.orientationTime ? 'Intact (ปกติ)' : 'Impaired (สับสน)'}
                    </span>
                  </button>

                  {/* Item 2: Place Button */}
                  <button
                    type="button"
                    onClick={() => onChange({ orientationPlace: !data.orientationPlace })}
                    className={`w-full min-h-[46px] px-4 py-2.5 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                      data.orientationPlace
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                        : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                    }`}
                    title={data.orientationPlace ? 'Place: ปกติ (แตะเพื่อเปลี่ยนเป็นสับสน)' : 'Place: สับสน (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                  >
                    <div className="flex items-center gap-2">
                      {data.orientationPlace ? (
                        <Check className="w-4 h-4 stroke-[3] shrink-0" />
                      ) : (
                        <X className="w-4 h-4 stroke-[3] shrink-0" />
                      )}
                      <span className="font-extrabold text-sm tracking-wide">Place</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                      {data.orientationPlace ? 'Intact (ปกติ)' : 'Impaired (สับสน)'}
                    </span>
                  </button>

                  {/* Item 3: Person Button */}
                  <button
                    type="button"
                    onClick={() => onChange({ orientationPerson: !data.orientationPerson })}
                    className={`w-full min-h-[46px] px-4 py-2.5 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                      data.orientationPerson
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                        : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                    }`}
                    title={data.orientationPerson ? 'Person: ปกติ (แตะเพื่อเปลี่ยนเป็นสับสน)' : 'Person: สับสน (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                  >
                    <div className="flex items-center gap-2">
                      {data.orientationPerson ? (
                        <Check className="w-4 h-4 stroke-[3] shrink-0" />
                      ) : (
                        <X className="w-4 h-4 stroke-[3] shrink-0" />
                      )}
                      <span className="font-extrabold text-sm tracking-wide">Person</span>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                      {data.orientationPerson ? 'Intact (ปกติ)' : 'Impaired (สับสน)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 8: Attention & Memory (Single-tap Toggle Button) */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  8. Attention & Memory
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  สมาธิและความจำ
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <button
                  type="button"
                  onClick={() => onChange({ attentionMemory: data.attentionMemory === 'Impaired' ? 'Intact' : 'Impaired' })}
                  className={`w-full min-h-[46px] px-4 py-2.5 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.attentionMemory !== 'Impaired'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                  }`}
                  title={data.attentionMemory !== 'Impaired' ? 'Attention & Memory: ปกติ (แตะเพื่อเปลี่ยนเป็นบกพร่อง)' : 'Attention & Memory: บกพร่อง (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.attentionMemory !== 'Impaired' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-sm tracking-wide">Attention & Memory</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.attentionMemory !== 'Impaired' ? 'Intact (ปกติ)' : 'Impaired (บกพร่อง)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Row 9: Judgment (Single-tap Toggle Button) */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  9. Judgment
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  การตัดสินใจและวิจารณญาณ
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3">
                <button
                  type="button"
                  onClick={() => onChange({ judgment: data.judgment === 'Impaired' ? 'Intact' : 'Impaired' })}
                  className={`w-full min-h-[46px] px-4 py-2.5 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.judgment !== 'Impaired'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                  }`}
                  title={data.judgment !== 'Impaired' ? 'Judgment: ปกติ (แตะเพื่อเปลี่ยนเป็นบกพร่อง)' : 'Judgment: บกพร่อง (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.judgment !== 'Impaired' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-sm tracking-wide">Judgment</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.judgment !== 'Impaired' ? 'Intact (ปกติ)' : 'Impaired (บกพร่อง)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Row 10: Insight (Preserves Thai translations as requested) */}
            <div className="flex flex-col md:flex-row md:items-stretch transition-colors hover:bg-slate-50/40">
              <div className="w-full md:w-48 lg:w-56 shrink-0 p-3 md:p-3.5 bg-slate-50/80 md:border-r border-b md:border-b-0 border-slate-200 flex flex-col justify-center text-left">
                <span className="font-extrabold text-xs text-slate-800 tracking-tight uppercase">
                  10. Insight
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                  ระดับการรับรู้โรค (6 ระดับ)
                </span>
              </div>
              <div className="flex-1 w-full p-2.5 sm:p-3 space-y-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                  {[
                    { level: '1', key: '1(Complete denial)', primary: 'Level 1: Denial', secondary: 'ปฏิเสธว่าไม่ได้ป่วย' },
                    { level: '2', key: '2(Slight awareness)', primary: 'Level 2: Slight', secondary: 'รู้ตัวเล็กน้อยไม่รักษา' },
                    { level: '3', key: '3(Aware but blaming)', primary: 'Level 3: Blaming', secondary: 'โทษผู้อื่น/สิ่งแวดล้อม' },
                    { level: '4', key: '4(Aware illness unknown)', primary: 'Level 4: Unknown', secondary: 'ไม่ทราบสาเหตุการป่วย' },
                    { level: '5', key: '5(Intellectual)', primary: 'Level 5: Intellectual', secondary: 'รู้แต่ยังปรับใช้ไม่ได้' },
                    { level: '6', key: '6(True)', primary: 'Level 6: True insight', secondary: 'เข้าใจตนเองแท้จริง' },
                  ].map(item => {
                    const isSelected =
                      data.insight === item.key ||
                      data.insight === item.level ||
                      data.insight?.startsWith(item.level);
                    return (
                      <button
                        key={item.level}
                        type="button"
                        onClick={() => onChange({ insight: item.key as any })}
                        className={`w-full min-h-[50px] p-2 text-xs rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all select-none active:scale-[0.98] ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs ring-1 ring-blue-300'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-medium'
                        }`}
                      >
                        <span className="font-bold leading-tight flex items-center justify-center gap-1">
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3] shrink-0" />}
                          {item.primary}
                        </span>
                        <span className={`text-[10.5px] leading-tight mt-0.5 ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                          {item.secondary}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {/* Clinical Description for selected Insight */}
                {(() => {
                  const currentLevel = [
                    { level: '1', key: '1(Complete denial)', label: 'Level 1: Complete denial of illness', desc: 'ปฏิเสธว่าไม่ได้เจ็บป่วยหรือมีความผิดปกติใดๆ ทางจิตเวช' },
                    { level: '2', key: '2(Slight awareness)', label: 'Level 2: Slight awareness of being sick', desc: 'รู้ตัวว่าป่วยเล็กน้อย แต่ปฏิเสธการรักษาและไม่คิดว่าอาการสำคัญ' },
                    { level: '3', key: '3(Aware but blaming)', label: 'Level 3: Aware but blaming external factors', desc: 'ยอมรับว่ามีอาการผิดปกติ แต่โทษผู้อื่น สิ่งแวดล้อม หรือโรคทางกาย' },
                    { level: '4', key: '4(Aware illness unknown)', label: 'Level 4: Aware of illness due to unknown cause', desc: 'ตระหนักว่าตนเองป่วย แต่คิดว่าเกิดจากสาเหตุลึกลับหรือไม่ทราบสาเหตุ' },
                    { level: '5', key: '5(Intellectual)', label: 'Level 5: Intellectual insight', desc: 'ยอมรับว่าตนเองมีโรคทางจิตเวชและต้องรักษา แต่ยังไม่สามารถนำความเข้าใจไปปรับใช้ในชีวิตจริงได้' },
                    { level: '6', key: '6(True)', label: 'Level 6: True emotional insight', desc: 'เข้าใจความเจ็บป่วยของตนเองอย่างลึกซึ้งทั้งความคิดและอารมณ์ พร้อมร่วมมือปรับเปลี่ยนพฤติกรรมและการรักษา' },
                  ].find(l => data.insight === l.key || data.insight === l.level || data.insight?.startsWith(l.level));

                  if (!currentLevel) return null;
                  return (
                    <div className="px-3.5 py-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium text-left leading-relaxed">
                      <span className="font-bold text-blue-950">{currentLevel.label}:</span> {currentLevel.desc}
                    </div>
                  );
                })()}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION F: Physical & Neurological Assessment */}
      <section id="section-f" className="clay-surface overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
              <h3 className="font-bold text-white text-sm sm:text-base">
                F. Physical & Neurological Assessment (การตรวจร่างกายและระบบประสาท)
              </h3>
            </div>
            {onApplyWnlPhysical && (
              <button
                type="button"
                onClick={onApplyWnlPhysical}
                className="text-[11px] sm:text-xs text-emerald-900 bg-emerald-100 hover:bg-white border border-emerald-200 font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-1.5 transition-all shadow-xs cursor-pointer"
                title="ตั้งค่าการตรวจร่างกายและระบบประสาททั้งหมดเป็นปกติ (WNL)"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>ปกติทั้งหมด (WNL)</span>
              </button>
            )}
          </div>
          <span className="text-xs text-blue-100 font-medium hidden sm:inline">สัญญาณชีพ และการตรวจทางกาย</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-5">
          {/* Vital Signs Grid */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Vital Signs & BMI (สัญญาณชีพและดัชนีมวลกาย)
              </label>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                ลำดับ: Temp → HR → BP → RR → น้ำหนัก → ส่วนสูง → BMI (คำนวณอัตโนมัติ)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* 1. Temp */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Temp:</span>
                <input
                  type="text"
                  value={data.temperature}
                  onChange={e => onChange({ temperature: e.target.value })}
                  placeholder="36.5"
                  className="w-14 text-xs font-mono border border-slate-300 rounded px-1.5 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">°C</span>
              </div>

              {/* 2. HR (Pulse Rate) */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">HR:</span>
                <input
                  type="number"
                  value={data.pulseRate}
                  onChange={e => onChange({ pulseRate: e.target.value })}
                  placeholder="76"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1.5 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">/min</span>
              </div>

              {/* 3. BP */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">BP:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={data.bpSys}
                    onChange={e => onChange({ bpSys: e.target.value })}
                    placeholder="120"
                    className="w-12 text-xs font-mono border border-slate-300 rounded px-1 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="text-slate-400 font-bold text-xs">/</span>
                  <input
                    type="number"
                    value={data.bpDia}
                    onChange={e => onChange({ bpDia: e.target.value })}
                    placeholder="80"
                    className="w-12 text-xs font-mono border border-slate-300 rounded px-1 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 font-medium">mmHg</span>
                </div>
              </div>

              {/* 4. RR */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">RR:</span>
                <input
                  type="number"
                  value={data.respRate}
                  onChange={e => onChange({ respRate: e.target.value })}
                  placeholder="18"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1.5 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">/min</span>
              </div>

              {/* 5. น้ำหนัก (Weight) */}
              <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-blue-950 whitespace-nowrap">น้ำหนัก:</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.weight || ''}
                  onChange={e => handleWeightChange(e.target.value)}
                  placeholder="65"
                  className="w-14 text-xs font-mono font-bold border border-blue-300 rounded px-1.5 py-1 text-center bg-white text-blue-950 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-blue-700 font-semibold">kg</span>
              </div>

              {/* 6. ส่วนสูง (Height) */}
              <div className="p-2 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-blue-950 whitespace-nowrap">ส่วนสูง:</span>
                <input
                  type="number"
                  step="0.1"
                  value={data.height || ''}
                  onChange={e => handleHeightChange(e.target.value)}
                  placeholder="165"
                  className="w-14 text-xs font-mono font-bold border border-blue-300 rounded px-1.5 py-1 text-center bg-white text-blue-950 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-blue-700 font-semibold">cm</span>
              </div>

              {/* 7. BMI (Auto-calculated) */}
              <div className={`p-2 rounded-lg flex items-center gap-1.5 shadow-2xs border ${
                data.bmi
                  ? Number(data.bmi) >= 30
                    ? 'bg-orange-50 border-orange-300'
                    : 'bg-emerald-50 border-emerald-300'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-xs font-extrabold text-slate-800 whitespace-nowrap">BMI:</span>
                <span className="min-w-[42px] px-1.5 py-1 bg-white border border-slate-300 rounded text-center text-xs font-mono font-extrabold text-slate-900 shadow-2xs">
                  {data.bmi || '-'}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">kg/m²</span>
                {data.bmiCategory && (
                  <span className={`px-2 py-0.5 text-[10px] rounded-full border ${bmiResult.badgeColorClass || 'bg-slate-100 text-slate-700'}`}>
                    {data.bmiCategory}
                  </span>
                )}
              </div>

              {/* 8. SpO2 */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">SpO2:</span>
                <input
                  type="number"
                  value={data.spo2}
                  onChange={e => onChange({ spo2: e.target.value })}
                  placeholder="98"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1.5 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">%</span>
              </div>

              {/* 9. Pain Score */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Pain:</span>
                <input
                  type="text"
                  value={data.painScore}
                  onChange={e => onChange({ painScore: e.target.value })}
                  placeholder="0"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1.5 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">/10</span>
              </div>
            </div>

            {/* Obesity Automation Alert Banner when BMI >= 30 */}
            {data.bmi && Number(data.bmi) >= 30 && (
              <div className="mt-2.5 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-300 rounded-xl shadow-xs text-xs text-orange-950 flex items-start gap-2.5">
                <div className="p-1 bg-orange-600 text-white rounded-full shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-orange-900 text-xs">
                      ⚡ ดำเนินการอัตโนมัติสำหรับภาวะอ้วน (BMI {data.bmi} — {data.bmiCategory}):
                    </span>
                    <span className="px-2 py-0.5 bg-orange-200 text-orange-900 rounded font-bold text-[10px]">
                      BMI ≥ 30 Protocol Activated
                    </span>
                  </div>
                  <div className="text-[11.5px] text-orange-900 leading-relaxed space-y-0.5">
                    <div>
                      <span className="font-bold text-orange-950">1. Comorbidity:</span> บันทึกระดับความรุนแรง <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-orange-300 text-orange-900">"{data.comorbidDiagnosis}"</span> ในช่อง Comorbidity อัตโนมัติแล้ว
                    </div>
                    <div>
                      <span className="font-bold text-orange-950">2. MDT Consult:</span> ตั้งค่าส่ง Consult และระบุในช่อง consult <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-orange-300 text-orange-900">"นักโภชนบำบัด ปรึกษาเรื่องน้ำหนักเกินและปรับอาหารให้เหมาะสม"</span> อัตโนมัติแล้ว
                    </div>
                    <div>
                      <span className="font-bold text-orange-950">3. Nutrition Status:</span> บันทึกสถานะโภชนาการเป็น <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-orange-300 text-rose-700">"Impaired (ทุพโภชนาการเกิน/โรคอ้วน)"</span> ในช่อง Nutrition อัตโนมัติแล้ว
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Underweight Automation Alert Banner when BMI < 18.5 */}
            {data.bmi && Number(data.bmi) > 0 && Number(data.bmi) < 18.5 && (
              <div className="mt-2.5 p-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-300 rounded-xl shadow-xs text-xs text-sky-950 flex items-start gap-2.5">
                <div className="p-1 bg-sky-600 text-white rounded-full shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-sky-900 text-xs">
                      ⚡ ดำเนินการอัตโนมัติสำหรับภาวะน้ำหนักต่ำกว่าเกณฑ์ (BMI {data.bmi} — {data.bmiCategory}):
                    </span>
                    <span className="px-2 py-0.5 bg-sky-200 text-sky-900 rounded font-bold text-[10px]">
                      BMI &lt; 18.5 Protocol Activated
                    </span>
                  </div>
                  <div className="text-[11.5px] text-sky-900 leading-relaxed space-y-0.5">
                    <div>
                      <span className="font-bold text-sky-950">1. Comorbidity:</span> บันทึก <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-sky-300 text-sky-900">"{data.comorbidDiagnosis}"</span> อัตโนมัติแล้ว
                    </div>
                    <div>
                      <span className="font-bold text-sky-950">2. MDT Consult:</span> ตั้งค่าส่ง Consult และระบุ <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-sky-300 text-sky-900">"นักโภชนบำบัด ปรึกษาเรื่องน้ำหนักต่ำกว่าเกณฑ์และเสริมโภชนาการ"</span> อัตโนมัติแล้ว
                    </div>
                    <div>
                      <span className="font-bold text-sky-950">3. Nutrition Status:</span> บันทึกสถานะโภชนาการเป็น <span className="font-mono font-bold bg-white/80 px-1.5 py-0.5 rounded border border-sky-300 text-rose-700">"Impaired (ทุพโภชนาการแบบขาดสารอาหาร)"</span> ในช่อง Nutrition อัตโนมัติแล้ว
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Physical Examination */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Physical Systems Examination (การตรวจร่างกายตามระบบ)
              </label>
              <span className="text-[11px] text-slate-500 font-medium">ค่าเริ่มต้น ปกติ (แตะ 1 ครั้งเพื่อระบุความผิดปกติ)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {[
                { label: 'General Appearance', key: 'generalAppearance', detailKey: 'generalAppearanceDetail' },
                { label: 'HEENT', key: 'heent', detailKey: 'heentDetail' },
                { label: 'CVS / RS', key: 'cvsRs', detailKey: 'cvsRsDetail' },
                { label: 'Abdomen', key: 'abdomen', detailKey: 'abdomenDetail' },
                { label: 'Extremities', key: 'extremities', detailKey: 'extremitiesDetail' },
              ].map(sys => {
                const isNormal = (data as any)[sys.key] !== 'Abnormal';
                return (
                  <div key={sys.key} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <button
                      type="button"
                      onClick={() => onChange({ 
                        [sys.key]: isNormal ? 'Abnormal' : 'Normal',
                        ...(isNormal ? {} : { [sys.detailKey]: '' })
                      })}
                      className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                        isNormal
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                          : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                      }`}
                      title={isNormal ? `${sys.label}: ปกติ (แตะเพื่อเปลี่ยนเป็นผิดปกติ)` : `${sys.label}: ผิดปกติ (แตะเพื่อเปลี่ยนเป็นปกติ)`}
                    >
                      <div className="flex items-center gap-2">
                        {isNormal ? (
                          <Check className="w-4 h-4 stroke-[3] shrink-0" />
                        ) : (
                          <X className="w-4 h-4 stroke-[3] shrink-0" />
                        )}
                        <span className="font-extrabold text-xs tracking-wide">{sys.label}</span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                        {isNormal ? 'Normal (ปกติ)' : 'Abnormal (ผิดปกติ)'}
                      </span>
                    </button>
                    {!isNormal && (
                      <input
                        type="text"
                        value={(data as any)[sys.detailKey] || ''}
                        onChange={e => onChange({ [sys.detailKey]: e.target.value })}
                        placeholder={`ระบุความผิดปกติ ${sys.label}...`}
                        className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        autoFocus
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Neurological Examination */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Neurological Examination (การตรวจระบบประสาทอย่างละเอียด)
              </label>
              <span className="text-[11px] text-slate-500 font-medium">ค่าเริ่มต้น ปกติ (แตะ 1 ครั้งเพื่อระบุความผิดปกติ)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {/* 1. Cranial Nerves */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const isNormal = data.cranialNerves === 'Grossly intact';
                    onChange({
                      cranialNerves: isNormal ? 'Abnormal' : 'Grossly intact',
                      ...(isNormal ? {} : { cranialNervesDetail: '' })
                    });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.cranialNerves === 'Grossly intact'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                  }`}
                  title={data.cranialNerves === 'Grossly intact' ? 'CN: ปกติ (แตะเพื่อเปลี่ยนเป็นผิดปกติ)' : 'CN: ผิดปกติ (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.cranialNerves === 'Grossly intact' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-xs tracking-wide">1. Cranial Nerves</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.cranialNerves === 'Grossly intact' ? 'Grossly intact (ปกติ)' : 'Abnormal (ผิดปกติ)'}
                  </span>
                </button>
                {data.cranialNerves === 'Abnormal' && (
                  <input
                    type="text"
                    value={data.cranialNervesDetail}
                    onChange={e => onChange({ cranialNervesDetail: e.target.value })}
                    placeholder="ระบุเส้นประสาทสมองที่ผิดปกติ เช่น CN VII..."
                    className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    autoFocus
                  />
                )}
              </div>

              {/* 2. Motor Power */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const isNormal = data.motorPower === 'Grade V all';
                    onChange({
                      motorPower: isNormal ? 'Abnormal' : 'Grade V all',
                      ...(isNormal ? {} : { motorPowerDetail: '' })
                    });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.motorPower === 'Grade V all'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                  }`}
                  title={data.motorPower === 'Grade V all' ? 'Motor Power: ปกติ (แตะเพื่อเปลี่ยนเป็นผิดปกติ)' : 'Motor Power: ผิดปกติ (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.motorPower === 'Grade V all' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-xs tracking-wide">2. Motor Power</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.motorPower === 'Grade V all' ? 'Grade V all (ปกติ)' : 'Weakness (ผิดปกติ)'}
                  </span>
                </button>
                {data.motorPower === 'Abnormal' && (
                  <input
                    type="text"
                    value={data.motorPowerDetail}
                    onChange={e => onChange({ motorPowerDetail: e.target.value })}
                    placeholder="ระบุเกรดและตำแหน่ง เช่น R't hemiparesis Grade IV..."
                    className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    autoFocus
                  />
                )}
              </div>

              {/* 3. Muscle Tone */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const isNormal = data.tone === 'Normal';
                    onChange({
                      tone: isNormal ? 'Rigidity' : 'Normal',
                      ...(isNormal ? {} : { toneDetail: '' })
                    });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.tone === 'Normal'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                  }`}
                  title={data.tone === 'Normal' ? 'Muscle Tone: ปกติ (แตะเพื่อเปลี่ยนเป็นผิดปกติ)' : 'Muscle Tone: ผิดปกติ (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.tone === 'Normal' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-xs tracking-wide">3. Muscle Tone</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.tone === 'Normal' ? 'Normal (ปกติ)' : `${data.tone || 'Abnormal'} (ผิดปกติ)`}
                  </span>
                </button>
                {data.tone && data.tone !== 'Normal' && (
                  <div className="space-y-1.5">
                    <div className="flex gap-1">
                      {(['Rigidity', 'Spasticity', 'Flaccid'] as const).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => onChange({ tone: t })}
                          className={`flex-1 py-1 text-xs rounded border transition-all cursor-pointer font-bold ${
                            data.tone === t
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={data.toneDetail}
                      onChange={e => onChange({ toneDetail: e.target.value })}
                      placeholder="ระบุรายละเอียด เช่น Lead-pipe rigidity..."
                      className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 4. Sensory System */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const isNormal = data.sensory === 'Intact';
                    onChange({
                      sensory: isNormal ? 'Impaired' : 'Intact',
                      ...(isNormal ? {} : { sensoryDetail: '' })
                    });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.sensory === 'Intact'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                  }`}
                  title={data.sensory === 'Intact' ? 'Sensory: ปกติ (แตะเพื่อเปลี่ยนเป็นผิดปกติ)' : 'Sensory: ผิดปกติ (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.sensory === 'Intact' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-xs tracking-wide">4. Sensory System</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.sensory === 'Intact' ? 'Intact (ปกติ)' : 'Impaired (ผิดปกติ)'}
                  </span>
                </button>
                {data.sensory === 'Impaired' && (
                  <input
                    type="text"
                    value={data.sensoryDetail}
                    onChange={e => onChange({ sensoryDetail: e.target.value })}
                    placeholder="ระบุความผิดปกติ เช่น Numbness both feet..."
                    className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    autoFocus
                  />
                )}
              </div>

              {/* 5. Deep Tendon Reflexes */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const isNormal = data.reflexes === 'Normal';
                    onChange({
                      reflexes: isNormal ? 'Hyperreflexia' : 'Normal',
                      ...(isNormal ? {} : { reflexesDetail: '' })
                    });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.reflexes === 'Normal'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700 shadow-amber-700/20 ring-2 ring-amber-300'
                  }`}
                  title={data.reflexes === 'Normal' ? 'DTRs: ปกติ (แตะเพื่อเปลี่ยนเป็นผิดปกติ)' : 'DTRs: ผิดปกติ (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.reflexes === 'Normal' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-xs tracking-wide">5. DTRs</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.reflexes === 'Normal' ? 'Normal (ปกติ)' : `${data.reflexes} (ผิดปกติ)`}
                  </span>
                </button>
                {data.reflexes !== 'Normal' && (
                  <div className="flex gap-1">
                    {(['Hyperreflexia', 'Hyporeflexia'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => onChange({ reflexes: r })}
                        className={`flex-1 py-1 text-xs rounded border transition-all cursor-pointer font-bold ${
                          data.reflexes === r
                            ? 'bg-amber-600 text-white border-amber-600'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Cerebellar Signs */}
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const isNormal = data.cerebellar === 'Normal';
                    onChange({
                      cerebellar: isNormal ? 'Abnormal' : 'Normal',
                      ...(isNormal ? {} : { cerebellarDetail: '' })
                    });
                  }}
                  className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                    data.cerebellar === 'Normal'
                      ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                      : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                  }`}
                  title={data.cerebellar === 'Normal' ? 'Cerebellar: ปกติ (แตะเพื่อเปลี่ยนเป็นผิดปกติ)' : 'Cerebellar: ผิดปกติ (แตะเพื่อเปลี่ยนเป็นปกติ)'}
                >
                  <div className="flex items-center gap-2">
                    {data.cerebellar === 'Normal' ? (
                      <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 stroke-[3] shrink-0" />
                    )}
                    <span className="font-extrabold text-xs tracking-wide">6. Cerebellar Signs</span>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                    {data.cerebellar === 'Normal' ? 'Normal (ปกติ)' : 'Abnormal (ผิดปกติ)'}
                  </span>
                </button>
                {data.cerebellar === 'Abnormal' && (
                  <input
                    type="text"
                    value={data.cerebellarDetail}
                    onChange={e => onChange({ cerebellarDetail: e.target.value })}
                    placeholder="ระบุความผิดปกติ เช่น Dysmetria, Ataxia..."
                    className="w-full border border-rose-300 rounded-lg px-2.5 py-1.5 bg-white text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    autoFocus
                  />
                )}
              </div>
            </div>
          </div>

          {/* Nutrition & ADL */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Nutrition */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <button
                type="button"
                onClick={() => onChange({ nutrition: data.nutrition === 'Impaired' ? 'Normal' : 'Impaired' })}
                className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                  data.nutrition !== 'Impaired'
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                    : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                }`}
                title={data.nutrition !== 'Impaired' ? 'โภชนาการ: ปกติ (แตะเพื่อเปลี่ยนเป็นบกพร่อง)' : 'โภชนาการ: บกพร่อง (แตะเพื่อเปลี่ยนเป็นปกติ)'}
              >
                <div className="flex items-center gap-2">
                  {data.nutrition !== 'Impaired' ? (
                    <Check className="w-4 h-4 stroke-[3] shrink-0" />
                  ) : (
                    <X className="w-4 h-4 stroke-[3] shrink-0" />
                  )}
                  <span className="font-extrabold text-xs tracking-wide">ภาวะโภชนาการ (Nutrition)</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                  {data.nutrition !== 'Impaired' ? 'Normal (ปกติ)' : 'Impaired (ทุพโภชนาการ)'}
                </span>
              </button>

              {/* Rationale & Decision Note */}
              {bmiResult.bmi ? (
                <div className="p-2 rounded-lg bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1">
                      <Info className="w-3 h-3 text-indigo-500" />
                      เกณฑ์การตัดสินใจจาก BMI (Clinical Rationale):
                    </span>
                    <span className={`text-[10.5px] font-bold px-1.5 py-0.2 rounded ${
                      bmiResult.nutritionStatus === 'Impaired' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      BMI {bmiResult.bmi} → Auto: {bmiResult.nutritionStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    {bmiResult.nutritionDetailedRationale}
                  </p>
                </div>
              ) : (
                <div className="text-[10.5px] text-slate-400 italic px-1">
                  * กรอกน้ำหนักและส่วนสูงด้านบน เพื่อให้ระบบวิเคราะห์ค่า BMI และเลือกสถานะโภชนาการให้อัตโนมัติ
                </div>
              )}
            </div>

            {/* ADL */}
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <button
                type="button"
                onClick={() => onChange({ adl: data.adl === 'Dependent' ? 'Independent' : 'Dependent' })}
                className={`w-full min-h-[44px] px-3.5 py-2 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs ${
                  data.adl !== 'Dependent'
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                    : 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700 shadow-amber-700/20 ring-2 ring-amber-300'
                }`}
                title={data.adl !== 'Dependent' ? 'ADL: ทำกิจวัตรเองได้ (แตะเพื่อเปลี่ยนเป็นต้องพึ่งพาผู้อื่น)' : 'ADL: ต้องพึ่งพาผู้อื่น (แตะเพื่อเปลี่ยนเป็นทำกิจวัตรเองได้)'}
              >
                <div className="flex items-center gap-2">
                  {data.adl !== 'Dependent' ? (
                    <Check className="w-4 h-4 stroke-[3] shrink-0" />
                  ) : (
                    <X className="w-4 h-4 stroke-[3] shrink-0" />
                  )}
                  <span className="font-extrabold text-xs tracking-wide">กิจวัตรประจำวัน (ADL)</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                  {data.adl !== 'Dependent' ? 'Independent (ทำเองได้)' : 'Dependent (ต้องพึ่งพาผู้อื่น)'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: Standardized Assessment */}
      <section id="section-h" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              H. Standardized Assessment (เครื่องมือประเมินมาตรฐาน)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">PHQ-9, 9Q, MMSE-Thai</span>
        </div>
        <div className="p-3.5 sm:p-6 space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              type="button"
              onClick={() => onChange({ standardizedAssessmentStatus: 'ไม่ได้ประเมิน' })}
              className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                data.standardizedAssessmentStatus === 'ไม่ได้ประเมิน'
                  ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              ไม่ได้ประเมิน
            </button>
            <button
              type="button"
              onClick={() => onChange({ standardizedAssessmentStatus: 'ประเมิน' })}
              className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                data.standardizedAssessmentStatus === 'ประเมิน'
                  ? 'bg-teal-700 text-white border-teal-700 shadow-2xs font-bold'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              ประเมิน (ระบุคะแนน)
            </button>
          </div>

          {data.standardizedAssessmentStatus === 'ประเมิน' && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">PHQ-9 (แบบประเมินโรคซึมเศร้า):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="27"
                    value={data.phq9Score}
                    onChange={e => onChange({ phq9Score: e.target.value })}
                    placeholder="0-27"
                    className="w-24 text-center border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-mono font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="font-medium text-slate-600">คะแนน</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">9Q (แบบคัดกรองโรคซึมเศร้า):</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="27"
                    value={data.nineQScore}
                    onChange={e => onChange({ nineQScore: e.target.value })}
                    placeholder="0-27"
                    className="w-24 text-center border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-mono font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="font-medium text-slate-600">คะแนน</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs p-2 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-800">MMSE-Thai / MoCA:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={data.mmseMocaScore}
                    onChange={e => onChange({ mmseMocaScore: e.target.value })}
                    placeholder="0-30"
                    className="w-24 text-center border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-mono font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="font-medium text-slate-600">คะแนน</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs p-2 bg-slate-50 rounded-lg">
                <DebouncedInput
                  type="text"
                  value={data.otherToolName}
                  onChangeValue={val => onChange({ otherToolName: val })}
                  placeholder="เครื่องมืออื่นๆ เช่น SNAP-IV, BPRS..."
                  className="w-56 border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <div className="flex items-center gap-1.5">
                  <DebouncedInput
                    type="text"
                    value={data.otherToolScore}
                    onChangeValue={val => onChange({ otherToolScore: val })}
                    placeholder="คะแนน/ผล"
                    className="w-24 text-center border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white font-mono font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="font-medium text-slate-600">คะแนน</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION I: Investigation */}
      <section id="section-i" className="clay-surface overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              I. Investigation (การตรวจทางห้องปฏิบัติการและการตรวจพิเศษ)
            </h3>
          </div>
          <span className="text-xs text-blue-100 font-medium hidden sm:inline">Lab และการตรวจทางรังสี/คลื่นไฟฟ้า</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              สถานะการส่งตรวจ Lab:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ investigationStatus: 'ไม่จำเป็นต้องส่งตรวจ' })}
                className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  data.investigationStatus === 'ไม่จำเป็นต้องส่งตรวจ'
                    ? 'bg-slate-700 text-white border-slate-700 shadow-2xs font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                ไม่จำเป็นต้องส่งตรวจ
              </button>
              <button
                type="button"
                onClick={() => onChange({ investigationStatus: 'ส่งตรวจ Lab' })}
                className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  data.investigationStatus === 'ส่งตรวจ Lab'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                ส่งตรวจ Lab (เลือกติ๊ก)
              </button>
            </div>
          </div>

          {data.investigationStatus === 'ส่งตรวจ Lab' && (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex flex-wrap gap-2">
                {['CBC', 'BUN/Cr', 'Electrolyte', 'LFT', 'TFT', 'U-Tox (สารเสพติด)', 'VDRL/Anti-HIV'].map(item => {
                  const isSelected = (data.labTests || []).includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem('labTests', item)}
                      className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                        isSelected ? 'clay-pill-active' : 'clay-pill-inactive'
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
              <input
                type="text"
                value={data.labOther}
                onChange={e => onChange({ labOther: e.target.value })}
                placeholder="Lab อื่นๆ..."
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          )}

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Neuroimaging / EEG / EKG:
            </label>
            <input
              type="text"
              value={data.neuroimaging}
              onChange={e => onChange({ neuroimaging: e.target.value })}
              placeholder="เช่น CT Brain Normal, EKG Normal sinus rhythm..."
              className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export const Step3ExaminationAndFindings = React.memo(Step3ExaminationAndFindingsComponent);
