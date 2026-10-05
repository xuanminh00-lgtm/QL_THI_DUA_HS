import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClassWeeklySummary } from '../types';
import {
  Trophy,
  Download,
  Printer,
  FileSpreadsheet,
  Award,
  Medal,
  CheckCircle2,
  Sparkles,
  Filter,
  Eye,
  Info,
  School,
} from 'lucide-react';

export const RankingsView: React.FC = () => {
  const { classRankings, currentWeek, selectedWeekId, weeks, setSelectedWeekId } = useApp();

  // Core Level Filter: 'all' | 'thcs' (6-9) | 'tieuhoc' (1-5)
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'thcs' | 'tieuhoc'>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('week');
  const [selectedClassDetail, setSelectedClassDetail] = useState<ClassWeeklySummary | null>(null);

  // Step 1: Filter and Re-rank by educational level (THCS 6-9, Tiểu học 1-5, or All)
  const levelRankings = useMemo(() => {
    let list = classRankings;
    if (selectedLevel === 'thcs') {
      list = classRankings.filter((c) => Number(c.grade) >= 6 && Number(c.grade) <= 9);
    } else if (selectedLevel === 'tieuhoc') {
      list = classRankings.filter((c) => Number(c.grade) >= 1 && Number(c.grade) <= 5);
    }

    // Re-rank within the selected level
    return list
      .slice()
      .sort((a, b) => b.finalScore - a.finalScore)
      .map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));
  }, [classRankings, selectedLevel]);

  // Step 2: Further filter by individual grade
  const filteredRankings = useMemo(() => {
    if (selectedGrade === 'all') return levelRankings;
    return levelRankings.filter((c) => c.grade === selectedGrade);
  }, [levelRankings, selectedGrade]);

  const getRatingBadge = (rating: ClassWeeklySummary['rating']) => {
    switch (rating) {
      case 'Xuất sắc':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Tốt':
        return 'bg-blue-50 text-blue-800 border-blue-300 font-semibold';
      case 'Khá':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
      case 'Trung bình':
        return 'bg-purple-50 text-purple-800 border-purple-300 font-medium';
      default:
        return 'bg-rose-50 text-rose-800 border-rose-300 font-medium';
    }
  };

  const handleExportExcel = () => {
    const headers = ['Hạng,Lớp,Khối,GVCN,Điểm nền,Tổng điểm trừ,Tổng điểm cộng,Điểm tổng kết,Xếp loại\n'];
    const rows = filteredRankings.map(
      (c) =>
        `${c.rank},"${c.className}","Khối ${c.grade}","${c.homeroomTeacher}",${c.baseScore},-${c.totalDeductions},+${c.totalBonuses},${c.finalScore},"${c.rating}"\n`
    );
    const blob = new Blob(['\uFEFF' + headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bang_xep_hang_thi_dua_${selectedLevel}_Tuan_${currentWeek?.weekNumber || 4}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  // Podium Top 3 classes
  const top1 = filteredRankings[0];
  const top2 = filteredRankings[1];
  const top3 = filteredRankings[2];

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-lg font-black text-white">KẾT QUẢ – XẾP HẠNG THI ĐUA NỀ NẾP</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Tuần {currentWeek?.weekNumber || 4} ({new Date(currentWeek?.startDate || '2026-09-28').toLocaleDateString('vi-VN')} –{' '}
            {new Date(currentWeek?.endDate || '2026-10-04').toLocaleDateString('vi-VN')}) · Trường PTDTBT TH&THCS Quản Bạ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Xuất Excel
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            In / Xuất PDF
          </button>
        </div>
      </div>

      {/* Filter Row: Level & Grade & Period */}
      <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-3 print:hidden">
        {/* Row 1: Level Tabs (Toàn trường, Khối THCS từ lớp 6-9, Khối Tiểu học từ lớp 1-5) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-blue-100">
          <div className="flex items-center gap-1.5 bg-blue-50/80 p-1 rounded-xl border border-blue-200">
            <button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevel === 'all'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-900 hover:bg-blue-100'
              }`}
            >
              Toàn trường ({classRankings.length} lớp)
            </button>
            <button
              onClick={() => {
                setSelectedLevel('thcs');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedLevel === 'thcs'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-900 hover:bg-blue-100'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>Khối THCS (Lớp 6–9)</span>
            </button>
            <button
              onClick={() => {
                setSelectedLevel('tieuhoc');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedLevel === 'tieuhoc'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-900 hover:bg-blue-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Khối Tiểu học (Lớp 1–5)</span>
            </button>
          </div>

          {/* Period Filter (Tuần, Tháng, Học kỳ, Cả năm) */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-blue-900">Kỳ xếp hạng:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1.5 bg-blue-50/50 border border-blue-200 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Theo Tuần (Tuần {currentWeek?.weekNumber || 4})</option>
              <option value="month">Theo Tháng (Tháng 9/2026)</option>
              <option value="semester">Học kỳ I</option>
              <option value="year">Cả năm học 2026–2027</option>
            </select>
          </div>
        </div>

        {/* Row 2: Sub-grade Filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-500 mr-1 whitespace-nowrap">
            Lọc theo khối:
          </span>
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              selectedGrade === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
            }`}
          >
            {selectedLevel === 'thcs'
              ? 'Tất cả lớp THCS (16 lớp)'
              : selectedLevel === 'tieuhoc'
              ? 'Tất cả lớp Tiểu học (15 lớp)'
              : 'Tất cả các khối'}
          </button>
          {(selectedLevel === 'thcs'
            ? ['6', '7', '8', '9']
            : selectedLevel === 'tieuhoc'
            ? ['1', '2', '3', '4', '5']
            : ['1', '2', '3', '4', '5', '6', '7', '8', '9']
          ).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedGrade === g
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
              }`}
            >
              Khối {g}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium (Only when viewing all grades) */}
      {selectedGrade === 'all' && top1 && top2 && top3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 print:hidden">
          {/* Top 2: Silver */}
          <div className="bg-gradient-to-b from-blue-50 via-slate-50 to-blue-100/70 p-4 rounded-2xl border border-blue-200 text-center flex flex-col justify-between shadow-xs">
            <div>
              <span className="inline-block p-2 rounded-full bg-white text-slate-700 shadow-xs mb-1 font-bold text-lg border border-blue-100">
                🥈
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-900">HẠNG NHÌ</p>
              <h3 className="text-base sm:text-lg font-black text-blue-950 mt-0.5">{top2.className}</h3>
              <p className="text-[11px] text-blue-800/80 font-medium">GVCN: {top2.homeroomTeacher}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200">
              <span className="text-xl sm:text-2xl font-black text-blue-950 tabular-nums">
                {top2.finalScore}
              </span>
              <span className="text-xs text-blue-700 ml-1 font-bold">điểm</span>
            </div>
          </div>

          {/* Top 1: Gold */}
          <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-blue-50 p-4 rounded-2xl border-2 border-amber-400 text-center flex flex-col justify-between shadow-md scale-102">
            <div>
              <span className="inline-block p-2.5 rounded-full bg-white text-amber-500 shadow-md mb-1 font-bold text-2xl border border-amber-200">
                🥇
              </span>
              <p className="text-xs font-black uppercase tracking-wider text-amber-800">
                {selectedLevel === 'thcs'
                  ? 'CỜ LUÂN LƯU ĐẦU BẢNG KHỐI THCS'
                  : selectedLevel === 'tieuhoc'
                  ? 'CỜ LUÂN LƯU ĐẦU BẢNG KHỐI TIỂU HỌC'
                  : 'CỜ LUÂN LƯU ĐẦU BẢNG TOÀN TRƯỜNG'}
              </p>
              <h3 className="text-lg sm:text-xl font-black text-blue-950 mt-0.5">{top1.className}</h3>
              <p className="text-xs text-blue-900 font-medium">GVCN: {top1.homeroomTeacher}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-300/80">
              <span className="text-2xl sm:text-3xl font-black text-blue-950 tabular-nums">
                {top1.finalScore}
              </span>
              <span className="text-xs text-amber-800 font-bold ml-1">điểm</span>
              <p className="text-[10px] text-emerald-700 font-black mt-0.5">XUẤT SẮC NHẤT TUẦN</p>
            </div>
          </div>

          {/* Top 3: Bronze */}
          <div className="bg-gradient-to-b from-cyan-50 via-sky-50 to-blue-100/70 p-4 rounded-2xl border border-blue-200 text-center flex flex-col justify-between shadow-xs">
            <div>
              <span className="inline-block p-2 rounded-full bg-white text-amber-700 shadow-xs mb-1 font-bold text-lg border border-blue-100">
                🥉
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-900">HẠNG BA</p>
              <h3 className="text-base sm:text-lg font-black text-blue-950 mt-0.5">{top3.className}</h3>
              <p className="text-[11px] text-blue-800/80 font-medium">GVCN: {top3.homeroomTeacher}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-blue-200">
              <span className="text-xl sm:text-2xl font-black text-blue-950 tabular-nums">
                {top3.finalScore}
              </span>
              <span className="text-xs text-blue-700 ml-1 font-bold">điểm</span>
            </div>
          </div>
        </div>
      )}

      {/* Official Ranking Table */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        {/* Printable Official Header */}
        <div className="hidden print:block p-6 text-center border-b border-blue-200">
          <p className="text-xs font-bold uppercase text-blue-900">
            PHÒNG GD&ĐT HUYỆN QUẢN BẠ — TRƯỜNG PTDTBT TH&THCS QUẢN BẠ
          </p>
          <h1 className="text-base font-bold uppercase text-blue-950 mt-1">
            BẢNG XẾP HẠNG THI ĐUA NỀ NẾP {selectedLevel === 'thcs' ? 'CẤP THCS (LỚP 6–9)' : selectedLevel === 'tieuhoc' ? 'CẤP TIỂU HỌC (LỚP 1–5)' : 'TOÀN TRƯỜNG'} — TUẦN {currentWeek?.weekNumber || 4}
          </h1>
          <p className="text-xs text-blue-700 mt-0.5">
            Thời gian: {currentWeek?.startDate} đến {currentWeek?.endDate}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-14 text-center">Hạng</th>
                <th className="py-3 px-4">Lớp / Chi đội</th>
                <th className="py-3 px-4">Khối</th>
                <th className="py-3 px-4">Giáo viên chủ nhiệm</th>
                <th className="py-3 px-4 text-center">Điểm nền</th>
                <th className="py-3 px-4 text-center">Điểm trừ</th>
                <th className="py-3 px-4 text-center">Điểm cộng</th>
                <th className="py-3 px-4 text-center font-black text-amber-300">Tổng điểm</th>
                <th className="py-3 px-4">Xếp loại</th>
                <th className="py-3 px-4 text-right print:hidden">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {filteredRankings.map((c) => {
                const isTop1 = c.rank === 1;
                const isTop2 = c.rank === 2;
                const isTop3 = c.rank === 3;

                return (
                  <tr
                    key={c.classId}
                    className={`hover:bg-blue-50/70 transition-colors even:bg-blue-50/20 ${
                      isTop1 ? 'bg-amber-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center">
                      {isTop1 ? (
                        <span className="inline-flex w-7 h-7 rounded-full bg-amber-400 text-white font-black items-center justify-center text-xs shadow-xs">
                          1
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black items-center justify-center text-xs shadow-xs">
                          2
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex w-7 h-7 rounded-full bg-amber-600 text-white font-black items-center justify-center text-xs shadow-xs">
                          3
                        </span>
                      ) : (
                        <span className="font-bold text-slate-600 font-mono tabular-nums text-sm">
                          #{c.rank}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{c.className}</span>
                        {isTop1 && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md">
                            Dẫn đầu
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">Khối {c.grade}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{c.homeroomTeacher}</td>
                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-500">
                      {c.baseScore}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-600 tabular-nums">
                      -{c.totalDeductions}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-600 tabular-nums">
                      +{c.totalBonuses}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-base font-black text-blue-900 tabular-nums font-mono">
                        {c.finalScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs border ${getRatingBadge(
                          c.rating
                        )}`}
                      >
                        {c.rating}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right print:hidden">
                      <button
                        onClick={() => setSelectedClassDetail(c)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                        title="Xem chi tiết các lỗi đã bị trừ"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Calculation Formula Verification Footer Note */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Công thức tính điểm minh bạch:</strong> Điểm tổng kết = 100 (Điểm nền) + Điểm cộng
              - Điểm trừ. Không thể chỉnh sửa trực tiếp điểm tổng.
            </span>
          </div>
          <span className="font-semibold text-slate-700">Tổng số chi đội: {filteredRankings.length}</span>
        </div>
      </div>

      {/* Modal: Xem chi tiết các lỗi của lớp trong tuần */}
      {selectedClassDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Bảng điểm chi tiết: {selectedClassDetail.className}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  GVCN: {selectedClassDetail.homeroomTeacher} · Xếp hạng: #{selectedClassDetail.rank}
                </p>
              </div>
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex justify-between items-center">
                <span>Điểm tổng kết:</span>
                <span className="text-xl font-black text-blue-900 tabular-nums">
                  {selectedClassDetail.finalScore} điểm ({selectedClassDetail.rating})
                </span>
              </div>

              <div>
                <p className="font-bold text-slate-700 uppercase text-[11px] mb-2">
                  Phân rã điểm trừ theo nhóm nội dung:
                </p>
                <div className="space-y-1.5 border border-slate-200 rounded-lg p-2.5 bg-slate-50">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Trang phục & Khăn quàng:</span>
                    <span className="font-bold text-rose-600">-3đ</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Đi học & Chuyên cần:</span>
                    <span className="font-bold text-rose-600">-2đ</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Vệ sinh & Trực nhật:</span>
                    <span className="font-bold text-rose-600">-4đ</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Nề nếp & Giờ học:</span>
                    <span className="font-bold text-rose-600">-0đ</span>
                  </div>
                  <div className="flex justify-between py-1 text-emerald-700 font-bold">
                    <span>Điểm cộng phong trào / Tiết học tốt:</span>
                    <span>+{selectedClassDetail.totalBonuses}đ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClassDetail(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
