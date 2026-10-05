import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AssignmentItem } from '../types';
import {
  CalendarClock,
  Plus,
  Wand2,
  Copy,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  X,
  Shuffle,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const AssignmentView: React.FC = () => {
  const {
    assignments,
    redFlags,
    classes,
    addAssignment,
    deleteAssignment,
    autoAssignWeek,
    copyAssignmentsFromPreviousWeek,
    selectedWeekId,
    weeks,
    currentUser,
    hasPermission,
  } = useApp();

  const canManage = hasPermission('canManageRedFlags');

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<'all' | 'thcs' | 'tieuhoc'>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Form state
  const [newAssignment, setNewAssignment] = useState<Omit<AssignmentItem, 'id'>>({
    weekId: selectedWeekId,
    redFlagId: redFlags[0]?.id || 'rf-1',
    redFlagName: redFlags[0]?.name || 'Nguyễn Văn An',
    targetClassId: classes[0]?.id || 'c-7a',
    targetClassName: classes[0]?.name || '7A',
    dayOfWeek: 'Thứ 2',
    area: 'Sân trường - Dãy B',
    shift: 'Sáng',
    content: 'Nề nếp & Xếp hàng',
    status: 'pending',
  });

  const weekAssignments = assignments.filter((a) => a.weekId === selectedWeekId);

  const filteredAssignments = weekAssignments.filter((a) => {
    // Level filter
    if (selectedLevelFilter !== 'all') {
      const cls = classes.find((c) => c.code === a.targetClassName || c.id === a.targetClassId);
      const gradeNum = cls ? Number(cls.grade) : parseInt(a.targetClassName) || 7;
      if (selectedLevelFilter === 'thcs' && (gradeNum < 6 || gradeNum > 9)) return false;
      if (selectedLevelFilter === 'tieuhoc' && (gradeNum < 1 || gradeNum > 5)) return false;
    }

    const matchDay = selectedDay === 'all' || a.dayOfWeek === selectedDay;
    const matchSearch =
      a.redFlagName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.targetClassName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchDay && matchSearch;
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    const rf = redFlags.find((r) => r.id === newAssignment.redFlagId);
    const cls = classes.find((c) => c.id === newAssignment.targetClassId);

    // Validate anti-self-grading rule!
    if (rf && cls && rf.classId === cls.id) {
      setValidationError(`Quy tắc công bằng: Cờ đỏ ${rf.name} (thuộc lớp ${rf.className}) không được phép chấm điểm chính lớp của mình! Vui lòng chọn lớp khác.`);
      return;
    }

    addAssignment({
      ...newAssignment,
      weekId: selectedWeekId,
      redFlagName: rf?.name || newAssignment.redFlagName,
      targetClassName: cls?.name.replace('Lớp ', '') || newAssignment.targetClassName,
    });

    setValidationError(null);
    setShowAddModal(false);
  };

  const handleAutoAssign = () => {
    if (!canManage) return;
    setConfirmModal({
      title: 'Tự động phân công trực tuần',
      message: 'Hệ thống sẽ chạy thuật toán tự động phân công tuần này (đảm bảo không chấm lớp mình và xoay vòng công bằng theo cấp học). Bạn có muốn tiếp tục?',
      onConfirm: () => {
        autoAssignWeek(selectedWeekId);
        setConfirmModal(null);
      },
    });
  };

  const handleCopyPreviousWeek = () => {
    if (!canManage) return;
    setConfirmModal({
      title: 'Tạo phân công từ tuần trước',
      message: 'Sao chép lịch phân công từ tuần trước và xoay vòng chi đội?',
      onConfirm: () => {
        copyAssignmentsFromPreviousWeek(selectedWeekId);
        setConfirmModal(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Phân công Trực tuần Cờ đỏ</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Lịch trực và phân ban giám sát nề nếp các chi đội — Đảm bảo nguyên tắc khách quan, công bằng
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Algorithm Auto-Assign button */}
          <button
            onClick={() => canManage && handleAutoAssign()}
            disabled={!canManage}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors shadow-xs ${
              canManage
                ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30 cursor-pointer'
                : 'bg-white/10 text-slate-400 border border-white/10 opacity-40 cursor-not-allowed pointer-events-auto'
            }`}
            title={canManage ? '+ Phân công tự động' : 'Tài khoản không được phân quyền phân công'}
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-300" />
            + Phân công tự động
          </button>

          {/* Copy week button */}
          <button
            onClick={() => canManage && handleCopyPreviousWeek()}
            disabled={!canManage}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
              canManage
                ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer'
                : 'bg-white/5 text-slate-400 border-white/10 opacity-40 cursor-not-allowed pointer-events-auto'
            }`}
            title={canManage ? 'Tạo phân công tuần mới' : 'Tài khoản không được phân quyền phân công'}
          >
            <Copy className="w-3.5 h-3.5" />
            Tạo phân công tuần mới
          </button>

          {/* Manual assign button */}
          <button
            onClick={() => canManage && setShowAddModal(true)}
            disabled={!canManage}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
              canManage
                ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
                : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
            }`}
            title={canManage ? '+ Phân công' : 'Tài khoản không được phân quyền phân công'}
          >
            <Plus className="w-4 h-4" />
            + Phân công
          </button>
        </div>
      </div>

      {!canManage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Chế độ xem Phân công trực tuần (Chỉ đọc): </span>
            <span>
              Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu lịch trực. Chức năng Thêm, Sửa, Xóa và Tự động phân công đều bị khóa trừ khi được Quản trị viên cấp quyền trong Bảng phân quyền.
            </span>
          </div>
        </div>
      )}

      {/* Fair Play Notice Banner */}
      <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs text-blue-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
          <span>
            <strong>Quy tắc thuật toán phân công:</strong> Hệ thống tự động ngăn chặn cờ đỏ chấm lớp của
            mình, đồng thời xoay vòng khu vực để không chấm trùng 1 lớp quá 2 tuần liên tiếp.
          </span>
        </div>
        <span className="text-[11px] font-bold text-blue-800 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs">
          Tổng số: {weekAssignments.length} ca trực
        </span>
      </div>

      {/* Filter and Search Bar with Level tabs */}
      <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-3">
        {/* Row 1: Level Tabs (Toàn trường, Khối THCS 6-9, Khối Tiểu học 1-5) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-blue-100">
          <div className="flex items-center gap-1.5 bg-blue-50/80 p-1 rounded-xl border border-blue-200">
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedLevelFilter === 'all'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-900 hover:bg-blue-100'
              }`}
            >
              Toàn trường ({weekAssignments.length} ca trực)
            </button>
            <button
              onClick={() => setSelectedLevelFilter('thcs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedLevelFilter === 'thcs'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-900 hover:bg-blue-100'
              }`}
            >
              <span>Khối THCS (Lớp 6–9)</span>
            </button>
            <button
              onClick={() => setSelectedLevelFilter('tieuhoc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedLevelFilter === 'tieuhoc'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'text-blue-900 hover:bg-blue-100'
              }`}
            >
              <span>Khối Tiểu học (Lớp 1–5)</span>
            </button>
          </div>
        </div>

        {/* Row 2: Day of Week Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Tất cả các ngày' },
              { id: 'Thứ 2', label: 'Thứ 2' },
              { id: 'Thứ 3', label: 'Thứ 3' },
              { id: 'Thứ 4', label: 'Thứ 4' },
              { id: 'Thứ 5', label: 'Thứ 5' },
              { id: 'Thứ 6', label: 'Thứ 6' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedDay === d.id
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
            <input
              type="text"
              placeholder="Tìm theo cờ đỏ, lớp, nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Assignments Table: STT | Cờ đỏ | Lớp được chấm | Ngày | Khu vực | Nội dung | Thao tác */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Cờ đỏ</th>
                <th className="py-3 px-4">Lớp được chấm</th>
                <th className="py-3 px-4">Ngày trực</th>
                <th className="py-3 px-4">Ca</th>
                <th className="py-3 px-4">Khu vực phân công</th>
                <th className="py-3 px-4">Nội dung chấm</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    Chưa có ca trực nào trong ngày hoặc bộ lọc đã chọn. Hãy bấm "+ Phân công tự động"!
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((item, idx) => {
                  const isDone = item.status === 'completed';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-500 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{item.redFlagName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/70">
                          {item.targetClassName.includes('Lớp') ? item.targetClassName : `Lớp ${item.targetClassName}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {item.dayOfWeek}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.shift}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {item.area}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.content}
                      </td>
                      <td className="py-3 px-4">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã nộp phiếu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Chờ chấm
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (!canManage) return;
                            setConfirmModal({
                              title: 'Xác nhận xóa phân công trực',
                              message: `Bạn có chắc chắn muốn hủy phân công trực lớp ${item.targetClassName} của cờ đỏ ${item.redFlagName} vào ${item.dayOfWeek}?`,
                              onConfirm: () => {
                                deleteAssignment(item.id);
                                setConfirmModal(null);
                              },
                            });
                          }}
                          disabled={!canManage}
                          className={`p-1.5 rounded-md transition-colors ${
                            !canManage
                              ? 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                          }`}
                          title={canManage ? 'Xóa phân công' : 'Tài khoản không có quyền xóa phân công'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm phân công thủ công */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Thêm Phân công trực tuần</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cờ đỏ thực hiện:</label>
                <select
                  value={newAssignment.redFlagId}
                  onChange={(e) => {
                    const rf = redFlags.find((r) => r.id === e.target.value);
                    setNewAssignment({
                      ...newAssignment,
                      redFlagId: e.target.value,
                      redFlagName: rf?.name || '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {redFlags.map((rf) => (
                    <option key={rf.id} value={rf.id}>
                      {rf.name} (Lớp {rf.className}) - {rf.code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp được phân công chấm:</label>
                <select
                  value={newAssignment.targetClassId}
                  onChange={(e) => {
                    const cls = classes.find((c) => c.id === e.target.value);
                    setNewAssignment({
                      ...newAssignment,
                      targetClassId: e.target.value,
                      targetClassName: cls?.name.replace('Lớp ', '') || '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} (GVCN: {cls.homeroomTeacher})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày trực:</label>
                  <select
                    value={newAssignment.dayOfWeek}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dayOfWeek: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Thứ 2">Thứ 2</option>
                    <option value="Thứ 3">Thứ 3</option>
                    <option value="Thứ 4">Thứ 4</option>
                    <option value="Thứ 5">Thứ 5</option>
                    <option value="Thứ 6">Thứ 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ca trực:</label>
                  <select
                    value={newAssignment.shift}
                    onChange={(e) => setNewAssignment({ ...newAssignment, shift: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sáng">Sáng (6:45 - 11:30)</option>
                    <option value="Chiều">Chiều (13:30 - 17:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Khu vực phân công:</label>
                <input
                  type="text"
                  value={newAssignment.area}
                  onChange={(e) => setNewAssignment({ ...newAssignment, area: e.target.value })}
                  placeholder="Ví dụ: Sân trường - Dãy nhà B"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung chấm nề nếp:</label>
                <input
                  type="text"
                  value={newAssignment.content}
                  onChange={(e) => setNewAssignment({ ...newAssignment, content: e.target.value })}
                  placeholder="Ví dụ: Trang phục, Khăn quàng & Vệ sinh"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValidationError(null);
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
                >
                  Lưu phân công
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-app Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-blue-200">
            <h3 className="font-bold text-slate-900 text-base">{confirmModal.title}</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">{confirmModal.message}</p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Xác nhận thực hiện
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
