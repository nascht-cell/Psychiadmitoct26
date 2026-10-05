import React, { useCallback, useRef, useMemo } from 'react';
import { PsychiatricAssessment } from '../types/assessment';
import { Step1PatientAndDiagnosis } from './assessment/Step1PatientAndDiagnosis';
import { Step2HistoryAndSymptoms } from './assessment/Step2HistoryAndSymptoms';
import { Step3ExaminationAndFindings } from './assessment/Step3ExaminationAndFindings';
import { Step4RiskAssessment } from './assessment/Step4RiskAssessment';
import { Step5PlanAndManagement } from './assessment/Step5PlanAndManagement';
import { CheckCircle2, ChevronRight, ChevronLeft, LayoutList, Layers } from 'lucide-react';

interface Props {
  data: PsychiatricAssessment;
  onChange: (updated: Partial<PsychiatricAssessment>) => void;
  errors: Record<string, string>;
  onBlurField?: (field: string, value: any) => void;
  collapsedSections?: Record<string, boolean>;
  onToggleSection?: (sectionKey: string) => void;
  onApplyWnlMse?: () => void;
  onApplyWnlPhysical?: () => void;
  currentStep?: number;
  onStepChange?: (step: number) => void;
  viewMode?: 'wizard' | 'full';
  onViewModeChange?: (mode: 'wizard' | 'full') => void;
  onOpenHistoryModal?: () => void;
}

const STEPS = [
  {
    id: 1,
    title: 'ผู้ป่วย & การวินิจฉัยโรค',
    shortTitle: '1. ผู้ป่วย & วินิจฉัย',
    subtitle: 'ข้อมูลทั่วไป, สิทธิ, ผู้ให้ประวัติ และการวินิจฉัยหลัก/โรคร่วม (Primary Dx, ICD-10)',
  },
  {
    id: 2,
    title: 'อาการสำคัญ & ประวัติเจ็บป่วย',
    shortTitle: '2. อาการ & ประวัติ',
    subtitle: 'อาการสำคัญ (CC), ประวัติปัจจุบัน (HPI), ประวัติเดิม, สารเสพติด และจิตสังคม',
  },
  {
    id: 3,
    title: 'ตรวจสภาพจิต, ร่างกาย & ผลตรวจ',
    shortTitle: '3. ตรวจร่างกาย & MSE',
    subtitle: 'การตรวจสภาพจิต (MSE), สัญญาณชีพ/ร่างกาย, แบบประเมิน และการส่งตรวจ Lab',
  },
  {
    id: 4,
    title: 'ประเมินความเสี่ยง & ความปลอดภัย',
    shortTitle: '4. ความเสี่ยง (Risks)',
    subtitle: 'ความเสี่ยงทำร้ายตนเอง, ความรุนแรง, ความเสี่ยงอื่นๆ และแผนความปลอดภัย',
  },
  {
    id: 5,
    title: 'แผนการรักษา & คำสั่งรับไว้รักษา',
    shortTitle: '5. แผนการรักษา',
    subtitle: 'การใช้ยา, การรักษาไม่ใช้ยา, สหวิชาชีพ, ข้อบ่งชี้การรับไว้ใน รพ. และลงชื่อแพทย์',
  },
];

const PsychiatricAssessmentFormComponent: React.FC<Props> = ({
  data,
  onChange,
  errors,
  onBlurField,
  onApplyWnlMse,
  onApplyWnlPhysical,
  currentStep = 1,
  onStepChange,
  viewMode = 'wizard',
  onViewModeChange,
  onOpenHistoryModal,
}) => {
  const dataRef = useRef(data);
  dataRef.current = data;

  const activeStep = currentStep || 1;

  const setActiveStep = (step: number) => {
    if (onStepChange) {
      onStepChange(step);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleArrayItem = useCallback((field: keyof PsychiatricAssessment, item: string) => {
    const current = (dataRef.current[field] as string[]) || [];

    // Precipitating Factors mutual exclusion
    if (field === 'precipitatingFactors') {
      const isNone = item.includes('ไม่พบ') || item.includes('ไม่มี');
      if (isNone) {
        const updated = current.includes(item) ? [] : [item];
        onChange({ [field]: updated });
        return;
      } else {
        const withoutNone = current.filter(
          i => !i.includes('ไม่พบ') && !i.includes('ไม่มี')
        );
        const updated = withoutNone.includes(item)
          ? withoutNone.filter(i => i !== item)
          : [...withoutNone, item];
        onChange({ [field]: updated });
        return;
      }
    }

    // Psychosocial Stressors mutual exclusion
    if (field === 'psychosocialStressors') {
      const isNone = item.includes('ไม่มี');
      if (isNone) {
        const updated = current.includes(item) ? [] : [item];
        onChange({ [field]: updated });
        return;
      } else {
        const withoutNone = current.filter(i => !i.includes('ไม่มี'));
        const updated = withoutNone.includes(item)
          ? withoutNone.filter(i => i !== item)
          : [...withoutNone, item];
        onChange({ [field]: updated });
        return;
      }
    }

    // Other Risks mutual exclusion
    if (field === 'otherRisks') {
      const isNone = item === 'None' || item === 'ไม่มี';
      if (isNone) {
        const updated = current.includes(item) ? [] : [item];
        onChange({ [field]: updated });
        return;
      } else {
        const withoutNone = current.filter(i => i !== 'None' && i !== 'ไม่มี');
        const updated = withoutNone.includes(item)
          ? withoutNone.filter(i => i !== item)
          : [...withoutNone, item];
        onChange({ [field]: updated });
        return;
      }
    }

    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    onChange({ [field]: updated });
  }, [onChange]);

  const isNormalMseOption = useCallback((field: keyof PsychiatricAssessment, item: string): boolean => {
    const lower = item.toLowerCase().trim();
    if (lower === 'normal') return true;
    if (field === 'moodAffect' && lower === 'euthymic') return true;
    if (field === 'thoughtProcess' && (lower === 'logical/coherent' || lower.includes('coherent'))) return true;
    return false;
  }, []);

  const toggleMseItem = useCallback((field: keyof PsychiatricAssessment, item: string) => {
    const current = (dataRef.current[field] as string[]) || [];
    const isNormal = isNormalMseOption(field, item);

    if (isNormal) {
      const updated = current.includes(item) ? [] : [item];
      onChange({ [field]: updated });
    } else {
      const withoutNormal = current.filter(i => !isNormalMseOption(field, i));
      const updated = withoutNormal.includes(item)
        ? withoutNormal.filter(i => i !== item)
        : [...withoutNormal, item];
      onChange({ [field]: updated });
    }
  }, [onChange, isNormalMseOption]);

  const handleDurationChange = useCallback((dur: string) => {
    const defaultOnsets: Record<string, 'เฉียบพลัน (Acute)' | 'ค่อยเป็นค่อยไป (Gradual)'> = {
      '1 วัน': 'เฉียบพลัน (Acute)',
      '< 1 สัปดาห์': 'เฉียบพลัน (Acute)',
      '1-4 สัปดาห์': 'ค่อยเป็นค่อยไป (Gradual)',
      '1-6 เดือน': 'ค่อยเป็นค่อยไป (Gradual)',
      '> 6 เดือน': 'ค่อยเป็นค่อยไป (Gradual)',
    };

    const typedDur = dur as PsychiatricAssessment['duration'];
    const suggestedOnset = defaultOnsets[dur];
    if (!dataRef.current.onset && suggestedOnset) {
      onChange({ duration: typedDur, onset: suggestedOnset });
    } else {
      onChange({ duration: typedDur });
    }
  }, [onChange]);

  const handleSuicideRiskChange = useCallback((risk: 'No Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk') => {
    const indications = new Set(dataRef.current.admissionIndications || []);
    const item = 'เป็นอันตรายต่อตนเอง (Risk of Harm to Self)';
    if (risk === 'Moderate Risk' || risk === 'High Risk') {
      indications.add(item);
    } else {
      indications.delete(item);
    }
    onChange({ suicideRisk: risk, admissionIndications: Array.from(indications) });
  }, [onChange]);

  const handleViolenceRiskChange = useCallback((risk: 'No Risk' | 'Low Risk' | 'Moderate Risk' | 'High Risk') => {
    const indications = new Set(dataRef.current.admissionIndications || []);
    const item = 'เป็นอันตรายต่อผู้อื่น (Risk of Harm to Others)';
    if (risk === 'Moderate Risk' || risk === 'High Risk') {
      indications.add(item);
    } else {
      indications.delete(item);
    }
    onChange({ violenceRisk: risk, admissionIndications: Array.from(indications) });
  }, [onChange]);

  // Step Completion Check (5 stages aligned with physician workflow)
  const stepCompletionStatus = useMemo(() => {
    const step1 = Boolean(
      data.hn?.trim() &&
      data.fullName?.trim() &&
      data.age &&
      data.gender &&
      data.primaryDiagnosis?.trim()
    );
    const step2 = Boolean(
      (data.chiefComplaint?.length || data.hpiDetails?.trim()) &&
      (data.psychiatricHistory || data.medicalHistory || data.substanceHistory)
    );
    const step3 = Boolean(
      (data.appearanceBehavior?.length || data.moodAffect?.length) &&
      (data.bpSys || data.generalAppearance)
    );
    const step4 = Boolean(data.suicideRisk && data.violenceRisk);
    const step5 = Boolean(data.physicianName?.trim());

    return { 1: step1, 2: step2, 3: step3, 4: step4, 5: step5 };
  }, [data]);

  const stepProps = {
    data,
    onChange,
    errors,
    onBlurField,
    onApplyWnlMse,
    onApplyWnlPhysical,
    toggleArrayItem,
    toggleMseItem,
    handleDurationChange,
    handleSuicideRiskChange,
    handleViolenceRiskChange,
    onOpenHistoryModal,
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      {/* Step Header & View Mode Switcher */}
      <div className="clay-surface p-2.5 sm:p-4 relative md:sticky md:top-24 z-20 bg-white/95 backdrop-blur-md mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-2 pb-2 sm:pb-3 border-b border-slate-200/80 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-slate-700 bg-slate-100/90 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-2xs">
              โหมดการประเมิน
            </span>
            <span className="text-xs text-slate-600 font-bold hidden sm:inline">
              {viewMode === 'wizard' ? 'กรอกตามลำดับความคิดแพทย์ (5 ขั้นตอน)' : 'แสดงฟอร์มทั้งหมดบนหน้าเดียว (Full Form)'}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl sm:rounded-2xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => onViewModeChange && onViewModeChange('wizard')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'wizard'
                  ? 'clay-pill-active'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>ทีละขั้นตอน</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange && onViewModeChange('full')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'full'
                  ? 'clay-pill-active'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>แสดงทั้งหมด</span>
            </button>
          </div>
        </div>

        {/* Step Navigation Tabs: 5 responsive columns */}
        <div className="grid grid-cols-5 gap-1 sm:gap-2 md:gap-2.5 pt-2 sm:pt-3">
          {STEPS.map((step) => {
            const isActive = activeStep === step.id;
            const isCompleted = stepCompletionStatus[step.id as keyof typeof stepCompletionStatus];
            const hasError = Object.keys(errors).some(k => {
              if (step.id === 1) return ['hn', 'fullName', 'age', 'gender', 'primaryDiagnosis'].includes(k);
              if (step.id === 5) return ['physicianName'].includes(k);
              return false;
            });

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`relative text-left p-1.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all cursor-pointer flex flex-col justify-between min-h-[46px] sm:min-h-[64px] ${
                  isActive
                    ? 'clay-card-blue ring-2 ring-blue-400 font-extrabold text-blue-950 scale-[1.01]'
                    : hasError
                    ? 'clay-card-rose text-rose-950 hover:scale-[1.01]'
                    : isCompleted
                    ? 'clay-card-mint text-emerald-950 hover:scale-[1.01]'
                    : 'clay-surface text-slate-800 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between gap-0.5 sm:gap-1 w-full">
                  <span className="text-[9px] sm:text-[11px] font-extrabold uppercase tracking-tight text-slate-600">
                    <span className="hidden xs:inline">ขั้น </span>{step.id}
                  </span>
                  {hasError ? (
                    <span className="text-[7px] sm:text-[10px] font-bold text-rose-700 bg-rose-100/90 px-1 sm:px-1.5 py-0.2 rounded-full border border-rose-300">
                      ไม่ครบ
                    </span>
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-700 shrink-0" />
                  ) : null}
                </div>

                <div className="text-[10px] sm:text-xs md:text-sm font-extrabold truncate mt-0.5 sm:mt-1">
                  <span className="sm:hidden">{step.shortTitle.replace(/^\d+\.\s*/, '')}</span>
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Content Rendering */}
      {viewMode === 'wizard' ? (
        <div className="space-y-6">
          {activeStep === 1 && <Step1PatientAndDiagnosis {...stepProps} />}
          {activeStep === 2 && <Step2HistoryAndSymptoms {...stepProps} />}
          {activeStep === 3 && <Step3ExaminationAndFindings {...stepProps} />}
          {activeStep === 4 && <Step4RiskAssessment {...stepProps} />}
          {activeStep === 5 && <Step5PlanAndManagement {...stepProps} />}

          {/* Bottom Wizard Navigation Footer Bar */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ย้อนกลับ (ขั้นตอน {activeStep - 1})</span>
              </button>
            ) : (
              <div />
            )}

            <div className="text-xs font-semibold text-slate-500 hidden sm:block">
              ขั้นตอนที่ {activeStep} จาก 5: {STEPS[activeStep - 1].title}
            </div>

            {activeStep < 5 ? (
              <button
                type="button"
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ml-auto"
              >
                <span>ขั้นตอนถัดไป ({activeStep + 1}/5)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 ml-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ครบทั้ง 5 ขั้นตอน พร้อมออกรายงาน PDF</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full Form View */
        <div className="space-y-8">
          <section id="step-section-1" className="scroll-mt-32">
            <Step1PatientAndDiagnosis {...stepProps} />
          </section>
          <section id="step-section-2" className="scroll-mt-32">
            <Step2HistoryAndSymptoms {...stepProps} />
          </section>
          <section id="step-section-3" className="scroll-mt-32">
            <Step3ExaminationAndFindings {...stepProps} />
          </section>
          <section id="step-section-4" className="scroll-mt-32">
            <Step4RiskAssessment {...stepProps} />
          </section>
          <section id="step-section-5" className="scroll-mt-32">
            <Step5PlanAndManagement {...stepProps} />
          </section>
        </div>
      )}
    </div>
  );
};

export const PsychiatricAssessmentForm = React.memo(PsychiatricAssessmentFormComponent);
