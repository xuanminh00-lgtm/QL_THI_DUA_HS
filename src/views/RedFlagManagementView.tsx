import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { RedFlagMember, AssignmentItem } from '../types';
import {
  Flag,
  Plus,
  KeyRound,
  Lock,
  Unlock,
  Edit2,
  Trash2,
  Search,
  Download,
  CheckCircle2,
  ShieldAlert,
  X,
  School,
  Sparkles,
  Phone,
  UserCheck,
  Shield,
  AlertTriangle,
  Award,
  Users,
  CalendarClock,
  Wand2,
  Copy,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const RedFlagManagementView: React.FC = () => {
  const {
    redFlags,
    classes,
    addRedFlag,
    updateRedFlag,
    deleteRedFlag,
    toggleRedFlagStatus,
    resetRedFlagPassword,
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    autoAssignWeek,
    copyAssignmentsFromPreviousWeek,
    weeks,
    selectedWeekId,
    setSelectedWeekId,
    currentWeek,
    currentUser,
    hasPermission,
  } = useApp();

  const canManage = hasPermission('canManageRedFlags');

  // Top Management Tab: 'members' (Danh sách cờ đỏ) | 'assignments' (Phân công cờ đỏ chấm lớp nào)
  const [activeTab, setActiveTab] = useState<'members' | 'assignments'>('members');

  // Global Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // ================= TAB 1: MEMBERS STATE =================
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberLevelFilter, setMemberLevelFilter] = useState<'all' | 'thcs' | 'tieuhoc'>('all');
  const [memberClassFilter, setMemberClassFilter] = useState('all');

  // Modals for Members
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<RedFlagMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<RedFlagMember | null>(null);

  // Form state for Members
  const [memberFormData, setMemberFormData] = useState({
    code: `CD${(redFlags.length + 1).toString().padStart(2, '0')}`,
    name: '',
    classId: 'c-8a',
    className: '8A',
    account: '',
    role: 'Cờ đỏ viên',
    phone: '',
    status: 'active' as 'active' | 'locked',
    dutyArea: 'Dãy nhà B - Khối 7',
  });

  // Calculate member stats
  const memberStats = useMemo(() => {
    let thcsCount = 0;
    let tieuhocCount = 0;
    let activeCount = 0;
    let lockedCount = 0;

    redFlags.forEach((rf) => {
      const cls = classes.find((c) => c.code === rf.className || c.id === rf.classId);
      const gradeNum = cls ? Number(cls.grade) : parseInt(rf.className) || 7;
      if (gradeNum >= 6 && gradeNum <= 9) thcsCount++;
      if (gradeNum >= 1 && gradeNum <= 5) tieuhocCount++;
      if (rf.status === 'active') activeCount++;
      else lockedCount++;
    });

    return {
      total: redFlags.length,
      thcsCount,
      tieuhocCount,
      activeCount,
      lockedCount,
    };
  }, [redFlags, classes]);

  const filteredMembers = useMemo(() => {
    return redFlags.filter((rf) => {
      if (memberLevelFilter !== 'all') {
        const matchedClass = classes.find((c) => c.code === rf.className || c.id === rf.classId);
        const gradeNum = matchedClass ? Number(matchedClass.grade) : parseInt(rf.className) || 7;
        if (memberLevelFilter === 'thcs' && (gradeNum < 6 || gradeNum > 9)) return false;
        if (memberLevelFilter === 'tieuhoc' && (gradeNum < 1 || gradeNum > 5)) return false;
      }

      const matchClass = memberClassFilter === 'all' || rf.className === memberClassFilter;
      const matchSearch =
        rf.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        rf.code.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        rf.account.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        (rf.dutyArea && rf.dutyArea.toLowerCase().includes(memberSearchTerm.toLowerCase())) ||
        (rf.phone && rf.phone.includes(memberSearchTerm)) ||
        (rf.role && rf.role.toLowerCase().includes(memberSearchTerm.toLowerCase()));
      return matchClass && matchSearch;
    });
  }, [redFlags, classes, memberLevelFilter, memberClassFilter, memberSearchTerm]);

  const handleOpenAddMemberModal = () => {
    if (!canManage) return;
    setEditingMember(null);
    const nextCode = `CD${(redFlags.length + 1).toString().padStart(2, '0')}`;
    const defaultCls = classes[0] || { id: 'c-8a', code: '8A' };
    setMemberFormData({
      code: nextCode,
      name: '',
      classId: defaultCls.id,
      className: defaultCls.code,
      account: `codo_${nextCode.toLowerCase()}`,
      role: 'Cờ đỏ viên',
      phone: '',
      status: 'active',
      dutyArea: 'Dãy nhà học & Hành lang',
    });
    setShowAddMemberModal(true);
  };

  const handleOpenEditMemberModal = (member: RedFlagMember) => {
    if (!canManage) return;
    setEditingMember(member);
    setMemberFormData({
      code: member.code,
      name: member.name,
      classId: member.classId,
      className: member.className,
      account: member.account,
      role: member.role || 'Cờ đỏ viên',
      phone: member.phone || '',
      status: member.status,
      dutyArea: member.dutyArea,
    });
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    if (!memberFormData.name.trim()) return;

    const selectedCls = classes.find((c) => c.id === memberFormData.classId);
    const resolvedClassName = selectedCls ? selectedCls.code : memberFormData.className;

    if (editingMember) {
      updateRedFlag(editingMember.id, {
        code: memberFormData.code.trim(),
        name: memberFormData.name.trim(),
        classId: memberFormData.classId,
        className: resolvedClassName,
        account: memberFormData.account.trim(),
        role: memberFormData.role,
        phone: memberFormData.phone.trim(),
        status: memberFormData.status,
        dutyArea: memberFormData.dutyArea.trim(),
      });
      showToast(`Đã cập nhật thông tin cờ đỏ: ${memberFormData.name}`);
      setEditingMember(null);
    } else {
      addRedFlag({
        code: memberFormData.code.trim(),
        name: memberFormData.name.trim(),
        classId: memberFormData.classId,
        className: resolvedClassName,
        account: memberFormData.account.trim() || `codo_${Date.now().toString().slice(-4)}`,
        role: memberFormData.role,
        phone: memberFormData.phone.trim(),
        status: memberFormData.status,
        dutyArea: memberFormData.dutyArea.trim() || 'Khuôn viên trường',
        assignedCount: 5,
      });
      showToast(`Đã thêm thành viên cờ đỏ mới: ${memberFormData.name} (Lớp ${resolvedClassName})`);
      setShowAddMemberModal(false);
    }
  };

  const confirmDeleteMember = () => {
    if (!canManage) return;
    if (memberToDelete) {
      deleteRedFlag(memberToDelete.id);
      showToast(`Đã xóa cờ đỏ "${memberToDelete.name}" (${memberToDelete.code}) khỏi hệ thống`);
      setMemberToDelete(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Mã cờ đỏ,Họ và tên,Chi đội/Lớp,Cấp học,Vai trò,Tài khoản,Khu vực trực,Điện thoại,Trạng thái\n'];
    const rows = filteredMembers.map((rf) => {
      const cls = classes.find((c) => c.code === rf.className || c.id === rf.classId);
      const gradeNum = cls ? Number(cls.grade) : parseInt(rf.className) || 7;
      const levelStr = gradeNum <= 5 ? 'Tiểu học' : 'THCS';
      return `"${rf.code}","${rf.name}","Lớp ${rf.className}","${levelStr}","${rf.role || 'Cờ đỏ viên'}","${rf.account}","${rf.dutyArea}","${rf.phone || ''}","${
        rf.status === 'active' ? 'Hoạt động' : 'Tạm khóa'
      }"\n`;
    });
    const blob = new Blob(['\uFEFF' + headers.concat(rows).join('')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_sach_Co_Do_Quan_Ba_${filteredMembers.length}_thanh_vien.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= TAB 2: PHÂN CÔNG CỜ ĐỎ CHẤM LỚP NÀO =================
  const [assignSearchTerm, setAssignSearchTerm] = useState('');
  const [assignLevelFilter, setAssignLevelFilter] = useState<'all' | 'thcs' | 'tieuhoc'>('all');
  const [assignDayFilter, setAssignDayFilter] = useState<string>('all');
  const [assignRedFlagFilter, setAssignRedFlagFilter] = useState<string>('all');

  // Modals for Assignment
  const [showAddAssignModal, setShowAddAssignModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AssignmentItem | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<AssignmentItem | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);

  // Form state for Assignment
  const [assignFormData, setAssignFormData] = useState<{
    weekId: string;
    redFlagId: string;
    redFlagName: string;
    targetClassId: string;
    targetClassName: string;
    dayOfWeek: AssignmentItem['dayOfWeek'];
    shift: 'Sáng' | 'Chiều';
    area: string;
    content: string;
  }>({
    weekId: selectedWeekId,
    redFlagId: redFlags[0]?.id || 'rf-1',
    redFlagName: redFlags[0]?.name || 'Nguyễn Văn An',
    targetClassId: classes[0]?.id || 'c-7a',
    targetClassName: classes[0]?.code || '7A',
    dayOfWeek: 'Thứ 2',
    shift: 'Sáng',
    area: 'Sân trường & Cổng trường',
    content: 'Nề nếp & Khăn quàng',
  });

  // Assignments for current week
  const weekAssignments = useMemo(() => {
    return assignments.filter((a) => a.weekId === selectedWeekId);
  }, [assignments, selectedWeekId]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return weekAssignments.filter((a) => {
      // Level filter based on target class
      if (assignLevelFilter !== 'all') {
        const targetCls = classes.find((c) => c.code === a.targetClassName || c.id === a.targetClassId);
        const gradeNum = targetCls ? Number(targetCls.grade) : parseInt(a.targetClassName) || 7;
        if (assignLevelFilter === 'thcs' && (gradeNum < 6 || gradeNum > 9)) return false;
        if (assignLevelFilter === 'tieuhoc' && (gradeNum < 1 || gradeNum > 5)) return false;
      }

      // Day filter
      if (assignDayFilter !== 'all' && a.dayOfWeek !== assignDayFilter) return false;

      // Red flag filter
      if (assignRedFlagFilter !== 'all' && a.redFlagId !== assignRedFlagFilter) return false;

      // Search term
      if (assignSearchTerm.trim()) {
        const term = assignSearchTerm.toLowerCase();
        const match =
          a.redFlagName.toLowerCase().includes(term) ||
          a.targetClassName.toLowerCase().includes(term) ||
          a.area.toLowerCase().includes(term) ||
          a.content.toLowerCase().includes(term);
        if (!match) return false;
      }

      return true;
    });
  }, [weekAssignments, classes, assignLevelFilter, assignDayFilter, assignRedFlagFilter, assignSearchTerm]);

  const handleOpenAddAssignModal = () => {
    setEditingAssignment(null);
    setAssignError(null);
    const defaultRf = redFlags[0] || { id: 'rf-1', name: 'Nguyễn Văn An', classId: 'c-8a', code: '8A' };
    // Find class not belonging to red flag
    const candidateClass = classes.find((c) => c.id !== defaultRf.classId) || classes[0];

    setAssignFormData({
      weekId: selectedWeekId,
      redFlagId: defaultRf.id,
      redFlagName: defaultRf.name,
      targetClassId: candidateClass.id,
      targetClassName: candidateClass.code,
      dayOfWeek: 'Thứ 2',
      shift: 'Sáng',
      area: 'Sân trường - Dãy nhà học',
      content: 'Trang phục & Nề nếp',
    });
    setShowAddAssignModal(true);
  };

  const handleOpenEditAssignModal = (item: AssignmentItem) => {
    if (!canManage) return;
    setEditingAssignment(item);
    setAssignError(null);
    setAssignFormData({
      weekId: item.weekId,
      redFlagId: item.redFlagId,
      redFlagName: item.redFlagName,
      targetClassId: item.targetClassId,
      targetClassName: item.targetClassName,
      dayOfWeek: item.dayOfWeek,
      shift: item.shift,
      area: item.area,
      content: item.content,
    });
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    const rf = redFlags.find((r) => r.id === assignFormData.redFlagId);
    const cls = classes.find((c) => c.id === assignFormData.targetClassId);

    // Validate anti-self-grading:
    if (rf && cls && (rf.classId === cls.id || rf.className === cls.code)) {
      setAssignError(
        `Quy tắc công bằng: Cờ đỏ "${rf.name}" thuộc lớp ${rf.className}, không được phân công chấm chính lớp của mình! Vui lòng chọn lớp khác.`
      );
      return;
    }

    if (editingAssignment) {
      updateAssignment(editingAssignment.id, {
        weekId: selectedWeekId,
        redFlagId: assignFormData.redFlagId,
        redFlagName: rf?.name || assignFormData.redFlagName,
        targetClassId: assignFormData.targetClassId,
        targetClassName: cls?.code || assignFormData.targetClassName,
        dayOfWeek: assignFormData.dayOfWeek,
        shift: assignFormData.shift,
        area: assignFormData.area.trim(),
        content: assignFormData.content.trim(),
      });
      showToast(`Đã cập nhật phân công cho Cờ đỏ ${rf?.name || assignFormData.redFlagName} chấm lớp ${cls?.code}`);
      setEditingAssignment(null);
    } else {
      addAssignment({
        weekId: selectedWeekId,
        redFlagId: assignFormData.redFlagId,
        redFlagName: rf?.name || assignFormData.redFlagName,
        targetClassId: assignFormData.targetClassId,
        targetClassName: cls?.code || assignFormData.targetClassName,
        dayOfWeek: assignFormData.dayOfWeek,
        shift: assignFormData.shift,
        area: assignFormData.area.trim() || 'Sân trường & Lớp học',
        content: assignFormData.content.trim() || 'Nề nếp toàn diện',
        status: 'pending',
      });
      showToast(`Đã phân công Cờ đỏ ${rf?.name} chấm lớp ${cls?.code} (${assignFormData.dayOfWeek})`);
      setShowAddAssignModal(false);
    }
  };

  const confirmDeleteAssignment = () => {
    if (!canManage) return;
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete.id);
      showToast(`Đã xóa ca phân công chấm lớp ${assignmentToDelete.targetClassName}`);
      setAssignmentToDelete(null);
    }
  };

  const handleAutoAssign = () => {
    if (!canManage) return;
    autoAssignWeek(selectedWeekId);
    showToast(`Đã chạy thuật toán tự động phân công chéo cho Tuần ${currentWeek?.weekNumber || 4}`);
  };

  const handleCopyPreviousWeek = () => {
    if (!canManage) return;
    copyAssignmentsFromPreviousWeek(selectedWeekId);
    showToast(`Đã sao chép lịch phân công chấm lớp từ tuần trước sang tuần ${currentWeek?.weekNumber || 4}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-400/40 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-blue-950">
              Ban Cờ Đỏ Trực Ban
            </span>
            <span className="text-xs text-blue-200">PTDTBT TH&THCS Quản Bạ</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">QUẢN LÝ CỜ ĐỎ & PHÂN CÔNG CHẤM LỚP</h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Quản lý danh sách thành viên cờ đỏ (thêm, sửa, xóa) và{' '}
            <strong className="text-amber-300">phân công cờ đỏ chấm lớp nào</strong> theo tuần
          </p>
        </div>

        {/* Global Action depending on Tab */}
        <div className="flex flex-wrap items-center gap-2">
          {activeTab === 'members' ? (
            <>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất CSV</span>
              </button>
              <button
                onClick={() => canManage && handleOpenAddMemberModal()}
                disabled={!canManage}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
                  canManage
                    ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                }`}
                title={canManage ? 'Thêm Cờ đỏ mới' : 'Tài khoản không được phân quyền thêm cờ đỏ'}
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Cờ đỏ mới</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => canManage && handleAutoAssign()}
                disabled={!canManage}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors shadow-xs ${
                  canManage
                    ? 'bg-white/20 hover:bg-white/30 text-white border border-white/30 cursor-pointer'
                    : 'bg-white/10 text-slate-400 border border-white/10 opacity-40 cursor-not-allowed pointer-events-auto'
                }`}
                title={canManage ? 'Tự động phân công chéo' : 'Tài khoản không được phân quyền phân công'}
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Tự động phân công</span>
              </button>
              <button
                onClick={() => canManage && handleCopyPreviousWeek()}
                disabled={!canManage}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                  canManage
                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 cursor-pointer'
                    : 'bg-white/5 text-slate-400 border-white/10 opacity-40 cursor-not-allowed pointer-events-auto'
                }`}
                title={canManage ? 'Sao chép tuần trước' : 'Tài khoản không được phân quyền phân công'}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Sao chép tuần trước</span>
              </button>
              <button
                onClick={() => canManage && handleOpenAddAssignModal()}
                disabled={!canManage}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-colors ${
                  canManage
                    ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                }`}
                title={canManage ? '+ Phân công cờ đỏ' : 'Tài khoản không được phân quyền phân công'}
              >
                <Plus className="w-4 h-4" />
                <span>+ Phân công cờ đỏ</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!canManage && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Chế độ xem Đội Cờ đỏ (Chỉ đọc): </span>
            <span>
              Tài khoản <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền tra cứu danh sách và lịch phân công. Các tính năng Thêm, Sửa, Xóa cờ đỏ và Phân công ca trực đều bị khóa trừ khi được Quản trị viên cấp quyền trong Bảng phân quyền.
            </span>
          </div>
        </div>
      )}

      {/* ================= 2 CHÍNH TABS: DANH SÁCH CỜ ĐỎ vs PHÂN CÔNG CHẤM LỚP NÀO ================= */}
      <div className="bg-white p-2 rounded-2xl border border-blue-200 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'members'
              ? 'bg-blue-700 text-white shadow-md'
              : 'text-blue-950 hover:bg-blue-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Danh sách thành viên Cờ đỏ ({redFlags.length} HS)</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeTab === 'assignments'
              ? 'bg-blue-700 text-white shadow-md'
              : 'text-blue-950 hover:bg-blue-50'
          }`}
        >
          <CalendarClock className="w-4 h-4" />
          <span>2. Phân công cờ đỏ chấm lớp nào ({weekAssignments.length} ca trực)</span>
        </button>
      </div>

      {/* ================= TAB 1: DANH SÁCH THÀNH VIÊN CỜ ĐỎ ================= */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* 4 Summary Stat KPI Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Tổng số cờ đỏ</span>
                <p className="text-xl font-black text-blue-950 tabular-nums">{memberStats.total} thành viên</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Khối THCS (Lớp 6–9)</span>
                <p className="text-xl font-black text-indigo-900 tabular-nums">{memberStats.thcsCount} đội viên</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Khối Tiểu học (1–5)</span>
                <p className="text-xl font-black text-amber-900 tabular-nums">{memberStats.tieuhocCount} đội viên</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Đang hoạt động</span>
                <p className="text-xl font-black text-emerald-700 tabular-nums">
                  {memberStats.activeCount} <span className="text-xs text-slate-400 font-medium">({memberStats.lockedCount} khóa)</span>
                </p>
              </div>
            </div>
          </div>

          {/* Level and Filter Row */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-blue-50/80 p-1 rounded-xl border border-blue-200">
                <button
                  onClick={() => {
                    setMemberLevelFilter('all');
                    setMemberClassFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    memberLevelFilter === 'all'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  Toàn trường ({redFlags.length})
                </button>
                <button
                  onClick={() => {
                    setMemberLevelFilter('thcs');
                    setMemberClassFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    memberLevelFilter === 'thcs'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Khối THCS (Lớp 6–9: {memberStats.thcsCount} HS)</span>
                </button>
                <button
                  onClick={() => {
                    setMemberLevelFilter('tieuhoc');
                    setMemberClassFilter('all');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    memberLevelFilter === 'tieuhoc'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Khối Tiểu học (Lớp 1–5: {memberStats.tieuhocCount} HS)</span>
                </button>
              </div>

              {/* Class & Search Filter */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={memberClassFilter}
                  onChange={(e) => setMemberClassFilter(e.target.value)}
                  className="px-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">
                    {memberLevelFilter === 'thcs'
                      ? 'Tất cả lớp THCS (Khối 6-9)'
                      : memberLevelFilter === 'tieuhoc'
                      ? 'Tất cả lớp Tiểu học (Khối 1-5)'
                      : 'Tất cả các chi đội/lớp'}
                  </option>
                  {classes
                    .filter((c) => {
                      if (memberLevelFilter === 'thcs') return Number(c.grade) >= 6 && Number(c.grade) <= 9;
                      if (memberLevelFilter === 'tieuhoc') return Number(c.grade) >= 1 && Number(c.grade) <= 5;
                      return true;
                    })
                    .map((c) => (
                      <option key={c.id} value={c.code}>
                        Lớp {c.code} ({c.name})
                      </option>
                    ))}
                </select>

                <div className="relative min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Tìm tên, mã cờ đỏ, vai trò, khu vực..."
                    value={memberSearchTerm}
                    onChange={(e) => setMemberSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4 min-w-[160px]">Họ và tên cờ đỏ</th>
                    <th className="py-3 px-4">Chi đội / Lớp</th>
                    <th className="py-3 px-4">Cấp học</th>
                    <th className="py-3 px-4">Tài khoản & Liên hệ</th>
                    <th className="py-3 px-4">Khu vực trực chính</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác (Sửa / Xóa)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-10 text-center text-slate-400">
                        <p className="font-semibold text-slate-500">Không tìm thấy thành viên cờ đỏ nào phù hợp</p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member, idx) => {
                      const isActive = member.status === 'active';
                      const matchedClass = classes.find((c) => c.code === member.className || c.id === member.classId);
                      const gradeNum = matchedClass ? Number(matchedClass.grade) : parseInt(member.className) || 7;
                      const isPrimary = gradeNum <= 5;

                      return (
                        <tr key={member.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-3 px-4 text-center font-mono text-slate-500 tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-900">
                            {member.code}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{member.name}</span>
                              {member.role && member.role !== 'Cờ đỏ viên' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                                  {member.role}
                                </span>
                              )}
                            </div>
                            {member.role === 'Cờ đỏ viên' && (
                              <span className="text-[11px] text-slate-500">Cờ đỏ viên trực ban</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                              Lớp {member.className}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {isPrimary ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Tiểu học (K{gradeNum})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                <School className="w-3 h-3 text-blue-600" />
                                THCS (K{gradeNum})
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-mono text-slate-700 font-bold">{member.account}</p>
                            {member.phone ? (
                              <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-slate-400" />
                                <span>{member.phone}</span>
                              </p>
                            ) : (
                              <span className="text-[10px] text-slate-400">MK: 123456</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-medium max-w-xs truncate">
                            {member.dutyArea}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Hoạt động
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <ShieldAlert className="w-3 h-3" />
                                Tạm khóa
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Toggle lock */}
                              <button
                                onClick={() => {
                                  if (!canManage) return;
                                  toggleRedFlagStatus(member.id);
                                  showToast(
                                    isActive
                                      ? `Đã khóa tài khoản cờ đỏ ${member.name}`
                                      : `Đã mở khóa tài khoản cho ${member.name}`
                                  );
                                }}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  !canManage
                                    ? 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                    : isActive
                                    ? 'text-amber-600 hover:bg-amber-50 cursor-pointer'
                                    : 'text-emerald-600 hover:bg-emerald-50 cursor-pointer'
                                }`}
                                title={
                                  !canManage
                                    ? 'Tài khoản không có quyền đổi trạng thái'
                                    : isActive
                                    ? 'Khóa tài khoản'
                                    : 'Mở khóa'
                                }
                              >
                                {isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                              </button>

                              {/* Reset password */}
                              <button
                                onClick={() => {
                                  if (!canManage) return;
                                  resetRedFlagPassword(member.id);
                                  showToast(`Đã đặt lại mật khẩu cho cờ đỏ ${member.name} về mặc định: 123456`);
                                }}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  !canManage
                                    ? 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                    : 'text-blue-600 hover:bg-blue-50 cursor-pointer'
                                }`}
                                title={canManage ? 'Đặt lại mật khẩu (123456)' : 'Tài khoản không có quyền reset mật khẩu'}
                              >
                                <KeyRound className="w-4 h-4" />
                              </button>

                              {/* SỬA CỜ ĐỎ */}
                              <button
                                onClick={() => canManage && handleOpenEditMemberModal(member)}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  !canManage
                                    ? 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                    : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 cursor-pointer'
                                }`}
                                title={canManage ? 'Sửa thông tin cờ đỏ' : 'Tài khoản không có quyền sửa'}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* XÓA CỜ ĐỎ */}
                              <button
                                onClick={() => canManage && setMemberToDelete(member)}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  !canManage
                                    ? 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                                }`}
                                title={canManage ? 'Xóa cờ đỏ khỏi hệ thống' : 'Tài khoản không có quyền xóa'}
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
        </div>
      )}

      {/* ================= TAB 2: PHÂN CÔNG CỜ ĐỎ CHẤM LỚP NÀO ================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Important Rule Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-blue-950 text-sm">
                  Cơ chế hiển thị: Cờ đỏ được phân công tuần đó chỉ hiện lên đúng lớp được chấm!
                </p>
                <p className="text-blue-800/80 text-[11px] mt-0.5">
                  Khi cờ đỏ mở ứng dụng di động để nhập kết quả chấm, màn hình sẽ chỉ hiển thị duy nhất lớp học đã được phân công bên dưới, đảm bảo tính bảo mật và khách quan tuyệt đối.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-900 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-xs">
                Tổng số: <strong>{weekAssignments.length}</strong> ca trực / Tuần {currentWeek?.weekNumber || 4}
              </span>
            </div>
          </div>

          {/* Week & Level Controls */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-blue-100">
              {/* Level Tabs: Toàn trường / THCS (6-9) / Tiểu học (1-5) */}
              <div className="flex items-center gap-1.5 bg-blue-50/80 p-1 rounded-xl border border-blue-200">
                <button
                  onClick={() => setAssignLevelFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    assignLevelFilter === 'all'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  Toàn trường ({weekAssignments.length} ca)
                </button>
                <button
                  onClick={() => setAssignLevelFilter('thcs')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    assignLevelFilter === 'thcs'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  <span>Khối THCS (Lớp 6–9)</span>
                </button>
                <button
                  onClick={() => setAssignLevelFilter('tieuhoc')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    assignLevelFilter === 'tieuhoc'
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Khối Tiểu học (Lớp 1–5)</span>
                </button>
              </div>

              {/* Week Selector */}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold text-slate-700">Chọn tuần phân công:</span>
                <select
                  value={selectedWeekId}
                  onChange={(e) => setSelectedWeekId(e.target.value)}
                  className="px-3 py-1.5 bg-blue-50/50 border border-blue-300 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500"
                >
                  {weeks.map((w) => (
                    <option key={w.id} value={w.id}>
                      Tuần {w.weekNumber} ({w.startDate} đến {w.endDate}) {w.status === 'in_progress' ? '— Đang diễn ra' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Row: Day & Red Flag & Search */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Day filter pills */}
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
                    onClick={() => setAssignDayFilter(d.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                      assignDayFilter === d.id
                        ? 'bg-blue-700 text-white shadow-xs'
                        : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {/* Red Flag Filter Dropdown & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={assignRedFlagFilter}
                  onChange={(e) => setAssignRedFlagFilter(e.target.value)}
                  className="px-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Xem tất cả Cờ đỏ</option>
                  {redFlags.map((rf) => (
                    <option key={rf.id} value={rf.id}>
                      Cờ đỏ {rf.name} (Lớp {rf.className})
                    </option>
                  ))}
                </select>

                <div className="relative min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Tìm cờ đỏ, lớp chấm, khu vực..."
                    value={assignSearchTerm}
                    onChange={(e) => setAssignSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assignments Table: CỜ ĐỎ NÀO CHẤM LỚP NÀO */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">STT</th>
                    <th className="py-3 px-4 min-w-[160px]">Cờ đỏ thực hiện</th>
                    <th className="py-3 px-4 min-w-[170px] bg-amber-500/20 text-amber-200">
                      LỚP ĐƯỢC CHẤM (CHỈ HIỆN LỚP NÀY)
                    </th>
                    <th className="py-3 px-4">Cấp học</th>
                    <th className="py-3 px-4">Ngày trực</th>
                    <th className="py-3 px-4">Ca trực</th>
                    <th className="py-3 px-4">Khu vực phân công</th>
                    <th className="py-3 px-4">Nội dung chấm</th>
                    <th className="py-3 px-4 text-center">Trạng thái chấm</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssignments.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        <CalendarClock className="w-8 h-8 text-blue-300 mx-auto mb-2 opacity-70" />
                        <p className="font-semibold text-slate-600 text-sm">Chưa có phân công chấm lớp nào phù hợp</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Bấm nút <strong>"+ Phân công cờ đỏ"</strong> hoặc <strong>"Tự động phân công"</strong> để tạo lịch chấm.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredAssignments.map((item, idx) => {
                      const isCompleted = item.status === 'completed';
                      const targetCls = classes.find(
                        (c) => c.code === item.targetClassName || c.id === item.targetClassId
                      );
                      const gradeNum = targetCls ? Number(targetCls.grade) : parseInt(item.targetClassName) || 7;
                      const isPrimary = gradeNum <= 5;

                      return (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="py-3 px-4 text-center font-mono text-slate-500 tabular-nums">
                            {idx + 1}
                          </td>

                          {/* CỜ ĐỎ */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              <span>{item.redFlagName}</span>
                            </div>
                            <span className="text-[11px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold border border-blue-200">
                              Mã {item.redFlagId.replace('rf-', 'CD')}
                            </span>
                          </td>

                          {/* LỚP ĐƯỢC CHẤM - HIGHLIGHT */}
                          <td className="py-3 px-4 bg-amber-50/40">
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-amber-400 text-blue-950 shadow-xs border border-amber-300">
                                Lớp {item.targetClassName}
                              </span>
                              <div className="text-[11px]">
                                <p className="font-semibold text-slate-800">
                                  {targetCls ? `GVCN: ${targetCls.homeroomTeacher}` : 'Chi đội'}
                                </p>
                                <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5" />
                                  Chỉ hiện lớp {item.targetClassName} trên App
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CẤP HỌC */}
                          <td className="py-3 px-4">
                            {isPrimary ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Tiểu học (Khối {gradeNum})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                <School className="w-3 h-3 text-blue-600" />
                                THCS (Khối {gradeNum})
                              </span>
                            )}
                          </td>

                          {/* NGÀY TRỰC */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                              {item.dayOfWeek}
                            </span>
                          </td>

                          {/* CA TRỰC */}
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                                item.shift === 'Sáng'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                              }`}
                            >
                              {item.shift}
                            </span>
                          </td>

                          {/* KHU VỰC */}
                          <td className="py-3 px-4 text-slate-600 font-medium max-w-xs truncate">
                            {item.area}
                          </td>

                          {/* NỘI DUNG */}
                          <td className="py-3 px-4 text-slate-600 max-w-xs truncate font-medium">
                            {item.content}
                          </td>

                          {/* TRẠNG THÁI */}
                          <td className="py-3 px-4 text-center">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Đã chấm
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600">
                                <Clock className="w-3 h-3 text-slate-400" />
                                Chờ chấm
                              </span>
                            )}
                          </td>

                          {/* THAO TÁC */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => canManage && handleOpenEditAssignModal(item)}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  !canManage
                                    ? 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                    : 'text-blue-600 hover:text-blue-800 hover:bg-blue-100 cursor-pointer'
                                }`}
                                title={canManage ? 'Đổi lớp hoặc lịch phân công' : 'Tài khoản không có quyền sửa phân công'}
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => canManage && setAssignmentToDelete(item)}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  !canManage
                                    ? 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                                }`}
                                title={canManage ? 'Xóa phân công này' : 'Tài khoản không có quyền xóa phân công'}
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
        </div>
      )}

      {/* ================= MODALS FOR TAB 1: ADD / EDIT CỜ ĐỎ ================= */}
      {(showAddMemberModal || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-blue-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Flag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-950 text-sm">
                    {editingMember ? `Sửa thông tin Cờ đỏ: ${editingMember.name}` : 'Thêm thành viên Cờ đỏ mới'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {editingMember ? 'Cập nhật phân công và tài khoản' : 'Tạo mới cờ đỏ cấp THCS hoặc Tiểu học'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddMemberModal(false);
                  setEditingMember(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã cờ đỏ:</label>
                  <input
                    type="text"
                    value={memberFormData.code}
                    onChange={(e) => setMemberFormData({ ...memberFormData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: CD33"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên học sinh:</label>
                  <input
                    type="text"
                    value={memberFormData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setMemberFormData({
                        ...memberFormData,
                        name,
                        account: editingMember
                          ? memberFormData.account
                          : `codo_${name
                              .toLowerCase()
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .replace(/đ/g, 'd')
                              .replace(/\s+/g, '_')}`,
                      });
                    }}
                    placeholder="Ví dụ: Nguyễn Văn An"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thuộc Chi đội / Lớp:</label>
                  <select
                    value={memberFormData.classId}
                    onChange={(e) => {
                      const sel = classes.find((c) => c.id === e.target.value);
                      setMemberFormData({
                        ...memberFormData,
                        classId: e.target.value,
                        className: sel ? sel.code : '8A',
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <optgroup label="Cấp THCS (Khối 6, 7, 8, 9)">
                      {classes
                        .filter((c) => Number(c.grade) >= 6 && Number(c.grade) <= 9)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            Lớp {c.code} ({c.name} · {c.homeroomTeacher})
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Cấp Tiểu học (Khối 1, 2, 3, 4, 5)">
                      {classes
                        .filter((c) => Number(c.grade) <= 5)
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            Lớp {c.code} ({c.name} · {c.homeroomTeacher})
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vai trò trong ban cờ đỏ:</label>
                  <select
                    value={memberFormData.role}
                    onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-semibold"
                  >
                    <option value="Cờ đỏ viên">Cờ đỏ viên</option>
                    <option value="Trưởng ban Cờ đỏ">Trưởng ban Cờ đỏ</option>
                    <option value="Phó ban Cờ đỏ">Phó ban Cờ đỏ</option>
                    <option value="Đội trưởng Sao đỏ TH">Đội trưởng Sao đỏ TH</option>
                    <option value="Đội phó Sao đỏ TH">Đội phó Sao đỏ TH</option>
                    <option value="Cờ đỏ kiểm tra">Cờ đỏ kiểm tra chéo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tài khoản đăng nhập di động:</label>
                  <input
                    type="text"
                    value={memberFormData.account}
                    onChange={(e) => setMemberFormData({ ...memberFormData, account: e.target.value })}
                    placeholder="codo_..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại liên hệ (tùy chọn):</label>
                  <input
                    type="text"
                    value={memberFormData.phone}
                    onChange={(e) => setMemberFormData({ ...memberFormData, phone: e.target.value })}
                    placeholder="VD: 0981234567"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Khu vực phân công phụ trách:</label>
                <input
                  type="text"
                  value={memberFormData.dutyArea}
                  onChange={(e) => setMemberFormData({ ...memberFormData, dutyArea: e.target.value })}
                  placeholder="Ví dụ: Dãy nhà B - Khối 7, Cổng trường, Sân tập thể dục..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái hoạt động:</label>
                <select
                  value={memberFormData.status}
                  onChange={(e) =>
                    setMemberFormData({ ...memberFormData, status: e.target.value as 'active' | 'locked' })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Đang hoạt động (Cho phép chấm điểm)</option>
                  <option value="locked">Tạm khóa (Vắng hoặc ngừng nhiệm vụ)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMemberModal(false);
                    setEditingMember(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  {editingMember ? 'Lưu thay đổi cờ đỏ' : 'Lưu & Thêm Cờ đỏ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CỜ ĐỎ ================= */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Xác nhận xóa thành viên Cờ đỏ</h3>
                <p className="text-[11px] text-slate-500">Thao tác này sẽ xóa vĩnh viễn khỏi danh sách</p>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p>
                <strong>Họ tên:</strong> <span className="text-blue-900 font-bold">{memberToDelete.name}</span>
              </p>
              <p>
                <strong>Mã cờ đỏ:</strong> <span className="font-mono font-bold text-slate-700">{memberToDelete.code}</span>
              </p>
              <p>
                <strong>Lớp / Chi đội:</strong> Lớp {memberToDelete.className}
              </p>
            </div>

            <p className="mt-3 text-xs text-rose-600 font-medium">
              Bạn có chắc chắn muốn xóa thành viên này không? Tài khoản đăng nhập di động của cờ đỏ sẽ bị thu hồi.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteMember}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PHÂN CÔNG CHẤM LỚP ================= */}
      {(showAddAssignModal || editingAssignment) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-blue-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <CalendarClock className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-950 text-sm">
                    {editingAssignment ? 'Sửa phân công Cờ đỏ chấm lớp' : 'Phân công Cờ đỏ chấm lớp nào'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tuần {currentWeek?.weekNumber || 4} · Chỉ hiện lớp được chọn trên máy cờ đỏ
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowAddAssignModal(false);
                  setEditingAssignment(null);
                  setAssignError(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="mt-4 space-y-3.5">
              {/* Cờ đỏ thực hiện */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Chọn Cờ đỏ thực hiện nhiệm vụ:
                </label>
                <select
                  value={assignFormData.redFlagId}
                  onChange={(e) => {
                    const rf = redFlags.find((r) => r.id === e.target.value);
                    setAssignFormData({
                      ...assignFormData,
                      redFlagId: e.target.value,
                      redFlagName: rf?.name || '',
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500"
                >
                  <optgroup label="Cờ đỏ Cấp THCS (Khối 6–9)">
                    {redFlags
                      .filter((rf) => {
                        const c = classes.find((cls) => cls.code === rf.className || cls.id === rf.classId);
                        const g = c ? Number(c.grade) : parseInt(rf.className) || 7;
                        return g >= 6;
                      })
                      .map((rf) => (
                        <option key={rf.id} value={rf.id}>
                          {rf.name} (Lớp {rf.className} · {rf.code})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Cờ đỏ Cấp Tiểu học (Khối 1–5)">
                    {redFlags
                      .filter((rf) => {
                        const c = classes.find((cls) => cls.code === rf.className || cls.id === rf.classId);
                        const g = c ? Number(c.grade) : parseInt(rf.className) || 7;
                        return g <= 5;
                      })
                      .map((rf) => (
                        <option key={rf.id} value={rf.id}>
                          {rf.name} (Lớp {rf.className} · {rf.code})
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* LỚP ĐƯỢC CHẤM */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>2. Lớp được phân công chấm (Khi cờ đỏ mở app chỉ hiện lớp này):</span>
                  <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                    Khác lớp của Cờ đỏ
                  </span>
                </label>
                <select
                  value={assignFormData.targetClassId}
                  onChange={(e) => {
                    const cls = classes.find((c) => c.id === e.target.value);
                    setAssignFormData({
                      ...assignFormData,
                      targetClassId: e.target.value,
                      targetClassName: cls?.code || '7A',
                    });
                  }}
                  className="w-full px-3 py-2 border-2 border-amber-300 bg-amber-50/30 rounded-xl text-xs font-black text-blue-950 focus:ring-2 focus:ring-blue-500"
                >
                  <optgroup label="Cấp THCS (Khối 6, 7, 8, 9)">
                    {classes
                      .filter((c) => Number(c.grade) >= 6)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          Lớp {c.code} — {c.name} (GVCN: {c.homeroomTeacher})
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Cấp Tiểu học (Khối 1, 2, 3, 4, 5)">
                    {classes
                      .filter((c) => Number(c.grade) <= 5)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          Lớp {c.code} — {c.name} (GVCN: {c.homeroomTeacher})
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* NGÀY & CA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">3. Ngày trực trong tuần:</label>
                  <select
                    value={assignFormData.dayOfWeek}
                    onChange={(e) =>
                      setAssignFormData({
                        ...assignFormData,
                        dayOfWeek: e.target.value as AssignmentItem['dayOfWeek'],
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Thứ 2">Thứ 2</option>
                    <option value="Thứ 3">Thứ 3</option>
                    <option value="Thứ 4">Thứ 4</option>
                    <option value="Thứ 5">Thứ 5</option>
                    <option value="Thứ 6">Thứ 6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">4. Ca trực:</label>
                  <select
                    value={assignFormData.shift}
                    onChange={(e) =>
                      setAssignFormData({
                        ...assignFormData,
                        shift: e.target.value as 'Sáng' | 'Chiều',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sáng">Sáng (6:45 – 11:30)</option>
                    <option value="Chiều">Chiều (13:30 – 17:00)</option>
                  </select>
                </div>
              </div>

              {/* KHU VỰC VÀ NỘI DUNG */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">5. Khu vực trực:</label>
                  <input
                    type="text"
                    value={assignFormData.area}
                    onChange={(e) => setAssignFormData({ ...assignFormData, area: e.target.value })}
                    placeholder="VD: Sân trường Dãy B"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">6. Nội dung chấm:</label>
                  <input
                    type="text"
                    value={assignFormData.content}
                    onChange={(e) => setAssignFormData({ ...assignFormData, content: e.target.value })}
                    placeholder="VD: Khăn quàng & Vệ sinh"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Error message */}
              {assignError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{assignError}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddAssignModal(false);
                    setEditingAssignment(null);
                    setAssignError(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
                >
                  {editingAssignment ? 'Lưu thay đổi phân công' : 'Lưu Phân công chấm lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE PHÂN CÔNG ================= */}
      {assignmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Xác nhận hủy ca phân công này</h3>
                <p className="text-[11px] text-slate-500">Thu hồi nhiệm vụ chấm lớp của cờ đỏ</p>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p>
                <strong>Cờ đỏ:</strong> <span className="text-blue-900 font-bold">{assignmentToDelete.redFlagName}</span>
              </p>
              <p>
                <strong>Lớp được chấm:</strong> <span className="font-bold text-amber-700">Lớp {assignmentToDelete.targetClassName}</span>
              </p>
              <p>
                <strong>Ngày & Ca trực:</strong> {assignmentToDelete.dayOfWeek} ({assignmentToDelete.shift})
              </p>
              <p>
                <strong>Khu vực:</strong> {assignmentToDelete.area}
              </p>
            </div>

            <p className="mt-3 text-xs text-rose-600 font-medium">
              Sau khi xóa, cờ đỏ sẽ không còn nhìn thấy lớp {assignmentToDelete.targetClassName} trong danh sách lớp được chấm của ngày này.
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssignmentToDelete(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmDeleteAssignment}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
