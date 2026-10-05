import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GradingRecordItem } from '../types';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  MessageSquare,
  X,
  FileCheck,
  Search,
  Check,
} from 'lucide-react';

export const ApprovalsView: React.FC = () => {
  const {
    gradingRecords,
    approveGradingRecord,
    requestRevisionGradingRecord,
    currentUser,
    selectedWeekId,
    hasPermission,
  } = useApp();

  const canApprove = hasPermission('canApprove');
  const canRequestRevision = hasPermission('canRequestRevision');

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'revision_requested'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [selectedRecord, setSelectedRecord] = useState<GradingRecordItem | null>(null);
  const [revisionRecord, setRevisionRecord] = useState<GradingRecordItem | null>(null);
  const [revisionReasonText, setRevisionReasonText] = useState('');
  const [showConfirmApproveAll, setShowConfirmApproveAll] = useState(false);

  const weekRecords = gradingRecords.filter((r) => r.weekId === selectedWeekId);

  const pendingCount = weekRecords.filter((r) => r.status === 'pending').length;
  const approvedCount = weekRecords.filter((r) => r.status === 'approved').length;
  const revisionCount = weekRecords.filter((r) => r.status === 'revision_requested').length;

  const currentList = weekRecords
    .filter((r) => r.status === activeTab)
    .filter(
      (r) =>
        r.redFlagName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.dayOfWeek.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleApprove = (recordId: string) => {
    if (!canApprove) return;
    approveGradingRecord(recordId, currentUser.name);
    if (selectedRecord?.id === recordId) setSelectedRecord(null);
  };

  const handleOpenRevision = (record: GradingRecordItem) => {
    if (!canRequestRevision) return;
    setRevisionRecord(record);
    setRevisionReasonText('');
  };

  const handleConfirmRevision = () => {
    if (!canRequestRevision) return;
    if (!revisionRecord || !revisionReasonText.trim()) return;
    requestRevisionGradingRecord(revisionRecord.id, revisionReasonText.trim());
    setRevisionRecord(null);
    if (selectedRecord?.id === revisionRecord.id) setSelectedRecord(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Duyệt Kết quả Chấm Nề nếp</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Tổng phụ trách Đội kiểm tra, đối chiếu biên bản của Cờ đỏ và phê duyệt điểm chính thức
          </p>
        </div>

        {/* Quick Batch Action */}
        {canApprove && activeTab === 'pending' && currentList.length > 0 && (
          <button
            onClick={() => setShowConfirmApproveAll(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Check className="w-4 h-4" />
            Duyệt tất cả ({currentList.length})
          </button>
        )}
      </div>

      {!canApprove && !canRequestRevision && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Chế độ xem Kết quả chấm (Chỉ đọc): </span>
            <span>
              Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu kết quả chấm. Quyền Duyệt điểm và Yêu cầu sửa phiếu chỉ dành cho tài khoản được Quản trị viên cấp quyền trong Bảng phân quyền.
            </span>
          </div>
        </div>
      )}

      {/* 3 Tabs: Chờ duyệt | Đã duyệt | Yêu cầu sửa */}
      <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chờ duyệt</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'pending' ? 'bg-amber-600 text-white' : 'bg-blue-200 text-blue-950 font-bold'
              }`}
            >
              {pendingCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Đã duyệt</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'approved' ? 'bg-emerald-700 text-white' : 'bg-blue-200 text-blue-950 font-bold'
              }`}
            >
              {approvedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('revision_requested')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'revision_requested'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Yêu cầu sửa</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'revision_requested' ? 'bg-rose-700 text-white' : 'bg-blue-200 text-blue-950 font-bold'
              }`}
            >
              {revisionCount}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
          <input
            type="text"
            placeholder="Tìm theo cờ đỏ, lớp, ngày..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Table: Cờ đỏ | Lớp | Ngày | Nội dung | Trạng thái | Thao tác */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Cờ đỏ chấm</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4">Ngày chấm</th>
                <th className="py-3 px-4">Lỗi vi phạm ghi nhận</th>
                <th className="py-3 px-4 text-center">Tổng điểm trừ</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    Không có phiếu chấm nào trong mục này
                  </td>
                </tr>
              ) : (
                currentList.map((rec, idx) => {
                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 text-center font-mono text-slate-500 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{rec.redFlagName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {rec.className.includes('Lớp') ? rec.className : `Lớp ${rec.className}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {rec.dayOfWeek} <span className="font-normal text-slate-400 text-[11px]">({rec.date})</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5 max-w-sm">
                          {rec.violations.map((v, i) => (
                            <p key={i} className="text-slate-700 truncate">
                              • {v.name} (x{v.quantity})
                            </p>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-black text-rose-600 tabular-nums">
                          -{rec.totalDeduction}đ
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {rec.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã duyệt
                          </span>
                        ) : rec.status === 'revision_requested' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            Yêu cầu sửa
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedRecord(rec)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                            title="Xem chi tiết phiếu"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Approve ✓ */}
                          {rec.status !== 'approved' && canApprove && (
                            <button
                              onClick={() => handleApprove(rec.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                              title="Duyệt kết quả"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Duyệt</span>
                            </button>
                          )}

                          {/* Request revision ✕ */}
                          {rec.status !== 'revision_requested' && canRequestRevision && (
                            <button
                              onClick={() => handleOpenRevision(rec)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                              title="Yêu cầu sửa phiếu"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Sửa</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Xem chi tiết phiếu chấm */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Chi tiết phiếu chấm: Lớp {selectedRecord.className}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cờ đỏ: {selectedRecord.redFlagName} · {selectedRecord.dayOfWeek} ({selectedRecord.date})
                </p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Summary pill box */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Thời gian tạo:</span>
                  <p className="font-semibold text-slate-800">{selectedRecord.createdAt}</p>
                </div>
                <div>
                  <span className="text-slate-500">Tổng điểm trừ:</span>
                  <p className="font-black text-rose-600 text-base tabular-nums">
                    -{selectedRecord.totalDeduction} điểm
                  </p>
                </div>
              </div>

              {/* Violations detail */}
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-[11px] mb-2">
                  Danh sách vi phạm ({selectedRecord.violations.length} mục)
                </h4>
                <div className="space-y-2">
                  {selectedRecord.violations.map((v, i) => (
                    <div key={i} className="p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{v.name}</span>
                        <span className="font-black text-rose-600">{v.totalPoints}đ</span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-slate-600">
                        <span>Số lượng: {v.quantity}</span>
                        <span>Đơn giá: {v.unitPoints}đ</span>
                      </div>
                      {v.studentNames && (
                        <p className="mt-1 text-slate-700">
                          Học sinh vi phạm: <strong>{v.studentNames}</strong>
                        </p>
                      )}
                      {v.note && <p className="mt-0.5 text-slate-500 italic">Ghi chú: {v.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              {/* General Note */}
              {selectedRecord.generalNote && (
                <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-0.5">Ghi chú của cờ đỏ:</p>
                  <p className="text-slate-700">{selectedRecord.generalNote}</p>
                </div>
              )}

              {/* Existing revision reason if any */}
              {selectedRecord.revisionReason && (
                <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 text-rose-900">
                  <p className="font-bold mb-0.5">Lý do yêu cầu sửa trước đó:</p>
                  <p>{selectedRecord.revisionReason}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              {canRequestRevision && (
                <button
                  onClick={() => handleOpenRevision(selectedRecord)}
                  className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold hover:bg-rose-100 cursor-pointer"
                >
                  ✕ Yêu cầu sửa
                </button>
              )}
              {canApprove && (
                <button
                  onClick={() => handleApprove(selectedRecord.id)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 shadow-xs cursor-pointer"
                >
                  ✓ Duyệt kết quả
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nhập lý do yêu cầu sửa (Explicit user requirement) */}
      {revisionRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Yêu cầu sửa phiếu chấm: Lớp {revisionRecord.className}
              </h3>
              <button onClick={() => setRevisionRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Vui lòng nhập lý do cụ thể để cờ đỏ{' '}
                <strong className="text-slate-900">{revisionRecord.redFlagName}</strong> nắm được và xác
                minh lại thông tin (Cờ đỏ sẽ nhìn thấy lý do này ngay khi đăng nhập):
              </p>

              <textarea
                rows={4}
                value={revisionReasonText}
                onChange={(e) => setRevisionReasonText(e.target.value)}
                placeholder="Ví dụ: GVCN phản hồi buổi sáng đã trực nhật sạch sẽ, đề nghị kiểm tra lại số phòng hoặc ghi rõ họ tên học sinh vi phạm..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setRevisionRecord(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmRevision}
                disabled={!revisionReasonText.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Gửi yêu cầu sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Duyệt nhanh tất cả */}
      {showConfirmApproveAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Check className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Xác nhận duyệt tất cả?</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Bạn có chắc chắn muốn duyệt nhanh toàn bộ {currentList.length} phiếu chấm đang chờ xử lý? Điểm số sẽ được ghi nhận chính thức vào bảng thi đua.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowConfirmApproveAll(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  currentList.forEach((r) => approveGradingRecord(r.id, currentUser.name));
                  setShowConfirmApproveAll(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Đồng ý duyệt ({currentList.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
