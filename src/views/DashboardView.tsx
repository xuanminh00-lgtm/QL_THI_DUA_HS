import React from 'react';
import { useApp } from '../context/AppContext';
import {
  School,
  Flag,
  CheckCircle2,
  Clock,
  RotateCw,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  BarChart,
  ClipboardList,
  Lock,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    weeks,
    selectedWeekId,
    setSelectedWeekId,
    selectedSchoolYear,
    setSelectedSchoolYear,
    currentWeek,
    kpiStats,
    top5LeadingClasses,
    topViolationsFrequency,
    classRankings,
    setActiveTab,
    refreshData,
    isAuthenticated,
  } = useApp();

  const navigateIfAuth = (tab: any) => {
    if (isAuthenticated) {
      setActiveTab(tab);
    }
  };

  const [selectedLevel, setSelectedLevel] = React.useState<'all' | 'thcs' | 'tieuhoc'>('all');

  const displayedRankings = React.useMemo(() => {
    let list = classRankings;
    if (selectedLevel === 'thcs') {
      list = classRankings.filter((c) => Number(c.grade) >= 6 && Number(c.grade) <= 9);
    } else if (selectedLevel === 'tieuhoc') {
      list = classRankings.filter((c) => Number(c.grade) >= 1 && Number(c.grade) <= 5);
    }
    return list;
  }, [classRankings, selectedLevel]);

  const displayedTop5 = React.useMemo(() => {
    return displayedRankings.slice(0, 5);
  }, [displayedRankings]);

  return (
    <div className="space-y-6">
      {/* Banner thông báo khi đã đăng xuất: Chỉ xem được trang Tổng quan */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Lock className="w-5 h-5 text-blue-950" />
            </div>
            <div>
              <p className="font-bold text-sm text-blue-950">
                Chế độ xem công khai: Chỉ xem trang Tổng quan
              </p>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                Tài khoản đã đăng xuất. Tất cả các tính năng quản lý, phân công cờ đỏ, chấm điểm, duyệt kết quả và cài đặt đã bị khóa và làm mờ trên thanh điều hướng. Vui lòng bấm <strong>"Đăng nhập"</strong> ở góc trên bên phải để mở khóa.
              </p>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-amber-200/80 border border-amber-300 rounded-xl font-bold text-blue-950 text-xs flex items-center gap-1.5 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-amber-900" />
            Các tính năng khác đang khóa
          </span>
        </div>
      )}

      {/* Top Filter Bar - Deep Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-4 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* School Year Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-blue-200">Năm học:</label>
            <select
              value={selectedSchoolYear}
              onChange={(e) => setSelectedSchoolYear(e.target.value)}
              className="px-3 py-1.5 bg-blue-950/60 border border-blue-400/40 rounded-lg text-xs font-bold text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              <option value="2026–2027" className="text-slate-900">2026–2027</option>
              <option value="2025–2026" className="text-slate-900">2025–2026</option>
            </select>
          </div>

          {/* Week Filter */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-blue-200">Tuần thi đua:</label>
            <select
              value={selectedWeekId}
              onChange={(e) => setSelectedWeekId(e.target.value)}
              className="px-3 py-1.5 bg-blue-950/60 border border-blue-400/40 rounded-lg text-xs font-bold text-amber-300 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            >
              {weeks.map((w) => (
                <option key={w.id} value={w.id} className="text-slate-900">
                  Tuần {w.weekNumber} ({new Date(w.startDate).toLocaleDateString('vi-VN')} –{' '}
                  {new Date(w.endDate).toLocaleDateString('vi-VN')}){' '}
                  {w.status === 'in_progress' ? '• Hiện tại' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Level Filter (Toàn trường / Khối THCS / Khối Tiểu học) */}
          <div className="flex items-center gap-1 bg-blue-950/60 p-1 rounded-lg border border-blue-400/40 text-xs font-bold">
            <button
              onClick={() => setSelectedLevel('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedLevel === 'all'
                  ? 'bg-amber-400 text-blue-950 shadow-xs'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Toàn trường
            </button>
            <button
              onClick={() => setSelectedLevel('thcs')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedLevel === 'thcs'
                  ? 'bg-amber-400 text-blue-950 shadow-xs'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Khối THCS (6–9)
            </button>
            <button
              onClick={() => setSelectedLevel('tieuhoc')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedLevel === 'tieuhoc'
                  ? 'bg-amber-400 text-blue-950 shadow-xs'
                  : 'text-blue-200 hover:text-white'
              }`}
            >
              Khối Tiểu học (1–5)
            </button>
          </div>
        </div>

        {/* Action: Refresh */}
        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-lg border border-white/30 shadow-xs transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-300" />
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* KPI Cards: 5 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Tổng số lớp */}
        <div
          onClick={() => navigateIfAuth('classes')}
          className={`bg-gradient-to-br from-white to-blue-50/80 p-4 rounded-2xl border border-blue-200/90 shadow-sm transition-all group ${
            isAuthenticated
              ? 'hover:border-blue-500 hover:shadow-md cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900">Tổng số lớp</span>
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <School className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-blue-950 tabular-nums">
              {displayedRankings.length}
            </span>
            <span className="text-xs font-semibold text-blue-600">lớp</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {selectedLevel === 'thcs'
              ? 'Khối 6, 7, 8, 9 (16 lớp THCS)'
              : selectedLevel === 'tieuhoc'
              ? 'Khối 1, 2, 3, 4, 5 (15 lớp Tiểu học)'
              : 'Khối 1 đến 9 (31 lớp liên cấp)'}
          </p>
        </div>

        {/* Card 2: Cờ đỏ được phân công */}
        <div
          onClick={() => navigateIfAuth('redflags')}
          className={`bg-gradient-to-br from-white to-indigo-50/80 p-4 rounded-2xl border border-indigo-200/90 shadow-sm transition-all group ${
            isAuthenticated
              ? 'hover:border-indigo-500 hover:shadow-md cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900">Cờ đỏ phân công</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Flag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-950 tabular-nums">
              {kpiStats.assignedRedFlags}
            </span>
            <span className="text-xs font-semibold text-indigo-600">học sinh</span>
          </div>
          <p className="mt-1 text-[11px] text-indigo-600 font-medium">100% đã nhận ca</p>
        </div>

        {/* Card 3: Lượt chấm trong tuần */}
        <div
          onClick={() => navigateIfAuth('assignments')}
          className={`bg-gradient-to-br from-white to-sky-50/80 p-4 rounded-2xl border border-sky-200/90 shadow-sm transition-all group ${
            isAuthenticated
              ? 'hover:border-sky-500 hover:shadow-md cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-900">Lượt chấm tuần</span>
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-sky-950 tabular-nums">
              {kpiStats.totalChecksThisWeek}
            </span>
            <span className="text-xs font-semibold text-sky-600">lượt</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">Theo kế hoạch tuần 4</p>
        </div>

        {/* Card 4: Đã hoàn thành */}
        <div
          onClick={() => navigateIfAuth('approvals')}
          className={`bg-gradient-to-br from-white to-emerald-50/80 p-4 rounded-2xl border border-emerald-200/90 shadow-sm transition-all group ${
            isAuthenticated
              ? 'hover:border-emerald-500 hover:shadow-md cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900">Đã hoàn thành</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 tabular-nums">
              {kpiStats.completedChecks}
            </span>
            <span className="text-xs text-emerald-600 font-bold">({kpiStats.completionPercentage}%)</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">Tiến độ xuất sắc</p>
        </div>

        {/* Card 5: Chưa hoàn thành */}
        <div
          onClick={() => navigateIfAuth('assignments')}
          className={`bg-gradient-to-br from-white to-sky-50/90 p-4 rounded-2xl border border-sky-200/90 shadow-sm transition-all group col-span-2 sm:col-span-1 ${
            isAuthenticated
              ? 'hover:border-blue-500 hover:shadow-md cursor-pointer'
              : 'cursor-default'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-950">Chưa hoàn thành</span>
            <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-sky-950 tabular-nums">
              {kpiStats.pendingChecks}
            </span>
            <span className="text-xs font-bold text-sky-700">lượt</span>
          </div>
          <p className="mt-1 text-[11px] text-sky-700 font-medium">Ca trực chiều thứ 5, 6</p>
        </div>
      </div>

      {/* Middle Row: 3 CARDS specified in Prompt: TIẾN ĐỘ HOÀN THÀNH, TOP 5 LỚP DẪN ĐẦU TUẦN, CẢNH BÁO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: TIẾN ĐỘ HOÀN THÀNH (Donut Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-3.5 -mx-5 -mt-5 rounded-t-xl mb-4 flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide">TIẾN ĐỘ HOÀN THÀNH</h2>
              <span className="text-[11px] font-bold text-blue-900 bg-amber-300 px-2 py-0.5 rounded-md shadow-xs">
                Tuần {currentWeek?.weekNumber || 4}
              </span>
            </div>

            {/* Donut Chart representation */}
            <div className="my-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle (Chưa hoàn thành - 5%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#FDE68A"
                    strokeWidth="14"
                    fill="transparent"
                  />
                  {/* Foreground Circle (Đã hoàn thành - 95%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#1D4ED8"
                    strokeWidth="14"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - kpiStats.completedChecks / kpiStats.totalChecksThisWeek)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-blue-950 tabular-nums">
                    {kpiStats.completionPercentage}%
                  </span>
                  <span className="text-[10px] text-blue-700 font-bold uppercase">Hoàn tất</span>
                </div>
              </div>

              {/* Legend */}
              <div className="mt-4 w-full grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2 bg-blue-50/80 rounded-xl border border-blue-200/60">
                  <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
                  <div>
                    <p className="text-slate-500 text-[10px]">Đã hoàn thành</p>
                    <p className="font-bold text-blue-950 tabular-nums">{kpiStats.completedChecks} lượt</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-amber-50/80 rounded-xl border border-amber-200/60">
                  <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
                  <div>
                    <p className="text-slate-500 text-[10px]">Chưa hoàn thành</p>
                    <p className="font-bold text-amber-950 tabular-nums">{kpiStats.pendingChecks} lượt</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            disabled={!isAuthenticated}
            onClick={() => navigateIfAuth('assignments')}
            className={`w-full text-center text-xs font-bold py-2 border-t border-blue-100 flex items-center justify-center gap-1 group transition-colors ${
              isAuthenticated
                ? 'text-blue-700 hover:text-blue-900 cursor-pointer'
                : 'text-slate-400 opacity-50 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span>Xem chi tiết ca trực</span>
            {isAuthenticated ? (
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* CARD 2: TOP 5 LỚP DẪN ĐẦU TUẦN */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-3.5 -mx-5 -mt-5 rounded-t-xl mb-3 flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide">TOP 5 LỚP DẪN ĐẦU TUẦN</h2>
              <span className="text-[11px] text-blue-200 font-medium">Trực tiếp</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {displayedTop5.map((item, idx) => {
                const medals = [
                  { bg: 'bg-amber-100 text-amber-900 border-amber-300 font-black', icon: '🥇' },
                  { bg: 'bg-slate-200 text-slate-800 border-slate-300 font-black', icon: '🥈' },
                  { bg: 'bg-amber-50 text-amber-900 border-amber-200 font-black', icon: '🥉' },
                  { bg: 'bg-blue-50 text-blue-900 border-blue-200 font-bold', icon: '4' },
                  { bg: 'bg-blue-50 text-blue-900 border-blue-200 font-bold', icon: '5' },
                ];
                const medal = medals[idx] || medals[4];

                return (
                  <div
                    key={item.classId}
                    onClick={() => navigateIfAuth('rankings')}
                    className={`flex items-center justify-between p-2.5 rounded-xl border border-blue-100/80 bg-blue-50/20 transition-colors ${
                      isAuthenticated
                        ? 'hover:border-blue-400 hover:bg-blue-50/60 cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-xs border ${medal.bg}`}
                      >
                        {medal.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-blue-950 text-sm">{item.className}</span>
                          <span className="text-[11px] text-slate-500">· GVCN: {item.homeroomTeacher}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">Khối {item.grade}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-blue-800 tabular-nums">
                        {item.finalScore} <span className="text-xs font-normal text-slate-500">điểm</span>
                      </span>
                      <p className="text-[10px] font-semibold text-emerald-600">{item.rating}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            disabled={!isAuthenticated}
            onClick={() => navigateIfAuth('rankings')}
            className={`w-full text-center text-xs font-bold py-2 border-t border-blue-100 flex items-center justify-center gap-1 group mt-2 transition-colors ${
              isAuthenticated
                ? 'text-blue-700 hover:text-blue-900 cursor-pointer'
                : 'text-slate-400 opacity-50 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span>Xem toàn bộ {displayedRankings.length} lớp</span>
            {isAuthenticated ? (
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <Lock className="w-3 h-3 text-slate-400" />
            )}
          </button>
        </div>

        {/* CARD 3: CẢNH BÁO */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-3.5 -mx-5 -mt-5 rounded-t-xl mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-300" />
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide">CẢNH BÁO HỆ THỐNG</h2>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                4 mục
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {/* Alert 1 */}
              <div
                onClick={() => setActiveTab('assignments')}
                className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5 hover:bg-amber-100/80 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-950">3 cờ đỏ chưa nhập dữ liệu</p>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    Học sinh: Hồ Văn Cường, Bùi Thị Hà, Vàng Thị Máy
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-amber-700 shrink-0" />
              </div>

              {/* Alert 2 */}
              <div
                onClick={() => setActiveTab('approvals')}
                className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-2.5 hover:bg-blue-100/80 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-950">
                    {kpiStats.pendingApprovalsCount} phiếu đang chờ duyệt
                  </p>
                  <p className="text-[11px] text-blue-800/80 mt-0.5">Từ lớp 7B, 9A, 6A, 8A, 8B đã gửi phiếu chấm</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-700 shrink-0" />
              </div>

              {/* Alert 3 */}
              <div
                onClick={() => setActiveTab('approvals')}
                className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 flex items-start gap-2.5 hover:bg-rose-100/80 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-rose-950">
                    {kpiStats.revisionsRequestedCount} dữ liệu yêu cầu sửa
                  </p>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">Lớp 6B (nhầm phòng) & 8C (thiếu danh sách vi phạm)</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-rose-700 shrink-0" />
              </div>

              {/* Alert 4 */}
              <div
                onClick={() => setActiveTab('weeks')}
                className="p-2.5 rounded-xl bg-blue-50/90 border border-blue-200 flex items-start gap-2.5 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-950">Tuần 4 sắp đóng</p>
                  <p className="text-[11px] text-blue-800/80 mt-0.5">Thời hạn chốt: Chủ nhật 17:00 (còn 2 ngày)</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-700 shrink-0" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-blue-100 text-center">
            <span className="text-[11px] text-blue-700 font-medium">
              Kiểm tra thường xuyên để đảm bảo tiến độ thi đua
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: BIỂU ĐỒ SO SÁNH ĐIỂM TRUNG BÌNH & THỐNG KÊ LỖI NHIỀU NHẤT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Biểu đồ so sánh điểm trung bình các lớp (8 cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-4 -mx-5 -mt-5 rounded-t-xl mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide">
                BIỂU ĐỒ SO SÁNH ĐIỂM THI ĐUA CÁC LỚP
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Điểm tuần 4 tính trên nền 100 điểm (+ thưởng - vi phạm)
              </p>
            </div>
            <button
              onClick={() => setActiveTab('rankings')}
              className="text-xs text-amber-300 font-bold hover:underline"
            >
              Bảng chi tiết
            </button>
          </div>

          {/* SVG Bar Chart for Classes */}
          <div className="mt-4">
            <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-2 px-1 pt-6 pb-2 border-b border-blue-100">
              {classRankings.map((c) => {
                const heightPercent = Math.max(15, Math.min(100, ((c.finalScore - 60) / 40) * 100));
                const isTop = c.rank <= 3;

                return (
                  <div key={c.classId} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-950 text-white text-[10px] py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-20 shadow-md">
                      {c.className}: {c.finalScore} điểm (Hạng {c.rank})
                    </div>

                    <span className="text-[10px] font-bold text-blue-900 mb-1 tabular-nums">
                      {c.finalScore}
                    </span>

                    {/* Column Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[28px] rounded-t-sm transition-all duration-300 ${
                        isTop
                          ? 'bg-gradient-to-t from-blue-800 to-blue-600 group-hover:from-blue-900 group-hover:to-blue-700'
                          : 'bg-gradient-to-t from-sky-400 to-sky-300 group-hover:from-sky-500 group-hover:to-sky-400'
                      }`}
                    />

                    {/* Class label */}
                    <span className="text-[10px] font-semibold text-slate-700 mt-2 truncate max-w-full">
                      {c.className.replace('Lớp ', '')}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-blue-700"></span>
                  Top 3 xuất sắc
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-sky-400"></span>
                  Các lớp còn lại
                </span>
              </div>
              <span className="text-[11px] font-bold text-blue-800">Điểm TB toàn trường: 89.2</span>
            </div>
          </div>
        </div>

        {/* Right: Thống kê lỗi nhiều nhất (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-blue-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-4 -mx-5 -mt-5 rounded-t-xl mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wide">
                  THỐNG KÊ LỖI NHIỀU NHẤT
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">Nhắc nhở trong lễ chào cờ đầu tuần</p>
              </div>
              <button
                onClick={() => setActiveTab('violations')}
                className="text-xs text-amber-300 font-bold hover:underline"
              >
                Danh mục
              </button>
            </div>

            {/* Horizontal Bar Chart for Top Violations */}
            <div className="mt-4 space-y-3.5">
              {topViolationsFrequency.map((item, idx) => {
                const maxVal = topViolationsFrequency[0]?.count || 1;
                const widthPercent = Math.round((item.count / maxVal) * 100);

                const barColors = [
                  'bg-rose-500',
                  'bg-amber-500',
                  'bg-blue-600',
                  'bg-emerald-500',
                  'bg-indigo-600',
                ];

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-blue-600 font-bold">#{idx + 1}</span>
                        {item.name}
                      </span>
                      <span className="font-bold text-blue-950 tabular-nums">
                        {item.count} <span className="text-[10px] font-normal text-slate-500">lượt</span>
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColors[idx % barColors.length]}`}
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Chi đội vi phạm ít nhất: 9A, 8A</span>
            <button
              onClick={() => setActiveTab('minutes')}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              Lập biên bản nhận xét
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
