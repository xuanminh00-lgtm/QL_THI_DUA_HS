import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClassItem, GradeLevel, StudentItem } from '../types';
import * as XLSX from 'xlsx';
import {
  School,
  Plus,
  FileSpreadsheet,
  Download,
  History,
  Edit2,
  Trash2,
  Search,
  X,
  Upload,
  CheckCircle2,
  Users,
  UserPlus,
  AlertCircle,
  ArrowLeft,
  Phone,
  Calendar,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';

export const ClassManagementView: React.FC = () => {
  const {
    classes,
    addClass,
    updateClass,
    deleteClass,
    deleteMultipleClasses,
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    deleteMultipleStudents,
    importStudents,
    classRankings,
    hasPermission,
    currentUser,
  } = useApp();

  // Permission check: based on permission matrix
  const canManage = hasPermission('canManageClasses');

  // Primary View Mode: 'classes' (Danh mục lớp) or 'students' (Danh sách học sinh)
  const [viewMode, setViewMode] = useState<'classes' | 'students'>('classes');
  const [selectedClassIdForStudents, setSelectedClassIdForStudents] = useState<string>('c-9a');

  // Multi-selection states for rows
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Deletion state for in-app confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'class' | 'classes_batch' | 'student' | 'students_batch';
    id?: string;
    ids?: string[];
    name: string;
    count?: number;
    className?: string;
  } | null>(null);

  // Global toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filters for classes
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filters for students
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentGenderFilter, setStudentGenderFilter] = useState<'all' | 'Nam' | 'Nữ'>('all');

  // Modals for Class
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [historyClass, setHistoryClass] = useState<ClassItem | null>(null);

  // Modals for Students
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [showImportExcelModal, setShowImportExcelModal] = useState(false);
  const [excelPreviewStudents, setExcelPreviewStudents] = useState<Omit<StudentItem, 'id'>[]>([]);
  const [excelFileName, setExcelFileName] = useState<string>('');
  const [excelImportSuccess, setExcelImportSuccess] = useState<string | null>(null);

  // Form states for Class
  const [classFormData, setClassFormData] = useState<Omit<ClassItem, 'id'>>({
    code: '',
    name: '',
    grade: '6',
    homeroomTeacher: '',
    studentCount: 38,
    room: '',
    status: 'active',
  });

  // Form states for Student
  const [studentFormData, setStudentFormData] = useState<Omit<StudentItem, 'id'>>({
    code: '',
    fullName: '',
    classId: 'c-9a',
    className: '9A',
    gender: 'Nam',
    dob: '2011-05-15',
    roleInClass: 'Học sinh',
    phone: '',
    status: 'active',
    violationCount: 0,
  });

  // Active class object for student view
  const activeClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassIdForStudents) || classes[0];
  }, [classes, selectedClassIdForStudents]);

  // Filtered classes
  const filteredClasses = classes.filter((c) => {
    const matchGrade = selectedGrade === 'all' || c.grade === selectedGrade;
    const matchSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.homeroomTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchGrade && matchSearch;
  });

  // Filtered students for active class
  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === activeClass?.id);
  }, [students, activeClass?.id]);

  const filteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
        s.roleInClass.toLowerCase().includes(studentSearchTerm.toLowerCase());
      const matchGender =
        studentGenderFilter === 'all' || s.gender === studentGenderFilter;
      return matchSearch && matchGender;
    });
  }, [classStudents, studentSearchTerm, studentGenderFilter]);

  // Selection handlers for Classes
  const handleSelectAllClasses = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedClassIds(filteredClasses.map((c) => c.id));
    } else {
      setSelectedClassIds([]);
    }
  };

  const handleToggleClass = (id: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Selection handlers for Students
  const handleSelectAllStudents = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Confirm delete execution (supports single & batch)
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'class' && deleteTarget.id) {
      deleteClass(deleteTarget.id);
      setSelectedClassIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      showToast(`Đã xóa thành công lớp: ${deleteTarget.name}`);
    } else if (deleteTarget.type === 'classes_batch' && deleteTarget.ids) {
      deleteMultipleClasses(deleteTarget.ids);
      setSelectedClassIds([]);
      showToast(`Đã xóa thành công ${deleteTarget.ids.length} lớp học khỏi hệ thống`);
    } else if (deleteTarget.type === 'student' && deleteTarget.id) {
      deleteStudent(deleteTarget.id);
      setSelectedStudentIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      showToast(`Đã xóa thành công học sinh: ${deleteTarget.name}`);
    } else if (deleteTarget.type === 'students_batch' && deleteTarget.ids) {
      deleteMultipleStudents(deleteTarget.ids);
      setSelectedStudentIds([]);
      showToast(`Đã xóa thành công ${deleteTarget.ids.length} học sinh khỏi lớp`);
    }

    setDeleteTarget(null);
  };

  // Class Save Handler
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormData.name || !classFormData.homeroomTeacher) return;

    if (editingClass) {
      updateClass(editingClass.id, classFormData);
      setEditingClass(null);
    } else {
      addClass(classFormData);
      setShowAddClassModal(false);
    }

    setClassFormData({
      code: '',
      name: '',
      grade: '6',
      homeroomTeacher: '',
      studentCount: 38,
      room: '',
      status: 'active',
    });
  };

  const openEditClass = (cls: ClassItem) => {
    setEditingClass(cls);
    setClassFormData({
      code: cls.code,
      name: cls.name,
      grade: cls.grade,
      homeroomTeacher: cls.homeroomTeacher,
      studentCount: cls.studentCount,
      room: cls.room,
      status: cls.status,
    });
  };

  // Student Save Handler
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormData.fullName || !activeClass) return;

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...studentFormData,
        classId: activeClass.id,
        className: activeClass.code,
      });
      setEditingStudent(null);
    } else {
      addStudent({
        ...studentFormData,
        classId: activeClass.id,
        className: activeClass.code,
        code:
          studentFormData.code ||
          `HS-${activeClass.code}-${String(classStudents.length + 1).padStart(2, '0')}`,
      });
      setShowAddStudentModal(false);
    }

    // Reset student form
    setStudentFormData({
      code: '',
      fullName: '',
      classId: activeClass.id,
      className: activeClass.code,
      gender: 'Nam',
      dob: '2011-05-15',
      roleInClass: 'Học sinh',
      phone: '',
      status: 'active',
      violationCount: 0,
    });
  };

  const openAddStudent = () => {
    if (!activeClass) return;
    const nextIdx = classStudents.length + 1;
    setStudentFormData({
      code: `HS-${activeClass.code}-${String(nextIdx).padStart(2, '0')}`,
      fullName: '',
      classId: activeClass.id,
      className: activeClass.code,
      gender: 'Nam',
      dob: '2011-05-15',
      roleInClass: 'Học sinh',
      phone: '',
      status: 'active',
      violationCount: 0,
    });
    setEditingStudent(null);
    setShowAddStudentModal(true);
  };

  const openEditStudent = (std: StudentItem) => {
    setEditingStudent(std);
    setStudentFormData({
      code: std.code,
      fullName: std.fullName,
      classId: std.classId,
      className: std.className,
      gender: std.gender,
      dob: std.dob,
      roleInClass: std.roleInClass,
      phone: std.phone || '',
      status: std.status,
      violationCount: std.violationCount,
    });
    setShowAddStudentModal(true);
  };

  // Handle Excel File Upload using SheetJS
  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeClass) return;

    setExcelFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (!rows || rows.length < 2) {
          alert('File Excel không có dữ liệu hoặc sai định dạng!');
          return;
        }

        // Parse rows (ignoring header)
        const parsedList: Omit<StudentItem, 'id'>[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0 || !row[1]) continue;

          const stt = row[0];
          const code = String(row[1] || `HS-${activeClass.code}-${String(i).padStart(2, '0')}`);
          const fullName = String(row[2] || row[1] || '').trim();
          if (!fullName) continue;

          const genderRaw = String(row[3] || 'Nam').toLowerCase();
          const gender: 'Nam' | 'Nữ' = genderRaw.includes('nữ') || genderRaw.includes('nu') ? 'Nữ' : 'Nam';
          const dob = String(row[4] || '2011-01-01');
          const roleInClass = String(row[5] || 'Học sinh');
          const phone = row[6] ? String(row[6]) : '';

          parsedList.push({
            code,
            fullName,
            classId: activeClass.id,
            className: activeClass.code,
            gender,
            dob,
            roleInClass,
            phone,
            status: 'active',
            violationCount: 0,
          });
        }

        setExcelPreviewStudents(parsedList);
      } catch (err) {
        console.error('Lỗi khi đọc file Excel:', err);
        alert('Không thể đọc file Excel. Vui lòng chọn file .xlsx, .xls hoặc .csv chuẩn.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Sample Excel Quick Demo Loader
  const handleLoadSampleExcelData = () => {
    if (!activeClass) return;
    const sampleNames = [
      { name: 'Vàng Mí Sính', gender: 'Nam', role: 'Lớp trưởng', dob: '2011-03-12', phone: '0981.234.567' },
      { name: 'Sùng Thị Say', gender: 'Nữ', role: 'Lớp phó Học tập', dob: '2011-04-18', phone: '0982.345.678' },
      { name: 'Lò A Sáng', gender: 'Nam', role: 'Lớp phó Lao động', dob: '2011-06-25', phone: '0983.456.789' },
      { name: 'Mai Thị Hoa', gender: 'Nữ', role: 'Tổ trưởng Tổ 1', dob: '2011-08-14', phone: '0984.567.890' },
      { name: 'Giàng A Dinh', gender: 'Nam', role: 'Tổ trưởng Tổ 2', dob: '2011-10-09', phone: '0985.678.901' },
      { name: 'Hầu Thị Chứ', gender: 'Nữ', role: 'Tổ trưởng Tổ 3', dob: '2011-11-20', phone: '0986.789.012' },
      { name: 'Thào Mí Pó', gender: 'Nam', role: 'Đội viên', dob: '2011-02-15', phone: '0987.890.123' },
      { name: 'Lục Thị Mai', gender: 'Nữ', role: 'Đội viên', dob: '2011-07-30', phone: '0988.901.234' },
      { name: 'Nguyễn Tiến Đạt', gender: 'Nam', role: 'Đội viên', dob: '2011-09-05', phone: '0989.012.345' },
      { name: 'Hoàng Thùy Dung', gender: 'Nữ', role: 'Đội viên', dob: '2011-12-11', phone: '0912.123.456' },
      { name: 'Lý A Phống', gender: 'Nam', role: 'Đội viên', dob: '2011-05-22', phone: '0913.234.567' },
      { name: 'Bùi Hồng Nhung', gender: 'Nữ', role: 'Đội viên', dob: '2011-01-19', phone: '0914.345.678' },
    ];

    const generated: Omit<StudentItem, 'id'>[] = sampleNames.map((item, idx) => ({
      code: `HS-${activeClass.code}-${String(idx + 1).padStart(2, '0')}`,
      fullName: item.name,
      classId: activeClass.id,
      className: activeClass.code,
      gender: item.gender as 'Nam' | 'Nữ',
      dob: item.dob,
      roleInClass: item.role,
      phone: item.phone,
      status: 'active',
      violationCount: 0,
    }));

    setExcelFileName(`Danh_sach_hoc_sinh_${activeClass.code}_Mau.xlsx`);
    setExcelPreviewStudents(generated);
  };

  // Confirm Excel Import
  const handleConfirmExcelImport = () => {
    if (!activeClass || excelPreviewStudents.length === 0) return;
    importStudents(activeClass.id, excelPreviewStudents);
    setExcelImportSuccess(`Đã nhập thành công ${excelPreviewStudents.length} học sinh vào ${activeClass.name}!`);
    setTimeout(() => {
      setExcelImportSuccess(null);
      setShowImportExcelModal(false);
      setExcelPreviewStudents([]);
      setExcelFileName('');
    }, 1800);
  };

  // Export Students of current class to Excel / CSV
  const handleExportStudentsExcel = () => {
    if (!activeClass) return;
    const headers = ['STT,Mã học sinh,Họ và tên,Lớp,Giới tính,Ngày sinh,Chức vụ,Số điện thoại,Lỗi vi phạm,Trạng thái\n'];
    const rows = classStudents.map(
      (s, idx) =>
        `"${idx + 1}","${s.code}","${s.fullName}","${activeClass.name}","${s.gender}","${s.dob}","${
          s.roleInClass
        }","${s.phone || ''}","${s.violationCount}","${s.status === 'active' ? 'Đang học' : 'Đã chuyển'}"\n`
    );
    const blob = new Blob(['\uFEFF' + headers.concat(rows).join('')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Danh_sach_hoc_sinh_${activeClass.code}_Quan_Ba.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Sample Excel Template
  const handleDownloadExcelTemplate = () => {
    const headers = ['STT,Mã học sinh,Họ và tên,Giới tính,Ngày sinh (YYYY-MM-DD),Chức vụ,Số điện thoại phụ huynh\n'];
    const sampleRows = [
      '1,HS-9A-01,Nguyễn Văn An,Nam,2011-03-15,Lớp trưởng,0988123456\n',
      '2,HS-9A-02,Vàng Thị Hoa,Nữ,2011-06-20,Lớp phó Học tập,0912345678\n',
      '3,HS-9A-03,Sùng Mí Sính,Nam,2011-09-12,Đội viên,0977889900\n',
    ];
    const blob = new Blob(['\uFEFF' + headers.concat(sampleRows).join('')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Mau_danh_sach_hoc_sinh_nhap_excel.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar - Royal Blue Banner */}
      <div className="bg-gradient-to-r from-[#0F275A] via-[#143B7E] to-[#1E4EB8] text-white p-5 rounded-2xl border border-blue-900/40 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-blue-950">
              Quản lý Chi đội & Học sinh
            </span>
            <span className="text-xs text-blue-200">PTDTBT TH&THCS Quản Bạ</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            {viewMode === 'classes' ? 'Danh mục Lớp học & Chi đội' : `Danh sách Học sinh: ${activeClass.name}`}
          </h2>
          <p className="text-xs text-blue-200 mt-0.5">
            Quản lý thông tin 16 lớp học,{' '}
            <strong className="text-amber-300">thêm/sửa/xóa học sinh</strong> và{' '}
            <strong className="text-amber-300">nhập danh sách qua Excel (.xlsx / .csv)</strong>
          </p>
        </div>

        {/* View Mode Switch */}
        <div className="flex items-center gap-1.5 bg-blue-950/60 p-1.5 rounded-xl border border-blue-400/30">
          <button
            onClick={() => setViewMode('classes')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'classes'
                ? 'bg-amber-400 text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <School className="w-3.5 h-3.5" />
            <span>Danh mục Lớp ({classes.length})</span>
          </button>

          <button
            onClick={() => setViewMode('students')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'students'
                ? 'bg-amber-400 text-blue-950 shadow-xs'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Quản lý Học sinh theo Lớp</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* VIEW MODE 1: DANH MỤC LỚP HỌC */}
      {/* ============================================================ */}
      {viewMode === 'classes' && (
        <div className="space-y-4">
          {/* Permission Notice Banner when user lacks permission */}
          {!canManage && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Chế độ xem (Phân quyền giới hạn): </span>
                <span>
                  Tài khoản hiện tại <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) chỉ có quyền xem dữ liệu. Các nút Thao tác (Thêm mới, Chỉnh sửa, Xóa lớp) bị làm mờ theo bảng phân quyền hệ thống.
                </span>
              </div>
            </div>
          )}

          {/* Action and Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            {/* Grade tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Tất cả khối' },
                { id: '1', label: 'Khối 1' },
                { id: '2', label: 'Khối 2' },
                { id: '3', label: 'Khối 3' },
                { id: '4', label: 'Khối 4' },
                { id: '5', label: 'Khối 5' },
                { id: '6', label: 'Khối 6' },
                { id: '7', label: 'Khối 7' },
                { id: '8', label: 'Khối 8' },
                { id: '9', label: 'Khối 9' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGrade(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedGrade === tab.id
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-blue-50/80 text-blue-900 hover:bg-blue-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search and Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên lớp, GVCN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  if (!canManage) return;
                  setEditingClass(null);
                  setClassFormData({
                    code: '6E',
                    name: 'Lớp 6E',
                    grade: '6',
                    homeroomTeacher: '',
                    studentCount: 38,
                    room: 'Phòng 105',
                    status: 'active',
                  });
                  setShowAddClassModal(true);
                }}
                disabled={!canManage}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                  canManage
                    ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                }`}
                title={canManage ? 'Thêm lớp học mới' : 'Tài khoản không được phân quyền thêm lớp'}
              >
                <Plus className="w-4 h-4" />
                Thêm lớp mới
              </button>
            </div>
          </div>

          {/* BATCH ACTION BAR: WHEN 1 OR MORE CLASSES ARE SELECTED */}
          {selectedClassIds.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-950 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Đã chọn {selectedClassIds.length} lớp học trên danh sách</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedClassIds([])}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white rounded-xl transition-colors font-medium border border-transparent hover:border-slate-200"
                >
                  Bỏ chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!canManage) return;
                    const selectedNames = classes
                      .filter((c) => selectedClassIds.includes(c.id))
                      .map((c) => c.name)
                      .join(', ');
                    setDeleteTarget({
                      type: 'classes_batch',
                      ids: selectedClassIds,
                      count: selectedClassIds.length,
                      name: `${selectedClassIds.length} lớp (${selectedNames})`,
                    });
                  }}
                  disabled={!canManage}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors ${
                    !canManage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  title={canManage ? 'Xóa các lớp đã chọn' : 'Tài khoản không có quyền xóa'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa {selectedClassIds.length} lớp đã chọn</span>
                </button>
              </div>
            </div>
          )}

          {/* Classes Table */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    {/* CHECKBOX SELECT ALL */}
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredClasses.length > 0 &&
                          selectedClassIds.length === filteredClasses.length
                        }
                        onChange={handleSelectAllClasses}
                        disabled={!canManage || filteredClasses.length === 0}
                        className={`rounded border-blue-300 text-blue-600 focus:ring-blue-400 w-4 h-4 transition-colors ${
                          !canManage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title={canManage ? 'Chọn tất cả các lớp' : 'Tài khoản không có quyền'}
                      />
                    </th>
                    <th className="py-3 px-3 w-12 text-center">STT</th>
                    <th className="py-3 px-4">Mã lớp</th>
                    <th className="py-3 px-4">Tên lớp</th>
                    <th className="py-3 px-4">Khối</th>
                    <th className="py-3 px-4">Giáo viên chủ nhiệm</th>
                    <th className="py-3 px-4 text-center">Sĩ số</th>
                    <th className="py-3 px-4">Phòng học</th>
                    <th className="py-3 px-4 text-center">Quản lý Học sinh</th>
                    <th className="py-3 px-4 text-right">Thao tác lớp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredClasses.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400">
                        Không tìm thấy lớp phù hợp với từ khóa
                      </td>
                    </tr>
                  ) : (
                    filteredClasses.map((cls, idx) => {
                      const countInSystem = students.filter((s) => s.classId === cls.id).length;
                      const isSelected = selectedClassIds.includes(cls.id);
                      return (
                        <tr
                          key={cls.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-blue-50/80' : 'hover:bg-blue-50/40'
                          }`}
                        >
                          {/* CHECKBOX EACH ROW */}
                          <td className="py-3.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleClass(cls.id)}
                              disabled={!canManage}
                              className={`rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 transition-colors ${
                                !canManage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title={canManage ? `Chọn lớp ${cls.name}` : 'Tài khoản không có quyền'}
                            />
                          </td>
                          <td className="py-3.5 px-3 text-center font-mono text-slate-500 tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-blue-900">
                            {cls.code}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900 text-sm">{cls.name}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-600">
                            Khối {cls.grade}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">
                            {cls.homeroomTeacher}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-700">
                            <span className="font-bold text-blue-950">{cls.studentCount} HS</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">{cls.room}</td>

                          {/* ACTION: OPEN STUDENT MANAGEMENT FOR THIS CLASS */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedClassIdForStudents(cls.id);
                                setViewMode('students');
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold border border-blue-200 hover:border-blue-600 transition-all shadow-xs"
                              title={`Xem và quản lý ${countInSystem || cls.studentCount} học sinh lớp ${cls.name}`}
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>Học sinh ({countInSystem || cls.studentCount})</span>
                            </button>
                          </td>

                          {/* Class row actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Emulation history */}
                              <button
                                onClick={() => setHistoryClass(cls)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Xem lịch sử thi đua của lớp"
                              >
                                <History className="w-4 h-4" />
                              </button>

                              {/* Edit Class */}
                              <button
                                onClick={() => canManage && openEditClass(cls)}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  canManage
                                    ? 'text-slate-600 hover:text-blue-700 hover:bg-slate-100 cursor-pointer'
                                    : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                }`}
                                title={
                                  canManage
                                    ? `Chỉnh sửa thông tin lớp ${cls.name}`
                                    : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền sửa lớp`
                                }
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete Class */}
                              <button
                                onClick={() => {
                                  if (!canManage) return;
                                  setDeleteTarget({
                                    type: 'class',
                                    id: cls.id,
                                    name: `${cls.name} (Mã: ${cls.code} - Khối ${cls.grade} - GVCN: ${cls.homeroomTeacher})`,
                                  });
                                }}
                                disabled={!canManage}
                                className={`p-1.5 rounded-md transition-colors ${
                                  canManage
                                    ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                                    : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                }`}
                                title={
                                  canManage
                                    ? `Xóa lớp ${cls.name}`
                                    : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền xóa lớp`
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
        </div>
      )}

      {/* ============================================================ */}
      {/* VIEW MODE 2: QUẢN LÝ HỌC SINH THEO LỚP */}
      {/* (THÊM HỌC SINH, XÓA, SỬA, NHẬP QUA EXCEL) */}
      {/* ============================================================ */}
      {viewMode === 'students' && (
        <div className="space-y-4">
          {/* Top Class Banner & Quick Switcher */}
          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-blue-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('classes')}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl transition-colors"
                  title="Quay lại danh mục các lớp"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-blue-950">
                      DANH SÁCH HỌC SINH: {activeClass.name}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      Khối {activeClass.grade}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    GVCN: <strong>{activeClass.homeroomTeacher}</strong> · Phòng: <strong>{activeClass.room}</strong> · Sĩ số: <strong>{classStudents.length} học sinh</strong>
                  </p>
                </div>
              </div>

              {/* Class Selector Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-blue-950 whitespace-nowrap">
                  Chuyển lớp:
                </label>
                <select
                  value={activeClass.id}
                  onChange={(e) => setSelectedClassIdForStudents(e.target.value)}
                  className="px-3 py-1.5 bg-blue-50/50 border border-blue-300 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.homeroomTeacher})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Bar: THÊM HỌC SINH + NHẬP QUA EXCEL + XUẤT EXCEL */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Search and gender filter */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative min-w-[220px]">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên học sinh, mã HS..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-blue-50/40 border border-blue-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setStudentGenderFilter('all')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      studentGenderFilter === 'all'
                        ? 'bg-white text-blue-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tất cả ({classStudents.length})
                  </button>
                  <button
                    onClick={() => setStudentGenderFilter('Nam')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      studentGenderFilter === 'Nam'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Nam ({classStudents.filter((s) => s.gender === 'Nam').length})
                  </button>
                  <button
                    onClick={() => setStudentGenderFilter('Nữ')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      studentGenderFilter === 'Nữ'
                        ? 'bg-pink-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Nữ ({classStudents.filter((s) => s.gender === 'Nữ').length})
                  </button>
                </div>
              </div>

              {/* 3 CORE ACTIONS: THÊM HS, NHẬP EXCEL, XUẤT EXCEL */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => canManage && setShowImportExcelModal(true)}
                  disabled={!canManage}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                    canManage
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                  }`}
                  title={canManage ? 'Nhập danh sách học sinh từ file Excel hoặc CSV' : 'Tài khoản không được phân quyền nhập Excel'}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Nhập qua Excel</span>
                </button>

                <button
                  onClick={handleExportStudentsExcel}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
                  title="Xuất danh sách học sinh lớp ra file Excel/CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Excel</span>
                </button>

                <button
                  onClick={() => canManage && openAddStudent()}
                  disabled={!canManage}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors ${
                    canManage
                      ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed pointer-events-auto'
                  }`}
                  title={canManage ? 'Thêm học sinh vào lớp' : 'Tài khoản không được phân quyền thêm học sinh'}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Thêm học sinh</span>
                </button>
              </div>
            </div>
          </div>

          {/* BATCH ACTION BAR: WHEN 1 OR MORE STUDENTS ARE SELECTED */}
          {selectedStudentIds.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-950 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Đã chọn {selectedStudentIds.length} học sinh của lớp {activeClass.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudentIds([])}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-white rounded-xl transition-colors font-medium border border-transparent hover:border-slate-200"
                >
                  Bỏ chọn tất cả
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!canManage) return;
                    setDeleteTarget({
                      type: 'students_batch',
                      ids: selectedStudentIds,
                      count: selectedStudentIds.length,
                      className: activeClass.name,
                      name: `${selectedStudentIds.length} học sinh khỏi lớp ${activeClass.name}`,
                    });
                  }}
                  disabled={!canManage}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors ${
                    !canManage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  title={canManage ? 'Xóa các học sinh đã chọn' : 'Tài khoản không có quyền xóa'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa {selectedStudentIds.length} học sinh đã chọn</span>
                </button>
              </div>
            </div>
          )}

          {/* Students Table */}
          <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    {/* CHECKBOX SELECT ALL */}
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          filteredStudents.length > 0 &&
                          selectedStudentIds.length === filteredStudents.length
                        }
                        onChange={handleSelectAllStudents}
                        disabled={!canManage || filteredStudents.length === 0}
                        className={`rounded border-blue-300 text-blue-600 focus:ring-blue-400 w-4 h-4 transition-colors ${
                          !canManage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                        title={canManage ? 'Chọn tất cả học sinh' : 'Tài khoản không có quyền'}
                      />
                    </th>
                    <th className="py-3 px-3 w-12 text-center">STT</th>
                    <th className="py-3 px-4">Mã học sinh</th>
                    <th className="py-3 px-4 min-w-[180px]">Họ và tên</th>
                    <th className="py-3 px-4 text-center">Giới tính</th>
                    <th className="py-3 px-4">Ngày sinh</th>
                    <th className="py-3 px-4">Chức vụ trong lớp</th>
                    <th className="py-3 px-4">Điện thoại phụ huynh</th>
                    <th className="py-3 px-4 text-center">Số lỗi tuần</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-10 text-center text-slate-400">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="font-semibold text-slate-600">
                          Chưa có học sinh nào trong {activeClass.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Hãy nhấn nút <strong className="text-blue-700">"Thêm học sinh"</strong> hoặc{' '}
                          <strong className="text-emerald-700">"Nhập qua Excel"</strong> để bổ sung danh sách.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((std, idx) => {
                      const isSelected = selectedStudentIds.includes(std.id);
                      return (
                        <tr
                          key={std.id}
                          className={`transition-colors ${
                            isSelected ? 'bg-blue-50/80' : 'hover:bg-blue-50/40'
                          }`}
                        >
                          {/* CHECKBOX EACH ROW */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleStudent(std.id)}
                              disabled={!canManage}
                              className={`rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 transition-colors ${
                                !canManage ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                              title={canManage ? `Chọn học sinh ${std.fullName}` : 'Tài khoản không có quyền'}
                            />
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-slate-500 tabular-nums">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-900">{std.code}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0 ${
                                  std.gender === 'Nữ' ? 'bg-pink-600' : 'bg-blue-700'
                                }`}
                              >
                                {std.fullName.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-900 text-xs sm:text-sm">
                                {std.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                std.gender === 'Nữ'
                                  ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {std.gender}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">{std.dob}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                                std.roleInClass.includes('trưởng') || std.roleInClass.includes('phó')
                                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                                  : std.roleInClass.includes('Tổ')
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {std.roleInClass}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {std.phone ? (
                              <span className="flex items-center gap-1 text-slate-700">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {std.phone}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Chưa có</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {std.violationCount > 0 ? (
                              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                {std.violationCount} lỗi
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-600">0 lỗi</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Đang học
                            </span>
                          </td>

                          {/* SỬA / XÓA HỌC SINH */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => canManage && openEditStudent(std)}
                                disabled={!canManage}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  canManage
                                    ? 'text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer'
                                    : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                }`}
                                title={
                                  canManage
                                    ? `Sửa thông tin học sinh ${std.fullName}`
                                    : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền sửa học sinh`
                                }
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (!canManage) return;
                                  setDeleteTarget({
                                    type: 'student',
                                    id: std.id,
                                    name: `${std.fullName} (${std.code} - ${std.gender} - ${std.roleInClass})`,
                                    className: activeClass.name,
                                  });
                                }}
                                disabled={!canManage}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  canManage
                                    ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                                    : 'text-slate-300 opacity-40 cursor-not-allowed pointer-events-auto'
                                }`}
                                title={
                                  canManage
                                    ? `Xóa học sinh ${std.fullName}`
                                    : `Tài khoản (${currentUser.title || currentUser.role}) không được phân quyền xóa học sinh`
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
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: THÊM / SỬA HỌC SINH */}
      {/* ============================================================ */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-blue-200">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-950 text-sm">
                  {editingStudent
                    ? `Chỉnh sửa học sinh: ${editingStudent.fullName}`
                    : `Thêm học sinh mới vào lớp ${activeClass?.name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setEditingStudent(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã học sinh:
                  </label>
                  <input
                    type="text"
                    value={studentFormData.code}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: HS-9A-01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Giới tính:
                  </label>
                  <select
                    value={studentFormData.gender}
                    onChange={(e) =>
                      setStudentFormData({
                        ...studentFormData,
                        gender: e.target.value as 'Nam' | 'Nữ',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên học sinh:
                </label>
                <input
                  type="text"
                  value={studentFormData.fullName}
                  onChange={(e) =>
                    setStudentFormData({ ...studentFormData, fullName: e.target.value })
                  }
                  placeholder="Họ và tên đầy đủ"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Ngày sinh:
                  </label>
                  <input
                    type="date"
                    value={studentFormData.dob}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, dob: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chức vụ trong lớp:
                  </label>
                  <select
                    value={studentFormData.roleInClass}
                    onChange={(e) =>
                      setStudentFormData({ ...studentFormData, roleInClass: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Học sinh">Học sinh</option>
                    <option value="Lớp trưởng">Lớp trưởng</option>
                    <option value="Lớp phó Học tập">Lớp phó Học tập</option>
                    <option value="Lớp phó Lao động">Lớp phó Lao động</option>
                    <option value="Lớp phó Kỷ luật">Lớp phó Kỷ luật</option>
                    <option value="Tổ trưởng">Tổ trưởng</option>
                    <option value="Đội viên">Đội viên</option>
                    <option value="Đội viên (Cờ đỏ)">Đội viên (Cờ đỏ)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Điện thoại liên hệ phụ huynh:
                </label>
                <input
                  type="text"
                  value={studentFormData.phone}
                  onChange={(e) =>
                    setStudentFormData({ ...studentFormData, phone: e.target.value })
                  }
                  placeholder="Ví dụ: 0988.123.456"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setEditingStudent(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: NHẬP DANH SÁCH HỌC SINH QUA EXCEL (IMPORT EXCEL) */}
      {/* ============================================================ */}
      {showImportExcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-blue-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-blue-950 text-sm sm:text-base">
                  Nhập danh sách học sinh qua Excel vào {activeClass?.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowImportExcelModal(false);
                  setExcelPreviewStudents([]);
                  setExcelFileName('');
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {excelImportSuccess && (
              <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl p-3 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{excelImportSuccess}</span>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {/* File upload drag drop zone */}
              <div className="border-2 border-dashed border-blue-300 hover:border-blue-600 rounded-2xl p-6 text-center bg-blue-50/20 transition-all">
                <FileSpreadsheet className="w-12 h-12 text-emerald-600 mx-auto mb-2 drop-shadow-sm" />
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Kéo thả file Excel vào đây hoặc click để chọn từ máy tính
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Hỗ trợ định dạng <strong>.xlsx</strong>, <strong>.xls</strong>,{' '}
                  <strong>.csv</strong> chuẩn Unicode Tiếng Việt
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                  <label
                    htmlFor="studentExcelInput"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Chọn file Excel (.xlsx / .csv)</span>
                  </label>
                  <input
                    type="file"
                    id="studentExcelInput"
                    accept=".csv, .xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className="hidden"
                    onChange={handleExcelFileUpload}
                  />

                  {/* Sample buttons */}
                  <button
                    type="button"
                    onClick={handleDownloadExcelTemplate}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải file mẫu Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSampleExcelData}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold border border-amber-300 transition-colors"
                    title="Nạp dữ liệu mẫu nhanh để kiểm tra tính năng"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Nạp mẫu nhanh (12 HS)</span>
                  </button>
                </div>

                {excelFileName && (
                  <div className="mt-3 text-xs font-bold text-blue-900 bg-blue-100/70 py-1.5 px-3 rounded-lg inline-block">
                    Tệp đã chọn: {excelFileName} ({excelPreviewStudents.length} học sinh sẵn sàng)
                  </div>
                )}
              </div>

              {/* Excel Preview table if data loaded */}
              {excelPreviewStudents.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                      Xem trước dữ liệu ({excelPreviewStudents.length} học sinh):
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Đã kiểm tra hợp lệ
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto border border-blue-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-blue-50 text-blue-950 font-bold sticky top-0 border-b border-blue-200">
                        <tr>
                          <th className="py-2 px-3">Mã HS</th>
                          <th className="py-2 px-3">Họ và tên</th>
                          <th className="py-2 px-3 text-center">Giới tính</th>
                          <th className="py-2 px-3">Ngày sinh</th>
                          <th className="py-2 px-3">Chức vụ</th>
                          <th className="py-2 px-3">Điện thoại</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {excelPreviewStudents.map((std, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="py-1.5 px-3 font-mono font-semibold text-blue-900">
                              {std.code}
                            </td>
                            <td className="py-1.5 px-3 font-bold text-slate-800">{std.fullName}</td>
                            <td className="py-1.5 px-3 text-center">{std.gender}</td>
                            <td className="py-1.5 px-3 font-mono text-slate-600">{std.dob}</td>
                            <td className="py-1.5 px-3 text-slate-700">{std.roleInClass}</td>
                            <td className="py-1.5 px-3 font-mono text-slate-600">
                              {std.phone || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowImportExcelModal(false);
                  setExcelPreviewStudents([]);
                  setExcelFileName('');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
              >
                Đóng
              </button>

              <button
                type="button"
                disabled={excelPreviewStudents.length === 0}
                onClick={handleConfirmExcelImport}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                  excelPreviewStudents.length > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Xác nhận nạp vào {activeClass?.name} ({excelPreviewStudents.length} HS)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: THÊM / SỬA LỚP HỌC */}
      {/* ============================================================ */}
      {(showAddClassModal || editingClass) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-blue-200">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <h3 className="font-bold text-blue-950 text-sm">
                {editingClass ? `Chỉnh sửa lớp: ${editingClass.name}` : 'Thêm Chi đội / Lớp mới'}
              </h3>
              <button
                onClick={() => {
                  setShowAddClassModal(false);
                  setEditingClass(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã lớp:</label>
                  <input
                    type="text"
                    value={classFormData.code}
                    onChange={(e) =>
                      setClassFormData({ ...classFormData, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên lớp:</label>
                  <input
                    type="text"
                    value={classFormData.name}
                    onChange={(e) =>
                      setClassFormData({ ...classFormData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khối:</label>
                  <select
                    value={classFormData.grade}
                    onChange={(e) =>
                      setClassFormData({
                        ...classFormData,
                        grade: e.target.value as GradeLevel,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  >
                    <optgroup label="Cấp Tiểu học">
                      <option value="1">Khối 1 (Tiểu học)</option>
                      <option value="2">Khối 2 (Tiểu học)</option>
                      <option value="3">Khối 3 (Tiểu học)</option>
                      <option value="4">Khối 4 (Tiểu học)</option>
                      <option value="5">Khối 5 (Tiểu học)</option>
                    </optgroup>
                    <optgroup label="Cấp THCS">
                      <option value="6">Khối 6 (THCS)</option>
                      <option value="7">Khối 7 (THCS)</option>
                      <option value="8">Khối 8 (THCS)</option>
                      <option value="9">Khối 9 (THCS)</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sĩ số học sinh:
                  </label>
                  <input
                    type="number"
                    value={classFormData.studentCount}
                    onChange={(e) =>
                      setClassFormData({
                        ...classFormData,
                        studentCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Giáo viên chủ nhiệm:
                </label>
                <input
                  type="text"
                  value={classFormData.homeroomTeacher}
                  onChange={(e) =>
                    setClassFormData({ ...classFormData, homeroomTeacher: e.target.value })
                  }
                  placeholder="Họ và tên giáo viên"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phòng học / Khu vực:
                </label>
                <input
                  type="text"
                  value={classFormData.room}
                  onChange={(e) =>
                    setClassFormData({ ...classFormData, room: e.target.value })
                  }
                  placeholder="Ví dụ: Phòng 201 Dãy A"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddClassModal(false);
                    setEditingClass(null);
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  {editingClass ? 'Lưu thay đổi' : 'Thêm lớp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: LỊCH SỬ THI ĐUA CỦA LỚP */}
      {/* ============================================================ */}
      {historyClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 shadow-2xl border border-blue-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
              <div>
                <h3 className="font-bold text-blue-950 text-base">
                  Lịch sử thi đua nề nếp: {historyClass.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  GVCN: {historyClass.homeroomTeacher} · Khối {historyClass.grade} · Sĩ số:{' '}
                  {historyClass.studentCount}
                </p>
              </div>
              <button
                onClick={() => setHistoryClass(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <span className="text-[11px] text-blue-700 font-semibold">Điểm tuần 4 hiện tại</span>
                  <p className="text-2xl font-black text-blue-900 mt-1 tabular-nums">
                    {classRankings.find((c) => c.classId === historyClass.id)?.finalScore || 91}
                  </p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-[11px] text-amber-700 font-semibold">Xếp hạng tuần 4</span>
                  <p className="text-2xl font-black text-amber-900 mt-1">
                    #{classRankings.find((c) => c.classId === historyClass.id)?.rank || 3}
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-700 font-semibold">Đánh giá chung</span>
                  <p className="text-2xl font-black text-emerald-900 mt-1">
                    {classRankings.find((c) => c.classId === historyClass.id)?.rating || 'Tốt'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHistoryClass(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: HỘP THOẠI XÁC NHẬN XÓA (AN TOÀN - CHỐNG BẤM NHẦM) */}
      {/* ============================================================ */}
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        title={
          deleteTarget?.type === 'class'
            ? 'Xác nhận xóa lớp học'
            : deleteTarget?.type === 'classes_batch'
            ? `Xác nhận xóa ${deleteTarget.count} lớp học đã chọn`
            : deleteTarget?.type === 'student'
            ? 'Xác nhận xóa học sinh'
            : `Xác nhận xóa ${deleteTarget?.count || 0} học sinh đã chọn`
        }
        message="Bạn có chắc chắn muốn xóa dữ liệu này không? Thao tác này sẽ xóa vĩnh viễn khỏi danh sách và cập nhật lại giao diện ngay lập tức."
        itemName={deleteTarget?.name}
        itemType={
          deleteTarget?.type === 'class'
            ? 'Lớp học & Chi đội'
            : deleteTarget?.type === 'classes_batch'
            ? 'Danh sách nhiều lớp học'
            : deleteTarget?.type === 'student'
            ? `Học sinh (${deleteTarget.className})`
            : `Học sinh (${deleteTarget?.className})`
        }
        warningText={
          deleteTarget?.type === 'class' || deleteTarget?.type === 'classes_batch'
            ? 'Xóa lớp học sẽ đồng thời xóa toàn bộ học sinh và dữ liệu liên quan của lớp đó khỏi hệ thống.'
            : 'Học sinh bị xóa sẽ bị loại khỏi lớp và sĩ số lớp học sẽ tự động được điều chỉnh giảm đi.'
        }
        confirmLabel="Đồng ý xóa"
        cancelLabel="Hủy bỏ"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
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
