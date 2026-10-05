import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  History,
  Clock,
  User,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Users,
  Key,
  ShieldCheck,
  Smartphone,
  BookOpen,
  FileSpreadsheet,
  Award,
  Check,
  X as CloseIcon,
} from 'lucide-react';
import { PermissionSettings, RolePermissionConfig, SchoolSettings } from '../types';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    updatePermissions,
    auditLogs,
    allUsers,
    classes,
    redFlags,
    currentUser,
    hasPermission,
  } = useApp();

  const canEdit = hasPermission('canEditSettings');

  const [formData, setFormData] = useState({ ...settings });
  const [permissionData, setPermissionData] = useState<PermissionSettings>(
    settings.permissions || {
      bgh: {
        canGrade: false,
        canApprove: false,
        canViewReports: true,
        canManageClasses: false,
        canManageRedFlags: false,
        canEditSettings: false,
        canExportData: true,
        canSignMinutes: false,
        canRequestRevision: false,
      },
      gvcn: {
        canGrade: false,
        canApprove: false,
        canViewReports: true,
        canManageClasses: false,
        canManageRedFlags: false,
        canEditSettings: false,
        canExportData: true,
        canSignMinutes: false,
        canRequestRevision: false,
      },
      red_flag: {
        canGrade: true,
        canApprove: false,
        canViewReports: false,
        canManageClasses: false,
        canManageRedFlags: false,
        canEditSettings: false,
        canExportData: false,
        canSignMinutes: false,
        canRequestRevision: false,
      },
    }
  );

  const [activeTab, setActiveTab] = useState<'config' | 'permissions' | 'audit_logs'>('config');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savePermSuccess, setSavePermSuccess] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [selectedRoleCard, setSelectedRoleCard] = useState<'all' | 'bgh' | 'gvcn' | 'red_flag'>('all');

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSavePermissions = () => {
    updatePermissions(permissionData);
    setSavePermSuccess(true);
    setTimeout(() => setSavePermSuccess(false), 3000);
  };

  const handleTogglePermission = (
    role: keyof PermissionSettings,
    key: keyof RolePermissionConfig
  ) => {
    setPermissionData((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: !prev[role][key],
      },
    }));
  };

  const handleResetToStandard = () => {
    const standard: PermissionSettings = {
      bgh: {
        canGrade: false,
        canApprove: false,
        canViewReports: true,
        canManageClasses: false,
        canManageRedFlags: false,
        canEditSettings: false,
        canExportData: true,
        canSignMinutes: false,
        canRequestRevision: false,
      },
      gvcn: {
        canGrade: false,
        canApprove: false,
        canViewReports: true,
        canManageClasses: false,
        canManageRedFlags: false,
        canEditSettings: false,
        canExportData: true,
        canSignMinutes: false,
        canRequestRevision: false,
      },
      red_flag: {
        canGrade: true,
        canApprove: false,
        canViewReports: false,
        canManageClasses: false,
        canManageRedFlags: false,
        canEditSettings: false,
        canExportData: false,
        canSignMinutes: false,
        canRequestRevision: false,
      },
    };
    setPermissionData(standard);
    updatePermissions(standard);
    setSavePermSuccess(true);
    setTimeout(() => setSavePermSuccess(false), 3000);
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.target.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  // List of permissions definition
  const permissionList: {
    key: keyof RolePermissionConfig;
    label: string;
    description: string;
    category: string;
  }[] = [
    {
      key: 'canGrade',
      label: 'Nhập điểm chấm nề nếp',
      description: 'Nhập phiếu chấm các ca trực sáng/chiều, ghi lỗi vi phạm của học sinh',
      category: 'Chấm điểm',
    },
    {
      key: 'canRequestRevision',
      label: 'Yêu cầu sửa / Khiếu nại điểm',
      description: 'Khiếu nại phiếu chấm cờ đỏ hoặc yêu cầu cờ đỏ đính chính lại lỗi ghi sai',
      category: 'Chấm điểm',
    },
    {
      key: 'canApprove',
      label: 'Phê duyệt phiếu chấm & Điểm tuần',
      description: 'Duyệt các phiếu chấm nề nếp, công nhận điểm thi đua tuần',
      category: 'Xét duyệt & Thi đua',
    },
    {
      key: 'canSignMinutes',
      label: 'Ký số & Ban hành biên bản',
      description: 'Ký xác nhận biên bản giao ban trực tuần và công bố bảng xếp hạng',
      category: 'Xét duyệt & Thi đua',
    },
    {
      key: 'canManageClasses',
      label: 'Quản lý lớp học & Học sinh',
      description: 'Thêm/sửa/xóa học sinh, nhập danh sách học sinh từ file Excel',
      category: 'Quản lý dữ liệu',
    },
    {
      key: 'canManageRedFlags',
      label: 'Quản lý Đội Cờ đỏ',
      description: 'Thêm thành viên, phân công ca trực tuần và cấp mã tài khoản cờ đỏ',
      category: 'Quản lý dữ liệu',
    },
    {
      key: 'canViewReports',
      label: 'Xem thống kê – Báo cáo tổng hợp',
      description: 'Xem biểu đồ thi đua, xu hướng tiến bộ, lọc theo lớp/tuần/tháng/học kỳ',
      category: 'Báo cáo & Thống kê',
    },
    {
      key: 'canExportData',
      label: 'Xuất dữ liệu Excel / In ấn',
      description: 'Xuất các bảng tổng hợp thi đua, danh sách học sinh ra file Excel/CSV/In',
      category: 'Báo cáo & Thống kê',
    },
    {
      key: 'canEditSettings',
      label: 'Cấu hình thông số & Phân quyền',
      description: 'Cài đặt biểu điểm, giờ chốt tuần tự động, quy chế thi đua và phân quyền người dùng',
      category: 'Hệ thống',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-blue-950">
              Quản trị hệ thống
            </span>
            <span className="text-xs text-blue-200">PTDTBT TH&THCS Quản Bạ</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Cài đặt Hệ thống & Phân quyền</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Cấu hình quy chế, thiết lập phân quyền chặt chẽ cho{' '}
            <strong className="text-amber-300">Ban giám hiệu</strong>,{' '}
            <strong className="text-amber-300">Giáo viên chủ nhiệm</strong> và{' '}
            <strong className="text-amber-300">Thành viên Cờ đỏ</strong>
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-blue-950/60 p-1.5 rounded-xl border border-blue-400/30">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'config'
                ? 'bg-amber-400 text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Cấu hình chung
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'permissions'
                ? 'bg-amber-400 text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Phân quyền vai trò</span>
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'audit_logs'
                ? 'bg-amber-400 text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            Nhật ký hệ thống ({auditLogs.length})
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3.5 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã lưu thành công cấu hình hệ thống!</span>
        </div>
      )}

      {savePermSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-3.5 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã cập nhật và lưu phân quyền thành công cho Ban giám hiệu, GVCN và Cờ đỏ!</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 1: CẤU HÌNH CHUNG */}
      {/* ============================================================ */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          {/* Card 1: THÔNG TIN TRƯỜNG */}
          <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
              <Shield className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wide">
                THÔNG TIN NHÀ TRƯỜNG & ĐƠN VỊ
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-blue-950 mb-1">Tên trường:</label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/30 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-blue-950 mb-1">Mô hình nhà trường:</label>
                <input
                  type="text"
                  value={formData.schoolType}
                  onChange={(e) => setFormData({ ...formData, schoolType: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/30 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-blue-950 mb-1">Địa phương / Huyện:</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/30 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-blue-950 mb-1">Năm học áp dụng:</label>
                <input
                  type="text"
                  value={formData.schoolYear}
                  onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                  className="w-full px-3 py-2 bg-blue-50/30 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tổng phụ trách Đội:</label>
                <input
                  type="text"
                  value={formData.youthUnionLeader}
                  onChange={(e) => setFormData({ ...formData, youthUnionLeader: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hiệu trưởng phê duyệt:</label>
                <input
                  type="text"
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Card 2: QUY CHẾ VÀ ĐIỀU LỆ THI ĐUA */}
          <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-blue-100">
              <Sliders className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-blue-950 text-sm uppercase tracking-wide">
                QUY CHẾ TÍNH ĐIỂM & CHỐT TUẦN
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-blue-950 mb-1">
                  Điểm nền ban đầu mỗi tuần (mặc định 100):
                </label>
                <input
                  type="number"
                  value={formData.baseScore}
                  onChange={(e) => setFormData({ ...formData, baseScore: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-blue-950 bg-blue-50/20"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-blue-950 mb-1">Thời gian tự động khóa tuần:</label>
                <input
                  type="text"
                  value={formData.autoLockTime}
                  onChange={(e) => setFormData({ ...formData, autoLockTime: e.target.value })}
                  className="w-full px-3 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-blue-950"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-blue-950 mb-1">
                  Quy tắc xếp hạng khi bằng điểm nhau:
                </label>
                <select
                  value={formData.tieBreakerRule}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tieBreakerRule: e.target.value as SchoolSettings['tieBreakerRule'],
                    })
                  }
                  className="w-full px-3 py-2 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="violation_count">Ưu tiên lớp có ít số lượt vi phạm hơn</option>
                  <option value="study_score">Ưu tiên điểm thi đua mục Học tập cao hơn</option>
                  <option value="draw">Đồng hạng (cùng nhận danh hiệu)</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="allowEdit"
                  checked={formData.allowEditAfterSubmission}
                  onChange={(e) =>
                    setFormData({ ...formData, allowEditAfterSubmission: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="allowEdit" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Cho phép cờ đỏ sửa phiếu trong vòng 30 phút sau khi nộp
                </label>
              </div>
            </div>
          </div>

          {!canEdit && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs mb-3">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Chế độ xem Cấu hình (Chỉ đọc): </span>
                <span>
                  Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu cấu hình. Chỉ <strong>Quản trị viên (Admin)</strong> mới có quyền thay đổi thông số này.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={!canEdit}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-colors ${
                canEdit
                  ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
              }`}
              title={canEdit ? 'Lưu cấu hình hệ thống' : 'Chỉ Quản trị viên mới được lưu cấu hình'}
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình hệ thống
            </button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PHÂN QUYỀN VAI TRÒ (BAN GIÁM HIỆU, GVCN, CỜ ĐỎ) */}
      {/* ============================================================ */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Policy Rule Announcement Banner */}
          <div className="bg-blue-950 text-white p-4 rounded-2xl border border-blue-800/80 shadow-sm flex items-start gap-3 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300 uppercase tracking-wide">
                QUY ĐỊNH BẢO MẬT & PHÂN QUYỀN HỆ THỐNG:
              </p>
              <p className="text-blue-100 mt-1">
                Ngoài tài khoản <strong>Quản trị viên (Admin)</strong> có toàn quyền mặc định, <strong>tất cả các tài khoản khác (Ban Giám Hiệu, GV Chủ Nhiệm, Đội Cờ Đỏ, Học sinh) đều chỉ có chức năng Xem</strong>. Các tài khoản này hoàn toàn <strong>không được phép Thêm, Sửa hay Xóa bất kỳ dữ liệu nào</strong> trừ khi được Quản trị viên tích chọn cấp quyền cụ thể trong bảng dưới đây.
              </p>
            </div>
          </div>

          {!canEdit && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Chế độ xem Bảng phân quyền (Chỉ đọc): </span>
                <span>
                  Tài khoản hiện tại <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền xem phân quyền. Chỉ <strong>Quản trị viên (Admin)</strong> mới có quyền bật/tắt các quyền này.
                </span>
              </div>
            </div>
          )}

          {/* Top Banner & Info */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                  <h3 className="font-bold text-blue-950 text-base">
                    MA TRẬN PHÂN QUYỀN THEO VAI TRÒ HỆ THỐNG (RBAC)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Thiết lập chi tiết quyền hạn tác vụ cho từng nhóm đối tượng người dùng. Tích chọn để cấp quyền, bỏ tích để thu hồi quyền ngay lập tức.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetToStandard}
                  disabled={!canEdit}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                    canEdit
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                  }`}
                  title="Khôi phục phân quyền chuẩn (Chỉ Admin toàn quyền, các vai trò khác chỉ xem)"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  Khôi phục mặc định (Chỉ xem)
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={!canEdit}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors ${
                    canEdit
                      ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                  }`}
                  title={canEdit ? 'Lưu cấu hình phân quyền' : 'Chỉ Admin mới có quyền lưu'}
                >
                  <Save className="w-4 h-4" />
                  Lưu cấu hình phân quyền
                </button>
              </div>
            </div>

            {/* 3 Summary Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
              {/* Role 1: Ban Giám Hiệu */}
              <div
                onClick={() => setSelectedRoleCard(selectedRoleCard === 'bgh' ? 'all' : 'bgh')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedRoleCard === 'bgh'
                    ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white border-blue-200 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Nhóm Quản Trị Cao Cấp
                  </span>
                  <Award className="w-4 h-4 text-blue-700" />
                </div>
                <h4 className="text-sm font-black text-blue-950 mt-2">1. Ban Giám Hiệu (BGH)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Hiệu trưởng, Phó Hiệu trưởng, Tổng phụ trách Đội
                </p>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                    Duyệt thi đua
                  </span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                    Khóa tuần
                  </span>
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold border border-amber-200">
                    Phân quyền
                  </span>
                </div>
              </div>

              {/* Role 2: Giáo Viên Chủ Nhiệm */}
              <div
                onClick={() => setSelectedRoleCard(selectedRoleCard === 'gvcn' ? 'all' : 'gvcn')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedRoleCard === 'gvcn'
                    ? 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                    : 'bg-white border-blue-200 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    16 Chi Đội THCS
                  </span>
                  <BookOpen className="w-4 h-4 text-amber-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mt-2">2. Giáo Viên Chủ Nhiệm (GVCN)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  16 Thầy/Cô chủ nhiệm các lớp từ khối 6 đến khối 9
                </p>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-200">
                    Quản lý học sinh lớp
                  </span>
                  <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-semibold border border-amber-200">
                    Khiếu nại điểm
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                    Nhập Excel
                  </span>
                </div>
              </div>

              {/* Role 3: Đội Cờ Đỏ */}
              <div
                onClick={() => setSelectedRoleCard(selectedRoleCard === 'red_flag' ? 'all' : 'red_flag')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedRoleCard === 'red_flag'
                    ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                    : 'bg-white border-blue-200 hover:border-rose-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    32 Thành Viên Trực Ban
                  </span>
                  <Smartphone className="w-4 h-4 text-rose-600" />
                </div>
                <h4 className="text-sm font-black text-slate-900 mt-2">3. Thành Viên Cờ Đỏ (Sao Đỏ)</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Đội thiếu niên cờ đỏ trực ban chéo giữa các khối
                </p>
                <div className="mt-3 flex flex-wrap gap-1 text-[10px]">
                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-semibold border border-rose-200">
                    Chấm điểm Mobile
                  </span>
                  <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-semibold border border-sky-200">
                    Ghi nhận vi phạm
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold border border-slate-300">
                    Không tự duyệt
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Permissions Matrix Table */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide">
                  BẢNG PHÂN QUYỀN CHI TIẾT THEO TÍNH NĂNG
                </h3>
                <p className="text-xs text-blue-200">
                  Nhấp vào ô để Bật / Tắt quyền tương ứng của vai trò
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-300 bg-blue-950/60 px-3 py-1 rounded-lg border border-blue-400/40">
                9 Nhóm Quyền Hạn
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-blue-50/80 text-blue-950 font-bold uppercase tracking-wider text-[11px] border-b border-blue-200">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    <th className="py-3 px-4 min-w-[200px]">Tính năng / Tác vụ hệ thống</th>
                    <th className="py-3 px-4 text-slate-600">Phân loại</th>
                    <th className="py-3 px-4 text-center min-w-[140px] bg-emerald-100/70 text-emerald-950 font-black">
                      Quản trị viên (Admin)
                    </th>
                    <th className="py-3 px-4 text-center min-w-[140px] bg-blue-100/50">
                      Ban Giám Hiệu
                    </th>
                    <th className="py-3 px-4 text-center min-w-[140px] bg-amber-100/40">
                      GV Chủ Nhiệm
                    </th>
                    <th className="py-3 px-4 text-center min-w-[140px] bg-rose-100/30">
                      Thành Viên Cờ Đỏ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {permissionList.map((perm, idx) => {
                    const isBgh = permissionData.bgh[perm.key];
                    const isGvcn = permissionData.gvcn[perm.key];
                    const isRedFlag = permissionData.red_flag[perm.key];

                    return (
                      <tr key={perm.key} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-3 px-4 text-center font-mono text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 text-xs">{perm.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{perm.description}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {perm.category}
                          </span>
                        </td>

                        {/* Quản trị viên (Admin) - Cố định bảo mật toàn quyền */}
                        <td className="py-3 px-4 text-center bg-emerald-50/30">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs" title="Quản trị viên luôn có toàn quyền mọi tính năng">
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                            Toàn quyền
                          </span>
                        </td>

                        {/* Ban Giám Hiệu */}
                        <td className="py-3 px-4 text-center bg-blue-50/20">
                          <button
                            type="button"
                            onClick={() => canEdit && handleTogglePermission('bgh', perm.key)}
                            disabled={!canEdit}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              !canEdit
                                ? isBgh
                                  ? 'bg-blue-300 text-white cursor-not-allowed opacity-60'
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-40'
                                : isBgh
                                ? 'bg-blue-700 text-white shadow-xs cursor-pointer hover:bg-blue-800'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer'
                            }`}
                            title={
                              !canEdit
                                ? 'Chỉ Quản trị viên mới được thay đổi quyền'
                                : `Nhấn để ${isBgh ? 'Thu hồi' : 'Cấp'} quyền cho Ban Giám Hiệu`
                            }
                          >
                            {isBgh ? <Check className="w-3.5 h-3.5" /> : <CloseIcon className="w-3.5 h-3.5" />}
                            <span>{isBgh ? 'Có quyền' : 'Chỉ xem'}</span>
                          </button>
                        </td>

                        {/* GV Chủ Nhiệm */}
                        <td className="py-3 px-4 text-center bg-amber-50/15">
                          <button
                            type="button"
                            onClick={() => canEdit && handleTogglePermission('gvcn', perm.key)}
                            disabled={!canEdit}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              !canEdit
                                ? isGvcn
                                  ? 'bg-amber-300 text-white cursor-not-allowed opacity-60'
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-40'
                                : isGvcn
                                ? 'bg-amber-600 text-white shadow-xs cursor-pointer hover:bg-amber-700'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer'
                            }`}
                            title={
                              !canEdit
                                ? 'Chỉ Quản trị viên mới được thay đổi quyền'
                                : `Nhấn để ${isGvcn ? 'Thu hồi' : 'Cấp'} quyền cho GVCN`
                            }
                          >
                            {isGvcn ? <Check className="w-3.5 h-3.5" /> : <CloseIcon className="w-3.5 h-3.5" />}
                            <span>{isGvcn ? 'Có quyền' : 'Chỉ xem'}</span>
                          </button>
                        </td>

                        {/* Thành Viên Cờ Đỏ */}
                        <td className="py-3 px-4 text-center bg-rose-50/15">
                          <button
                            type="button"
                            onClick={() => canEdit && handleTogglePermission('red_flag', perm.key)}
                            disabled={!canEdit}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              !canEdit
                                ? isRedFlag
                                  ? 'bg-rose-300 text-white cursor-not-allowed opacity-60'
                                  : 'bg-slate-100 text-slate-300 cursor-not-allowed opacity-40'
                                : isRedFlag
                                ? 'bg-rose-600 text-white shadow-xs cursor-pointer hover:bg-rose-700'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 cursor-pointer'
                            }`}
                            title={
                              !canEdit
                                ? 'Chỉ Quản trị viên mới được thay đổi quyền'
                                : `Nhấn để ${isRedFlag ? 'Thu hồi' : 'Cấp'} quyền cho Cờ đỏ`
                            }
                          >
                            {isRedFlag ? <Check className="w-3.5 h-3.5" /> : <CloseIcon className="w-3.5 h-3.5" />}
                            <span>{isRedFlag ? 'Có quyền' : 'Chỉ xem'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-600">
                Các thay đổi có hiệu lực ngay khi nhấn nút{' '}
                <strong className="text-blue-900">"Lưu cấu hình phân quyền"</strong>.
              </span>
              <button
                type="button"
                onClick={handleSavePermissions}
                disabled={!canEdit}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-colors ${
                  canEdit
                    ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                    : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                }`}
                title={canEdit ? 'Lưu cấu hình phân quyền' : 'Chỉ Quản trị viên mới có quyền lưu'}
              >
                <Save className="w-4 h-4" />
                Lưu cấu hình phân quyền
              </button>
            </div>
          </div>

          {/* User Account Registry by Role */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <h3 className="font-bold text-blue-950 text-sm">
                  DANH SÁCH TÀI KHOẢN THEO NHÓM VAI TRÒ
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Tổng 5 tài khoản mẫu + 16 GVCN + 32 Cờ đỏ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allUsers.map((u) => {
                const roleBadge =
                  u.role === 'admin'
                    ? { bg: 'bg-indigo-100 text-indigo-800', label: 'Quản trị viên (TPT)' }
                    : u.role === 'bgh'
                    ? { bg: 'bg-blue-100 text-blue-800', label: 'Ban Giám Hiệu' }
                    : u.role === 'teacher'
                    ? { bg: 'bg-amber-100 text-amber-800', label: 'GV Chủ Nhiệm' }
                    : u.role === 'red_flag'
                    ? { bg: 'bg-rose-100 text-rose-800', label: 'Đội Cờ Đỏ' }
                    : { bg: 'bg-emerald-100 text-emerald-800', label: 'Đại diện Học sinh' };

                return (
                  <div
                    key={u.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3 hover:bg-blue-50/40 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-xs truncate">{u.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{u.title}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${roleBadge.bg}`}
                        >
                          {roleBadge.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">@{u.username}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: NHẬT KÝ HỆ THỐNG */}
      {/* ============================================================ */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-blue-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-700" />
              <h3 className="font-bold text-blue-950 text-xs sm:text-sm">
                NHẬT KÝ KIỂM TOÁN THAO TÁC HỆ THỐNG
              </h3>
            </div>
            <input
              type="text"
              placeholder="Tìm theo người dùng, tác vụ..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Thời gian</th>
                  <th className="py-2.5 px-3">Người dùng</th>
                  <th className="py-2.5 px-3">Vai trò</th>
                  <th className="py-2.5 px-3">Hành động</th>
                  <th className="py-2.5 px-3">Đối tượng</th>
                  <th className="py-2.5 px-3">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-blue-50/50">
                    <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-950">{log.user}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-600">{log.target}</td>
                    <td className="py-2.5 px-3 text-slate-500">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
