import React, { useState, useEffect } from 'react';
import { Settings, Printer, Check, X, FileText, User, ShieldCheck } from 'lucide-react';
import { PsychiatricAssessment } from '../types/assessment';
import { loadClinicianSettings, saveClinicianSettings, ClinicianSettings } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: PsychiatricAssessment;
  onChange: (updated: Partial<PsychiatricAssessment>) => void;
  onShowToast?: (type: 'success' | 'error' | 'info', title: string, desc: string) => void;
}

export const ClinicianSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  onChange,
  onShowToast,
}) => {
  const [settings, setSettings] = useState<ClinicianSettings>({
    autoPrintAfterSave: false,
    defaultAllowPage4: false,
    defaultPhysicianName: '',
    defaultLicenseNumber: '',
  });

  useEffect(() => {
    if (isOpen) {
      const loaded = loadClinicianSettings();
      setSettings({
        autoPrintAfterSave: data.autoPrintAfterSave !== undefined ? Boolean(data.autoPrintAfterSave) : loaded.autoPrintAfterSave,
        defaultAllowPage4: data.allowPage4 !== undefined ? Boolean(data.allowPage4) : Boolean(loaded.defaultAllowPage4),
        defaultPhysicianName: loaded.defaultPhysicianName || data.physicianName || '',
        defaultLicenseNumber: loaded.defaultLicenseNumber || data.licenseNumber || '',
      });
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, data.autoPrintAfterSave, data.allowPage4, data.physicianName, data.licenseNumber]);

  if (!isOpen) return null;


  const handleToggleAllowPage4 = (checked: boolean) => {
    const updated = { ...settings, defaultAllowPage4: checked };
    setSettings(updated);
    saveClinicianSettings({ defaultAllowPage4: checked });
    onChange({ allowPage4: checked });
  };

  const handleSaveClinicianProfile = () => {
    saveClinicianSettings({
      defaultPhysicianName: settings.defaultPhysicianName,
      defaultLicenseNumber: settings.defaultLicenseNumber,
    });
    const updates: Partial<PsychiatricAssessment> = {};
    if (!data.physicianName && settings.defaultPhysicianName) {
      updates.physicianName = settings.defaultPhysicianName;
    }
    if (!data.licenseNumber && settings.defaultLicenseNumber) {
      updates.licenseNumber = settings.defaultLicenseNumber;
    }
    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
    if (onShowToast) {
      onShowToast('success', 'บันทึกการตั้งค่าสำเร็จ', 'บันทึกการตั้งค่าและโปรไฟล์แพทย์ลงในเครื่องนี้เรียบร้อย');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="การตั้งค่าระบบและพิมพ์รายงาน"
    >
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/30 text-blue-300 rounded-xl border border-blue-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white leading-tight">
                การตั้งค่าระบบ & การพิมพ์ (Settings)
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                ปรับแต่งเวิร์กโฟลว์การพิมพ์รายงานและเวชระเบียนคลินิก
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
            aria-label="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Print Workflow Info - Always on */}
          <div className="p-3.5 sm:p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">
                  ระบบพิมพ์อัตโนมัติ (Always Auto-Print)
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2 py-0.2 rounded-full">
                  เปิดทำงานอัตโนมัติ
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                ทุกครั้งที่บันทึกและดาวน์โหลด PDF ระบบจะเรียกหน้าต่างสั่งพิมพ์ของเครื่องทันทีโดยไม่ต้องคลิกซ้ำ
              </p>
            </div>
          </div>

          {/* Section 2: PDF Page Layout Options */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <span className="font-extrabold text-sm text-slate-900">
                รูปแบบการจัดหน้าเอกสาร A4 (PDF Layout)
              </span>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
              <input
                id="modal-toggle-allowPage4"
                type="checkbox"
                checked={Boolean(settings.defaultAllowPage4)}
                onChange={e => handleToggleAllowPage4(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
              />
              <label
                htmlFor="modal-toggle-allowPage4"
                className="text-sm text-slate-800 leading-snug cursor-pointer select-none flex-1"
              >
                <div className="font-bold text-slate-900">
                  อนุญาตให้แยกเป็น 4 หน้า (4-Page Layout)
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  ค่ามาตรฐานคือ <strong className="text-slate-900">3 หน้า A4 อย่างลงตัว</strong> หากเลือกข้อนี้ เอกสารจะขยายเป็น 4 หน้าเหมาะสำหรับเคสที่มีประวัติและคำสั่งยายาวมาก
                </p>
              </label>
            </div>
          </div>

          {/* Section 3: Clinician Profile Defaults */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <span className="font-extrabold text-sm text-slate-900">
                  ข้อมูลแพทย์ประจำเครื่อง (Default Clinician Info)
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                เก็บบนเครื่องนี้ (Private)
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              บันทึกชื่อแพทย์และเลข ว. เพื่อให้ระบบกรอกลงในแบบประเมินผู้ป่วยใหม่อัตโนมัติ
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อ-สกุลแพทย์ผู้ประเมิน
                </label>
                <input
                  type="text"
                  value={settings.defaultPhysicianName}
                  onChange={e =>
                    setSettings({ ...settings, defaultPhysicianName: e.target.value })
                  }
                  placeholder="เช่น พญ. สมใจ มุ่งมั่น"
                  className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  เลขที่ใบอนุญาตฯ (เลข ว.)
                </label>
                <input
                  type="text"
                  value={settings.defaultLicenseNumber}
                  onChange={e =>
                    setSettings({ ...settings, defaultLicenseNumber: e.target.value })
                  }
                  placeholder="เช่น ว. 45678"
                  className="w-full text-sm bg-white border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            บันทึกการตั้งค่าลง Local Storage ของเครื่องนี้อัตโนมัติ
          </div>
          <button
            type="button"
            onClick={handleSaveClinicianProfile}
            className="clay-btn clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>เสร็จสิ้น & บันทึก</span>
          </button>
        </div>
      </div>
    </div>
  );
};
