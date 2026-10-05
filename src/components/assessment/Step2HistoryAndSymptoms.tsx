import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  Check,
  HeartPulse,
  Users,
  Wine,
  Cigarette,
  Flame,
  Pill,
  Sparkles,
  Brain,
  Stethoscope,
  AlertTriangle,
} from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { DebouncedInput } from './DebouncedInput';
import { DebouncedTextarea } from './DebouncedTextarea';
import {
  DiagnosticGroup,
  DIAGNOSTIC_GROUPS,
  detectDiagnosticGroup,
  getSymptomsByGroup,
} from '../../utils/symptomMapping';

const Step2HistoryAndSymptomsComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  onBlurField,
  toggleArrayItem,
  handleDurationChange,
}) => {
  // Automatically detect the diagnostic group based on Step 1 diagnosis input
  const suggestedGroup = useMemo(() => detectDiagnosticGroup(data), [
    data.diagnosticCategory,
    data.diagnosticCategoryOther,
    data.primaryDiagnosis,
    data.differentialDiagnosis,
  ]);

  const [activeCategory, setActiveCategory] = useState<DiagnosticGroup>(suggestedGroup);

  // Sync activeCategory whenever diagnosis changes in Step 1
  useEffect(() => {
    setActiveCategory(suggestedGroup);
  }, [suggestedGroup]);

  // Retrieve symptom lists for active category
  const { chiefComplaints, associatedSymptoms } = useMemo(() => {
    return getSymptomsByGroup(activeCategory);
  }, [activeCategory]);

  // Ensure category symptoms appear first in canonical clinical order, with other selected symptoms appended
  const displayChiefComplaints = useMemo(() => {
    const list = [...chiefComplaints];
    (data.chiefComplaint || []).forEach(selectedName => {
      if (!list.some(item => item.name === selectedName)) {
        list.push({
          name: selectedName,
          activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs',
        });
      }
    });
    return list;
  }, [chiefComplaints, data.chiefComplaint]);

  // Ensure category symptoms appear first in canonical clinical order, with other selected symptoms appended
  const displayAssociatedSymptoms = useMemo(() => {
    const list = [...associatedSymptoms];
    (data.associatedSymptoms || []).forEach(selectedName => {
      if (!list.some(item => item.name === selectedName)) {
        list.push({
          name: selectedName,
          activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs',
        });
      }
    });
    return list;
  }, [associatedSymptoms, data.associatedSymptoms]);

  return (
    <div className="space-y-6">
      {/* SECTION B: Chief Complaint & HPI */}
      <section id="section-b" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              B. Chief Complaint & History of Present Illness (อาการสำคัญและประวัติปัจจุบัน)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">อาการสำคัญและประวัติเจ็บป่วย</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-5">
          {/* Dynamic Diagnostic Group Matching Banner & Category Switcher */}
          <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/80 border border-blue-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-extrabold text-blue-950">
                      ตรวจพบกลุ่มโรคจากการวินิจฉัยในขั้นตอนที่ 1:
                    </span>
                    <span className="text-xs font-extrabold text-blue-800 bg-white border border-blue-300 px-3 py-0.5 rounded-full shadow-2xs flex items-center gap-1.5">
                      <span>{DIAGNOSTIC_GROUPS[suggestedGroup]?.badge || suggestedGroup}</span>
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-1">
                    ฟองตัวเลือก (Bubbles) ทั้งหมดในหน้านี้ถูกปรับให้สอดคล้องกับโรคที่แพทย์วินิจฉัยแล้วโดยอัตโนมัติ เพื่อให้ตัดสินใจเลือกได้รวดเร็ว
                  </div>
                </div>
              </div>

              {/* Quick Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1 bg-white/95 p-1 rounded-xl border border-slate-200 shadow-2xs">
                {(Object.keys(DIAGNOSTIC_GROUPS) as Array<keyof typeof DIAGNOSTIC_GROUPS>).map(grpKey => {
                  const grp = DIAGNOSTIC_GROUPS[grpKey];
                  const isSelected = activeCategory === grpKey;
                  const isSuggested = suggestedGroup === grpKey;
                  return (
                    <button
                      key={grpKey}
                      type="button"
                      onClick={() => setActiveCategory(grpKey)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-400/40'
                          : isSuggested
                          ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{grp.shortLabel}</span>
                      {isSuggested && !isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ทั้งหมด (All)
                </button>
              </div>
            </div>
          </div>

          {/* 1. Chief Complaint Bubbles */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  อาการสำคัญ (Chief Complaint)
                </label>
                <span className="text-[11px] text-slate-500 font-normal">
                  (ฟองตัวเลือก Bubbles ประจำกลุ่มโรค — เลือกได้มากกว่า 1 ข้อ)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {(data.chiefComplaint || []).length > 0 && (
                  <>
                    <span className="text-[11px] text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      เลือกแล้ว {(data.chiefComplaint || []).length} อาการ
                    </span>
                    <button
                      type="button"
                      onClick={() => onChange({ chiefComplaint: [] })}
                      className="text-[10px] text-slate-400 hover:text-red-600 transition-colors font-semibold underline cursor-pointer"
                    >
                      ล้างที่เลือก
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {displayChiefComplaints.map(({ name: item, activeCls }) => {
                const isSelected = (data.chiefComplaint || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem('chiefComplaint', item)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs ${
                      isSelected
                        ? `${activeCls} ring-2 ring-blue-400/40 text-white`
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
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

            <div className="mt-2.5 sm:mt-3 space-y-1 max-w-md">
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

          {/* 2. Associated symptoms Bubbles */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  อาการร่วมที่สำคัญ (Associated symptoms)
                </label>
                <span className="text-[11px] text-slate-500 font-normal">
                  (ฟองตัวเลือก Bubbles สอดคล้องตามโรคที่วินิจฉัย — ตัดสินใจเลือกหรือไม่เลือก)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {(data.associatedSymptoms || []).length > 0 && (
                  <>
                    <span className="text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      เลือกแล้ว {(data.associatedSymptoms || []).length} อาการ
                    </span>
                    <button
                      type="button"
                      onClick={() => onChange({ associatedSymptoms: [] })}
                      className="text-[10px] text-slate-400 hover:text-red-600 transition-colors font-semibold underline cursor-pointer"
                    >
                      ล้างที่เลือก
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {displayAssociatedSymptoms.map(({ name: item, activeCls }) => {
                const isSelected = (data.associatedSymptoms || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem('associatedSymptoms', item)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs ${
                      isSelected
                        ? `${activeCls} ring-2 ring-indigo-400/40 text-white`
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
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

          {/* 3. Duration, Onset, Course & HPI Details */}
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

          {/* 4. ปัจจัยกระตุ้นเฉียบพลัน (Precipitating factors) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                4. ปัจจัยกระตุ้นเฉียบพลัน (Precipitating factors — เหตุการณ์นำก่อนอาการกำเริบครั้งนี้) <span className="text-xs font-normal text-slate-500">(เลือกได้มากกว่า 1 ข้อ)</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ระบุเหตุการณ์หรือภาวะเฉียบพลันที่กระตุ้นให้อาการกำเริบนำมา รพ. ในครั้งนี้ (สำหรับปัญหาความกดดันเรื้อรัง/การเงิน/ครอบครัว ให้ประเมินในหัวข้อ G จิตสังคม)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'ขาดยา / ไม่ได้ทานยาต่อเนื่อง', aliases: ['ขาดยา'], activeCls: 'bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-300' },
                { name: 'ใช้สารเสพติด / ดื่มสุราหนัก', aliases: ['ใช้สารเสพติด'], activeCls: 'bg-orange-600 text-white border-orange-600 shadow-xs' },
                { name: 'อดนอนสะสม / พักผ่อนไม่พอ', aliases: ['อดนอน'], activeCls: 'bg-indigo-600 text-white border-indigo-600 shadow-xs' },
                { name: 'โรคทางกายกำเริบ / เจ็บป่วยเฉียบพลัน', aliases: ['โรคทางกายกำเริบ'], activeCls: 'bg-amber-600 text-white border-amber-600 shadow-xs' },
                { name: 'มีปากเสียง / ทะเลาะขัดแย้งรุนแรง', aliases: ['ปัญหาครอบครัว/ความสัมพันธ์'], activeCls: 'bg-purple-600 text-white border-purple-600 shadow-xs' },
                { name: 'เหตุการณ์วิกฤตเฉียบพลัน (Crisis)', aliases: ['การเงิน/การงาน'], activeCls: 'bg-sky-600 text-white border-sky-600 shadow-xs' },
                { name: 'ไม่พบปัจจัยกระตุ้นเฉียบพลันชัดเจน', aliases: ['ไม่พบปัจจัยชัดเจน', 'ไม่มี/ไม่ชัดเจน', 'ไม่มี'], activeCls: 'bg-slate-600 text-white border-slate-600 shadow-xs' },
              ].map(({ name: item, aliases, activeCls }) => {
                const currentList = data.precipitatingFactors || [];
                const isSelected = currentList.includes(item) || aliases.some(a => currentList.includes(a));
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        const updated = currentList.filter(f => f !== item && !aliases.includes(f));
                        onChange({ precipitatingFactors: updated });
                      } else {
                        toggleArrayItem('precipitatingFactors', item);
                      }
                    }}
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
            <div className="mt-2.5">
              <DebouncedInput
                type="text"
                value={data.precipitatingFactorsOther || ''}
                onChangeValue={val => onChange({ precipitatingFactorsOther: val })}
                placeholder="ระบุปัจจัยกระตุ้นเฉียบพลันอื่นๆ เพิ่มเติม (เช่น อกหักฉับพลัน, ถูกให้ออกจากบ้าน, มีเรื่องวิวาท)..."
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* 5. Previous treatment & response */}
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

      {/* SECTION C: Psychiatric, Medical & Substance History */}
      <section id="section-c" className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              C. Psychiatric, Medical & Substance History (ประวัติอดีต ทางกาย ยา และสารเสพติด)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">ประวัติจิตเวช ทางกาย ยา และสารเสพติด</span>
        </div>

        {/* Content Body: Strict vertical eyespan alignment with consistent flush-left axis */}
        <div className="p-4 sm:p-6 text-left">
          <div className="border-l-2 border-indigo-200/90 pl-3.5 sm:pl-5 space-y-6 text-left">

            {/* 1. ประวัติการรักษาจิตเวชในอดีต (Past Psychiatric History) */}
            <div className="space-y-2 pb-5 border-b border-slate-100 text-left">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider text-left">
                  1. ประวัติการรักษาจิตเวชในอดีต (Past Psychiatric History)
                </label>
                <p className="text-xs text-slate-500 text-left mt-0.5">
                  ประวัติการตรวจวินิจฉัยและรับการรักษาด้านจิตเวชมาก่อน
                </p>
              </div>

              {/* Main Toggles - flush left */}
              <div className="flex flex-wrap items-center justify-start gap-2 text-left pt-0.5">
                <button
                  type="button"
                  onClick={() => onChange({ psychiatricHistory: 'ไม่มีประวัติ', psychiatricDisorders: [], psychiatricDisorderOther: '' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.psychiatricHistory === 'ไม่มีประวัติ'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {data.psychiatricHistory === 'ไม่มีประวัติ' && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>ไม่มีประวัติ</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ psychiatricHistory: 'มีประวัติ' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.psychiatricHistory === 'มีประวัติ'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs ring-1 ring-indigo-400/40'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {data.psychiatricHistory === 'มีประวัติ' && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>มีประวัติ (ระบุกลุ่มโรค)</span>
                </button>
              </div>

              {/* If has history: Disease pills & Other input - flush left */}
              {data.psychiatricHistory === 'มีประวัติ' && (
                <div className="pt-2 space-y-2 text-left">
                  <span className="text-xs font-bold text-indigo-950 block text-left">
                    กลุ่มโรคจิตเวชเดิมที่เคยได้รับการวินิจฉัย (เลือกได้มากกว่า 1 ข้อ):
                  </span>
                  <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2 text-left">
                    {[
                      'Depressive d/o',
                      'Bipolar d/o',
                      'Schizophrenia/Psychotic d/o',
                      'Anxiety d/o',
                      'Substance Related d/o',
                      'Dementia',
                    ].map(item => {
                      const isSelected = (data.psychiatricDisorders || []).includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleArrayItem('psychiatricDisorders', item)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 ring-1 ring-indigo-300'
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
                  <DebouncedInput
                    type="text"
                    value={data.psychiatricDisorderOther}
                    onChangeValue={val => onChange({ psychiatricDisorderOther: val })}
                    placeholder="ระบุโรคจิตเวชเดิมอื่นๆ / ประวัติการรักษาที่โรงพยาบาลเดิม..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-left focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* 2. ประวัติการ Admit จิตเวช (Inpatient Admission History) */}
            <div className="space-y-2 pb-5 border-b border-slate-100 text-left">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider text-left">
                  2. ประวัติการ Admit จิตเวช (Inpatient Admission History)
                </label>
                <p className="text-xs text-slate-500 text-left mt-0.5">
                  ประวัติการรับไว้รักษาเป็นผู้ป่วยในแผนกจิตเวช
                </p>
              </div>

              {/* Toggles - flush left */}
              <div className="flex flex-wrap items-center justify-start gap-2 text-left pt-0.5">
                {(['ไม่เคย', 'เคย'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ admitHistory: opt, ...(opt === 'ไม่เคย' ? { admitLastYear: '' } : {}) })}
                    className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                      (data.admitHistory || 'ไม่เคย') === opt
                        ? opt === 'ไม่เคย'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {(data.admitHistory || 'ไม่เคย') === opt && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                    <span>{opt === 'ไม่เคย' ? 'ไม่เคยนอน รพ.' : 'เคย Admit'}</span>
                  </button>
                ))}

                {data.admitHistory === 'เคย' && (
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-xs text-slate-600 font-medium">ช่วง 1 ปีที่ผ่านมา:</span>
                    <DebouncedInput
                      type="text"
                      value={data.admitLastYear}
                      onChangeValue={val => onChange({ admitLastYear: val })}
                      placeholder="เช่น 1 ครั้ง"
                      className="w-28 text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-left focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 3. โรคประจำตัวทางกาย (Medical History & Comorbidities) */}
            <div className="space-y-2 pb-5 border-b border-slate-100 text-left">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider text-left">
                  3. โรคประจำตัวทางกาย (Medical History & Comorbidities)
                </label>
                <p className="text-xs text-slate-500 text-left mt-0.5">
                  โรคเรื้อรังทางกาย ภาวะชัก หรือการผ่าตัด
                </p>
              </div>

              {/* Toggles - flush left */}
              <div className="flex flex-wrap items-center justify-start gap-2 text-left pt-0.5">
                <button
                  type="button"
                  onClick={() => onChange({ medicalHistory: 'ไม่มีโรคประจำตัว', medicalConditions: [] })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.medicalHistory === 'ไม่มีโรคประจำตัว'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {data.medicalHistory === 'ไม่มีโรคประจำตัว' && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>ไม่มีโรคประจำตัว</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ medicalHistory: 'มีโรคประจำตัว' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.medicalHistory === 'มีโรคประจำตัว'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-400/40'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {data.medicalHistory === 'มีโรคประจำตัว' && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>มีโรคประจำตัว (ระบุโรค)</span>
                </button>
              </div>

              {/* When has medical condition: Disease chips & Other input - flush left */}
              {data.medicalHistory === 'มีโรคประจำตัว' && (
                <div className="pt-2 space-y-2 text-left">
                  <span className="text-xs font-bold text-slate-800 block text-left">
                    เลือกโรคประจำตัวสำคัญ (คลิกเลือกได้มากกว่า 1 ข้อ):
                  </span>
                  <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2 text-left">
                    {[
                      { id: 'HT', label: 'HT (ความดันโลหิตสูง)' },
                      { id: 'DM', label: 'DM (เบาหวาน)' },
                      { id: 'DLP', label: 'DLP (ไขมันในเลือดสูง)' },
                      { id: 'CKD', label: 'CKD (โรคไต)' },
                      { id: 'Epilepsy', label: 'Epilepsy (โรคลมชัก)' },
                      { id: 'Thyroid', label: 'Thyroid (ไทรอยด์)' },
                      { id: 'CAD/MI', label: 'CAD/MI (โรคหัวใจ)' },
                    ].map(({ id, label }) => {
                      const isSelected = (data.medicalConditions || []).includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleArrayItem('medicalConditions', id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 ring-1 ring-blue-300'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
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
                  <DebouncedInput
                    type="text"
                    value={data.medicalHistoryOther}
                    onChangeValue={val => onChange({ medicalHistoryOther: val })}
                    placeholder="ระบุโรคประจำตัวอื่นๆ เพิ่มเติม (เช่น มะเร็ง, โรคตับ, ผ่าตัดสมอง)..."
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-left focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* 4. ประวัติการแพ้ยาและอาหาร (Drug & Food Allergies) */}
            <div className="space-y-2 pb-5 border-b border-slate-100 text-left">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider text-left">
                  4. ประวัติการแพ้ยา / แพ้อาหาร (Allergies & NKDA)
                </label>
                <p className="text-xs text-slate-500 text-left mt-0.5">
                  ข้อมูลความปลอดภัยและประวัติการแพ้ยา/อาหารของผู้ป่วย
                </p>
              </div>

              {/* Toggles - flush left */}
              <div className="flex flex-wrap items-center justify-start gap-2 text-left pt-0.5">
                <button
                  type="button"
                  onClick={() => onChange({ allergy: 'ปฏิเสธการแพ้', allergyDetail: '' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.allergy === 'ปฏิเสธการแพ้'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {data.allergy === 'ปฏิเสธการแพ้' && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>ปฏิเสธการแพ้ (NKDA)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ allergy: 'แพ้' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.allergy === 'แพ้'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-400/50'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {data.allergy === 'แพ้' && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>⚠️ มีประวัติแพ้ (ระบุ)</span>
                </button>
              </div>

              {/* Detail Input - flush left, full width */}
              {data.allergy === 'แพ้' && (
                <div className="pt-2 text-left">
                  <DebouncedInput
                    type="text"
                    value={data.allergyDetail}
                    onChangeValue={val => onChange({ allergyDetail: val })}
                    placeholder="ระบุชื่อยา/อาหารและลักษณะอาการแพ้ เช่น แพ้ Penicillin มีผื่นลมพิษ, แพ้อาหารทะเล แน่นหน้าอก..."
                    className="w-full text-xs bg-rose-50/50 border border-rose-300 rounded-lg px-3 py-2 text-rose-950 font-medium text-left focus:ring-2 focus:ring-rose-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* 5. ประวัติการดื่มสุรา (Alcohol History) */}
            <div className="space-y-2 pb-5 border-b border-slate-100 text-left">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider text-left">
                  5. ประวัติการดื่มสุรา (Alcohol History)
                </label>
                <p className="text-xs text-slate-500 text-left mt-0.5">
                  ความถี่และพฤติกรรมการดื่มเครื่องดื่มแอลกอฮอล์
                </p>
              </div>

              {/* Toggles - flush left in single row */}
              <div className="flex flex-wrap items-center justify-start gap-2 text-left pt-0.5">
                <button
                  type="button"
                  onClick={() => onChange({ alcoholUse: '' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    !data.alcoholUse
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {!data.alcoholUse && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>ปฏิเสธการดื่ม</span>
                </button>
                {(['นานๆ ครั้ง', 'ดื่มประจำ/ติด', 'เพิ่งดื่มล่าสุด < 24 ชม.'] as const).map(alc => (
                  <button
                    key={alc}
                    type="button"
                    onClick={() => onChange({ alcoholUse: data.alcoholUse === alc ? '' : alc })}
                    className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                      data.alcoholUse === alc
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {data.alcoholUse === alc && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                    <span>{alc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6. ประวัติการสูบบุหรี่ (Smoking History) */}
            <div className="space-y-2 pb-5 border-b border-slate-100 text-left">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider text-left">
                  6. ประวัติการสูบบุหรี่ (Smoking History)
                </label>
                <p className="text-xs text-slate-500 text-left mt-0.5">
                  การสูบบุหรี่และปริมาณการสูบต่อวัน
                </p>
              </div>

              {/* Toggles - flush left */}
              <div className="flex flex-wrap items-center justify-start gap-2 text-left pt-0.5">
                <button
                  type="button"
                  onClick={() => onChange({ smokingUse: '', cigarettesPerDay: '' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    !data.smokingUse
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {!data.smokingUse && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                  <span>ปฏิเสธการสูบ</span>
                </button>
                {(['นานๆ ครั้ง', 'สูบประจำ'] as const).map(smk => (
                  <button
                    key={smk}
                    type="button"
                    onClick={() => onChange({ smokingUse: data.smokingUse === smk ? '' : smk })}
                    className={`px-3.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                      data.smokingUse === smk
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs ring-1 ring-amber-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {data.smokingUse === smk && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                    <span>{smk}</span>
                  </button>
                ))}

                {data.smokingUse === 'สูบประจำ' && (
                  <div className="flex items-center gap-1.5 text-left">
                    <span className="text-xs text-slate-600 font-medium">เฉลี่ยวันละ:</span>
                    <DebouncedInput
                      type="text"
                      value={data.cigarettesPerDay || ''}
                      onChangeValue={val => onChange({ cigarettesPerDay: val })}
                      placeholder="เช่น 10"
                      className="w-20 text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-left font-bold focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500">มวน</span>
                  </div>
                )}
              </div>
            </div>

            {/* 7. ประวัติสารเสพติดและยาบ้า (Substances & Methamphetamine) */}
            <div className="space-y-2 text-left">
              <div className="text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider text-left">
                  7. ประวัติสารเสพติดและยาบ้า (Substance History)
                </label>
                <p className="text-xs text-slate-500 text-left mt-0.5">
                  การใช้ยาบ้า/ไอซ์ กัญชา กระท่อม สารระเหย และสารเสพติดอื่นๆ
                </p>
              </div>

              {/* Main Toggles - flush left */}
              <div className="flex flex-wrap items-center justify-start gap-2 text-left pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      substanceHistory: 'ปฏิเสธการใช้',
                      methUse: '',
                      otherSubstances: [],
                      otherSubstancesDetail: '',
                    })
                  }
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.substanceHistory === 'ปฏิเสธการใช้' || (!data.substanceHistory && !data.methUse && (!data.otherSubstances || data.otherSubstances.length === 0))
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {(data.substanceHistory === 'ปฏิเสธการใช้' || (!data.substanceHistory && !data.methUse && (!data.otherSubstances || data.otherSubstances.length === 0))) && (
                    <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                  )}
                  <span>ปฏิเสธการใช้ทุกชนิด</span>
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ substanceHistory: 'มีประวัติ' })}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    data.substanceHistory === 'มีประวัติ' || data.methUse || (data.otherSubstances && data.otherSubstances.length > 0)
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-1 ring-rose-400/40'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {(data.substanceHistory === 'มีประวัติ' || data.methUse || (data.otherSubstances && data.otherSubstances.length > 0)) && (
                    <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                  )}
                  <span>มีประวัติ (ระบุสาร)</span>
                </button>
              </div>

              {/* When has substance history: Sequential vertical questions flush left */}
              {(data.substanceHistory === 'มีประวัติ' || data.methUse || (data.otherSubstances && data.otherSubstances.length > 0)) && (
                <div className="pt-2 space-y-3.5 text-left">
                  {/* ยาบ้า/ไอซ์ (Methamphetamine) */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-xs font-bold text-slate-800 block text-left">
                      ยาบ้า / ไอซ์ (Methamphetamine):
                    </span>
                    <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2 text-left">
                      <button
                        type="button"
                        onClick={() => onChange({ methUse: '' })}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                          !data.methUse
                            ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {!data.methUse && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                        <span>ไม่เคยใช้</span>
                      </button>
                      {(['เคยใช้ในอดีต (เลิกแล้ว)', 'ปัจจุบันยังใช้', 'เพิ่งใช้ล่าสุด < 24 ชม.'] as const).map(mth => (
                        <button
                          key={mth}
                          type="button"
                          onClick={() => onChange({ methUse: data.methUse === mth ? '' : mth })}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                            data.methUse === mth
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {data.methUse === mth && <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />}
                          <span>{mth}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* สารเสพติดอื่นๆ (Other Substances) */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-xs font-bold text-slate-800 block text-left">
                      สารเสพติดอื่นๆ (คลิกเลือกได้มากกว่า 1 ข้อ):
                    </span>
                    <div className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2 text-left">
                      {[
                        { id: 'กัญชา', label: 'กัญชา (Cannabis)' },
                        { id: 'กระท่อม', label: 'กระท่อม (Kratom)' },
                        { id: 'สารระเหย', label: 'สารระเหย (Inhalants)' },
                        { id: 'Opioid', label: 'Opioid (มอร์ฟีน/เฮโรอีน)' },
                        { id: 'ยานอนหลับ', label: 'ยานอนหลับ/ยากล่อมประสาท' },
                        { id: 'อื่นๆ', label: 'อื่นๆ (ระบุ)' },
                      ].map(opt => {
                        const isSelected = (data.otherSubstances || []).includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleArrayItem('otherSubstances', opt.id)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shadow-2xs ${
                              isSelected
                                ? 'bg-purple-600 text-white border-purple-600 ring-1 ring-purple-300'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                            ) : (
                              <span className="w-3 h-3 rounded-full border border-slate-400/80 shrink-0" />
                            )}
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                    {(data.otherSubstances?.includes('อื่นๆ') || (data.otherSubstances || []).length > 0 || data.otherSubstancesDetail) && (
                      <DebouncedInput
                        type="text"
                        value={data.otherSubstancesDetail}
                        onChangeValue={val => onChange({ otherSubstancesDetail: val })}
                        placeholder="ระบุรายละเอียดสารเสพติดเพิ่มเติม เช่น ปริมาณ, ความถี่, วิธีใช้, วันที่ใช้ล่าสุด..."
                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-left focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION G: Psychosocial Assessment & Living Environment */}
      <section id="section-g" className="clay-surface overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              G. Psychosocial Assessment & Living Environment (การประเมินทางจิตสังคมและสภาพแวดล้อม)
            </h3>
          </div>
          <span className="text-xs text-blue-100 font-medium hidden sm:inline">ครอบครัว การเงิน และสิ่งแวดล้อม</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <div className="mb-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Psychosocial Stressors (ความกดดันและปัญหาทางจิตสังคมในชีวิตประจำวัน) <span className="text-xs font-normal text-slate-500">(หากเลือกข้ออื่น ระบบจะยกเลิกข้อ "ไม่มีปัญหาความกดดันชัดเจน" ให้อัตโนมัติ)</span>
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                ประเมินปัญหาด้านครอบครัว เศรษฐกิจ การงาน สังคม และสิ่งแวดล้อมที่เป็นความเครียดสะสมของผู้ป่วย (Chronic / Background Life Stressors)
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                { name: 'ปัญหาชีวิตสมรส / ความสัมพันธ์ในครอบครัว', aliases: ['ปัญหาความสัมพันธ์/ครอบครัว', 'ปัญหาครอบครัว/ความสัมพันธ์'] },
                { name: 'ภาระหนี้สิน / วิกฤตทางการเงิน', aliases: ['ปัญหาการเงิน/หนี้สิน', 'การเงิน/การงาน'] },
                { name: 'ปัญหาการทำงาน / ตกงาน / ปัญหาในหน่วยทหาร / การเรียน', aliases: ['ปัญหาการงาน/การเรียน'] },
                { name: 'การเจ็บป่วยทางกายเรื้อรังรุนแรง', aliases: ['การเจ็บป่วยทางกายรุนแรง'] },
                { name: 'การสูญเสียบุคคลใกล้ชิด (Bereavement / Grief)', aliases: ['การสูญเสีย (Bereavement)'] },
                { name: 'ปัญหาคดีความ / ข้อพิพาททางกฎหมาย', aliases: ['ปัญหาคดีความ/กฎหมาย'] },
                { name: 'ขาดผู้ดูแล / โดดเดี่ยว / ถูกทอดทิ้ง', aliases: ['ขาดผู้ดูแล/ถูกทอดทิ้ง'] },
                { name: 'ปัญหาการปรับตัวในหน่วย / สิ่งแวดล้อมใหม่', aliases: [] },
                { name: 'ไม่มีปัญหาความกดดันทางจิตสังคมชัดเจน', aliases: ['ไม่มี/ไม่ชัดเจน', 'ไม่มี'] },
              ].map(({ name: item, aliases }) => {
                const currentList = data.psychosocialStressors || [];
                const isSelected = currentList.includes(item) || aliases.some(a => currentList.includes(a));
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        const updated = currentList.filter(f => f !== item && !aliases.includes(f));
                        onChange({ psychosocialStressors: updated });
                      } else {
                        toggleArrayItem('psychosocialStressors', item);
                      }
                    }}
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
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Living Environment (สภาพแวดล้อมความเป็นอยู่)
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onChange({ livingEnvironment: 'ปลอดภัยและเหมาะสม' })}
                className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  data.livingEnvironment === 'ปลอดภัยและเหมาะสม'
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                ปลอดภัยและเหมาะสม
              </button>
              <button
                type="button"
                onClick={() => onChange({ livingEnvironment: 'ไม่ปลอดภัย/ไม่เหมาะสมต่อการฟื้นฟู' })}
                className={`px-4 py-2 min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  data.livingEnvironment === 'ไม่ปลอดภัย/ไม่เหมาะสมต่อการฟื้นฟู'
                    ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs ring-2 ring-amber-300/50'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                ⚠️ ไม่ปลอดภัย/ไม่เหมาะสมต่อการฟื้นฟู
              </button>
            </div>
            {data.livingEnvironment === 'ไม่ปลอดภัย/ไม่เหมาะสมต่อการฟื้นฟู' && (
              <div className="mt-2.5">
                <DebouncedInput
                  type="text"
                  value={data.livingEnvironmentDetail}
                  onChangeValue={val => onChange({ livingEnvironmentDetail: val })}
                  placeholder="ระบุเหตุผล เช่น อยู่ลำพัง, สภาพแวดล้อมเสี่ยง, ขาดผู้ดูแล..."
                  className="w-full text-xs bg-white border border-amber-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-amber-600 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const Step2HistoryAndSymptoms = React.memo(Step2HistoryAndSymptomsComponent);
