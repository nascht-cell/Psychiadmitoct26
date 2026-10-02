import React from 'react';
import { PsychiatricAssessment } from '../types/assessment';

interface Props {
  data: PsychiatricAssessment;
  showPageBadges?: boolean;
  id?: string;
}

interface FooterProps {
  data: PsychiatricAssessment;
  pageNumber: number;
  totalPages: number;
}

/**
 * 1-line multi-page footer required for Page 2 onwards:
 * "ชื่อ-สกุล: [ชื่อ-สกุล]   |   อายุ: [อายุ]   |   เพศ: [เพศ]   |   HN: [HN]   |   AN: [AN]   (หน้า X/Y)"
 */
const DocumentFooter: React.FC<FooterProps> = ({ data, pageNumber, totalPages }) => {
  const fullName = data.fullName?.trim() || 'ไม่ระบุชื่อ-สกุล';
  const age = data.age?.trim() ? `${data.age.trim()} ปี` : '-';
  const gender = data.gender || '-';
  const hn = data.hn?.trim() || '-';
  const an = data.an?.trim() || '-';

  return (
    <div
      className="a4-document-footer mt-auto pt-1 border-t border-black text-black shrink-0"
      style={{
        fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif",
        borderTop: '1px solid #000000',
        marginTop: 'auto',
        paddingTop: '3px',
        flexShrink: 0,
        width: '100%',
      }}
    >
      <div
        className="flex justify-between items-center text-[10pt] leading-tight"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10pt', lineHeight: 1.2 }}
      >
        <div className="min-w-0 flex-1 truncate pr-2" style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>
          <span className="font-normal">ชื่อ-สกุล:</span> {fullName} &nbsp;|&nbsp;{' '}
          <span className="font-normal">อายุ:</span> {age} &nbsp;|&nbsp;{' '}
          <span className="font-normal">เพศ:</span> {gender} &nbsp;|&nbsp;{' '}
          <span className="font-normal">HN:</span> <span className="font-normal">{hn}</span> &nbsp;|&nbsp;{' '}
          <span className="font-normal">AN:</span> <span className="font-normal">{an}</span>
        </div>
        <div className="shrink-0 font-normal text-[10pt] text-black whitespace-nowrap" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
          (หน้า {pageNumber}/{totalPages})
        </div>
      </div>
    </div>
  );
};

const PageContinuationHeader: React.FC<{ data: PsychiatricAssessment; pageNumber: number; totalPages: number }> = ({
  data,
}) => (
  <div
    className="w-full max-w-full border-b border-black pb-0.5 mb-1.5 flex items-center justify-between leading-tight shrink-0"
    style={{
      fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif",
      width: '100%',
      borderBottom: '1px solid #000000',
      paddingBottom: '2px',
      marginBottom: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}
  >
    <div
      className="flex items-center gap-1.5 min-w-0 flex-1 text-[11pt] overflow-hidden pr-2"
      style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: '1 1 0%', overflow: 'hidden', paddingRight: '8px', fontSize: '11pt' }}
    >
      <img
        src="/Official_emblem_of_Bhumibol_Adulyadej_Hospital.jpg"
        alt="ตราสัญลักษณ์"
        className="w-auto h-4 object-contain shrink-0"
        style={{ aspectRatio: '200 / 283', height: '16px', width: 'auto', flexShrink: 0 }}
        referrerPolicy="no-referrer"
      />
      <span className="font-normal text-black truncate whitespace-nowrap" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        แบบบันทึกแรกรับผู้ป่วยจิตเวช (ต่อ) · กองจิตเวช รพ.ภูมิพลอดุลยเดช
      </span>
    </div>
    <div
      className="shrink-0 text-right text-black whitespace-nowrap flex items-center gap-2 text-[11pt]"
      style={{
        fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', Tahoma, sans-serif",
        flexShrink: 0,
        textAlign: 'right',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11pt',
      }}
    >
      <span className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
        <span className="font-normal">HN:</span>&nbsp;
        <span className="font-normal text-black">{data.hn || '-'}</span>
      </span>
      <span className="text-slate-400" style={{ color: '#94a3b8' }}>|</span>
      <span className="flex items-center" style={{ display: 'flex', alignItems: 'center' }}>
        <span className="font-normal">AN:</span>&nbsp;
        <span className="font-normal text-black">{data.an || '-'}</span>
      </span>
    </div>
  </div>
);

const renderCheck = (checked: boolean) => (
  <span className="inline-block font-mono font-bold mr-1 text-black">
    {checked ? '☑' : '☐'}
  </span>
);

const isNormalMseValue = (val: string): boolean => {
  const normalized = val.trim().toLowerCase();
  return (
    normalized === 'normal' ||
    normalized === 'intact' ||
    normalized === 'euthymic' ||
    normalized === 'logical/coherent' ||
    normalized === 'logical' ||
    normalized === 'none' ||
    normalized === 'ปกติ' ||
    normalized === 'grossly intact'
  );
};

const renderMseArray = (values: string[] | undefined) => {
  if (!values || values.length === 0) {
    return <span className="text-slate-400 font-normal">-</span>;
  }

  if (values.length === 1 && isNormalMseValue(values[0])) {
    return <span className="text-slate-700 font-normal">{values[0]}</span>;
  }

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
      {values.map((val, idx) => {
        const isNormal = isNormalMseValue(val);
        return (
          <span
            key={idx}
            className={isNormal ? 'text-slate-700 font-normal' : 'text-black font-bold'}
          >
            {val}
            {idx < values.length - 1 && <span className="text-slate-300 ml-1 font-normal">,</span>}
          </span>
        );
      })}
    </div>
  );
};

const renderSingleValue = (val: string | undefined) => {
  if (!val) return <span className="text-slate-400 font-normal">-</span>;
  const isNormal = isNormalMseValue(val);
  return (
    <span className={isNormal ? 'text-slate-700 font-normal' : 'text-black font-bold'}>
      {val}
    </span>
  );
};

const renderInsight = (val: string | undefined) => {
  if (!val) return <span className="text-slate-400 font-normal">-</span>;
  if (val === '6' || val.toLowerCase().includes('true insight') || val.toLowerCase().includes('level 6')) {
    return <span className="text-slate-700 font-normal">True insight (Level 6)</span>;
  }
  if (val === '5' || val.toLowerCase().includes('intellectual')) {
    return <span className="text-black font-bold">Intellectual insight (Level 5)</span>;
  }
  const isNormal = val.includes('6') || val.toLowerCase().includes('true');
  return (
    <span className={isNormal ? 'text-slate-700 font-normal' : 'text-black font-bold'}>
      {val}
    </span>
  );
};

const renderOrientation = (time: boolean, place: boolean, person: boolean) => {
  if (time && place && person) {
    return <span className="text-slate-700 font-normal">Intact (Time, Place, Person)</span>;
  }
  const parts = [];
  if (time) {
    parts.push(<span className="text-slate-700 font-normal">Time ✓</span>);
  } else {
    parts.push(<span className="text-black font-bold">Time ✗</span>);
  }

  if (place) {
    parts.push(<span className="text-slate-700 font-normal">Place ✓</span>);
  } else {
    parts.push(<span className="text-black font-bold">Place ✗</span>);
  }

  if (person) {
    parts.push(<span className="text-slate-700 font-normal">Person ✓</span>);
  } else {
    parts.push(<span className="text-black font-bold">Person ✗</span>);
  }

  return (
    <div className="flex gap-x-2 flex-wrap items-center">
      {parts.map((p, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span className="text-slate-300 text-[11pt] font-normal">·</span>}
          {p}
        </React.Fragment>
      ))}
    </div>
  );
};

const expandDoToDisorder = (text: string | undefined): string => {
  if (!text) return '';
  return text
    .replace(/\bd\s*\/\s*os\b/gi, 'disorders')
    .replace(/\bd\s*\/\s*o\b/gi, 'disorder')
    .replace(/d\/o/gi, 'disorder')
    .replace(/\bD\/O\b/g, 'disorder');
};

const pageSheetStyle: React.CSSProperties = {
  width: '210mm',
  minHeight: '297mm',
  maxHeight: '297mm',
  height: '297mm',
  padding: '8mm 8mm 8mm 12mm', // Top 8mm, Right 8mm, Bottom 8mm, Left 12mm (Calibrated for HP LaserJet Enterprise M406 & Medical Charts)
  fontFamily: "'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', Tahoma, 'Leelawadee', sans-serif",
  fontSize: '14pt',
  lineHeight: '1.3',
  boxSizing: 'border-box',
  color: '#000000',
  backgroundColor: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
};

const embeddedPdfStyles = `
  .a4-page-sheet {
    width: 210mm !important;
    min-height: 297mm !important;
    max-height: 297mm !important;
    height: 297mm !important;
    padding: 8mm 8mm 8mm 12mm !important;
    font-family: 'TH Sarabun PSK', 'TH Sarabun New', 'Sarabun', Tahoma, 'Leelawadee', sans-serif !important;
    font-size: 14pt !important;
    line-height: 1.3 !important;
    box-sizing: border-box !important;
    color: #000000 !important;
    background-color: #ffffff !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
    position: relative !important;
    overflow: hidden !important;
  }
  .pdf-grid-12 {
    display: flex !important;
    flex-wrap: wrap !important;
    width: 100% !important;
  }
  .col-span-12 { width: 100% !important; box-sizing: border-box !important; }
  .col-span-8 { width: 66.666% !important; box-sizing: border-box !important; }
  .col-span-7 { width: 58.333% !important; box-sizing: border-box !important; }
  .col-span-6 { width: 50% !important; box-sizing: border-box !important; }
  .col-span-5 { width: 41.666% !important; box-sizing: border-box !important; }
  .col-span-4 { width: 33.333% !important; box-sizing: border-box !important; }
  .col-span-3 { width: 25% !important; box-sizing: border-box !important; }
  .col-span-2 { width: 16.666% !important; box-sizing: border-box !important; }

  .pdf-grid-2 {
    display: flex !important;
    flex-wrap: wrap !important;
    width: 100% !important;
  }
  .pdf-grid-2 > * {
    width: 50% !important;
    box-sizing: border-box !important;
  }

  .pdf-grid-4 {
    display: flex !important;
    flex-wrap: wrap !important;
    width: 100% !important;
  }
  .pdf-grid-4 > * {
    width: 25% !important;
    box-sizing: border-box !important;
  }

  .pdf-grid-6 {
    display: flex !important;
    width: 100% !important;
  }
  .pdf-grid-6 > * {
    width: 16.666% !important;
    box-sizing: border-box !important;
    text-align: center !important;
  }

  .border-b-2 { border-bottom: 2px solid #000000 !important; }
  .border-b { border-bottom: 1px solid #000000 !important; }
  .border-t { border-top: 1px solid #000000 !important; }
  .border-2 { border: 2px solid #000000 !important; }
  .border { border: 1px solid #000000 !important; }
  .border-dotted { border-style: dotted !important; }
  .border-black { border-color: #000000 !important; }
  .border-slate-300 { border-color: #cbd5e1 !important; }
  .border-slate-200 { border-color: #e2e8f0 !important; }

  .flex { display: flex !important; }
  .flex-col { flex-direction: column !important; }
  .flex-1 { flex: 1 1 0% !important; }
  .items-center { align-items: center !important; }
  .items-start { align-items: flex-start !important; }
  .justify-between { justify-content: space-between !important; }
  .justify-end { justify-content: flex-end !important; }
  .justify-center { justify-content: center !important; }
  .text-center { text-align: center !important; }
  .text-right { text-align: right !important; }
  .whitespace-nowrap { white-space: nowrap !important; }
  .shrink-0 { flex-shrink: 0 !important; }
  .w-1\\/2 { width: 50% !important; }
  .w-full { width: 100% !important; }
  .text-black { color: #000000 !important; }
  .text-slate-800 { color: #1e293b !important; }
  .text-slate-700 { color: #334155 !important; }
  .text-slate-600 { color: #475569 !important; }
  .font-bold, b, strong { font-weight: 700 !important; }
  .font-semibold { font-weight: 600 !important; }
  .font-normal { font-weight: 400 !important; }
`;

const AssessmentPdfDocumentComponent: React.FC<Props> = ({ data, showPageBadges = false, id }) => {
  const hasPage4 = React.useMemo(() => {
    // Standard layout is strictly 3 pages.
    // Only expand to Page 4 if explicitly requested by user (allowPage4 === true)
    // or if free-text fields are exceptionally long (> 1200 chars total) causing actual page overflow.
    if (data.allowPage4 === true) return true;
    if (data.allowPage4 === false) return false;

    const totalFreeTextLength =
      (data.hpiDetails?.length || 0) +
      (data.medicationDetails?.length || 0) +
      (data.differentialDiagnosis?.length || 0) +
      (data.concernsDetail?.length || 0);

    return totalFreeTextLength > 1200;
  }, [data]);

  const renderSectionI = () => {
    const isLab = data.investigationStatus === 'ส่งตรวจ Lab';
    const labList = [
      ...(data.labTests || []),
      ...(data.labOther ? [data.labOther] : []),
    ].join(', ');

    return (
      <div className="avoid-break-inside">
        <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]">
          I. Investigation
        </div>
        <div className="space-y-0.5 text-[12.5pt]">
          <div>
            {isLab ? (
              <span className="font-normal text-slate-800">
                <span className="font-semibold text-black">ส่งตรวจ Lab:</span> [{labList || 'ระบุส่งตรวจ'}]
              </span>
            ) : (
              <span className="font-normal text-slate-800">
                {data.investigationStatus || '-'}
              </span>
            )}
            {data.neuroimaging && (
              <span className="ml-3 font-normal text-slate-800">
                {isLab ? '| ' : ''}Neuroimaging/EEG/EKG: {data.neuroimaging}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSectionJ = () => {
    const formattedCategories = (data.diagnosticCategory || [])
      .map(expandDoToDisorder)
      .filter(Boolean);
    const formattedCategoryOther = data.diagnosticCategoryOther
      ? expandDoToDisorder(data.diagnosticCategoryOther)
      : '';

    return (
      <div className="avoid-break-inside">
        <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]">
          J. Diagnosis (การวินิจฉัยโรค)
        </div>
        <div className="space-y-0.5 text-[12.5pt]">
          <div>
            <span className="font-normal text-slate-800">กลุ่มโรค (Category):</span>{' '}
            <span className="font-normal text-slate-800">
              {formattedCategories.length > 0 ? formattedCategories.join(', ') : '-'}
              {formattedCategoryOther && ` (${formattedCategoryOther})`}
            </span>
          </div>
          <div className="mt-0.5">
            <span className="font-normal text-black">Primary Diagnosis (ICD-10):</span>{' '}
            <span className="underline text-black font-bold">{expandDoToDisorder(data.primaryDiagnosis) || '-'}</span>
          </div>
          {data.differentialDiagnosis && (
            <div className="mt-0.5">
              <span className="font-normal text-slate-800">Differential Dx:</span> <span className="font-normal text-slate-800">{expandDoToDisorder(data.differentialDiagnosis)}</span>
            </div>
          )}
          {data.comorbidDiagnosis && (
            <div className="mt-0.5">
              <span className="font-normal text-slate-800">Comorbidity:</span> <span className="font-normal text-slate-800">{expandDoToDisorder(data.comorbidDiagnosis)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSectionK = () => (
    <div className="avoid-break-inside">
      <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]">
        K. Care Plan & Medical Intervention (แผนการดูแลและรักษา)
      </div>
      <div className="space-y-0.5 text-[12.5pt]">
        <div>
          <span className="font-normal text-slate-800">1. Pharmacological:</span> <span className="font-normal text-slate-800">{data.pharmPlan}</span>
          {data.medicationGroups && data.medicationGroups.length > 0 && (
            <span className="ml-2 font-normal text-slate-800">[{data.medicationGroups.join(', ')}]</span>
          )}
          {data.medicationDetails && (
            <div className="pl-3 font-normal text-black">
              <span className="font-normal text-slate-800">คำสั่งยา:</span> {data.medicationDetails}
            </div>
          )}
        </div>
        <div>
          <span className="font-normal text-slate-800">2. Non-Pharmacological:</span>{' '}
          <span className="font-normal text-slate-800">{data.nonPharmTreatments && data.nonPharmTreatments.join(', ') || '-'}</span>
        </div>
        <div>
          <span className="font-normal text-slate-800">3. Multidisciplinary Team ที่จำเป็นต้องร่วมดูแลผู้ป่วย:</span> <span className="font-normal text-slate-800">{data.mdtConsult}</span>
          {data.mdtConsult === 'ส่ง' && (
            <span className="ml-2 font-normal text-slate-800">
              [{data.mdtRoles && data.mdtRoles.join(', ')} {data.mdtOther && `, ${data.mdtOther}`}]
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const renderSectionL = () => (
    <div className="avoid-break-inside">
      <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
        L. Patient Involvement (การมีส่วนร่วมในการรักษา)
      </div>
      <div className="space-y-0.5 text-[12.5pt]" style={{ fontSize: '12.5pt' }}>
        <div className="grid grid-cols-2 gap-1.5 font-normal pdf-grid-2" style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
          <span style={{ width: '50%', boxSizing: 'border-box' }}>{renderCheck(data.explainedDiagnosis)} อธิบายการวินิจฉัยแล้ว</span>
          <span style={{ width: '50%', boxSizing: 'border-box' }}>{renderCheck(data.explainedCarePlan)} อธิบายแผนการรักษา/ทางเลือกแล้ว</span>
          <span style={{ width: '50%', boxSizing: 'border-box' }}>{renderCheck(data.explainedSideEffects)} อธิบายผลข้างเคียงยาแล้ว</span>
          <span style={{ width: '50%', boxSizing: 'border-box' }}>{renderCheck(data.explainedWarningSigns)} แนะนำอาการเตือนที่ต้องรีบมาพบแพทย์</span>
        </div>
        <div style={{ marginTop: '2px' }}>
          <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ข้อกังวลของผู้ป่วย/ญาติ:</span> <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>{data.concernsStatus}{' '}{data.concernsDetail && `(${data.concernsDetail})`}</span>
        </div>
      </div>
    </div>
  );

  const renderSectionM = () => (
    <div className="avoid-break-inside">
      <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
        M. Indication for Admission (ข้อบ่งชี้ในการรับไว้รักษาในโรงพยาบาล)
      </div>
      {data.admissionIndications && data.admissionIndications.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[12.5pt] pdf-grid-2" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', fontSize: '12.5pt' }}>
          {data.admissionIndications.map((item, idx) => (
            <span key={item} className="flex items-start font-normal text-black" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', boxSizing: 'border-box' }}>
              {renderCheck(true)}{' '}
              <span>{idx + 1}. {item}</span>
            </span>
          ))}
        </div>
      ) : (
        <div className="text-[12.5pt] text-slate-600 font-normal" style={{ fontSize: '12.5pt', color: '#475569' }}>
          - ไม่มีข้อบ่งชี้การรับไว้รักษาในโรงพยาบาล (รักษาแบบผู้ป่วยนอก OPD) -
        </div>
      )}
    </div>
  );

  const renderSignature = () => (
    <div className="pt-2 flex justify-end" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
      <div className="w-80 text-center space-y-0.5 text-[12.5pt]" style={{ width: '320px', textAlign: 'center', fontSize: '12.5pt' }}>
        <div className="pb-0.5 font-normal whitespace-nowrap" style={{ paddingBottom: '2px', whiteSpace: 'nowrap' }}>
          ลงชื่อ ............................................................................
        </div>
        <div className="font-normal text-black" style={{ color: '#000000' }}>
          แพทย์ผู้ประเมิน
        </div>
        <div className="font-normal text-black" style={{ color: '#000000' }}>
          ({data.physicianName || '............................................................................'})
        </div>
        <div className="font-normal">
          เลขที่ใบประกอบวิชาชีพ: {data.licenseNumber || '....................................'}
        </div>
        <div className="text-slate-600 text-[11pt] font-normal" style={{ color: '#475569', fontSize: '11pt' }}>
          วันที่บันทึก: {data.assessmentDate} {data.assessmentTime} น.
        </div>
      </div>
    </div>
  );

  const page1Fn = (pageNumber: number, totalPages: number) => (
    <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Official Header: 3 Boxes Ordered 1 -> 2 -> 3 from Top to Bottom */}
          <div className="pb-1 mb-2" style={{ paddingBottom: '4px', marginBottom: '8px' }}>
            {/* Box 1: Hospital Header (Emblem + Hospital Name) */}
            <div
              className="border border-black rounded-xs px-3 py-1 bg-[#fcfcfc] mb-1.5"
              style={{
                border: '1px solid #000000',
                padding: '4px 12px',
                backgroundColor: '#fcfcfc',
                marginBottom: '6px',
              }}
            >
              <div className="flex items-center justify-center gap-3.5" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                <img
                  src="/Official_emblem_of_Bhumibol_Adulyadej_Hospital.jpg"
                  alt="ตราสัญลักษณ์ โรงพยาบาลภูมิพลอดุลยเดช"
                  className="w-auto object-contain shrink-0"
                  style={{
                    height: '38pt',
                    maxHeight: '38pt',
                    aspectRatio: '200 / 283',
                    flexShrink: 0,
                  }}
                  referrerPolicy="no-referrer"
                />
                <div className="text-center" style={{ textAlign: 'center' }}>
                  <div
                    className="uppercase tracking-wider font-bold text-black leading-tight"
                    style={{ fontSize: '13pt', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000000', lineHeight: 1.2, fontWeight: 'bold' }}
                  >
                    Bhumibol Adulyadej Hospital
                  </div>
                  <div
                    className="text-black font-normal leading-snug"
                    style={{ fontSize: '12pt', color: '#000000', lineHeight: 1.3 }}
                  >
                    กองจิตเวชและประสาทวิทยา โรงพยาบาลภูมิพลอดุลยเดช
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Form Title Box */}
            <div
              className="border-2 border-black rounded-xs px-3 py-1 text-center bg-[#fcfcfc] mb-1.5"
              style={{
                border: '2px solid #000000',
                textAlign: 'center',
                backgroundColor: '#fcfcfc',
                padding: '4px 12px',
                marginBottom: '6px',
              }}
            >
              <h1
                className="font-bold text-black tracking-wide"
                style={{ fontSize: '14.5pt', lineHeight: 1.2, margin: 0, fontWeight: 'bold', color: '#000000', textAlign: 'center' }}
              >
                แบบบันทึกแรกรับผู้ป่วยจิตเวช
              </h1>
              <div
                className="font-normal text-black tracking-wide"
                style={{ fontSize: '11.5pt', lineHeight: 1.1, margin: 0, fontWeight: 'normal', color: '#000000', textAlign: 'center' }}
              >
                (Mental Health Admission Form)
              </div>
            </div>

            {/* Box 3: Admission & Registration Details Box */}
            <div
              className="border border-black rounded-xs px-3 py-1 bg-white text-black"
              style={{
                border: '1px solid #000000',
                padding: '3px 10px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: '11.5pt',
              }}
            >
              <div
                className="flex items-center justify-between text-[11.5pt]"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '11.5pt' }}
              >
                <div className="flex items-center gap-4" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="font-normal">ประเภทการรับผู้ป่วย:</span>
                  <span>{renderCheck(data.admissionType === 'OPD')} OPD</span>
                  <span>{renderCheck(data.admissionType === 'IPD')} IPD</span>
                  <span>{renderCheck(data.admissionType === 'ER')} ER</span>
                  <span className="text-slate-300">|</span>
                  <span>
                    <span className="font-normal">แผนก:</span> <span className="font-normal">{data.department || 'จิตเวชศาสตร์'}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3.5" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span>
                    <span className="font-normal">วันที่:</span> <span className="font-normal">{data.assessmentDate || '-'}</span>
                  </span>
                  <span>
                    <span className="font-normal">เวลา:</span> <span className="font-normal">{data.assessmentTime ? `${data.assessmentTime} น.` : '-'}</span>
                  </span>
                  <span className="text-slate-300">|</span>
                  <span>
                    <span className="font-normal">HN:</span> <span className="font-bold text-black">{data.hn || '________'}</span>
                  </span>
                  <span>
                    <span className="font-normal">AN:</span> <span className="font-normal text-black">{data.an || '-'}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION A: Patient Identification */}
          <div className="mb-2 avoid-break-inside" style={{ marginBottom: '8px' }}>
            <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
              A. Patient Identification (ข้อมูลระบุตัวผู้ป่วย)
            </div>
            <div className="space-y-0.5 text-[12.5pt]" style={{ fontSize: '12.5pt' }}>
              <div className="grid grid-cols-12 gap-1.5 pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                <div className="col-span-5" style={{ width: '41.666%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ชื่อ-สกุล:</span> <span className="font-normal">{data.fullName || '-'}</span>
                </div>
                <div className="col-span-3" style={{ width: '25%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>อายุ:</span> <span className="font-normal">{data.age ? `${data.age} ปี` : '-'}</span>
                </div>
                <div className="col-span-4" style={{ width: '33.333%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>เพศ:</span> <span className="font-normal">{data.gender || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1.5 pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: '2px' }}>
                <div className="col-span-3" style={{ width: '25%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>สถานภาพ:</span> <span className="font-normal">{data.maritalStatus || '-'}</span>
                </div>
                <div className="col-span-4" style={{ width: '33.333%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>อาชีพ:</span> <span className="font-normal">{data.occupation || '-'}</span>
                </div>
                <div className="col-span-5" style={{ width: '41.666%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ระดับการศึกษา:</span> <span className="font-normal">{data.educationLevel || '-'}</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1.5 pt-0.5 border-t border-dotted border-slate-300 pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', borderTop: '1px dotted #cbd5e1', paddingTop: '2px', marginTop: '2px' }}>
                <div className="col-span-8" style={{ width: '66.666%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ผู้ให้ข้อมูลหลัก:</span>{' '}
                  {renderCheck(data.informant === 'ผู้ป่วยเอง')} ผู้ป่วยเอง{' '}
                  {renderCheck(data.informant === 'ญาติ/ผู้ดูแล')} ญาติ/ผู้ดูแล
                  {data.informantDetail && ` (${data.informantDetail})`}
                </div>
                <div className="col-span-4" style={{ width: '33.333%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ความน่าเชื่อถือ:</span> <span className="font-normal">{data.reliability || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: Chief Complaint & HPI */}
          <div className="mb-2 avoid-break-inside" style={{ marginBottom: '8px' }}>
            <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
              B. Chief Complaint & History of Present Illness (อาการสำคัญและประวัติปัจจุบัน)
            </div>
            <div className="space-y-0.5 text-[12.5pt]" style={{ fontSize: '12.5pt' }}>
              <div>
                <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>อาการสำคัญ (CC):</span>{' '}
                <span className="font-semibold text-black" style={{ fontWeight: 'bold', color: '#000000' }}>
                  {data.chiefComplaint && data.chiefComplaint.length > 0 ? data.chiefComplaint.map(expandDoToDisorder).join(', ') : '-'}
                  {data.chiefComplaintOther && ` (${expandDoToDisorder(data.chiefComplaintOther)})`}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-1.5 pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: '2px' }}>
                <div className="col-span-4" style={{ width: '33.333%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ระยะเวลา:</span> <span className="font-normal">{data.duration || '-'}</span>
                </div>
                <div className="col-span-4" style={{ width: '33.333%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>Onset:</span> <span className="font-normal">{data.onset || '-'}</span>
                </div>
                <div className="col-span-4" style={{ width: '33.333%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>Course:</span> <span className="font-normal">{data.course || '-'}</span>
                </div>
              </div>

              {data.precipitatingFactors && data.precipitatingFactors.length > 0 && (
                <div style={{ marginTop: '2px' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ปัจจัยกระตุ้น:</span> <span className="font-normal">{data.precipitatingFactors.join(', ')}{data.precipitatingFactorsOther && ` (${data.precipitatingFactorsOther})`}</span>
                </div>
              )}

              {data.associatedSymptoms && data.associatedSymptoms.length > 0 && (
                <div style={{ marginTop: '2px' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>อาการร่วม:</span> <span className="font-normal">{data.associatedSymptoms.join(', ')}</span>
                </div>
              )}

              {data.hpiDetails && (
                <div className="p-1 bg-[#fcfcfc] border border-slate-300 rounded mt-0.5" style={{ padding: '4px', backgroundColor: '#fcfcfc', border: '1px solid #cbd5e1', borderRadius: '4px', marginTop: '2px' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>รายละเอียดประวัติปัจจุบัน (HPI):</span>
                  <p className="whitespace-pre-wrap mt-0.5 text-justify leading-snug line-clamp-4 font-normal" style={{ whiteSpace: 'pre-wrap', marginTop: '2px', textAlign: 'justify', lineHeight: 1.3, fontWeight: 'normal', margin: 0 }}>
                    {expandDoToDisorder(data.hpiDetails)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-12 gap-1.5 pt-0.5 pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', paddingTop: '2px', marginTop: '2px' }}>
                <div className="col-span-6" style={{ width: '50%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ประวัติการรักษาเดิม:</span> <span className="font-normal">{data.previousTreatment || '-'}{data.previousHospital && ` (รพ. ${data.previousHospital})`}</span>
                </div>
                <div className="col-span-6" style={{ width: '50%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>การตอบสนอง:</span> <span className="font-normal">{data.previousResponse || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION C: Psychiatric, Medical & Substance History */}
          <div className="mb-1 avoid-break-inside" style={{ marginBottom: '4px' }}>
            <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
              C. Psychiatric, Medical & Substance History (ประวัติการเจ็บป่วยและสารเสพติด)
            </div>
            <div className="space-y-0.5 text-[12.5pt]" style={{ fontSize: '12.5pt' }}>
              <div className="grid grid-cols-12 gap-1.5 pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                <div className="col-span-6" style={{ width: '50%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ประวัติจิตเวชเดิม:</span>{' '}
                  <span className={data.psychiatricHistory === 'มีประวัติ' ? 'font-semibold text-black' : 'font-normal text-slate-700'}>
                    {data.psychiatricHistory}
                    {data.psychiatricDisorders && data.psychiatricDisorders.length > 0 && (
                      <span> [{data.psychiatricDisorders.map(expandDoToDisorder).join(', ')}]</span>
                    )}
                    {data.psychiatricDisorderOther && ` (${expandDoToDisorder(data.psychiatricDisorderOther)})`}
                  </span>
                </div>
                <div className="col-span-6" style={{ width: '50%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ประวัติ Admit จิตเวช:</span>{' '}
                  <span className={data.admitHistory && data.admitHistory !== 'ไม่เคย' ? 'font-semibold text-black' : 'font-normal text-slate-700'}>
                    {data.admitHistory}
                    {data.admitLastYear && ` (ช่วง 1 ปี: ${data.admitLastYear})`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-1.5 pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: '2px' }}>
                <div className="col-span-6" style={{ width: '50%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>โรคประจำตัวทางกาย:</span>{' '}
                  <span className={data.medicalHistory === 'มีโรคประจำตัว' ? 'font-semibold text-black' : 'font-normal text-slate-700'}>
                    {data.medicalHistory}
                    {data.medicalConditions && data.medicalConditions.length > 0 && (
                      <span> [{data.medicalConditions.map(expandDoToDisorder).join(', ')}]</span>
                    )}
                    {data.medicalHistoryOther && ` (${expandDoToDisorder(data.medicalHistoryOther)})`}
                  </span>
                </div>
                <div className="col-span-6" style={{ width: '50%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ประวัติการแพ้:</span>{' '}
                  <span className={data.allergy === 'แพ้' ? 'font-bold text-black' : 'font-normal text-slate-700'}>
                    {data.allergy}
                    {data.allergyDetail && ` (แพ้: ${data.allergyDetail})`}
                  </span>
                </div>
              </div>

              <div className="pt-0.5 border-t border-dotted border-slate-300 pdf-border-t" style={{ borderTop: '1px dotted #cbd5e1', paddingTop: '2px', marginTop: '2px' }}>
                <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ประวัติสารเสพติด:</span>{' '}
                <span className="font-normal">{data.substanceHistory}</span>
                <div className="grid grid-cols-4 gap-1.5 mt-0.5 text-slate-800 pdf-grid-4" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', marginTop: '2px', color: '#1e293b' }}>
                  <div style={{ width: '25%', boxSizing: 'border-box' }}>
                    • สุรา: <span className={data.alcoholUse === 'ดื่มประจำ/ติด' || data.alcoholUse === 'เพิ่งดื่มล่าสุด < 24 ชม.' ? 'font-bold text-black' : 'font-normal'}>{data.alcoholUse || 'ปฏิเสธ'}</span>
                  </div>
                  <div style={{ width: '25%', boxSizing: 'border-box' }}>
                    • บุหรี่: <span className={data.smokingUse === 'สูบประจำ' ? 'font-bold text-black' : 'font-normal'}>{data.smokingUse || 'ปฏิเสธ'}</span>
                    {data.cigarettesPerDay && ` (${data.cigarettesPerDay} มวน/วัน)`}
                  </div>
                  <div style={{ width: '25%', boxSizing: 'border-box' }}>
                    • ยาบ้า: <span className={data.methUse === 'ปัจจุบันยังใช้' || data.methUse === 'เพิ่งใช้ล่าสุด < 24 ชม.' ? 'font-bold text-black' : 'font-normal'}>{data.methUse || 'ปฏิเสธ'}</span>
                  </div>
                  <div style={{ width: '25%', boxSizing: 'border-box' }}>
                    • อื่นๆ: <span className={data.otherSubstances && data.otherSubstances.length > 0 ? 'font-bold text-black' : 'font-normal'}>{data.otherSubstances && data.otherSubstances.length > 0 ? data.otherSubstances.join(', ') : 'ไม่มี'}</span>
                    {data.otherSubstancesDetail && ` (${data.otherSubstancesDetail})`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DocumentFooter data={data} pageNumber={pageNumber} totalPages={totalPages} />
      </div>
    </div>
  );

  const page2Fn = (pageNumber: number, totalPages: number) => (
    <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
      <div className="flex-1 flex flex-col justify-between min-h-0">
        <div className="space-y-1.5">
          <PageContinuationHeader data={data} pageNumber={pageNumber} totalPages={totalPages} />

          {/* SECTION D: Mental Status Examination (MSE) */}
          <div className="avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
              D. Mental Status Examination (การตรวจสภาพจิต - MSE)
            </div>
            
            <div className="border-t border-[#cbd5e1] text-[12pt]" style={{ borderTop: '0.5px solid #cbd5e1', fontSize: '12pt' }}>
              {/* Row 1 */}
              <div className="flex border-b border-[#cbd5e1] py-0.5 items-start" style={{ display: 'flex', width: '100%', borderBottom: '0.5px solid #cbd5e1', padding: '2px 0', alignItems: 'flex-start' }}>
                <div className="w-1/2 flex items-start pr-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingRight: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>1. Appearance:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderMseArray(data.appearanceBehavior)}
                  </div>
                </div>
                <div className="w-1/2 flex items-start pl-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>2. Speech:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderMseArray(data.speech)}
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex border-b border-[#cbd5e1] py-0.5 items-start" style={{ display: 'flex', width: '100%', borderBottom: '0.5px solid #cbd5e1', padding: '2px 0', alignItems: 'flex-start' }}>
                <div className="w-1/2 flex items-start pr-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingRight: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>3. Mood & Affect:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderMseArray(data.moodAffect)}
                  </div>
                </div>
                <div className="w-1/2 flex items-start pl-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>4. Thought Process:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderMseArray(data.thoughtProcess)}
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex border-b border-[#cbd5e1] py-0.5 items-start" style={{ display: 'flex', width: '100%', borderBottom: '0.5px solid #cbd5e1', padding: '2px 0', alignItems: 'flex-start' }}>
                <div className="w-1/2 flex items-start pr-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingRight: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>5. Thought Content:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderMseArray(data.thoughtContent)}
                    {data.delusionDetail && (
                      <div className="text-[11pt] text-black font-bold mt-0.5" style={{ fontSize: '11pt', fontWeight: 'bold', color: '#000000', marginTop: '2px' }}>
                        (Delusion: {data.delusionDetail})
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-1/2 flex items-start pl-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>6. Perception:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderMseArray(data.perception)}
                  </div>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex border-b border-[#cbd5e1] py-0.5 items-start" style={{ display: 'flex', width: '100%', borderBottom: '0.5px solid #cbd5e1', padding: '2px 0', alignItems: 'flex-start' }}>
                <div className="w-1/2 flex items-start pr-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingRight: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>7. Orientation:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderOrientation(data.orientationTime, data.orientationPlace, data.orientationPerson)}
                  </div>
                </div>
                <div className="w-1/2 flex items-start pl-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>8. Attention & Memory:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderSingleValue(data.attentionMemory)}
                  </div>
                </div>
              </div>

              {/* Row 5 */}
              <div className="flex border-b border-[#cbd5e1] py-0.5 items-start" style={{ display: 'flex', width: '100%', borderBottom: '0.5px solid #cbd5e1', padding: '2px 0', alignItems: 'flex-start' }}>
                <div className="w-1/2 flex items-start pr-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingRight: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>9. Insight:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderInsight(data.insight)}
                  </div>
                </div>
                <div className="w-1/2 flex items-start pl-2" style={{ width: '50%', display: 'flex', alignItems: 'flex-start', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal w-[125px] shrink-0 text-slate-800 leading-tight" style={{ width: '125px', flexShrink: 0, color: '#1e293b' }}>10. Judgment:</span>
                  <div className="flex-1 leading-tight text-justify" style={{ flex: '1 1 0%' }}>
                    {renderSingleValue(data.judgment)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION E: Safety & Risk Assessment */}
          <div className="avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
              E. Safety & Risk Assessment (การประเมินความเสี่ยงและความปลอดภัย)
            </div>
            <div className="grid grid-cols-12 gap-1.5 text-[12.5pt] pdf-grid-12" style={{ display: 'flex', flexWrap: 'wrap', width: '100%', fontSize: '12.5pt' }}>
              <div className="col-span-6 p-0.5 px-1.5 border border-slate-300 rounded bg-[#fcfcfc]" style={{ width: '50%', padding: '2px 6px', border: '1px solid #cbd5e1', backgroundColor: '#fcfcfc', boxSizing: 'border-box' }}>
                <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>1. ความเสี่ยงฆ่าตัวตาย/ทำร้ายตนเอง:</span>{' '}
                <span className={data.suicideRisk && data.suicideRisk !== 'No Risk' && data.suicideRisk !== 'Low Risk' ? 'font-bold text-black underline' : 'font-normal text-slate-700'}>
                  {data.suicideRisk || 'No Risk'}
                </span>
              </div>
              <div className="col-span-6 p-0.5 px-1.5 border border-slate-300 rounded bg-[#fcfcfc]" style={{ width: '50%', padding: '2px 6px', border: '1px solid #cbd5e1', backgroundColor: '#fcfcfc', boxSizing: 'border-box' }}>
                <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>2. ความเสี่ยงก้าวร้าวรุนแรง (Violence):</span>{' '}
                <span className={data.violenceRisk && data.violenceRisk !== 'No Risk' && data.violenceRisk !== 'Low Risk' ? 'font-bold text-black underline' : 'font-normal text-slate-700'}>
                  {data.violenceRisk || 'No Risk'}
                </span>
              </div>
              {data.otherRisks && data.otherRisks.length > 0 && (
                <div className="col-span-12" style={{ width: '100%', boxSizing: 'border-box', marginTop: '2px' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ความเสี่ยงอื่นๆ:</span> <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>{data.otherRisks.join(', ')}</span>
                </div>
              )}
              {data.safetyPlan && data.safetyPlan.length > 0 && (
                <div className="col-span-12 p-0.5 px-1.5 bg-[#fffdf0] border border-amber-300 rounded" style={{ width: '100%', padding: '2px 6px', backgroundColor: '#fffdf0', border: '1px solid #fcd34d', borderRadius: '4px', boxSizing: 'border-box', marginTop: '2px' }}>
                  <span className="font-normal text-[#451a03]" style={{ color: '#451a03' }}>Safety Plan:</span>{' '}
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>
                    {data.safetyPlan.join(', ')}
                    {data.safetyPlanOther && ` (${data.safetyPlanOther})`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* SECTION F: Physical & Functional Assessment */}
          <div className="avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
              F. Physical & Functional Assessment
            </div>
            <div className="space-y-0.5 text-[12.5pt]" style={{ fontSize: '12.5pt' }}>
              <div className="p-0.5 border border-slate-300 rounded bg-[#fcfcfc] grid grid-cols-6 gap-1 text-center text-[11.5pt] pdf-grid-6" style={{ display: 'flex', width: '100%', border: '1px solid #cbd5e1', backgroundColor: '#fcfcfc', textAlign: 'center', fontSize: '11.5pt', padding: '2px 4px' }}>
                <div style={{ width: '16.666%' }}>BP: <span className="font-normal">{data.bpSys && data.bpDia ? `${data.bpSys}/${data.bpDia}` : '-'}</span> mmHg</div>
                <div style={{ width: '16.666%' }}>PR: <span className="font-normal">{data.pulseRate || '-'}</span> bpm</div>
                <div style={{ width: '16.666%' }}>RR: <span className="font-normal">{data.respRate || '-'}</span> /min</div>
                <div style={{ width: '16.666%' }}>Temp: <span className="font-normal">{data.temperature || '-'}</span> °C</div>
                <div style={{ width: '16.666%' }}>SpO2: <span className="font-normal">{data.spo2 || '-'}</span> %</div>
                <div style={{ width: '16.666%' }}>Pain: <span className="font-normal">{data.painScore || '-'}</span></div>
              </div>

              <div className="grid grid-cols-12 gap-x-2 text-[12pt] pdf-grid-12" style={{ display: 'flex', width: '100%', fontSize: '12pt', marginTop: '2px' }}>
                <div className="col-span-5 space-y-0.5" style={{ width: '41.666%', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800 block" style={{ color: '#1e293b', display: 'block' }}>Physical Exam:</span>
                  <div>• GA: <span className={data.generalAppearance && data.generalAppearance !== 'Normal' ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.generalAppearance || '-'}{data.generalAppearanceDetail && ` (${data.generalAppearanceDetail})`}</span></div>
                  <div>• HEENT: <span className={data.heent && data.heent !== 'Normal' ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.heent || '-'}{data.heentDetail && ` (${data.heentDetail})`}</span></div>
                  <div>• CVS/RS: <span className={data.cvsRs && data.cvsRs !== 'Normal' ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.cvsRs || '-'}{data.cvsRsDetail && ` (${data.cvsRsDetail})`}</span></div>
                  <div>• Abd: <span className={data.abdomen && data.abdomen !== 'Normal' ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.abdomen || '-'}{data.abdomenDetail && ` (${data.abdomenDetail})`}</span>, Ext: <span className={data.extremities && data.extremities !== 'Normal' ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.extremities || '-'}</span></div>
                </div>
                <div className="col-span-7 space-y-0.5 border-l border-slate-200 pl-2" style={{ width: '58.333%', borderLeft: '1px solid #e2e8f0', paddingLeft: '8px', boxSizing: 'border-box' }}>
                  <span className="font-normal text-slate-800 block" style={{ color: '#1e293b', display: 'block' }}>Neurological Exam:</span>
                  <div>• CN: <span className={data.cranialNerves && !data.cranialNerves.toLowerCase().includes('intact') ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.cranialNerves || 'Intact'}{data.cranialNervesDetail && ` (${data.cranialNervesDetail})`}</span></div>
                  <div>• Motor Power: <span className={data.motorPower && !data.motorPower.includes('Grade V') ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.motorPower || data.motorSensory || 'Grade V all'}{data.motorPowerDetail && ` (${data.motorPowerDetail})`}</span></div>
                  <div>• Tone: <span className="font-normal text-slate-700" style={{ color: '#334155' }}>{data.tone || 'Normal'}</span> | Sensory: <span className="font-normal text-slate-700" style={{ color: '#334155' }}>{data.sensory || 'Intact'}{data.sensoryDetail && ` (${data.sensoryDetail})`}</span></div>
                  <div>
                    • Reflex: <span className="font-normal text-slate-700" style={{ color: '#334155' }}>{data.reflexes || data.reflexesCerebellar || 'Normal'}{data.reflexesDetail && ` (${data.reflexesDetail})`}</span>
                    {' | '}Cerebellar: <span className="font-normal text-slate-700" style={{ color: '#334155' }}>{data.cerebellar || 'Normal'}{data.cerebellarDetail && ` (${data.cerebellarDetail})`}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5 border-t border-dotted border-slate-300 pdf-grid-2" style={{ display: 'flex', width: '100%', borderTop: '1px dotted #cbd5e1', paddingTop: '2px', marginTop: '2px' }}>
                <div style={{ width: '50%', boxSizing: 'border-box' }}><span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>โภชนาการ:</span> <span className={data.nutrition && data.nutrition !== 'Normal' ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.nutrition || '-'}</span></div>
                <div style={{ width: '50%', boxSizing: 'border-box' }}><span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>กิจวัตรประจำวัน (ADL):</span> <span className={data.adl && data.adl !== 'Independent' ? 'font-bold text-black' : 'font-normal text-slate-700'}>{data.adl || '-'}</span></div>
              </div>
            </div>
          </div>

          {/* SECTION G & H: Psychosocial & Standardized Assessment */}
          <div className="avoid-break-inside">
            <div className="border-b border-black pb-0.5 mb-1 text-black font-normal text-[12.5pt]" style={{ borderBottom: '1px solid #000000', paddingBottom: '2px', marginBottom: '4px', fontSize: '12.5pt', color: '#000000' }}>
              G. Psychosocial & H. Standardized Assessment (จิตสังคมและแบบประเมินมาตรฐาน)
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12.5pt] pdf-grid-2" style={{ display: 'flex', width: '100%', fontSize: '12.5pt' }}>
              <div style={{ width: '50%', paddingRight: '6px', boxSizing: 'border-box' }}>
                <div>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>Psychosocial Stressors:</span>{' '}
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>
                    {data.psychosocialStressors && data.psychosocialStressors.length > 0 ? data.psychosocialStressors.join(', ') : 'ไม่มี'}
                  </span>
                </div>
                <div style={{ marginTop: '2px' }}>
                  <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>สภาพแวดล้อมที่อยู่:</span> <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>{data.livingEnvironment || '-'}{data.livingEnvironmentDetail && ` (${data.livingEnvironmentDetail})`}</span>
                </div>
              </div>
              <div style={{ width: '50%', paddingLeft: '6px', boxSizing: 'border-box' }}>
                <span className="font-normal text-slate-800" style={{ color: '#1e293b' }}>ผลแบบประเมินมาตรฐาน:</span>
                {data.standardizedAssessmentStatus === 'ไม่ได้ประเมิน' ? (
                  <span className="ml-1 text-slate-600 font-normal" style={{ marginLeft: '4px', color: '#475569' }}>ไม่ได้ประเมิน</span>
                ) : (
                  <div className="space-y-0.5 mt-0.5 text-slate-800" style={{ color: '#1e293b', marginTop: '2px' }}>
                    {data.phq9Score && <div>• PHQ-9: <span className={Number(data.phq9Score) >= 10 ? 'font-bold text-black' : 'font-normal'}>{data.phq9Score}</span> คะแนน</div>}
                    {data.nineQScore && <div>• 9Q: <span className={Number(data.nineQScore) >= 7 ? 'font-bold text-black' : 'font-normal'}>{data.nineQScore}</span> คะแนน</div>}
                    {data.mmseMocaScore && <div>• MMSE/MoCA: <span className={Number(data.mmseMocaScore) < 24 ? 'font-bold text-black' : 'font-normal'}>{data.mmseMocaScore}</span> คะแนน</div>}
                    {data.otherToolName && (
                      <div>• {data.otherToolName}: <span className="font-normal">{data.otherToolScore}</span> คะแนน</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DocumentFooter data={data} pageNumber={pageNumber} totalPages={totalPages} />
      </div>
    </div>
  );

  const pages = React.useMemo(() => {
    if (hasPage4) {
      return [
        page1Fn,
        page2Fn,
        (pageNumber: number, totalPages: number) => (
          <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
            <div className="flex-1 flex flex-col justify-between min-h-0">
              <div className="space-y-2">
                <PageContinuationHeader data={data} pageNumber={pageNumber} totalPages={totalPages} />
                {renderSectionI()}
                {renderSectionJ()}
                {renderSectionK()}
                {renderSectionL()}
              </div>
              <DocumentFooter data={data} pageNumber={pageNumber} totalPages={totalPages} />
            </div>
          </div>
        ),
        (pageNumber: number, totalPages: number) => (
          <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
            <div className="flex-1 flex flex-col justify-between min-h-0">
              <div className="space-y-3">
                <PageContinuationHeader data={data} pageNumber={pageNumber} totalPages={totalPages} />
                {renderSectionM()}
                {renderSignature()}
              </div>
              <DocumentFooter data={data} pageNumber={pageNumber} totalPages={totalPages} />
            </div>
          </div>
        ),
      ];
    }

    return [
      page1Fn,
      page2Fn,
      (pageNumber: number, totalPages: number) => (
        <div className="a4-page-sheet shadow-xl print:shadow-none" style={pageSheetStyle}>
          <div className="flex-1 flex flex-col justify-between min-h-0">
            <div className="space-y-1.5">
              <PageContinuationHeader data={data} pageNumber={pageNumber} totalPages={totalPages} />
              {renderSectionI()}
              {renderSectionJ()}
              {renderSectionK()}
              {renderSectionL()}
              {renderSectionM()}
              {renderSignature()}
            </div>
            <DocumentFooter data={data} pageNumber={pageNumber} totalPages={totalPages} />
          </div>
        </div>
      ),
    ];
  }, [data, hasPage4]);

  const totalPagesCount = pages.length;

  return (
    <div
      id={id || "psychiatric-assessment-pdf-document"}
      data-fullname={data.fullName || ''}
      data-age={data.age || ''}
      data-gender={data.gender || ''}
      data-hn={data.hn || ''}
      data-an={data.an || ''}
      className="sarabun-document bg-transparent text-black mx-auto flex flex-col items-center gap-6 print:gap-0"
    >
      <style dangerouslySetInnerHTML={{ __html: embeddedPdfStyles }} />
      {pages.map((renderPage, index) => {
        const pageNumber = index + 1;
        return (
          <div key={pageNumber} className="w-full flex flex-col items-center">
            {showPageBadges && (
              <div
                className="w-[210mm] text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between no-print px-1"
                data-html2canvas-ignore="true"
              >
                <span className="bg-slate-700/80 text-slate-200 px-3 py-1 rounded-full text-xs font-medium shadow-xs">
                  หน้า {pageNumber} จาก {totalPagesCount}
                </span>
              </div>
            )}
            {renderPage(pageNumber, totalPagesCount)}
          </div>
        );
      })}
    </div>
  );
};

export const AssessmentPdfDocument = React.memo(AssessmentPdfDocumentComponent);
