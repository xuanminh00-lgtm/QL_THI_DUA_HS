import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  itemType?: string; // e.g. "lớp học", "học sinh", "tiêu chí vi phạm"
  warningText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title = 'Xác nhận xóa dữ liệu',
  message = 'Bạn có chắc chắn muốn xóa dữ liệu này không?',
  itemName,
  itemType,
  warningText = 'Dữ liệu bị xóa sẽ không thể phục hồi lại.',
  confirmLabel = 'Đồng ý xóa',
  cancelLabel = 'Hủy bỏ',
  onConfirm,
  onClose,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600" />

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-xs border border-rose-200">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="pr-6">
            <h3 className="text-base font-black text-slate-900 leading-snug">{title}</h3>
            <p className="text-xs text-slate-500 mt-1">{message}</p>
          </div>
        </div>

        {/* Highlighted Item Info */}
        {itemName && (
          <div className="mt-4 p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl">
            <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
              {itemType ? `Đối tượng cần xóa: ${itemType}` : 'Thông tin đối tượng:'}
            </div>
            <div className="text-sm font-bold text-rose-950 mt-0.5 break-words">
              {itemName}
            </div>
          </div>
        )}

        {/* Warning text */}
        <div className="mt-3.5 flex items-center gap-2 text-[12px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200/70">
          <span className="font-bold shrink-0">⚠️ Cảnh báo:</span>
          <span>{warningText}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isLoading ? 'Đang xóa...' : confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
