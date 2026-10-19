import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, ChevronDown, ChevronUp, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { suggestIcd10FromNotes, Icd10Suggestion } from '../../utils/icd10SuggestHelper';

interface Icd10AiSuggesterProps {
  notes: string;
  symptoms?: string[];
  currentCategory?: string[];
  currentPrimaryDx?: string;
  onApplyDiagnosis: (suggestion: Icd10Suggestion) => void;
  title?: string;
  compact?: boolean;
}

export const Icd10AiSuggester: React.FC<Icd10AiSuggesterProps> = ({
  notes,
  symptoms = [],
  currentCategory = [],
  currentPrimaryDx,
  onApplyDiagnosis,
  title = 'แนะนำรหัสวินิจฉัย ICD-10 (Clinical Assist)',
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Icd10Suggestion[]>([]);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const trimmedNotes = (notes || '').trim();
  const hasContent = trimmedNotes.length >= 3 || symptoms.length > 0;

  const handleFetchSuggestions = async () => {
    if (!hasContent) {
      setIsOpen(true);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setIsOpen(true);

    try {
      const results = await suggestIcd10FromNotes(trimmedNotes, {
        symptoms,
        currentCategory,
        signal: controller.signal,
      });
      setSuggestions(results);
      setLastAnalyzedText(trimmedNotes);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Failed to get ICD-10 suggestions:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSelect = (sug: Icd10Suggestion) => {
    setAppliedCode(sug.code);
    onApplyDiagnosis(sug);
    setTimeout(() => {
      setAppliedCode(null);
    }, 2500);
  };

  return (
    <div className="mt-2 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-sky-50/70 p-3 shadow-2xs transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-2xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
              <span>{title}</span>
              <span className="rounded-md bg-blue-100/90 px-2 py-0.5 text-[10px] font-semibold text-blue-800 border border-blue-200">
                Clinical Rules & Assist
              </span>
            </h4>
            <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
              แนะนำรหัสวินิจฉัย ICD-10 จากประวัติและอาการสำคัญ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!isOpen) {
              handleFetchSuggestions();
            } else {
              setIsOpen(false);
            }
          }}
          disabled={loading}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer select-none shadow-2xs ${
            isOpen
              ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>กำลังวิเคราะห์อาการ...</span>
            </>
          ) : isOpen ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>ซ่อนคำแนะนำ</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>แนะนำรหัส ICD-10</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 pt-2.5 border-t border-blue-200/80 space-y-2">
          {!hasContent ? (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>กรุณาพิมพ์รายละเอียดอาการในช่องบันทึก (เช่น "ผู้ป่วยมีหูแว่ว หวาดระแวง ไม่ยอมนอน") แล้วกดแนะนำรหัสอีกครั้ง</span>
            </div>
          ) : loading ? (
            <div className="py-6 flex flex-col items-center justify-center text-center space-y-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-xs font-medium text-slate-600">
                ระบบ AI กำลังวิเคราะห์อาการทางคลินิกและจับคู่เกณฑ์รหัส ICD-10 ทางจิตเวช...
              </p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-center text-xs text-slate-600">
              ไม่พบรหัสโรคที่ตรงกับข้อความที่พิมพ์ โปรดระบุอาการเพิ่มเติม เช่น หูแว่ว, ซึมเศร้า, เสพยา, หรือติดสุรา
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                <span className="font-semibold text-slate-700">
                  🎯 รหัสวินิจฉัยที่แนะนำตามลำดับความสอดคล้อง ({suggestions.length} รายการ):
                </span>
                {trimmedNotes !== lastAnalyzedText && (
                  <button
                    type="button"
                    onClick={handleFetchSuggestions}
                    className="text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    🔄 อัปเดตการวิเคราะห์ตามข้อความใหม่
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestions.map((sug, idx) => {
                  const isCurrentPrimary = currentPrimaryDx?.includes(sug.code);
                  const isJustApplied = appliedCode === sug.code;

                  return (
                    <div
                      key={sug.code + idx}
                      className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between ${
                        isCurrentPrimary
                          ? 'bg-blue-100/90 border-blue-400 ring-1 ring-blue-300'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1.5">
                          <div>
                            <span className="inline-block px-1.5 py-0.5 text-[10.5px] font-mono font-bold bg-blue-700 text-white rounded">
                              {sug.code}
                            </span>
                            <span className="ml-1.5 text-xs font-bold text-slate-900 leading-snug">
                              {sug.nameEn}
                            </span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 text-[10px] font-bold rounded shrink-0 ${
                              sug.confidence === 'High'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : sug.confidence === 'Medium'
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {sug.confidence === 'High' ? '★ ตรงเกณฑ์สูง' : '● ปานกลาง'}
                          </span>
                        </div>

                        <div className="text-[11px] font-medium text-slate-600 mt-0.5">
                          {sug.nameTh}
                        </div>

                        {sug.reason && (
                          <div className="mt-1.5 text-[11px] text-slate-600 bg-slate-50 rounded-lg p-1.5 border border-slate-150 leading-relaxed">
                            <span className="font-semibold text-slate-800">เหตุผลทางคลินิก:</span> {sug.reason}
                          </div>
                        )}

                        {sug.suggestedComorbid && (
                          <div className="mt-1 text-[10.5px] font-medium text-amber-800 bg-amber-50 rounded px-1.5 py-0.5 border border-amber-200">
                            🔗 โรคร่วมแนะนำ: <span className="font-bold">{sug.suggestedComorbid}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-600">
                          กลุ่ม: {sug.category.split(' ')[0]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelect(sug)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                            isCurrentPrimary || isJustApplied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'
                          }`}
                        >
                          {isCurrentPrimary || isJustApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>เลือกใช้รหัสนี้แล้ว</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>เลือกเป็น Primary Dx</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
