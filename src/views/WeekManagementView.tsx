import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WeekItem, WeekStatus } from '../types';
import {
  CalendarRange,
  Plus,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  ShieldAlert,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

export const WeekManagementView: React.FC = () => {
  const {
    weeks,
    addWeek,
    updateWeekStatus,
    deleteWeek,
    selectedWeekId,
    setSelectedWeekId,
    setActiveTab,
    hasPermission,
    currentUser,
  } = useApp();

  const canEdit = hasPermission('canEditSettings');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmLockWeek, setConfirmLockWeek] = useState<WeekItem | null>(null);
  const [viewDetailWeek, setViewDetailWeek] = useState<WeekItem | null>(null);
  const [weekToDelete, setWeekToDelete] = useState<WeekItem | null>(null);

  // Form state
  const [newWeekNumber, setNewWeekNumber] = useState(weeks.length + 1);
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const statusConfig: Record<
    WeekStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ElementType }
  > = {
    not_started: {
      label: 'Chưa mở',
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      icon: CalendarRange,
    },
    in_progress: {
      label: 'Đang chấm',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: Unlock,
    },
    pending_approval: {
      label: 'Chờ duyệt',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertCircle,
    },
    approved: {
      label: 'Đã duyệt',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: CheckCircle2,
    },
    locked: {
      label: 'Đã khóa',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: Lock,
    },
  };

  const handleCreateWeek = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!newStartDate || !newEndDate) return;

    addWeek({
      weekNumber: Number(newWeekNumber),
      startDate: newStartDate,
      endDate: newEndDate,
      schoolYear: '2026–2027',
      status: 'not_started',
      notes: newNotes,
    });

    setShowAddModal(false);
    setNewStartDate('');
    setNewEndDate('');
    setNewNotes('');
    setNewWeekNumber(weeks.length + 2);
  };

  const handleConfirmLock = () => {
    if (!canEdit) return;
    if (confirmLockWeek) {
      updateWeekStatus(confirmLockWeek.id, 'locked');
      setConfirmLockWeek(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Quản lý Tuần thi đua</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Quản lý kế hoạch các tuần trong năm học 2026–2027, mở đợt chấm hoặc khóa điểm công bố kết quả
          </p>
        </div>

        <button
          onClick={() => canEdit && setShowAddModal(true)}
          disabled={!canEdit}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
            canEdit
              ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
              : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
          }`}
          title={canEdit ? 'Thêm tuần mới' : 'Tài khoản không được phân quyền thêm tuần'}
        >
          <Plus className="w-4 h-4" />
          Thêm tuần mới
        </button>
      </div>

      {!canEdit && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Chế độ xem Quản lý tuần (Chỉ đọc): </span>
            <span>
              Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu danh sách tuần. Chức năng Thêm tuần, Khóa/Mở tuần và Xóa tuần bị khóa trừ khi được Quản trị viên cấp quyền trong Bảng phân quyền.
            </span>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center text-blue-200">STT</th>
                <th className="py-3.5 px-4">Tuần</th>
                <th className="py-3.5 px-4">Từ ngày</th>
                <th className="py-3.5 px-4">Đến ngày</th>
                <th className="py-3.5 px-4">Ghi chú kế hoạch</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {weeks.map((week, idx) => {
                const config = statusConfig[week.status];
                const StatusIcon = config.icon;
                const isSelected = week.id === selectedWeekId;

                return (
                  <tr
                    key={week.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isSelected ? 'bg-blue-50/40 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 text-center font-mono text-slate-500 tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Tuần {week.weekNumber}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md font-semibold">
                            Đang xem
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                      {new Date(week.startDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 tabular-nums">
                      {new Date(week.endDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                      {week.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Select as active view */}
                        <button
                          onClick={() => setSelectedWeekId(week.id)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                          title="Chọn xem dữ liệu tuần này"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Open Week / Lock Week toggle */}
                        {week.status === 'locked' ? (
                          <button
                            onClick={() => canEdit && updateWeekStatus(week.id, 'in_progress')}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-md transition-colors ${
                              canEdit
                                ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                                : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                            }`}
                            title={canEdit ? 'Mở khóa tuần' : 'Tài khoản không có quyền mở khóa tuần'}
                          >
                            <Unlock className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => canEdit && setConfirmLockWeek(week)}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-md transition-colors ${
                              canEdit
                                ? 'text-amber-600 hover:bg-amber-50 cursor-pointer'
                                : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                            }`}
                            title={canEdit ? 'Khóa tuần chốt điểm' : 'Tài khoản không có quyền khóa tuần'}
                          >
                            <Lock className="w-4 h-4" />
                          </button>
                        )}

                        {/* View Report shortcut */}
                        <button
                          onClick={() => {
                            setSelectedWeekId(week.id);
                            setActiveTab('rankings');
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md"
                          title="Xem bảng xếp hạng"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            if (!canEdit) return;
                            setWeekToDelete(week);
                          }}
                          disabled={!canEdit}
                          className={`p-1.5 rounded-md transition-colors ${
                            canEdit
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                              : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                          }`}
                          title={
                            canEdit
                              ? `Xóa Tuần ${week.weekNumber}`
                              : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền xóa tuần`
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thêm tuần mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Thêm Tuần thi đua mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWeek} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Số thứ tự tuần:</label>
                <input
                  type="number"
                  min="1"
                  max="45"
                  value={newWeekNumber}
                  onChange={(e) => setNewWeekNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Từ ngày (Thứ 2):</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đến ngày (Chủ nhật):</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kế hoạch / Chủ đề thi đua:</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ví dụ: Đợt cao điểm thi đua 20/11..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
                >
                  Tạo tuần
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Khóa tuần */}
      {confirmLockWeek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="font-bold text-slate-900 text-base">Xác nhận khóa Tuần {confirmLockWeek.weekNumber}?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Sau khi khóa tuần, toàn bộ kết quả thi đua và lỗi vi phạm sẽ được đóng băng. Đội cờ đỏ sẽ
              không thể thêm hoặc chỉnh sửa kết quả nữa. Bạn có chắc chắn muốn chốt điểm tuần này?
            </p>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setConfirmLockWeek(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmLock}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Đồng ý khóa tuần
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Xóa tuần */}
      <ConfirmDeleteModal
        isOpen={weekToDelete !== null}
        title="Xác nhận xóa tuần thi đua"
        message="Bạn có chắc chắn muốn xóa tuần này không? Dữ liệu điểm tuần sẽ bị loại khỏi bảng tổng hợp."
        itemName={weekToDelete ? `Tuần ${weekToDelete.weekNumber} (${weekToDelete.startDate} đến ${weekToDelete.endDate})` : ''}
        itemType="Tuần thi đua"
        warningText="Thao tác xóa tuần không thể phục hồi lại."
        confirmLabel="Đồng ý xóa"
        cancelLabel="Hủy bỏ"
        onConfirm={() => {
          if (weekToDelete) {
            deleteWeek(weekToDelete.id);
            setWeekToDelete(null);
          }
        }}
        onClose={() => setWeekToDelete(null)}
      />
    </div>
  );
};
