import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CriterionItem, CriteriaCategory } from '../types';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

export const CriteriaView: React.FC = () => {
  const { criteria, addCriterion, updateCriterion, deleteCriterion, hasPermission, currentUser } =
    useApp();

  // Permission: BGH & Admin have canEditSettings
  const canEdit = hasPermission('canEditSettings');

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCrit, setEditingCrit] = useState<CriterionItem | null>(null);

  // Row selection & Batch delete
  const [selectedCritIds, setSelectedCritIds] = useState<string[]>([]);
  const [critToDelete, setCritToDelete] = useState<{
    id?: string;
    ids?: string[];
    name: string;
    isBatch?: boolean;
    count?: number;
  } | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories: CriteriaCategory[] = [
    'Trang phục',
    'Đi học',
    'Vệ sinh',
    'Nề nếp',
    'Học tập',
    'Thể dục',
    'Hoạt động Đội',
    'Khen thưởng & Điểm cộng',
  ];

  const [formData, setFormData] = useState<Omit<CriterionItem, 'id'>>({
    code: `TC0${criteria.length + 1}`,
    category: 'Trang phục',
    name: '',
    defaultPoints: -1,
    type: 'deduction',
    appliedGrades: ['6', '7', '8', '9'],
    status: 'active',
    description: '',
  });

  const filteredCriteria = criteria.filter((c) => {
    const matchCat = selectedCategory === 'all' || c.category === selectedCategory;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Select all checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedCritIds(filteredCriteria.map((c) => c.id));
    } else {
      setSelectedCritIds([]);
    }
  };

  // Toggle single row checkbox
  const handleToggleRow = (id: string) => {
    setSelectedCritIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCrit) {
      updateCriterion(editingCrit.id, formData);
      setEditingCrit(null);
      showToast(`Đã cập nhật tiêu chí: ${formData.name}`);
    } else {
      addCriterion(formData);
      setShowAddModal(false);
      showToast(`Đã thêm mới tiêu chí: ${formData.name}`);
    }

    setFormData({
      code: `TC0${criteria.length + 2}`,
      category: 'Trang phục',
      name: '',
      defaultPoints: -1,
      type: 'deduction',
      appliedGrades: ['6', '7', '8', '9'],
      status: 'active',
      description: '',
    });
  };

  // Handle confirm delete (Single or Batch)
  const handleConfirmDelete = () => {
    if (!critToDelete) return;

    if (critToDelete.isBatch && critToDelete.ids) {
      critToDelete.ids.forEach((id) => deleteCriterion(id));
      setSelectedCritIds([]);
      showToast(`Đã xóa thành công ${critToDelete.ids.length} tiêu chí thi đua`);
    } else if (critToDelete.id) {
      deleteCriterion(critToDelete.id);
      setSelectedCritIds((prev) => prev.filter((id) => id !== critToDelete.id));
      showToast(`Đã xóa thành công tiêu chí: ${critToDelete.name}`);
    }

    setCritToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white">Tiêu chí Chấm điểm Thi đua</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Cấu hình khung thang điểm cộng, điểm trừ nề nếp kỷ cương áp dụng cho các khối lớp
          </p>
        </div>

        <button
          onClick={() => {
            if (!canEdit) return;
            setEditingCrit(null);
            setFormData({
              code: `TC0${criteria.length + 1}`,
              category: 'Trang phục',
              name: '',
              defaultPoints: -2,
              type: 'deduction',
              appliedGrades: ['6', '7', '8', '9'],
              status: 'active',
              description: '',
            });
            setShowAddModal(true);
          }}
          disabled={!canEdit}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors ${
            canEdit
              ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
              : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
          }`}
          title={canEdit ? 'Thêm tiêu chí mới' : 'Tài khoản không được phân quyền thêm tiêu chí'}
        >
          <Plus className="w-4 h-4" />
          Thêm tiêu chí mới
        </button>
      </div>

      {/* Permission Alert Banner when unauthorized */}
      {!canEdit && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Chế độ xem (Phân quyền hạn chế): </span>
            <span>
              Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu tiêu chí. Các nút Thêm mới, Chỉnh sửa, Xóa tiêu chí bị làm mờ theo bảng phân quyền.
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
            }`}
          >
            Tất cả ({criteria.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
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
            placeholder="Tìm theo mã, tên tiêu chí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* BATCH ACTION BAR: WHEN 1 OR MORE CRITERIA ARE SELECTED */}
      {selectedCritIds.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-rose-950 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Đã chọn {selectedCritIds.length} tiêu chí thi đua</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCritIds([])}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white rounded-xl transition-colors font-medium border border-transparent hover:border-slate-200"
            >
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              onClick={() => {
                if (!canEdit) return;
                setCritToDelete({
                  ids: selectedCritIds,
                  isBatch: true,
                  count: selectedCritIds.length,
                  name: `${selectedCritIds.length} tiêu chí thi đua đã chọn`,
                });
              }}
              disabled={!canEdit}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors ${
                !canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
              title={canEdit ? 'Xóa các tiêu chí đã chọn' : 'Tài khoản không có quyền'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa {selectedCritIds.length} tiêu chí đã chọn</span>
            </button>
          </div>
        </div>
      )}

      {/* Criteria Table: Checkbox | STT | Mã | Nhóm | Tiêu chí | Điểm | Loại | Trạng thái | Thao tác */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
              <tr>
                {/* SELECT ALL CHECKBOX */}
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredCriteria.length > 0 &&
                      selectedCritIds.length === filteredCriteria.length
                    }
                    onChange={handleSelectAll}
                    disabled={!canEdit || filteredCriteria.length === 0}
                    className={`rounded border-blue-300 text-blue-600 focus:ring-blue-400 w-4 h-4 transition-colors ${
                      !canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    title={canEdit ? 'Chọn tất cả tiêu chí' : 'Tài khoản không có quyền'}
                  />
                </th>
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-4">Mã</th>
                <th className="py-3 px-4">Nhóm tiêu chí</th>
                <th className="py-3 px-4">Tên tiêu chí quy định</th>
                <th className="py-3 px-4 text-center">Thang điểm</th>
                <th className="py-3 px-4">Loại điểm</th>
                <th className="py-3 px-4">Khối áp dụng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCriteria.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    Không tìm thấy tiêu chí phù hợp
                  </td>
                </tr>
              ) : (
                filteredCriteria.map((c, idx) => {
                  const isBonus = c.type === 'bonus';
                  const isSelected = selectedCritIds.includes(c.id);

                  return (
                    <tr
                      key={c.id}
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50/80' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* ROW CHECKBOX */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleRow(c.id)}
                          disabled={!canEdit}
                          className={`rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 transition-colors ${
                            !canEdit ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title={canEdit ? `Chọn tiêu chí ${c.name}` : 'Tài khoản không có quyền'}
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500 tabular-nums">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-blue-900">
                        {c.code}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-semibold text-[11px] border border-blue-200">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {c.name}
                        {c.description && (
                          <p className="text-[11px] font-normal text-slate-500 mt-0.5">{c.description}</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-sm font-black tabular-nums ${
                            isBonus ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {isBonus ? `+${c.defaultPoints}` : `${c.defaultPoints}`}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {isBonus ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Sparkles className="w-3 h-3" />
                            Điểm cộng
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                            <AlertCircle className="w-3 h-3" />
                            Điểm trừ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        Khối {c.appliedGrades.join(', ')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Áp dụng
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              if (!canEdit) return;
                              setEditingCrit(c);
                              setFormData({
                                code: c.code,
                                category: c.category,
                                name: c.name,
                                defaultPoints: c.defaultPoints,
                                type: c.type,
                                appliedGrades: c.appliedGrades,
                                status: c.status,
                                description: c.description || '',
                              });
                            }}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-md transition-colors ${
                              canEdit
                                ? 'text-slate-600 hover:text-blue-700 hover:bg-slate-100 cursor-pointer'
                                : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                            }`}
                            title={
                              canEdit
                                ? 'Sửa tiêu chí'
                                : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền sửa`
                            }
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (!canEdit) return;
                              setCritToDelete({
                                id: c.id,
                                name: `${c.name} (${c.code} - Nhóm: ${c.category} - ${isBonus ? '+' : ''}${c.defaultPoints}đ)`,
                              });
                            }}
                            disabled={!canEdit}
                            className={`p-1.5 rounded-md transition-colors ${
                              canEdit
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                                : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                            }`}
                            title={
                              canEdit
                                ? 'Xóa tiêu chí'
                                : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền xóa`
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Modal: Thêm / Sửa tiêu chí */}
      {(showAddModal || editingCrit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingCrit ? 'Sửa thông tin Tiêu chí' : 'Thêm Tiêu chí Thi đua mới'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingCrit(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã tiêu chí:</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nhóm tiêu chí:</label>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên hành vi / Tiêu chí:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Đi học muộn, Không đeo khăn quàng..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phân loại:</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                        defaultPoints:
                          e.target.value === 'bonus'
                            ? Math.abs(formData.defaultPoints) || 1
                            : -Math.abs(formData.defaultPoints) || -1,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="deduction">Điểm trừ (-)</option>
                    <option value="bonus">Điểm cộng (+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Điểm mặc định:</label>
                  <input
                    type="number"
                    value={formData.defaultPoints}
                    onChange={(e) => setFormData({ ...formData, defaultPoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú hướng dẫn:</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ví dụ: Trừ 1 điểm/học sinh vi phạm"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCrit(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800"
                >
                  {editingCrit ? 'Lưu thay đổi' : 'Thêm tiêu chí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL FOR CRITERIA DELETION */}
      <ConfirmDeleteModal
        isOpen={critToDelete !== null}
        title={critToDelete?.isBatch ? `Xác nhận xóa ${critToDelete.count} tiêu chí` : 'Xác nhận xóa tiêu chí thi đua'}
        message="Bạn có chắc chắn muốn xóa tiêu chí này khỏi hệ thống không? Dữ liệu sẽ được cập nhật ngay lập tức."
        itemName={critToDelete?.name}
        itemType="Tiêu chí chấm điểm thi đua"
        warningText="Việc xóa tiêu chí có thể ảnh hưởng đến bảng danh mục chấm điểm của Ban Cờ đỏ."
        confirmLabel="Đồng ý xóa"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() => setCritToDelete(null)}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
