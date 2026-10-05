import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ViolationCatalogItem, CriteriaCategory } from '../types';
import {
  AlertTriangle,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  BookOpen,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

export const ViolationsCatalogView: React.FC = () => {
  const {
    violationsCatalog,
    addViolationCatalogItem,
    updateViolationCatalogItem,
    deleteViolationCatalogItem,
    hasPermission,
    currentUser,
  } = useApp();

  const canEdit = hasPermission('canEditSettings');

  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ViolationCatalogItem | null>(null);

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<ViolationCatalogItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories: CriteriaCategory[] = [
    'Trang phục',
    'Đi học',
    'Học tập',
    'Vệ sinh',
    'Nề nếp',
    'Thể dục',
    'Hoạt động Đội',
    'Khác',
  ];

  const [formData, setFormData] = useState<Omit<ViolationCatalogItem, 'id'>>({
    code: `L${(violationsCatalog.length + 1).toString().padStart(2, '0')}`,
    category: 'Trang phục',
    name: '',
    pointsDeducted: 1,
    description: '',
  });

  const filteredViolations = violationsCatalog.filter((v) => {
    const matchCat = selectedCat === 'all' || v.category === selectedCat;
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingItem) {
      updateViolationCatalogItem(editingItem.id, formData);
      setEditingItem(null);
      showToast(`Đã cập nhật lỗi: ${formData.name}`);
    } else {
      addViolationCatalogItem(formData);
      setShowAddModal(false);
      showToast(`Đã thêm mới lỗi: ${formData.name}`);
    }

    setFormData({
      code: `L${(violationsCatalog.length + 2).toString().padStart(2, '0')}`,
      category: 'Trang phục',
      name: '',
      pointsDeducted: 1,
      description: '',
    });
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteViolationCatalogItem(itemToDelete.id);
    showToast(`Đã xóa lỗi: ${itemToDelete.name}`);
    setItemToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Danh mục Lỗi vi phạm</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Danh mục chuẩn hóa để Ban Cờ đỏ lựa chọn khi đi chấm nề nếp hàng ngày (chống nhập sai lệch điểm)
          </p>
        </div>

        <button
          onClick={() => {
            if (!canEdit) return;
            setEditingItem(null);
            setFormData({
              code: `L${(violationsCatalog.length + 1).toString().padStart(2, '0')}`,
              category: 'Trang phục',
              name: '',
              pointsDeducted: 2,
              description: 'Trừ 2 điểm/lần vi phạm',
            });
            setShowAddModal(true);
          }}
          disabled={!canEdit}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors ${
            canEdit
              ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
              : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
          }`}
          title={canEdit ? 'Thêm lỗi mới' : 'Tài khoản không có quyền thêm lỗi'}
        >
          <Plus className="w-4 h-4" />
          Thêm lỗi mới
        </button>
      </div>

      {/* Permission banner when unauthorized */}
      {!canEdit && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Chế độ xem (Phân quyền hạn chế): </span>
            <span>
              Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu. Các nút Thao tác (Thêm mới, Chỉnh sửa, Xóa) bị làm mờ theo bảng phân quyền.
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCat === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
            }`}
          >
            Tất cả ({violationsCatalog.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
          <input
            type="text"
            placeholder="Tìm theo mã, tên lỗi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid view of violations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredViolations.map((v) => {
          return (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-blue-100 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                    {v.code}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {v.category}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">{v.name}</h4>
                {v.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{v.description}</p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-base font-black text-rose-600 tabular-nums">
                  -{v.pointsDeducted}{' '}
                  <span className="text-xs font-medium text-slate-400">điểm/lần</span>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (!canEdit) return;
                      setEditingItem(v);
                      setFormData({
                        code: v.code,
                        category: v.category,
                        name: v.name,
                        pointsDeducted: v.pointsDeducted,
                        description: v.description || '',
                      });
                    }}
                    disabled={!canEdit}
                    className={`p-1.5 rounded-md transition-colors ${
                      canEdit
                        ? 'text-slate-500 hover:text-blue-700 hover:bg-slate-100 cursor-pointer'
                        : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                    }`}
                    title={
                      canEdit
                        ? 'Sửa lỗi'
                        : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền sửa`
                    }
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!canEdit) return;
                      setItemToDelete(v);
                    }}
                    disabled={!canEdit}
                    className={`p-1.5 rounded-md transition-colors ${
                      canEdit
                        ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                        : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                    }`}
                    title={
                      canEdit
                        ? 'Xóa lỗi'
                        : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền xóa`
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Thêm / Sửa lỗi */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingItem ? 'Sửa thông tin lỗi vi phạm' : 'Thêm Lỗi vi phạm vào danh mục'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã lỗi:</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhóm vi phạm:</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên hành vi vi phạm:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Không đeo khăn quàng đỏ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm trừ mỗi lần (-):</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.pointsDeducted}
                  onChange={(e) => setFormData({ ...formData, pointsDeducted: Math.abs(Number(e.target.value)) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-rose-600 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết / Ghi chú:</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ví dụ: Trừ 1 điểm cho mỗi bạn học sinh không đeo khăn quàng vào giờ truy bài"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
                >
                  {editingItem ? 'Lưu thay đổi' : 'Thêm vào danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      <ConfirmDeleteModal
        isOpen={itemToDelete !== null}
        title="Xác nhận xóa lỗi vi phạm"
        message="Bạn có chắc chắn muốn xóa lỗi này khỏi danh mục không?"
        itemName={itemToDelete ? `${itemToDelete.name} (${itemToDelete.code} - Nhóm: ${itemToDelete.category} - Trừ ${itemToDelete.pointsDeducted}đ)` : ''}
        itemType="Lỗi vi phạm danh mục"
        warningText="Lỗi này sẽ không còn hiển thị trong danh mục lựa chọn khi Ban Cờ đỏ đi chấm điểm."
        confirmLabel="Đồng ý xóa"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() => setItemToDelete(null)}
      />

      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
