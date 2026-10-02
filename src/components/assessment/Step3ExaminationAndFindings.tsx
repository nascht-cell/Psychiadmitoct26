import React from 'react';
import {
  Brain,
  Stethoscope,
  Sparkles,
  Check,
  FlaskConical,
  FileCheck,
  CheckSquare,
} from 'lucide-react';
import { AssessmentStepProps } from './AssessmentStepProps';
import { DebouncedInput } from './DebouncedInput';

const Step3ExaminationAndFindingsComponent: React.FC<AssessmentStepProps> = ({
  data,
  onChange,
  onApplyWnlMse,
  onApplyWnlPhysical,
  toggleArrayItem,
  toggleMseItem,
}) => {
  return (
    <div className="space-y-6">
      {/* SECTION D: Mental Status Examination (MSE) */}
      <section id="section-d" className="clay-surface overflow-hidden">
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 rounded-t-[16px] sm:rounded-t-[26px]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
              <h3 className="font-bold text-white text-sm sm:text-base">
                D. Mental Status Examination (การตรวจสภาพจิต)
              </h3>
            </div>
            {onApplyWnlMse && (
              <button
                type="button"
                onClick={onApplyWnlMse}
                className="text-[11px] sm:text-xs text-blue-900 bg-blue-100 hover:bg-white border border-blue-200 font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-1.5 transition-all shadow-xs cursor-pointer"
                title="ตั้งค่า MSE ทั้งหมดเป็นปกติ (Normal / WNL)"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>ปกติทั้งหมด (WNL)</span>
              </button>
            )}
          </div>
          <span className="text-xs text-blue-100 font-medium hidden sm:inline">การประเมินสภาพจิต 9 มิติ</span>
        </div>

        <div className="p-3.5 sm:p-6 space-y-3.5 sm:space-y-5">
          {/* Appearance & Speech */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Appearance & Psychomotor
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs' },
                  { name: 'Poor hygiene', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
                  { name: 'Restless/Agitated', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs ring-1 ring-orange-300' },
                  { name: 'Retardation', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
                  { name: 'Uncooperative', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
                  { name: 'EPS', activeCls: 'bg-rose-700 text-white border-rose-700 font-bold shadow-xs ring-2 ring-rose-400' },
                ].map(({ name: item, activeCls }) => {
                  const isSelected =
                    data.appearanceBehavior.includes(item) ||
                    (item === 'Poor hygiene' && data.appearanceBehavior.includes('Unkempt/Poor hygiene'));
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMseItem('appearanceBehavior', item)}
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

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Speech
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs' },
                  { name: 'Slow/Poverty of speech', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
                  { name: 'Talkative/Pressured', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs ring-1 ring-orange-300' },
                  { name: 'Loud/Aggressive', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
                  { name: 'Mute', activeCls: 'bg-slate-700 text-white border-slate-700 font-bold shadow-xs' },
                ].map(({ name: item, activeCls }) => {
                  const isSelected = data.speech.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMseItem('speech', item)}
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
          </div>

          {/* Mood / Affect */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Mood & Affect
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Euthymic', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs' },
                { name: 'Depressed', activeCls: 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs' },
                { name: 'Euphoric/Elated', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
                { name: 'Irritable/Angry', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
                { name: 'Anxious', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
                { name: 'Blunted/Flat', activeCls: 'bg-slate-600 text-white border-slate-600 font-bold shadow-xs' },
                { name: 'Labile', activeCls: 'bg-teal-600 text-white border-teal-600 font-bold shadow-xs' },
              ].map(({ name: item, activeCls }) => {
                const isSelected = data.moodAffect.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleMseItem('moodAffect', item)}
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

          {/* Thought Process & Thought Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Thought Process
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Logical/Coherent', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs' },
                  { name: 'Flight of ideas', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
                  { name: 'Loose association', activeCls: 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs' },
                  { name: 'Circumstantial', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
                  { name: 'Tangential', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
                  { name: 'Incoherent', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
                ].map(({ name: item, activeCls }) => {
                  const isSelected = data.thoughtProcess.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMseItem('thoughtProcess', item)}
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

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Thought Content
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs' },
                  { name: 'Delusion', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs ring-1 ring-rose-300' },
                  { name: 'Suicidal ideation', activeCls: 'bg-rose-700 text-white border-rose-700 font-bold shadow-xs ring-2 ring-rose-400' },
                  { name: 'Homicidal ideation', activeCls: 'bg-rose-800 text-white border-rose-800 font-bold shadow-xs ring-2 ring-rose-500' },
                  { name: 'Obsession/Phobia', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
                  { name: 'Grandiosity', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs' },
                ].map(({ name: item, activeCls }) => {
                  const isSelected = data.thoughtContent.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleMseItem('thoughtContent', item)}
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
              {data.thoughtContent.includes('Delusion') && (
                <div className="mt-2.5">
                  <DebouncedInput
                    type="text"
                    value={data.delusionDetail}
                    onChangeValue={val => onChange({ delusionDetail: val })}
                    placeholder="ระบุประเภทและรายละเอียด Delusion เช่น Persecutory delusion..."
                    className="w-full text-xs bg-white border border-rose-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-rose-600 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Perception */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Perception
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Normal', activeCls: 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-2xs' },
                { name: 'Auditory Hallucination', activeCls: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs ring-1 ring-purple-300' },
                { name: 'Visual Hallucination', activeCls: 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs' },
                { name: 'Illusion', activeCls: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs' },
                { name: 'Somatic Hallucination', activeCls: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs' },
              ].map(({ name: item, activeCls }) => {
                const isSelected = data.perception.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleMseItem('perception', item)}
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

          {/* Cognitive & Sensorium */}
          <div className="pt-3 border-t border-slate-100 space-y-4">
            {/* Orientation */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Orientation:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'orientationTime', label: 'Time (เวลา)' },
                  { key: 'orientationPlace', label: 'Place (สถานที่)' },
                  { key: 'orientationPerson', label: 'Person (บุคคล)' },
                ].map(({ key, label }) => {
                  const val = Boolean((data as any)[key]);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => onChange({ [key]: !val })}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                        val
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100 font-semibold'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>{label} {val ? '✓' : '✗'}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attention & Memory, Insight, Judgment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1.5">Attention & Memory:</span>
                <div className="flex gap-1.5">
                  {(['Intact', 'Impaired'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onChange({ attentionMemory: opt })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        data.attentionMemory === opt
                          ? opt === 'Intact'
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                            : 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1.5">Insight (ระดับการรับรู้โรค):</span>
                <select
                  value={data.insight}
                  onChange={e => onChange({ insight: e.target.value as any })}
                  className="w-full text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="1(Complete denial)">Level 1 - Complete denial of illness</option>
                  <option value="2(Slight awareness)">Level 2 - Slight awareness of being sick</option>
                  <option value="3(Aware but blaming)">Level 3 - Aware but blaming external factors</option>
                  <option value="4(Aware illness unknown)">Level 4 - Aware of illness due to unknown cause</option>
                  <option value="5(Intellectual)">Level 5 - Intellectual insight</option>
                  <option value="6(True)">Level 6 - True emotional insight</option>
                </select>
              </div>

              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1.5">Judgment:</span>
                <div className="flex gap-1.5">
                  {(['Intact', 'Impaired'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => onChange({ judgment: opt })}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer font-medium ${
                        data.judgment === opt
                          ? opt === 'Intact'
                            ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                            : 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
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
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Vital Signs (สัญญาณชีพ)
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {/* BP */}
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

              {/* PR */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">PR:</span>
                <input
                  type="number"
                  value={data.pulseRate}
                  onChange={e => onChange({ pulseRate: e.target.value })}
                  placeholder="76"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">/min</span>
              </div>

              {/* RR */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">RR:</span>
                <input
                  type="number"
                  value={data.respRate}
                  onChange={e => onChange({ respRate: e.target.value })}
                  placeholder="18"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">/min</span>
              </div>

              {/* Temp */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Temp:</span>
                <input
                  type="text"
                  value={data.temperature}
                  onChange={e => onChange({ temperature: e.target.value })}
                  placeholder="36.5"
                  className="w-14 text-xs font-mono border border-slate-300 rounded px-1 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">°C</span>
              </div>

              {/* SpO2 */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">SpO2:</span>
                <input
                  type="number"
                  value={data.spo2}
                  onChange={e => onChange({ spo2: e.target.value })}
                  placeholder="98"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">%</span>
              </div>

              {/* Pain Score */}
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 shadow-2xs">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Pain:</span>
                <input
                  type="text"
                  value={data.painScore}
                  onChange={e => onChange({ painScore: e.target.value })}
                  placeholder="0"
                  className="w-12 text-xs font-mono border border-slate-300 rounded px-1 py-1 text-center bg-white focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <span className="text-[11px] text-slate-500 font-medium">/10</span>
              </div>
            </div>
          </div>

          {/* Physical Examination */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Physical Systems Examination (การตรวจร่างกายตามระบบ)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              {[
                { label: 'General Appearance', key: 'generalAppearance', detailKey: 'generalAppearanceDetail' },
                { label: 'HEENT', key: 'heent', detailKey: 'heentDetail' },
                { label: 'CVS / RS', key: 'cvsRs', detailKey: 'cvsRsDetail' },
                { label: 'Abdomen', key: 'abdomen', detailKey: 'abdomenDetail' },
                { label: 'Extremities', key: 'extremities', detailKey: 'extremitiesDetail' },
              ].map(sys => (
                <div key={sys.key} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{sys.label}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onChange({ [sys.key]: 'Normal' })}
                        className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-all ${
                          (data as any)[sys.key] === 'Normal'
                            ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Normal
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange({ [sys.key]: 'Abnormal' })}
                        className={`px-2.5 py-1 text-xs font-medium rounded cursor-pointer transition-all ${
                          (data as any)[sys.key] === 'Abnormal'
                            ? 'bg-rose-600 text-white shadow-2xs font-bold'
                            : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Abnormal
                      </button>
                    </div>
                  </div>
                  {(data as any)[sys.key] === 'Abnormal' && (
                    <input
                      type="text"
                      value={(data as any)[sys.detailKey] || ''}
                      onChange={e => onChange({ [sys.detailKey]: e.target.value })}
                      placeholder={`ระบุความผิดปกติ ${sys.label}...`}
                      className="w-full border border-rose-300 rounded px-2 py-1 bg-white text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Neurological Examination */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Neurological Examination (การตรวจระบบประสาทอย่างละเอียด)
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200/80 text-xs">
              {/* Cranial Nerves */}
              <div className="px-4 py-2.5 hover:bg-slate-100/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-3 font-semibold text-slate-800">1. Cranial Nerves:</div>
                  <div className="md:col-span-9 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onChange({ cranialNerves: 'Grossly intact', cranialNervesDetail: '' })}
                      className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                        data.cranialNerves === 'Grossly intact'
                          ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Grossly intact (ปกติ)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ cranialNerves: 'Abnormal' })}
                      className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                        data.cranialNerves === 'Abnormal'
                          ? 'bg-rose-600 text-white font-bold shadow-xs ring-1 ring-rose-300'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Abnormal (ผิดปกติ)
                    </button>
                  </div>
                </div>
                {data.cranialNerves === 'Abnormal' && (
                  <div className="mt-1.5 md:ml-[25%]">
                    <input
                      type="text"
                      value={data.cranialNervesDetail}
                      onChange={e => onChange({ cranialNervesDetail: e.target.value })}
                      placeholder="ระบุเส้นประสาทสมองที่ผิดปกติ เช่น CN VII..."
                      className="w-full border border-rose-300 rounded px-2 py-1 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* Motor Power */}
              <div className="px-4 py-2.5 hover:bg-slate-100/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-3 font-semibold text-slate-800">2. Motor Power:</div>
                  <div className="md:col-span-9 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onChange({ motorPower: 'Grade V all', motorPowerDetail: '' })}
                      className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                        data.motorPower === 'Grade V all'
                          ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Grade V all (ปกติ)
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ motorPower: 'Abnormal' })}
                      className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                        data.motorPower === 'Abnormal'
                          ? 'bg-rose-600 text-white font-bold shadow-xs ring-1 ring-rose-300'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Weakness (ผิดปกติ)
                    </button>
                  </div>
                </div>
                {data.motorPower === 'Abnormal' && (
                  <div className="mt-1.5 md:ml-[25%]">
                    <input
                      type="text"
                      value={data.motorPowerDetail}
                      onChange={e => onChange({ motorPowerDetail: e.target.value })}
                      placeholder="ระบุเกรดและตำแหน่ง เช่น R't hemiparesis Grade IV..."
                      className="w-full border border-rose-300 rounded px-2 py-1 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* Muscle Tone */}
              <div className="px-4 py-2.5 hover:bg-slate-100/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-3 font-semibold text-slate-800">3. Muscle Tone:</div>
                  <div className="md:col-span-9 flex flex-wrap items-center gap-1.5">
                    {(['Normal', 'Rigidity', 'Spasticity', 'Flaccid'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => onChange({ tone: t, ...(t === 'Normal' ? { toneDetail: '' } : {}) })}
                        className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                          data.tone === t
                            ? t === 'Normal'
                              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                              : 'bg-rose-600 text-white font-bold shadow-xs ring-1 ring-rose-300'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {data.tone && data.tone !== 'Normal' && (
                  <div className="mt-1.5 md:ml-[25%]">
                    <input
                      type="text"
                      value={data.toneDetail}
                      onChange={e => onChange({ toneDetail: e.target.value })}
                      placeholder="ระบุรายละเอียด เช่น Lead-pipe rigidity..."
                      className="w-full border border-rose-300 rounded px-2 py-1 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* Sensory */}
              <div className="px-4 py-2.5 hover:bg-slate-100/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-3 font-semibold text-slate-800">4. Sensory System:</div>
                  <div className="md:col-span-9 flex flex-wrap items-center gap-1.5">
                    {(['Intact', 'Impaired'] as const).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onChange({ sensory: s, ...(s === 'Intact' ? { sensoryDetail: '' } : {}) })}
                        className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                          data.sensory === s
                            ? s === 'Intact'
                              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                              : 'bg-rose-600 text-white font-bold shadow-xs ring-1 ring-rose-300'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                {data.sensory === 'Impaired' && (
                  <div className="mt-1.5 md:ml-[25%]">
                    <input
                      type="text"
                      value={data.sensoryDetail}
                      onChange={e => onChange({ sensoryDetail: e.target.value })}
                      placeholder="ระบุความผิดปกติ เช่น Numbness both feet..."
                      className="w-full border border-rose-300 rounded px-2 py-1 bg-rose-50/30 text-xs focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                )}
              </div>

              {/* Deep Tendon Reflexes */}
              <div className="px-4 py-2.5 hover:bg-slate-100/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-3 font-semibold text-slate-800">5. DTRs:</div>
                  <div className="md:col-span-9 flex flex-wrap items-center gap-1.5">
                    {(['Normal', 'Hyperreflexia', 'Hyporeflexia'] as const).map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => onChange({ reflexes: r, ...(r === 'Normal' ? { reflexesDetail: '' } : {}) })}
                        className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                          data.reflexes === r
                            ? r === 'Normal'
                              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                              : 'bg-amber-600 text-white font-bold shadow-xs ring-1 ring-amber-300'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cerebellar Signs */}
              <div className="px-4 py-2.5 hover:bg-slate-100/50 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                  <div className="md:col-span-3 font-semibold text-slate-800">6. Cerebellar Signs:</div>
                  <div className="md:col-span-9 flex flex-wrap items-center gap-1.5">
                    {(['Normal', 'Abnormal'] as const).map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onChange({ cerebellar: c, ...(c === 'Normal' ? { cerebellarDetail: '' } : {}) })}
                        className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-all ${
                          data.cerebellar === c
                            ? c === 'Normal'
                              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                              : 'bg-rose-600 text-white font-bold shadow-xs ring-1 ring-rose-300'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nutrition & ADL */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-5 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-xs text-slate-800">Nutrition:</span>
              <div className="flex gap-1.5">
                {(['Normal', 'Impaired'] as const).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => onChange({ nutrition: n })}
                    className={`px-2.5 py-1 text-xs font-medium rounded border transition-all cursor-pointer ${
                      data.nutrition === n
                        ? n === 'Normal'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                          : 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="font-bold text-xs text-slate-800">ADL:</span>
              <div className="flex gap-1.5">
                {(['Independent', 'Dependent'] as const).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => onChange({ adl: a })}
                    className={`px-2.5 py-1 text-xs font-medium rounded border transition-all cursor-pointer ${
                      data.adl === a
                        ? a === 'Independent'
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                          : 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
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
