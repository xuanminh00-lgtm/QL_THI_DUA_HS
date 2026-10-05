import React from 'react';
import {
  FileText,
  Printer,
  CheckCircle2,
  X,
  Send,
  Calendar,
  UserCheck,
  Building,
  AlertTriangle,
  Award,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { OFFICIAL_GRADING_CRITERIA, OfficialCriterion } from '../data/officialGradingCriteria';

export interface ScoreSheetData {
  weekNumber: number;
  startDate?: string;
  endDate?: string;
  date: string;
  dayOfWeek: string;
  shift: 'Sáng' | 'Chiều';
  classId: string;
  className: string;
  gradeLevel?: string;
  redFlagId: string;
  redFlagName: string;
  redFlagClass?: string;
  generalNote?: string;
  isRainyDayShoes?: boolean;
  isRainyDayWatering?: boolean;
  // Map of criterionId -> { deducted: number, violations: { name: string; count: number; studentNames?: string; note?: string }[] }
  criteriaResults: Record<
    string,
    {
      deducted: number;
      details: string[];
      studentNames?: string;
    }
  >;
  totalDeduction: number;
  finalScore: number; // 50 - totalDeduction
  status?: 'draft' | 'pending' | 'approved' | 'revision_requested' | 'rejected';
}

interface Props {
  data: ScoreSheetData;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend?: (updatedData?: ScoreSheetData) => void;
  isSubmitting?: boolean;
  isViewOnly?: boolean;
}

export const OfficialScoreSheetModal: React.FC<Props> = ({
  data,
  isOpen,
  onClose,
  onConfirmSend,
  isSubmitting = false,
  isViewOnly = false,
}) => {
  const [sheetData, setSheetData] = React.useState<ScoreSheetData>(data);

  React.useEffect(() => {
    setSheetData(data);
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDeductionChange = (critId: string, val: number) => {
    setSheetData((prev) => {
      const crit = OFFICIAL_GRADING_CRITERIA.find((c) => c.id === critId);
      const maxPts = crit ? crit.maxPoints : critId === 'crit-10' ? 8 : 5;
      const cleanVal = Math.max(0, Math.min(maxPts, isNaN(val) ? 0 : val));

      const updatedResults = {
        ...prev.criteriaResults,
        [critId]: {
          ...(prev.criteriaResults[critId] || { details: [] }),
          deducted: cleanVal,
          details:
            cleanVal > 0
              ? prev.criteriaResults[critId]?.details?.length
                ? prev.criteriaResults[critId].details
                : [`Trừ trực tiếp ${cleanVal}đ`]
              : [],
        },
      };

      const newTotalDeduction = Object.values(updatedResults).reduce(
        (sum, item) => sum + (item.deducted || 0),
        0
      );
      const newFinalScore = Math.max(0, 50 - newTotalDeduction);

      return {
        ...prev,
        criteriaResults: updatedResults,
        totalDeduction: newTotalDeduction,
        finalScore: newFinalScore,
      };
    });
  };

  const handleRemainingChange = (critId: string, val: number) => {
    setSheetData((prev) => {
      const crit = OFFICIAL_GRADING_CRITERIA.find((c) => c.id === critId);
      const maxPts = crit ? crit.maxPoints : critId === 'crit-10' ? 8 : 5;
      const cleanRemaining = Math.max(0, Math.min(maxPts, isNaN(val) ? 0 : val));
      const cleanDeduction = Math.max(0, maxPts - cleanRemaining);

      const updatedResults = {
        ...prev.criteriaResults,
        [critId]: {
          ...(prev.criteriaResults[critId] || { details: [] }),
          deducted: cleanDeduction,
          details:
            cleanDeduction > 0
              ? prev.criteriaResults[critId]?.details?.length
                ? prev.criteriaResults[critId].details
                : [`Trừ trực tiếp ${cleanDeduction}đ`]
              : [],
        },
      };

      const newTotalDeduction = Object.values(updatedResults).reduce(
        (sum, item) => sum + (item.deducted || 0),
        0
      );
      const newFinalScore = Math.max(0, 50 - newTotalDeduction);

      return {
        ...prev,
        criteriaResults: updatedResults,
        totalDeduction: newTotalDeduction,
        finalScore: newFinalScore,
      };
    });
  };

  const handleStudentNameChange = (critId: string, name: string) => {
    setSheetData((prev) => ({
      ...prev,
      criteriaResults: {
        ...prev.criteriaResults,
        [critId]: {
          ...(prev.criteriaResults[critId] || { deducted: 0, details: [] }),
          studentNames: name,
        },
      },
    }));
  };

  const handleGeneralNoteChange = (note: string) => {
    setSheetData((prev) => ({
      ...prev,
      generalNote: note,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Modal Header Controls */}
        <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-3.5 sm:p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{isViewOnly ? 'CHI TIẾT PHIẾU CHẤM CỦA CỜ ĐỎ' : 'XEM TRƯỚC PHIẾU CHẤM CỜ ĐỎ'}</span>
                {!isViewOnly && (
                  <span className="bg-amber-400 text-blue-950 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                    Trước khi gửi
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-blue-200">
                Thang điểm 50 điểm/ngày (300 điểm/tuần 6 ngày) — Trường PTDTBT TH&THCS Quản Bạ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer border border-white/20"
              title="In phiếu chấm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In phiếu</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Printed / Formal Score Sheet Layout */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 print:p-0 print:overflow-visible">
          {/* Paper Frame */}
          <div className="border-2 border-slate-300 rounded-xl p-4 sm:p-6 bg-white shadow-xs space-y-4 print:border-none print:shadow-none">
            {/* National & School Emblem Header */}
            <div className="text-center space-y-1 pb-3 border-b-2 border-slate-800">
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wide">
                <span>HỘI ĐỒNG ĐỘI HUYỆN QUẢN BẠ</span>
                <span>ĐỘI TNTP HỒ CHÍ MINH</span>
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-600">
                <span>LIÊN ĐỘI TRƯỜNG PTDTBT TH&THCS QUẢN BẠ</span>
                <span className="italic font-normal">Quản Bạ, năm học 2026 – 2027</span>
              </div>
              <div className="pt-2">
                <h1 className="text-base sm:text-xl font-black text-blue-950 uppercase tracking-tight">
                  PHIẾU CHẤM ĐIỂM THI ĐUA NỀ NẾP HÀNG NGÀY
                </h1>
                <p className="text-xs sm:text-sm font-bold text-rose-600 uppercase mt-0.5">
                  THANG ĐIỂM: 50 ĐIỂM / NGÀY (300 ĐIỂM / TUẦN 6 NGÀY)
                </p>
                <p className="text-[11px] text-slate-500 italic mt-0.5">
                  I. Nội quy, quy định nề nếp Liên đội
                </p>
              </div>
            </div>

            {/* Meta Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Tuần thi đua:</span>
                <p className="font-bold text-slate-900">
                  Tuần {sheetData.weekNumber}
                  {sheetData.startDate && <span className="font-normal text-slate-500 text-[11px]"> ({sheetData.startDate} – {sheetData.endDate})</span>}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Ngày chấm / Buổi:</span>
                <p className="font-bold text-blue-900">
                  {sheetData.dayOfWeek} ({sheetData.date}) — Ca {sheetData.shift}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Lớp được chấm:</span>
                <p className="font-black text-amber-900 text-sm">
                  Lớp {sheetData.className}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">Cờ đỏ chấm:</span>
                <p className="font-bold text-emerald-900">
                  {sheetData.redFlagName} {sheetData.redFlagClass ? `(Lớp ${sheetData.redFlagClass})` : ''}
                </p>
              </div>
            </div>

            {/* Weather / Special conditions if active */}
            {(sheetData.isRainyDayShoes || sheetData.isRainyDayWatering) && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs flex items-center gap-2 text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="space-x-3">
                  <span className="font-bold">Ghi nhận điều kiện thời tiết:</span>
                  {sheetData.isRainyDayShoes && (
                    <span className="inline-flex items-center gap-1 font-semibold text-blue-800">
                      • Ngày mưa (miễn trừ điểm đi giày)
                    </span>
                  )}
                  {sheetData.isRainyDayWatering && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                      • Ngày mưa (miễn tưới cây măng non)
                    </span>
                  )}
                </div>
              </div>
            )}

            {!isViewOnly && (
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs flex items-start gap-2.5 text-blue-950 shadow-2xs">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">
                    Sửa trực tiếp điểm trên ô dữ liệu của phiếu chấm:
                  </p>
                  <p className="text-[11px] text-blue-800 mt-0.5">
                    Bạn có thể gõ sửa trực tiếp điểm ở cả cột <strong>"Trừ"</strong> hoặc cột <strong>"Còn lại"</strong>. Hệ thống sẽ tự động bù trừ và tính toán lại toàn bộ tổng điểm, điểm trừ và xếp loại theo thời gian thực!
                  </p>
                </div>
              </div>
            )}

            {/* 9 Criteria Table according to Official Document */}
            <div className="overflow-x-auto border border-slate-300 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                    <th className="py-2.5 px-3 w-12 text-center border-r border-slate-300">STT</th>
                    <th className="py-2.5 px-3 min-w-[180px] border-r border-slate-300">
                      Nội dung tiêu chí nề nếp
                    </th>
                    <th className="py-2.5 px-2.5 w-16 text-center border-r border-slate-300">
                      Chuẩn
                    </th>
                    <th className="py-2.5 px-3 border-r border-slate-300 min-w-[200px]">
                      Ghi nhận vi phạm & Đội viên
                    </th>
                    <th className="py-2.5 px-2.5 w-24 text-center border-r border-slate-300 bg-rose-50/80">
                      <span>Trừ</span>
                      {!isViewOnly && <span className="text-[10px] text-rose-700 font-bold block">(Sửa ô)</span>}
                    </th>
                    <th className="py-2.5 px-2.5 w-24 text-center bg-emerald-50/80">
                      <span>Còn lại</span>
                      {!isViewOnly && <span className="text-[10px] text-emerald-800 font-bold block">(Sửa ô)</span>}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {OFFICIAL_GRADING_CRITERIA.map((crit) => {
                    const res = sheetData.criteriaResults[crit.id] || { deducted: 0, details: [] };
                    const hasViolation = res.deducted > 0;
                    const remaining = Math.max(0, crit.maxPoints - res.deducted);

                    return (
                      <tr key={crit.id} className={hasViolation ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">
                          {crit.order}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          <p className="font-bold text-slate-900">
                            {crit.order}. {crit.name}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{crit.description}</p>
                          {crit.dutyDays && (
                            <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                              Kiểm tra: {crit.dutyDays.join(', ')}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-2.5 text-center font-bold text-slate-700 border-r border-slate-200 tabular-nums">
                          {crit.maxPoints} đ
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-200">
                          {isViewOnly ? (
                            hasViolation ? (
                              <div className="space-y-1">
                                {res.details.map((d, i) => (
                                  <p key={i} className="text-rose-700 font-medium text-[11px] flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                                    <span>{d}</span>
                                  </p>
                                ))}
                                {res.studentNames && (
                                  <p className="text-[11px] text-slate-600 italic">
                                    Học sinh: <strong>{res.studentNames}</strong>
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>Thực hiện tốt, đầy đủ</span>
                              </span>
                            )
                          ) : (
                            <div className="space-y-1.5">
                              {res.details.length > 0 && (
                                <div className="space-y-0.5">
                                  {res.details.map((d, i) => (
                                    <p key={i} className="text-rose-700 text-[11px] flex items-center gap-1">
                                      <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0"></span>
                                      <span>{d}</span>
                                    </p>
                                  ))}
                                </div>
                              )}
                              <input
                                type="text"
                                placeholder="Ghi họ tên học sinh vi phạm..."
                                value={res.studentNames || ''}
                                onChange={(e) => handleStudentNameChange(crit.id, e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                                title="Sửa trực tiếp tên học sinh trên phiếu"
                              />
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-2.5 text-center border-r border-slate-200 bg-rose-50/30 tabular-nums">
                          {isViewOnly ? (
                            <span className="font-bold text-rose-600">
                              {hasViolation ? `-${res.deducted}` : '0'}
                            </span>
                          ) : (
                            <div className="inline-flex items-center justify-center gap-0.5">
                              <span className="font-bold text-rose-600">-</span>
                              <input
                                type="number"
                                min="0"
                                max={crit.maxPoints}
                                step="0.5"
                                value={res.deducted}
                                onChange={(e) => handleDeductionChange(crit.id, parseFloat(e.target.value) || 0)}
                                className="w-14 py-1 text-center font-black text-rose-700 bg-white border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-xs shadow-2xs hover:border-rose-400"
                                title="Sửa trực tiếp điểm trừ của ô dữ liệu này"
                              />
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-2.5 text-center bg-emerald-50/30 tabular-nums">
                          {isViewOnly ? (
                            <span className="font-black text-slate-900">{remaining} đ</span>
                          ) : (
                            <div className="inline-flex items-center justify-center gap-0.5">
                              <input
                                type="number"
                                min="0"
                                max={crit.maxPoints}
                                step="0.5"
                                value={remaining}
                                onChange={(e) => handleRemainingChange(crit.id, parseFloat(e.target.value) || 0)}
                                className="w-14 py-1 text-center font-black text-emerald-800 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs shadow-2xs hover:border-emerald-400"
                                title="Sửa trực tiếp điểm còn lại (điểm đạt) của ô dữ liệu này"
                              />
                              <span className="text-[11px] text-emerald-800 font-bold">đ</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Kỷ luật & Nề nếp chung (8 điểm) để đạt đúng thang điểm 50 điểm/ngày */}
                  <tr className="bg-slate-50/70 border-t border-slate-300">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-600 border-r border-slate-200">
                      10
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      <p className="font-bold text-slate-900">10. Nề nếp & Kỷ luật chung</p>
                      <p className="text-[11px] text-slate-500">
                        Chấp hành nội quy, không gây mất trật tự trường lớp, đoàn kết nội bộ
                      </p>
                    </td>
                    <td className="py-2.5 px-2.5 text-center font-bold text-slate-700 border-r border-slate-200 tabular-nums">
                      8 đ
                    </td>
                    <td className="py-2.5 px-3 border-r border-slate-200">
                      {isViewOnly ? (
                        <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Đạt chuẩn định mức chung</span>
                        </span>
                      ) : (
                        <input
                          type="text"
                          placeholder="Ghi chú kỷ luật..."
                          value={sheetData.criteriaResults['crit-10']?.studentNames || ''}
                          onChange={(e) => handleStudentNameChange('crit-10', e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      )}
                    </td>
                    <td className="py-2.5 px-2.5 text-center border-r border-slate-200 bg-rose-50/30 tabular-nums">
                      {isViewOnly ? (
                        <span className="font-bold text-slate-400">
                          {sheetData.criteriaResults['crit-10']?.deducted ? `-${sheetData.criteriaResults['crit-10'].deducted}` : '0'}
                        </span>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-0.5">
                          <span className="font-bold text-rose-600">-</span>
                          <input
                            type="number"
                            min="0"
                            max="8"
                            step="0.5"
                            value={sheetData.criteriaResults['crit-10']?.deducted || 0}
                            onChange={(e) => handleDeductionChange('crit-10', parseFloat(e.target.value) || 0)}
                            className="w-14 py-1 text-center font-black text-rose-700 bg-white border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 text-xs shadow-2xs"
                            title="Sửa trực tiếp điểm trừ nề nếp chung"
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-2.5 text-center bg-emerald-50/30 tabular-nums">
                      {isViewOnly ? (
                        <span className="font-black text-slate-900">
                          {Math.max(0, 8 - (sheetData.criteriaResults['crit-10']?.deducted || 0))} đ
                        </span>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-0.5">
                          <input
                            type="number"
                            min="0"
                            max="8"
                            step="0.5"
                            value={Math.max(0, 8 - (sheetData.criteriaResults['crit-10']?.deducted || 0))}
                            onChange={(e) => handleRemainingChange('crit-10', parseFloat(e.target.value) || 0)}
                            className="w-14 py-1 text-center font-black text-emerald-800 bg-white border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-xs shadow-2xs hover:border-emerald-400"
                            title="Sửa trực tiếp điểm còn lại nề nếp chung"
                          />
                          <span className="text-[11px] text-emerald-800 font-bold">đ</span>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>

                {/* Table Footer: Total Summary */}
                <tfoot>
                  <tr className="bg-amber-50 font-black text-slate-900 border-t-2 border-slate-400 text-xs sm:text-sm">
                    <td colSpan={2} className="py-3 px-3 text-right uppercase border-r border-slate-300">
                      TỔNG ĐIỂM CHUẨN ĐỊNH MỨC TRONG NGÀY:
                    </td>
                    <td className="py-3 px-2.5 text-center text-blue-900 border-r border-slate-300 tabular-nums">
                      50 đ
                    </td>
                    <td className="py-3 px-3 text-right uppercase text-rose-700 border-r border-slate-300">
                      TỔNG ĐIỂM TRỪ:
                    </td>
                    <td className="py-3 px-2.5 text-center text-rose-700 border-r border-slate-300 tabular-nums text-sm font-black">
                      -{sheetData.totalDeduction} đ
                    </td>
                    <td className="py-3 px-2.5 text-center bg-amber-100 text-blue-950 font-black text-sm sm:text-base tabular-nums">
                      {sheetData.finalScore} / 50 đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Note & Remarks Section */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <span className="font-bold text-slate-800 uppercase text-[11px]">
                Nhận xét & Kiến nghị của Cờ đỏ trực ban:
              </span>
              {isViewOnly ? (
                <p className="text-slate-700 italic">
                  {sheetData.generalNote ? sheetData.generalNote : 'Lớp thực hiện nghiêm túc nội quy nề nếp buổi trực.'}
                </p>
              ) : (
                <textarea
                  rows={2}
                  value={sheetData.generalNote || ''}
                  onChange={(e) => handleGeneralNoteChange(e.target.value)}
                  placeholder="Nhập nhận xét của Cờ đỏ..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            {/* Signatures Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-center text-xs border-t border-slate-200">
              <div className="space-y-10">
                <div>
                  <p className="font-bold uppercase text-slate-800">ĐẠI DIỆN LỚP ĐƯỢC CHẤM</p>
                  <p className="text-[11px] text-slate-500 italic">(Lớp trưởng / Bí thư ký)</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-xs">Chi đội Lớp {data.className}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    Xác nhận kết quả
                  </span>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <p className="font-bold uppercase text-slate-800">CỜ ĐỎ CHẤM ĐIỂM</p>
                  <p className="text-[11px] text-slate-500 italic">(Ký, ghi rõ họ tên)</p>
                </div>
                <div>
                  <p className="font-black text-blue-950 text-sm">{data.redFlagName}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ✓ Đã lập phiếu chấm
                  </span>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <p className="font-bold uppercase text-slate-800">TỔNG PHỤ TRÁCH ĐỘI</p>
                  <p className="text-[11px] text-slate-500 italic">(Xem xét và phê duyệt)</p>
                </div>
                <div>
                  <p className="font-bold text-slate-500 italic text-xs">
                    {data.status === 'approved'
                      ? 'Thầy Nguyễn Văn Thành (Đã duyệt)'
                      : data.status === 'rejected'
                      ? 'Thầy Nguyễn Văn Thành (Đã từ chối)'
                      : data.status === 'revision_requested'
                      ? 'Thầy Nguyễn Văn Thành (Yêu cầu sửa lại)'
                      : '[Chờ Tổng phụ trách duyệt]'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
            >
              {isViewOnly ? 'Đóng' : 'Quay lại chỉnh sửa'}
            </button>
            <button
              onClick={handlePrint}
              className="sm:hidden px-3 py-2 rounded-xl border border-slate-300 text-slate-700 bg-white text-xs font-semibold"
            >
              In phiếu
            </button>
          </div>

          {!isViewOnly && onConfirmSend && (
            <button
              onClick={() => onConfirmSend(sheetData)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>XÁC NHẬN & GỬI PHIẾU CHẤM CHO TỔNG PHỤ TRÁCH</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
