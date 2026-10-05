import React from 'react';
import { Pill, FileCheck, Check, X, Sparkles } from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { DebouncedInput } from './DebouncedInput';

const Step5PlanAndManagementComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  errors,
  onBlurField,
  toggleArrayItem,
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION K: Care Plan & Medical Intervention */}
      <section id="section-k" className="clay-surface overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-teal-700 to-emerald-800 text-white flex items-center justify-between rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              K. Care Plan & Medical Intervention (แผนการดูแลและรักษา)
            </h3>
          </div>
          <span className="text-xs text-teal-100 font-medium hidden sm:inline">ยา การบำบัด และสหสาขาวิชาชีพ</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-5">
          {/* 1. Pharmacological */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5 sm:mb-2">
              1. Pharmacological Treatment (กลุ่มยาที่สั่งใช้)
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-3">
              {(['ไม่มีการสั่งยาจิตเวช', 'มียาจิตเวชเดิม (ไม่ปรับเปลี่ยน)', 'ปรับ/เริ่มยาใหม่'] as const).map(
                opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onChange({ pharmPlan: opt })}
                    className={`px-3 sm:px-3.5 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      data.pharmPlan === opt
                        ? opt === 'ปรับ/เริ่มยาใหม่'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                          : 'bg-slate-700 text-white border-slate-700 shadow-2xs font-bold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>

            {data.pharmPlan === 'ปรับ/เริ่มยาใหม่' && (
              <div className="p-4 bg-blue-50/30 border border-blue-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-blue-900 block">
                  เลือกกลุ่มยาที่เริ่ม/ปรับ:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Antidepressants',
                    'Antipsychotics',
                    'Mood Stabilizers',
                    'Anxiolytics/Sedatives',
                    'Anticholinergics (แก้ EPS)',
                    'อื่นๆ',
                  ].map(item => {
                    const isSelected = (data.medicationGroups || []).includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem('medicationGroups', item)}
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
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-slate-700">
                      ระบุชื่อยา / Dose คร่าวๆ:
                    </label>
                  </div>

                  {/* Quick Medication Chips */}
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 w-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      คลิกเพื่อแทรกสูตรยาพบบ่อย:
                    </span>
                    {[
                      'Sertraline (50) 1 tab po pc morning',
                      'Fluoxetine (20) 1 tab po pc morning',
                      'Risperidone (2) 1 tab po hs',
                      'Quetiapine (25) 1 tab po hs',
                      'Lorazepam (0.5) 1 tab po hs prn',
                      'Haloperidol (5) 1 amp IM stat',
                    ].map(med => (
                      <button
                        key={med}
                        type="button"
                        onClick={() => {
                          const current = data.medicationDetails || '';
                          const updated = current ? `${current}, ${med}` : med;
                          onChange({ medicationDetails: updated });
                        }}
                        className="text-[10px] font-mono bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded transition-all cursor-pointer"
                      >
                        + {med}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={data.medicationDetails}
                    onChange={e => onChange({ medicationDetails: e.target.value })}
                    onBlur={e => onBlurField && onBlurField('medicationDetails', e.target.value)}
                    placeholder="เช่น Sertraline (50) 1 tab po pc morning, Lorazepam (0.5) 1 tab po hs prn..."
                    className="w-full text-xs font-mono bg-white border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 2. Non-Pharmacological */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              2. Non-Pharmacological Treatment (การบำบัดทางจิตสังคม)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                'Psychoeducation',
                'Supportive Psychotherapy',
                'CBT / Specific Psychotherapy',
                'Family Therapy / Counseling',
              ].map(item => {
                const isSelected = (data.nonPharmTreatments || []).includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleArrayItem('nonPharmTreatments', item)}
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

          {/* 3. MDT Consult */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                3. Multidisciplinary Team (MDT) Consult:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ mdtConsult: 'ไม่ส่ง' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.mdtConsult === 'ไม่ส่ง'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-2xs font-bold'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ไม่ส่ง
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ mdtConsult: 'ส่ง' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.mdtConsult === 'ส่ง'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs font-bold'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ส่ง Consult
                </button>
              </div>
            </div>

            {data.mdtConsult === 'ส่ง' && (
              <div className="p-3.5 bg-blue-50/40 border border-blue-200 rounded-xl space-y-2.5">
                <span className="text-xs font-semibold text-blue-900 block">เลือกทีมสหวิชาชีพที่ต้องการปรึกษา:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    'นักจิตวิทยาคลินิก',
                    'นักสังคมสงเคราะห์',
                    'อายุรแพทย์',
                    'นักโภชนบำบัด',
                  ].map(item => {
                    const isSelected = (data.mdtRoles || []).includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem('mdtRoles', item)}
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
                  value={data.mdtOther}
                  onChange={e => onChange({ mdtOther: e.target.value })}
                  placeholder="แพทย์เฉพาะทางอื่นๆ หรือบุคลากรอื่น..."
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION L & M: Involvement, Indication for Admission & Sign-off */}
      <section id="section-l-m" className="clay-surface overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-slate-800 to-indigo-950 text-white flex items-center justify-between rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-300" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              L. Patient Involvement & M. Indication for Admission (การมีส่วนร่วมและข้อบ่งชี้การรับไว้รักษา)
            </h3>
          </div>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">ข้อบ่งชี้การรับรักษา และลงนามแพทย์</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
          {/* Section L */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              L. Patient & Family Involvement (การมีส่วนร่วม)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              {[
                { label: 'อธิบายการวินิจฉัยแล้ว', key: 'explainedDiagnosis' },
                { label: 'อธิบายแผนการรักษา/ทางเลือกแล้ว', key: 'explainedCarePlan' },
                { label: 'อธิบายผลข้างเคียงยาแล้ว', key: 'explainedSideEffects' },
                { label: 'แนะนำอาการเตือนที่ต้องรีบมาพบแพทย์', key: 'explainedWarningSigns' },
              ].map(item => {
                const isDone = !!(data as any)[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onChange({ [item.key]: !isDone })}
                    className={`w-full min-h-[46px] px-3.5 py-2.5 text-xs rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer select-none active:scale-[0.98] shadow-xs text-left ${
                      isDone
                        ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                        : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-rose-700/20 ring-2 ring-rose-300'
                    }`}
                    title={isDone ? `${item.label} (แตะเพื่อสลับเป็นยังไม่ได้ทำ)` : `${item.label} (แตะเพื่อสลับเป็นเรียบร้อยแล้ว)`}
                  >
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <Check className="w-4 h-4 stroke-[3] shrink-0" />
                      ) : (
                        <X className="w-4 h-4 stroke-[3] shrink-0" />
                      )}
                      <span className="font-extrabold text-xs leading-snug">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 shrink-0">
                      {isDone ? 'เรียบร้อย' : 'ยังไม่ทำ'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">ข้อกังวลของผู้ป่วย/ญาติ:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange({ concernsStatus: 'ไม่มี', concernsDetail: '' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.concernsStatus === 'ไม่มี'
                      ? 'bg-slate-700 text-white border-slate-700 shadow-2xs font-bold'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ไม่มีข้อกังวล
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ concernsStatus: 'มี' })}
                  className={`px-3.5 py-1.5 min-h-[38px] text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    data.concernsStatus === 'มี'
                      ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  มีข้อกังวล (ระบุ)
                </button>
              </div>
              {data.concernsStatus === 'มี' && (
                <input
                  type="text"
                  value={data.concernsDetail}
                  onChange={e => onChange({ concernsDetail: e.target.value })}
                  placeholder="ระบุข้อกังวล เช่น เรื่องงาน, ผลข้างเคียงยา..."
                  className="flex-1 min-w-[200px] text-xs border border-amber-300 rounded-lg px-3 py-2 bg-amber-50/20 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              )}
            </div>
          </div>

          {/* Section M */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  M. Indication for Admission (ข้อบ่งชี้ในการรับไว้รักษาในโรงพยาบาล)
                </label>
                <span className="text-xs text-slate-500">เลือกข้อบ่งชี้ตามเกณฑ์การประเมิน</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'เป็นอันตรายต่อตนเอง (Risk of Harm to Self)',
                  'เป็นอันตรายต่อผู้อื่น (Risk of Harm to Others)',
                  'ผลการรักษาแบบผู้ป่วยนอกล้มเหลว (Failure of outpatient treatment)',
                  'ต้องการการปรับยาหรือเฝ้าระวังผลข้างเคียงอย่างใกล้ชิด',
                ].map(item => {
                  const isSelected = (data.admissionIndications || []).includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleArrayItem('admissionIndications', item)}
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

            {/* PDF Layout Options */}
            <div className="p-5 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-3 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                <span>การตั้งค่าการพิมพ์รายงาน (Print Layout Settings)</span>
              </div>
              <div className="flex items-start gap-3">
                <input
                  id="toggle-allowPage4"
                  type="checkbox"
                  checked={Boolean(data.allowPage4)}
                  onChange={e => onChange({ allowPage4: e.target.checked })}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer"
                />
                <label htmlFor="toggle-allowPage4" className="text-sm text-slate-850 leading-snug cursor-pointer select-none">
                  <div className="font-semibold text-slate-900">แยกเอกสารออกเป็น 4 หน้า (สำหรับเคสที่มีประวัติหรือคำสั่งยายาวมาก)</div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    <strong className="text-blue-700">มาตรฐาน:</strong> โดยปกติเอกสารจะจัดอยู่ใน <strong className="text-slate-900">3 หน้า A4 อย่างลงตัวและพอดี</strong> หากไม่ได้ติ๊กเลือกตัวเลือกนี้ เอกสารจะพิมพ์เป็น 3 หน้าเสมอ (ติ๊กเลือกเฉพาะเมื่อพิมพ์แล้วเนื้อหาในหน้า 3 แน่นเกินไป)
                  </div>
                </label>
              </div>
            </div>

            {/* Doctor Signature & Identification */}
            <div className="p-5 bg-slate-50 border border-slate-300 rounded-xl space-y-3 mt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-800">
                ข้อมูลแพทย์ผู้ประเมิน
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-700 mb-1 font-semibold flex items-center justify-between">
                    <span>
                      ชื่อแพทย์ผู้ประเมิน <span className="text-red-500">*</span>
                    </span>
                    {!data.physicianName?.trim() && (
                      <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        จำเป็นต้องระบุ
                      </span>
                    )}
                  </label>
                  <input
                    id="field-physicianName"
                    type="text"
                    value={data.physicianName}
                    onChange={e => onChange({ physicianName: e.target.value })}
                    onBlur={e => onBlurField && onBlurField('physicianName', e.target.value)}
                    placeholder="เช่น นพ. หรือ พญ. ..."
                    className={`w-full text-sm bg-white border rounded px-3 py-1.5 transition-all focus:ring-2 focus:ring-blue-600 focus:outline-none ${
                      errors.physicianName
                        ? 'border-red-500 bg-red-50'
                        : !data.physicianName?.trim()
                        ? 'border-slate-300 border-l-4 border-l-rose-500 bg-rose-50/20'
                        : 'border-slate-300'
                    }`}
                  />
                  {errors.physicianName && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.physicianName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-700 mb-1 font-semibold">
                    เลขที่ใบประกอบวิชาชีพ
                  </label>
                  <input
                    type="text"
                    value={data.licenseNumber}
                    onChange={e => onChange({ licenseNumber: e.target.value })}
                    onBlur={e => onBlurField && onBlurField('licenseNumber', e.target.value)}
                    placeholder="เช่น ว. 12345"
                    className="w-full text-sm font-mono bg-white border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const Step5PlanAndManagement = React.memo(Step5PlanAndManagementComponent);
