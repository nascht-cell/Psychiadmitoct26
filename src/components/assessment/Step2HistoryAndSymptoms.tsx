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

          {/* 4. ปัจจัยกระตุ้น (Precipitating factors) */}
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
      <section id="section-c" className="clay-surface overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              C. Psychiatric / Medical / Medication History (ประวัติอดีตและสารเสพติด)
            </h3>
          </div>
          <span className="text-xs text-blue-100 font-medium hidden sm:inline">ประวัติจิตเวช ทางกาย ยา และสารเสพติด</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          {/* Psychiatric History */}
          <div className="border-b border-slate-100 pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2.5 sm:mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider sm:w-64 shrink-0">
                ประวัติจิตเวชเดิม:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ psychiatricHistory: 'ไม่มีประวัติ' })}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.psychiatricHistory === 'ไม่มีประวัติ'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ไม่มีประวัติ
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ psychiatricHistory: 'มีประวัติ' })}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.psychiatricHistory === 'มีประวัติ'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  มีประวัติ (ระบุกลุ่มโรค)
                </button>
              </div>
            </div>

            {data.psychiatricHistory === 'มีประวัติ' && (
              <div className="mt-3 p-3.5 bg-blue-50/40 rounded-xl border border-blue-200 space-y-3">
                <span className="text-xs font-semibold text-blue-900 block">เลือกกลุ่มโรคจิตเวชเดิม:</span>
                <div className="flex flex-wrap gap-2">
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

                <div className="pt-2">
                  <DebouncedInput
                    type="text"
                    value={data.psychiatricDisorderOther}
                    onChangeValue={val => onChange({ psychiatricDisorderOther: val })}
                    placeholder="กลุ่มโรคอื่นๆ..."
                    className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Admit History */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-slate-700">ประวัติการ Admit จิตเวช:</span>
              <div className="flex gap-2">
                {(['ไม่เคย', 'เคย'] as const).map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ admitHistory: opt, ...(opt === 'ไม่เคย' ? { admitLastYear: '' } : {}) })}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                      (data.admitHistory || 'ไม่เคย') === opt
                        ? opt === 'ไม่เคย'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                          : 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {data.admitHistory === 'เคย' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">ช่วง 1 ปีที่ผ่านมา:</span>
                  <DebouncedInput
                    type="text"
                    value={data.admitLastYear}
                    onChangeValue={val => onChange({ admitLastYear: val })}
                    placeholder="เช่น 1 ครั้ง"
                    className="w-24 text-xs bg-white border border-slate-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Medical History */}
          <div className="border-b border-slate-100 pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2.5 sm:mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider sm:w-64 shrink-0">
                โรคประจำตัวทางกาย:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ medicalHistory: 'ไม่มีโรคประจำตัว', medicalConditions: [] })}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.medicalHistory === 'ไม่มีโรคประจำตัว'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ไม่มีโรคประจำตัว
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ medicalHistory: 'มีโรคประจำตัว' })}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.medicalHistory === 'มีโรคประจำตัว'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  มีโรคประจำตัว (ระบุโรค)
                </button>
              </div>
            </div>

            {data.medicalHistory === 'มีโรคประจำตัว' && (
              <div className="mt-3 p-3.5 bg-blue-50/40 rounded-xl border border-blue-200 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {['HT', 'DM', 'DLP', 'CKD', 'Epilepsy', 'Thyroid', 'CAD/MI'].map(cond => {
                    const isSelected = (data.medicalConditions || []).includes(cond);
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => toggleArrayItem('medicalConditions', cond)}
                        className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                          isSelected ? 'clay-pill-active' : 'clay-pill-inactive'
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3] text-white shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded-full border border-slate-400/80 shrink-0" />
                        )}
                        <span>{cond}</span>
                      </button>
                    );
                  })}
                </div>
                <DebouncedInput
                  type="text"
                  value={data.medicalHistoryOther}
                  onChangeValue={val => onChange({ medicalHistoryOther: val })}
                  placeholder="ระบุโรคประจำตัวอื่นๆ..."
                  className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Allergy */}
          <div className="border-b border-slate-100 pb-4 sm:pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider sm:w-64 shrink-0">
                ประวัติการแพ้ยา/อาหาร:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ allergy: 'ปฏิเสธการแพ้', allergyDetail: '' })}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.allergy === 'ปฏิเสธการแพ้'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ปฏิเสธการแพ้
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ allergy: 'แพ้' })}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.allergy === 'แพ้'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  มีประวัติแพ้
                </button>
              </div>
            </div>
            {data.allergy === 'แพ้' && (
              <div className="mt-2.5">
                <DebouncedInput
                  type="text"
                  value={data.allergyDetail}
                  onChangeValue={val => onChange({ allergyDetail: val })}
                  placeholder="ระบุชื่อยาและอาการที่แพ้ เช่น แพ้ Penicillin ผื่นคัน..."
                  className="w-full text-xs bg-white border border-rose-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-rose-600 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Substance History */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider sm:w-64 shrink-0">
                ประวัติสารเสพติด:
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      substanceHistory: 'ปฏิเสธการใช้',
                      alcoholUse: '',
                      smokingUse: '',
                      cigarettesPerDay: '',
                      methUse: '',
                      otherSubstances: [],
                      otherSubstancesDetail: '',
                    })
                  }
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.substanceHistory === 'ปฏิเสธการใช้'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ปฏิเสธการใช้
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ substanceHistory: 'มีประวัติ' })}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.substanceHistory === 'มีประวัติ'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  มีประวัติ (ระบุสาร)
                </button>
              </div>
            </div>

            {data.substanceHistory === 'มีประวัติ' && (
              <div className="p-3.5 bg-blue-50/30 rounded-xl border border-blue-200 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Alcohol */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Wine className="w-3.5 h-3.5 text-blue-600" />
                      สุรา (Alcohol)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(['นานๆ ครั้ง', 'ดื่มประจำ/ติด', 'เพิ่งดื่มล่าสุด < 24 ชม.'] as const).map(alc => (
                        <button
                          key={alc}
                          type="button"
                          onClick={() => onChange({ alcoholUse: alc })}
                          className={`px-2 py-1 text-xs rounded border transition-all cursor-pointer ${
                            data.alcoholUse === alc
                              ? 'bg-blue-600 text-white border-blue-600 font-bold'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {alc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smoking */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Cigarette className="w-3.5 h-3.5 text-amber-600" />
                      บุหรี่ (Smoking)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(['นานๆ ครั้ง', 'สูบประจำ'] as const).map(smk => (
                        <button
                          key={smk}
                          type="button"
                          onClick={() => onChange({ smokingUse: smk })}
                          className={`px-2 py-1 text-xs rounded border transition-all cursor-pointer ${
                            data.smokingUse === smk
                              ? 'bg-amber-600 text-white border-amber-600 font-bold'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {smk}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Methamphetamine */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-600" />
                      ยาบ้า/ไอซ์ (Meth)
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(['เคยใช้ในอดีต (เลิกแล้ว)', 'ปัจจุบันยังใช้', 'เพิ่งใช้ล่าสุด < 24 ชม.'] as const).map(mth => (
                        <button
                          key={mth}
                          type="button"
                          onClick={() => onChange({ methUse: mth })}
                          className={`px-2 py-1 text-xs rounded border transition-all cursor-pointer ${
                            data.methUse === mth
                              ? 'bg-rose-600 text-white border-rose-600 font-bold'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {mth}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Other substances */}
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-purple-600" />
                    สารเสพติดอื่นๆ (Other Substances)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'กัญชา', label: 'กัญชา (Cannabis)' },
                      { id: 'กระท่อม', label: 'กระท่อม (Kratom)' },
                      { id: 'สารระเหย', label: 'สารระเหย (Inhalants)' },
                      { id: 'Opioid', label: 'Opioid (มอร์ฟีน/เฮโรอีน)' },
                      { id: 'อื่นๆ', label: 'อื่นๆ (ระบุ)' },
                    ].map(opt => {
                      const isSelected = (data.otherSubstances || []).includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleArrayItem('otherSubstances', opt.id)}
                          className={`px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                            isSelected ? 'clay-pill-active' : 'clay-pill-inactive'
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
                  {(data.otherSubstances.includes('อื่นๆ') || data.otherSubstances.length > 0 || data.otherSubstancesDetail) && (
                    <DebouncedInput
                      type="text"
                      value={data.otherSubstancesDetail}
                      onChangeValue={val => onChange({ otherSubstancesDetail: val })}
                      placeholder="ระบุรายละเอียดสารเสพติด เช่น ดื่มน้ำกระท่อมวันละ 1 ลิตร..."
                      className="w-full text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    />
                  )}
                </div>
              </div>
            )}
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
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 sm:mb-2">
              Psychosocial Stressors (ปัจจัยกระตุ้นความเครียด) <span className="text-xs font-normal text-slate-500">(หากเลือกข้ออื่น ระบบจะยกเลิกข้อ "ไม่มี/ไม่ชัดเจน" ให้อัตโนมัติ)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {[
                'ปัญหาความสัมพันธ์/ครอบครัว',
                'ปัญหาการเงิน/หนี้สิน',
                'ปัญหาการงาน/การเรียน',
                'การเจ็บป่วยทางกายรุนแรง',
                'การสูญเสีย (Bereavement)',
                'ปัญหาคดีความ/กฎหมาย',
                'ขาดผู้ดูแล/ถูกทอดทิ้ง',
                'ไม่มี/ไม่ชัดเจน',
              ].map(item => {
                const isSelected = (data.psychosocialStressors || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem('psychosocialStressors', item)}
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
