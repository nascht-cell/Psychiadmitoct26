import React from 'react';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { DebouncedInput } from './DebouncedInput';

const Step4RiskAssessmentComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  toggleArrayItem,
  handleSuicideRiskChange,
  handleViolenceRiskChange,
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION E: Safety & Risk Assessment */}
      <section id="section-e" className="clay-surface overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-rose-700 to-red-800 text-white flex items-center justify-between rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-200" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              E. Safety & Risk Assessment (การประเมินความเสี่ยงด้านความปลอดภัย)
            </h3>
          </div>
          <span className="text-xs text-rose-100 font-bold hidden sm:flex items-center gap-1 bg-white/15 px-3 py-1 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-200" />
            เกณฑ์เฝ้าระวังความปลอดภัย
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Suicide Risk */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  1. Suicide / Self-harm Risk <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-semibold">
                  {data.suicideRisk === 'High Risk' && <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-bold">ความเสี่ยงสูงมาก</span>}
                  {data.suicideRisk === 'Moderate Risk' && <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">ความเสี่ยงปานกลาง</span>}
                  {data.suicideRisk === 'Low Risk' && <span className="text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">ความเสี่ยงต่ำ</span>}
                  {data.suicideRisk === 'No Risk' && <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">ไม่มีความเสี่ยง</span>}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { risk: 'No Risk', label: 'No Risk (ไม่มี)', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs' },
                  { risk: 'Low Risk', label: 'Low Risk (ต่ำ)', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
                  { risk: 'Moderate Risk', label: 'Moderate Risk (ปานกลาง)', activeCls: 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs ring-2 ring-amber-300/50' },
                  { risk: 'High Risk', label: 'High Risk (สูง)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-2 ring-rose-400/60 animate-pulse-once' },
                ].map(({ risk, label, activeCls }) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => handleSuicideRiskChange(risk as any)}
                    className={`py-2.5 px-3 min-h-[42px] text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      data.suicideRisk === risk
                        ? activeCls
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Violence Risk */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Violence / Aggression Risk <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-semibold">
                  {data.violenceRisk === 'High Risk' && <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-bold">ความเสี่ยงสูงมาก</span>}
                  {data.violenceRisk === 'Moderate Risk' && <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">ความเสี่ยงปานกลาง</span>}
                  {data.violenceRisk === 'Low Risk' && <span className="text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">ความเสี่ยงต่ำ</span>}
                  {data.violenceRisk === 'No Risk' && <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">ไม่มีความเสี่ยง</span>}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { risk: 'No Risk', label: 'No Risk (ไม่มี)', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs' },
                  { risk: 'Low Risk', label: 'Low Risk (ต่ำ)', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
                  { risk: 'Moderate Risk', label: 'Moderate Risk (ปานกลาง)', activeCls: 'bg-amber-500 text-white border-amber-500 font-bold shadow-xs ring-2 ring-amber-300/50' },
                  { risk: 'High Risk', label: 'High Risk (สูง)', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-2 ring-rose-400/60 animate-pulse-once' },
                ].map(({ risk, label, activeCls }) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => handleViolenceRiskChange(risk as any)}
                    className={`py-2.5 px-3 min-h-[42px] text-xs rounded-lg border text-center transition-all cursor-pointer ${
                      data.violenceRisk === risk
                        ? activeCls
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Other Risks */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              3. Other Risks (ความเสี่ยงอื่นๆ)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { risk: 'None', label: 'None (ไม่มีความเสี่ยงอื่น)', isSafe: true },
                { risk: 'Falls', label: 'Falls (พลัดตกหกล้ม)', isSafe: false },
                { risk: 'Escape', label: 'Escape (หลบหนี)', isSafe: false },
                { risk: 'Abuse/Neglect', label: 'Abuse/Neglect (ถูกทอดทิ้ง/ทำร้าย)', isSafe: false },
                { risk: 'Medication ADR', label: 'Medication ADR (แพ้ยา/ผลข้างเคียง)', isSafe: false },
              ].map(({ risk, label, isSafe }) => {
                const isSelected =
                  data.otherRisks.includes(risk) ||
                  (risk === 'Escape' && data.otherRisks.includes('Wandering/Elopement'));
                return (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => toggleArrayItem('otherRisks', risk)}
                    className={`text-xs px-3.5 py-2 min-h-[38px] rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? isSafe
                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs'
                          : 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs ring-2 ring-amber-300/40'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Safety Plan if Moderate or High */}
          {(data.suicideRisk === 'Moderate Risk' ||
            data.suicideRisk === 'High Risk' ||
            data.violenceRisk === 'Moderate Risk' ||
            data.violenceRisk === 'High Risk') && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
              <label className="block text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Safety Plan (แผนความปลอดภัยเนื่องจากมีความเสี่ยง Moderate/High)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Admit สังเกตอาการใกล้ชิด',
                  'แจ้งญาติดูแล 24 ชม.',
                  'Restraint/Seclusion',
                ].map(plan => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => toggleArrayItem('safetyPlan', plan)}
                    className={`text-xs px-3.5 py-2 min-h-[38px] rounded-lg border cursor-pointer transition-all ${
                      data.safetyPlan.includes(plan)
                        ? 'bg-rose-700 text-white border-rose-700 font-bold shadow-xs'
                        : 'bg-white text-rose-900 border-rose-300 hover:bg-rose-100'
                    }`}
                  >
                    {plan}
                  </button>
                ))}
              </div>
              <DebouncedInput
                type="text"
                value={data.safetyPlanOther}
                onChangeValue={val => onChange({ safetyPlanOther: val })}
                placeholder="ระบุแผนความปลอดภัยอื่นๆ เพิ่มเติม..."
                className="w-full text-xs bg-white border border-rose-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-rose-600 focus:outline-none"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export const Step4RiskAssessment = React.memo(Step4RiskAssessmentComponent);
