import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CriteriaCategory, ViolationCatalogItem, GradingRecordItem } from '../types';
import { OfficialScoreSheetModal, ScoreSheetData } from '../components/OfficialScoreSheetModal';
import { OFFICIAL_GRADING_CRITERIA, OfficialCriterion } from '../data/officialGradingCriteria';
import {
  Smartphone,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Minus,
  Sparkles,
  Trash2,
  Calendar,
  MapPin,
  FileCheck,
  Send,
  X,
  AlertCircle,
  HelpCircle,
  Flag,
  Lock,
  ChevronRight,
  Eye,
  FileText,
  CloudRain,
  ShieldCheck,
  ListChecks,
  ChevronDown,
  ChevronUp,
  UserCheck,
} from 'lucide-react';

interface StagedViolation {
  catalogId: string;
  category: CriteriaCategory;
  name: string;
  quantity: number;
  unitPoints: number;
  totalPoints: number;
  studentNames?: string;
  note?: string;
}

export const GradingMobileView: React.FC = () => {
  const {
    currentUser,
    currentWeek,
    weeks,
    selectedWeekId,
    setSelectedWeekId,
    assignments,
    classes,
    redFlags,
    violationsCatalog,
    gradingRecords,
    addGradingRecord,
    setActiveTab,
    hasPermission,
    students,
  } = useApp();

  const canGrade = currentUser.role === 'admin' || currentUser.role === 'red_flag' || hasPermission('canGrade');
  const isRedFlagRole = currentUser.role === 'red_flag';

  // Find Cờ đỏ corresponding to currentUser if logged in as Cờ đỏ
  const userRedFlag = useMemo(() => {
    return redFlags.find(
      (r) =>
        r.account.toLowerCase() === currentUser.username.toLowerCase() ||
        r.name.toLowerCase() === currentUser.name.toLowerCase() ||
        r.id === currentUser.id.replace('u-', '') ||
        r.code.toLowerCase() === currentUser.username.toLowerCase()
    );
  }, [redFlags, currentUser]);

  // Active Red Flag who is performing the grading
  const [selectedRedFlagId, setSelectedRedFlagId] = useState<string>(() => {
    if (userRedFlag) return userRedFlag.id;
    const found = redFlags.find((r) => r.name === currentUser.name || r.account === currentUser.username);
    return found ? found.id : redFlags[0]?.id || 'rf-1';
  });

  // Sync selectedRedFlagId when currentUser changes
  useEffect(() => {
    if (userRedFlag) {
      setSelectedRedFlagId(userRedFlag.id);
    } else {
      const found = redFlags.find((r) => r.name === currentUser.name || r.account === currentUser.username);
      if (found) {
        setSelectedRedFlagId(found.id);
      }
    }
  }, [userRedFlag, currentUser, redFlags]);

  const activeRedFlag = useMemo(() => {
    if (isRedFlagRole && userRedFlag) return userRedFlag;
    return redFlags.find((r) => r.id === selectedRedFlagId) || redFlags[0];
  }, [isRedFlagRole, userRedFlag, redFlags, selectedRedFlagId]);

  // Active Week Selection
  const [activeWeekId, setActiveWeekId] = useState<string>(selectedWeekId || currentWeek?.id || 'w-4');

  useEffect(() => {
    if (selectedWeekId) {
      setActiveWeekId(selectedWeekId);
    }
  }, [selectedWeekId]);

  const activeWeek = useMemo(() => {
    return weeks.find((w) => w.id === activeWeekId) || currentWeek || weeks[0];
  }, [weeks, activeWeekId, currentWeek]);

  // Assignments specifically for this Cờ đỏ in this week:
  const redFlagWeekAssignments = useMemo(() => {
    if (!activeRedFlag) return [];
    return assignments.filter(
      (a) =>
        a.weekId === activeWeekId &&
        (a.redFlagId === activeRedFlag.id ||
         a.redFlagName === activeRedFlag.name ||
         (activeRedFlag.code && a.redFlagName.includes(activeRedFlag.name)))
    );
  }, [assignments, activeWeekId, activeRedFlag]);

  // Unique classes that this cờ đỏ is assigned to grade in this week:
  const assignedClasses = useMemo(() => {
    const assignedCodes = new Set(redFlagWeekAssignments.map((a) => a.targetClassName));
    const assignedIds = new Set(redFlagWeekAssignments.map((a) => a.targetClassId));
    const directClasses = classes.filter(
      (c) =>
        assignedCodes.has(c.code) ||
        assignedIds.has(c.id) ||
        assignedCodes.has(c.name.replace('Lớp ', ''))
    );
    if (directClasses.length > 0) return directClasses;

    // Fallback: If this cờ đỏ has assignment in any week, use those assigned classes:
    const anyWeekAssignments = assignments.filter(
      (a) =>
        a.redFlagId === activeRedFlag?.id ||
        a.redFlagName === activeRedFlag?.name ||
        (activeRedFlag?.code && a.redFlagName.includes(activeRedFlag.name))
    );
    if (anyWeekAssignments.length > 0) {
      const anyCodes = new Set(anyWeekAssignments.map((a) => a.targetClassName));
      const matched = classes.filter((c) => anyCodes.has(c.code) || anyCodes.has(c.name.replace('Lớp ', '')));
      if (matched.length > 0) return matched;
    }

    // Default cross-class fallback for any active red flag so they can always test & grade:
    if (activeRedFlag) {
      const ownClass = activeRedFlag.className;
      const candidate = classes.find((c) => c.code !== ownClass && !c.name.includes(ownClass));
      if (candidate) return [candidate];
    }
    return classes.length > 0 ? [classes[0]] : [];
  }, [redFlagWeekAssignments, assignments, classes, activeRedFlag]);

  const hasAssignmentThisWeek = assignedClasses.length > 0;

  // Selected Day for duty
  const [selectedDay, setSelectedDay] = useState<string>('Thứ 5');
  const [selectedShift, setSelectedShift] = useState<'Sáng' | 'Chiều'>('Sáng');
  const [targetClass, setTargetClass] = useState<string>('7A');
  const [generalNote, setGeneralNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Assignment specifically for the selected day
  const currentDayAssignment = useMemo(() => {
    return redFlagWeekAssignments.find((a) => a.dayOfWeek === selectedDay);
  }, [redFlagWeekAssignments, selectedDay]);

  // Sync targetClass strictly from assigned classes
  useEffect(() => {
    if (currentDayAssignment) {
      setTargetClass(currentDayAssignment.targetClassName);
      if (currentDayAssignment.shift) {
        setSelectedShift(currentDayAssignment.shift as 'Sáng' | 'Chiều');
      }
    } else if (assignedClasses.length > 0) {
      if (!assignedClasses.some((c) => c.code === targetClass)) {
        setTargetClass(assignedClasses[0].code);
      }
    }
  }, [selectedDay, currentDayAssignment, assignedClasses, targetClass]);

  // Danh sách học sinh của lớp được phân công chấm hiện tại:
  const classStudents = useMemo(() => {
    if (!targetClass) return [];
    const matchedClass = classes.find(
      (c) =>
        c.code === targetClass ||
        c.name.replace('Lớp ', '') === targetClass ||
        c.id === targetClass
    );
    return students.filter(
      (s) =>
        (matchedClass && s.classId === matchedClass.id) ||
        s.className === targetClass ||
        s.className.replace('Lớp ', '') === targetClass ||
        s.className === `Lớp ${targetClass}`
    );
  }, [students, targetClass, classes]);

  // Lọc học sinh trong modal tìm kiếm:
  const filteredModalStudents = useMemo(() => {
    if (!modalStudentSearch.trim()) return classStudents;
    const term = modalStudentSearch.toLowerCase().trim();
    return classStudents.filter(
      (s) =>
        s.fullName.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        (s.roleInClass && s.roleInClass.toLowerCase().includes(term))
    );
  }, [classStudents, modalStudentSearch]);

  // Staged violations in current draft
  const [stagedViolations, setStagedViolations] = useState<StagedViolation[]>([
    {
      catalogId: 'vc-1',
      category: 'Trang phục',
      name: 'Không đeo khăn quàng đỏ',
      quantity: 2,
      unitPoints: -1,
      totalPoints: -2,
      studentNames: 'Lò Mí Sính, Vàng Thị Hoa',
      note: 'Giờ truy bài 15 phút',
    },
  ]);

  // Modal: Add single violation
  const [showAddViolationModal, setShowAddViolationModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CriteriaCategory>('Trang phục');
  const [selectedViolationItem, setSelectedViolationItem] = useState<ViolationCatalogItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customUnitPoints, setCustomUnitPoints] = useState<number>(1);
  const [studentNames, setStudentNames] = useState<string>('');
  const [modalStudentSearch, setModalStudentSearch] = useState<string>('');
  const [modalNote, setModalNote] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Active student selected on the main screen before picking criteria
  const [activeGradingStudent, setActiveGradingStudent] = useState<string>('');

  // Available violations for selected category
  const categoryViolations = violationsCatalog.filter((v) => v.category === selectedCategory);

  // Find assignment of current user or fallback to standard demo assignment (7A)
  const userAssignments = assignments.filter((a) =>
    currentUser.name.includes('An') ? a.redFlagName.includes('An') : true
  );

  // Progress for the 6 days of the week (Thang điểm 50đ/ngày, 6 ngày/tuần = 300đ)
  const daysProgress = [
    { day: 'Thứ 2', status: 'completed' },
    { day: 'Thứ 3', status: 'completed' },
    { day: 'Thứ 4', status: 'completed' },
    { day: 'Thứ 5', status: 'pending' },
    { day: 'Thứ 6', status: 'pending' },
    { day: 'Thứ 7', status: 'pending' },
  ];

  // Weather notes from official regulations
  const [isRainyDayShoes, setIsRainyDayShoes] = useState<boolean>(false);
  const [isRainyDayWatering, setIsRainyDayWatering] = useState<boolean>(false);

  // Preview Modal State: Xem trước phiếu chấm trước khi gửi
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [viewingRecordData, setViewingRecordData] = useState<ScoreSheetData | null>(null);

  // Tab mode in grading view: Quick 9-Criteria Sheet vs Custom Catalog
  const [gradingTab, setGradingTab] = useState<'official_sheet' | 'violations_list'>('official_sheet');

  // Calculated totals: 50 points/day base score
  const totalDeduction = stagedViolations.reduce((sum, v) => sum + Math.abs(v.totalPoints), 0);
  const dailyFinalScore = Math.max(0, 50 - totalDeduction);

  // Map current draft into official ScoreSheetData structure for preview
  const currentScoreSheetData = useMemo<ScoreSheetData>(() => {
    const criteriaResults: Record<string, { deducted: number; details: string[]; studentNames?: string }> = {};
    OFFICIAL_GRADING_CRITERIA.forEach((crit) => {
      criteriaResults[crit.id] = { deducted: 0, details: [] };
    });

    stagedViolations.forEach((v) => {
      let matchedCrit = OFFICIAL_GRADING_CRITERIA.find((c) => (v as any).criterionId === c.id);
      if (!matchedCrit) {
        matchedCrit = OFFICIAL_GRADING_CRITERIA.find(
          (c) =>
            c.name.toLowerCase().includes(v.name.toLowerCase()) ||
            v.name.toLowerCase().includes(c.name.toLowerCase()) ||
            c.items.some((item) => item.label.toLowerCase().includes(v.name.toLowerCase()))
        );
      }
      if (!matchedCrit) {
        if (v.category === 'Trang phục') matchedCrit = OFFICIAL_GRADING_CRITERIA[1];
        else if (v.category === 'Đi học') matchedCrit = OFFICIAL_GRADING_CRITERIA[3];
        else if (v.category === 'Vệ sinh') matchedCrit = OFFICIAL_GRADING_CRITERIA[4];
        else if (v.category === 'Học tập') matchedCrit = OFFICIAL_GRADING_CRITERIA[5];
        else if (v.category === 'Nề nếp') matchedCrit = OFFICIAL_GRADING_CRITERIA[0];
        else matchedCrit = OFFICIAL_GRADING_CRITERIA[8];
      }

      if (matchedCrit) {
        const cur = criteriaResults[matchedCrit.id] || { deducted: 0, details: [] };
        const pts = Math.abs(v.totalPoints);
        cur.deducted += pts;
        cur.details.push(`${v.name} (${v.quantity > 1 ? `x${v.quantity} ` : ''}-${pts}đ)`);
        if (v.studentNames) {
          cur.studentNames = cur.studentNames
            ? `${cur.studentNames}, ${v.studentNames}`
            : v.studentNames;
        }
        criteriaResults[matchedCrit.id] = cur;
      }
    });

    return {
      weekNumber: activeWeek?.weekNumber || 4,
      startDate: activeWeek?.startDate,
      endDate: activeWeek?.endDate,
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: selectedDay,
      shift: selectedShift,
      classId: classes.find((c) => c.code === targetClass)?.id || 'c-7a',
      className: targetClass,
      redFlagId: activeRedFlag.id,
      redFlagName: activeRedFlag.name,
      redFlagClass: activeRedFlag.className,
      generalNote,
      isRainyDayShoes,
      isRainyDayWatering,
      criteriaResults,
      totalDeduction,
      finalScore: dailyFinalScore,
      status: 'draft',
    };
  }, [
    activeWeek,
    selectedDay,
    selectedShift,
    targetClass,
    classes,
    activeRedFlag,
    generalNote,
    isRainyDayShoes,
    isRainyDayWatering,
    stagedViolations,
    totalDeduction,
    dailyFinalScore,
  ]);

  // Quick-add an infraction from the 9 official criteria
  const handleQuickAddOfficialInfraction = (
    criterion: OfficialCriterion,
    item: { code: string; label: string; pointsDeducted: number; unit: string }
  ) => {
    if (!canGrade) return;

    if (activeGradingStudent) {
      // Đã chọn học sinh từ thanh chọn trước
      const existingIndex = stagedViolations.findIndex(
        (v) => (v.catalogId === item.code || v.name === item.label) && v.studentNames === activeGradingStudent
      );
      if (existingIndex >= 0) {
        setStagedViolations((prev) =>
          prev.map((v, i) => {
            if (i === existingIndex) {
              const nextQty = v.quantity + 1;
              return {
                ...v,
                quantity: nextQty,
                totalPoints: v.unitPoints * nextQty,
              };
            }
            return v;
          })
        );
      } else {
        const unitPts = -Math.abs(item.pointsDeducted);
        const newV: StagedViolation & { criterionId?: string } = {
          catalogId: item.code,
          category: criterion.category,
          name: item.label,
          quantity: 1,
          unitPoints: unitPts,
          totalPoints: unitPts,
          studentNames: activeGradingStudent,
          note: `Mục ${criterion.order}. ${criterion.name}`,
        };
        (newV as any).criterionId = criterion.id;
        setStagedViolations((prev) => [...prev, newV]);
      }
    } else {
      // Yêu cầu chọn học sinh trước khi chọn danh mục lỗi
      setSelectedCategory(criterion.category);
      const matched = violationsCatalog.find((v) => v.id === item.code || v.name === item.label) || {
        id: item.code,
        category: criterion.category,
        name: item.label,
        pointsDeducted: item.pointsDeducted,
        unit: item.unit,
        description: item.label,
      };
      setSelectedViolationItem(matched);
      setCustomUnitPoints(Math.abs(item.pointsDeducted));
      setQuantity(1);
      setSelectedStudentId('');
      setStudentNames('');
      setModalStudentSearch('');
      setModalNote(`Mục ${criterion.order}. ${criterion.name}`);
      setShowAddViolationModal(true);
    }
  };

  // Convert past GradingRecordItem into ScoreSheetData for view-only modal
  const handleViewPastScoreSheet = (record: GradingRecordItem) => {
    const criteriaResults: Record<string, { deducted: number; details: string[]; studentNames?: string }> = {};
    OFFICIAL_GRADING_CRITERIA.forEach((crit) => {
      criteriaResults[crit.id] = { deducted: 0, details: [] };
    });

    record.violations.forEach((v) => {
      let matchedCrit = OFFICIAL_GRADING_CRITERIA.find(
        (c) =>
          c.name.toLowerCase().includes(v.name.toLowerCase()) ||
          v.name.toLowerCase().includes(c.name.toLowerCase())
      );
      if (!matchedCrit) {
        if (v.category === 'Trang phục') matchedCrit = OFFICIAL_GRADING_CRITERIA[1];
        else if (v.category === 'Đi học') matchedCrit = OFFICIAL_GRADING_CRITERIA[3];
        else if (v.category === 'Vệ sinh') matchedCrit = OFFICIAL_GRADING_CRITERIA[4];
        else if (v.category === 'Học tập') matchedCrit = OFFICIAL_GRADING_CRITERIA[5];
        else if (v.category === 'Nề nếp') matchedCrit = OFFICIAL_GRADING_CRITERIA[0];
        else matchedCrit = OFFICIAL_GRADING_CRITERIA[8];
      }
      if (matchedCrit) {
        const cur = criteriaResults[matchedCrit.id] || { deducted: 0, details: [] };
        const pts = Math.abs(v.totalPoints);
        cur.deducted += pts;
        cur.details.push(`${v.name} (${v.quantity > 1 ? `x${v.quantity} ` : ''}-${pts}đ)`);
        if (v.studentNames) {
          cur.studentNames = cur.studentNames ? `${cur.studentNames}, ${v.studentNames}` : v.studentNames;
        }
        criteriaResults[matchedCrit.id] = cur;
      }
    });

    setViewingRecordData({
      weekNumber: record.weekNumber,
      date: record.date,
      dayOfWeek: record.dayOfWeek,
      shift: 'Sáng',
      classId: record.classId,
      className: record.className,
      redFlagId: record.redFlagId,
      redFlagName: record.redFlagName,
      generalNote: record.generalNote,
      criteriaResults,
      totalDeduction: record.totalDeduction,
      finalScore: Math.max(0, 50 - record.totalDeduction),
      status: record.status,
    });
  };

  const handleOpenAddViolation = (preselectedCategory?: CriteriaCategory, preselectedStudent?: string) => {
    if (!canGrade) return;
    const cat = preselectedCategory || selectedCategory || 'Trang phục';
    setSelectedCategory(cat);
    const catItems = violationsCatalog.filter((v) => v.category === cat);
    const defaultItem = catItems[0] || violationsCatalog[0];
    setSelectedViolationItem(defaultItem);
    setQuantity(1);
    setSelectedStudentId('');
    setStudentNames(preselectedStudent || '');
    setCustomUnitPoints(defaultItem ? Math.abs(defaultItem.pointsDeducted) : 1);
    setModalNote('');
    setShowAddViolationModal(true);
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    if (!studentId) return;
    if (studentId === 'all') {
      setStudentNames(`Tập thể Lớp ${targetClass}`);
      return;
    }
    if (studentId === 'custom') {
      return;
    }
    const st = classStudents.find((s) => s.id === studentId);
    if (st) {
      setStudentNames(st.fullName);
    }
  };

  const handleToggleStudentChip = (name: string) => {
    if (!studentNames.trim()) {
      setStudentNames(name);
    } else {
      const namesList = studentNames.split(',').map((n) => n.trim()).filter(Boolean);
      if (namesList.includes(name)) {
        const filtered = namesList.filter((n) => n !== name);
        setStudentNames(filtered.join(', '));
      } else {
        setStudentNames([...namesList, name].join(', '));
      }
    }
  };

  const handleConfirmAddViolation = () => {
    if (!canGrade) return;
    if (!selectedViolationItem) return;

    const unitPts = -Math.abs(customUnitPoints);
    const totPts = unitPts * quantity;

    const newViolation: StagedViolation = {
      catalogId: selectedViolationItem.id,
      category: selectedViolationItem.category,
      name: selectedViolationItem.name,
      quantity,
      unitPoints: unitPts,
      totalPoints: totPts,
      studentNames: studentNames.trim() || undefined,
      note: modalNote.trim() || undefined,
    };

    setStagedViolations((prev) => [...prev, newViolation]);
    setShowAddViolationModal(false);
  };

  const handleRemoveStaged = (index: number) => {
    if (!canGrade) return;
    setStagedViolations((prev) => prev.filter((_, i) => i !== index));
  };

  // Cho phép sửa trực tiếp điểm trừ của lỗi vi phạm đã ghi trên ô dữ liệu
  const handleDirectEditStagedPoints = (index: number, newAbsPoints: number) => {
    if (!canGrade) return;
    const cleanPts = Math.max(0, isNaN(newAbsPoints) ? 0 : newAbsPoints);
    setStagedViolations((prev) =>
      prev.map((v, i) => {
        if (i === index) {
          return {
            ...v,
            unitPoints: -cleanPts,
            totalPoints: -cleanPts * v.quantity,
          };
        }
        return v;
      })
    );
  };

  const handleDirectEditStagedStudentNames = (index: number, names: string) => {
    if (!canGrade) return;
    setStagedViolations((prev) =>
      prev.map((v, i) => {
        if (i === index) {
          return {
            ...v,
            studentNames: names,
          };
        }
        return v;
      })
    );
  };

  // Cho phép sửa trực tiếp điểm trừ trên ô dữ liệu của bảng 10 tiêu chí chuẩn
  const handleDirectEditCriterionPoints = (criterion: OfficialCriterion, newDeduction: number) => {
    if (!canGrade) return;
    const cleanDeduction = Math.max(0, Math.min(criterion.maxPoints, isNaN(newDeduction) ? 0 : newDeduction));

    const existingIndex = stagedViolations.findIndex(
      (v) => (v as any).criterionId === criterion.id || (v.category === criterion.category && v.name.includes(criterion.name))
    );

    if (existingIndex >= 0) {
      if (cleanDeduction === 0) {
        setStagedViolations((prev) => prev.filter((_, i) => i !== existingIndex));
      } else {
        setStagedViolations((prev) =>
          prev.map((v, i) => {
            if (i === existingIndex) {
              return {
                ...v,
                unitPoints: -cleanDeduction,
                totalPoints: -cleanDeduction,
              };
            }
            return v;
          })
        );
      }
    } else if (cleanDeduction > 0) {
      const defaultItem = criterion.items[0];
      const newV: StagedViolation & { criterionId?: string } = {
        catalogId: defaultItem?.code || `crit-${criterion.order}`,
        category: criterion.category,
        name: `Trừ điểm: ${criterion.name}`,
        quantity: 1,
        unitPoints: -cleanDeduction,
        totalPoints: -cleanDeduction,
        note: `Sửa trực tiếp điểm mục ${criterion.order}. ${criterion.name}`,
      };
      (newV as any).criterionId = criterion.id;
      setStagedViolations((prev) => [...prev, newV]);
    }
  };

  const handleOpenPreviewScoreSheet = () => {
    if (!canGrade) return;
    if (assignedClasses.length === 0) {
      setFormError(`Cờ đỏ ${activeRedFlag.name} chưa được phân công chấm lớp nào trong Tuần ${activeWeek.weekNumber}. Bạn không được phép tạo phiếu chấm mới!`);
      return;
    }

    const isAssigned = assignedClasses.some(
      (c) => c.code === targetClass || c.name.replace('Lớp ', '') === targetClass
    );
    if (!isAssigned) {
      setFormError(`Bạn chỉ được phép tạo phiếu chấm cho lớp được phân công (${assignedClasses.map((c) => c.name).join(', ')})!`);
      return;
    }

    setFormError(null);
    setShowPreviewModal(true);
  };

  const handleSubmitRecord = (customData?: ScoreSheetData) => {
    if (!canGrade) return;
    if (assignedClasses.length === 0) {
      setFormError(`Cờ đỏ ${activeRedFlag.name} chưa được phân công chấm lớp nào trong Tuần ${activeWeek.weekNumber}. Bạn không được phép tạo phiếu chấm mới!`);
      return;
    }

    // Verify targetClass is strictly one of the assigned classes
    const isAssigned = assignedClasses.some(
      (c) => c.code === targetClass || c.name.replace('Lớp ', '') === targetClass
    );
    if (!isAssigned) {
      setFormError(`Bạn chỉ được phép tạo phiếu chấm cho lớp được phân công (${assignedClasses.map((c) => c.name).join(', ')})!`);
      return;
    }

    const matchedCls = classes.find((c) => c.code === targetClass || c.name.includes(targetClass)) || assignedClasses[0];

    const finalDeduction = customData ? customData.totalDeduction : totalDeduction;
    const finalNote = customData?.generalNote || [
      generalNote || (stagedViolations.length === 0 ? 'Lớp thực hiện tốt các nội quy, không ghi nhận vi phạm trong buổi trực.' : ''),
      isRainyDayShoes ? '[Thời tiết: Ngày mưa miễn chấm giày]' : '',
      isRainyDayWatering ? '[Thời tiết: Ngày mưa miễn tưới cây măng non]' : '',
    ]
      .filter(Boolean)
      .join(' ');

    let finalViolations = stagedViolations;
    if (customData) {
      const generatedViols: StagedViolation[] = [];
      Object.entries(customData.criteriaResults).forEach(([critId, res]) => {
        if (res.deducted > 0) {
          const crit = OFFICIAL_GRADING_CRITERIA.find((c) => c.id === critId);
          generatedViols.push({
            catalogId: critId,
            category: crit?.category || 'Nề nếp',
            name: crit ? `${crit.order}. ${crit.name}` : 'Nề nếp & Kỷ luật chung',
            quantity: 1,
            unitPoints: -res.deducted,
            totalPoints: -res.deducted,
            studentNames: res.studentNames || undefined,
            note: res.details?.join('; ') || undefined,
          });
        }
      });
      if (generatedViols.length > 0 || stagedViolations.length === 0) {
        finalViolations = generatedViols;
      }
    }

    addGradingRecord({
      weekId: activeWeek.id,
      weekNumber: activeWeek.weekNumber,
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: selectedDay,
      redFlagId: activeRedFlag.id,
      redFlagName: activeRedFlag.name,
      classId: matchedCls?.id || 'c-7a',
      className: targetClass,
      violations: finalViolations,
      bonuses: [],
      totalDeduction: finalDeduction,
      totalBonus: 0,
      netScoreImpact: -finalDeduction,
      status: 'pending',
      generalNote: finalNote,
    });

    setFormError(null);
    setSubmitSuccess(true);
    setShowPreviewModal(false);
    setStagedViolations([]);
    setActiveGradingStudent('');
    setGeneralNote('');
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  // Recent submitted records for current user and assigned classes
  const recentRecords = useMemo(() => {
    return gradingRecords.filter(
      (r) =>
        r.redFlagId === activeRedFlag.id ||
        r.redFlagName === activeRedFlag.name ||
        assignedClasses.some((c) => c.id === r.classId || c.code === r.className)
    );
  }, [gradingRecords, activeRedFlag, assignedClasses]);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-16 lg:pb-6">
      {/* Cờ đỏ Greeting Banner (Mobile-first friendly) */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>GIAO DIỆN CHẤM ĐIỂM DÀNH CHO CỜ ĐỎ</span>
            </div>

            {/* Week Selector */}
            <div className="flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-xl text-xs backdrop-blur-md border border-white/20">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <select
                value={activeWeekId}
                onChange={(e) => {
                  setActiveWeekId(e.target.value);
                  if (setSelectedWeekId) setSelectedWeekId(e.target.value);
                }}
                className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer"
              >
                {weeks.map((w) => (
                  <option key={w.id} value={w.id} className="text-slate-900">
                    Tuần {w.weekNumber} ({w.startDate.slice(5)} - {w.endDate.slice(5)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Xin chào, {activeRedFlag?.name || 'Nguyễn Văn An'} 👋
            </h2>
            <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-xl text-xs backdrop-blur-md">
              <Flag className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-blue-100 text-[11px]">Cờ đỏ chấm:</span>
              {isRedFlagRole ? (
                <span className="font-bold text-amber-300 text-xs">
                  {activeRedFlag.name} (Lớp {activeRedFlag.className})
                </span>
              ) : (
                <select
                  value={selectedRedFlagId}
                  onChange={(e) => setSelectedRedFlagId(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs focus:outline-hidden cursor-pointer"
                >
                  {redFlags.map((rf) => (
                    <option key={rf.id} value={rf.id} className="text-slate-900">
                      {rf.name} (Lớp {rf.className})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Duty Mission Card */}
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  NHIỆM VỤ PHÂN CÔNG TUẦN {activeWeek?.weekNumber || 4}
                </span>
                {hasAssignmentThisWeek ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400 text-blue-950 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Được phân công chấm Lớp {assignedClasses.map((c) => c.name).join(', ')}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-400 text-rose-950 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Chưa có phân công tuần này
                  </span>
                )}
              </div>
              <span className="text-[11px] text-blue-100 font-mono">
                {activeWeek?.startDate || '28/09'} – {activeWeek?.endDate || '04/10/2026'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2.5">
              <div>
                <p className="text-[10px] text-blue-200">Lớp được phân công chấm:</p>
                <p className="text-base font-black text-amber-300">
                  {hasAssignmentThisWeek
                    ? assignedClasses.map((c) => `Lớp ${c.name}`).join(', ')
                    : 'Chưa có phân công'}
                </p>
                {hasAssignmentThisWeek && (
                  <p className="text-[10px] text-emerald-300 font-medium mt-0.5">
                    ✓ Được phép tạo phiếu chấm
                  </p>
                )}
              </div>
              <div>
                <p className="text-[10px] text-blue-200">Khu vực trực:</p>
                <p className="font-bold text-white truncate">
                  {currentDayAssignment?.area || activeRedFlag.dutyArea || 'Khu vực được phân công'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-blue-200">Nội dung chấm:</p>
                <p className="font-bold text-white truncate">
                  {currentDayAssignment?.content || 'Nề nếp & Giờ học'}
                </p>
              </div>
            </div>
          </div>

          {/* Weekday Progress Indicators */}
          <div className="mt-4">
            <p className="text-[11px] text-blue-200 font-medium mb-1.5">Chọn ngày trong tuần để tạo phiếu chấm:</p>
            <div className="grid grid-cols-5 gap-1.5">
              {daysProgress.map((item) => {
                const isSelected = selectedDay === item.day;
                const hasDutyThisDay = redFlagWeekAssignments.some((a) => a.dayOfWeek === item.day);
                const hasExistingRecord = gradingRecords.some(
                  (r) =>
                    r.weekId === activeWeek.id &&
                    r.dayOfWeek === item.day &&
                    (r.redFlagId === activeRedFlag.id || r.redFlagName === activeRedFlag.name)
                );

                return (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDay(item.day)}
                    className={`py-2 px-1 rounded-lg text-center text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-blue-950 font-bold shadow-md scale-102 ring-2 ring-white'
                        : hasExistingRecord
                        ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/40'
                        : hasDutyThisDay
                        ? 'bg-blue-600/50 border border-blue-400/40 text-white hover:bg-blue-600/70'
                        : 'bg-white/10 border border-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    <p className="font-bold">{item.day}</p>
                    <p className="text-[10px] mt-0.5 font-medium truncate">
                      {hasExistingRecord ? '✓ Đã tạo phiếu' : hasDutyThisDay ? 'Có ca trực' : 'Nghỉ'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Success notification alert */}
      {submitSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl p-4 flex items-center gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Đã tạo và gửi phiếu chấm mới thành công!</p>
            <p className="text-emerald-700">
              Phiếu chấm ngày {selectedDay} (Lớp {targetClass}, Tuần {activeWeek.weekNumber}) đã được ghi nhận và chuyển đến Thầy Tổng phụ trách để phê duyệt.
            </p>
          </div>
        </div>
      )}

      {/* Form Error Message */}
      {formError && (
        <div className="bg-rose-50 border border-rose-300 text-rose-900 rounded-xl p-4 flex items-center gap-3 shadow-xs animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-xs font-semibold">
            {formError}
          </div>
        </div>
      )}

      {/* No assignment warning */}
      {!hasAssignmentThisWeek && (
        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-xs text-amber-950 space-y-2 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Không được phép tạo phiếu chấm trong Tuần {activeWeek.weekNumber}</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            Hệ thống quy định: <strong>Cờ đỏ chấm lớp nào thì được phép tạo phiếu chấm mới cho lớp được phân công của tuần đó</strong>.
            Cờ đỏ <strong>{activeRedFlag.name}</strong> (Lớp {activeRedFlag.className}) hiện <strong>chưa được phân công chấm lớp nào</strong> trong Tuần {activeWeek.weekNumber}.
          </p>
          <p className="text-slate-600 text-[11px]">
            Em vui lòng chọn tuần khác có lịch trực hoặc liên hệ Thầy Tổng phụ trách để được phân công lớp chấm.
          </p>
        </div>
      )}

      {/* Read-only permission notice */}
      {!canGrade && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Chế độ xem Chấm điểm (Chỉ đọc)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Tài khoản hiện tại <strong>{currentUser.name}</strong> ({currentUser.title || currentUser.role}) không có quyền nhập điểm chấm nề nếp. Chức năng ghi nhận lỗi vi phạm và gửi phiếu chấm bị khóa trừ khi được Quản trị viên cấp quyền trong Bảng phân quyền.
          </p>
        </div>
      )}

      {/* Main Grading Entry Box: TẠO PHIẾU CHẤM MỚI */}
      <div className={`bg-white rounded-2xl border shadow-xs p-4 sm:p-5 space-y-4 ${!hasAssignmentThisWeek ? 'opacity-60 border-slate-200' : 'border-blue-200 ring-1 ring-blue-100'}`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Tạo phiếu chấm mới — {selectedDay} (Tuần {activeWeek.weekNumber})
              </h3>
            </div>
            
            {/* Lớp được phân công chấm */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 mt-1.5">
              <span>Lớp được chấm:</span>
              {hasAssignmentThisWeek ? (
                assignedClasses.length === 1 ? (
                  <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-amber-50 text-blue-950 px-3 py-1 rounded-xl border border-amber-300 shadow-xs font-black text-xs">
                      <span>Lớp {assignedClasses[0].name}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        (Khối {assignedClasses[0].grade} · {Number(assignedClasses[0].grade) <= 5 ? 'Tiểu học' : 'THCS'})
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Được phân công tuần này
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <select
                      value={targetClass}
                      onChange={(e) => setTargetClass(e.target.value)}
                      disabled={!canGrade || !hasAssignmentThisWeek}
                      className="font-bold text-blue-900 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      {assignedClasses.map((c) => (
                        <option key={c.id} value={c.code}>
                          Lớp {c.name} - Khối {c.grade} ({Number(c.grade) <= 5 ? 'Tiểu học' : 'THCS'})
                        </option>
                      ))}
                    </select>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      Chỉ hiện các lớp được phân công
                    </span>
                  </div>
                )
              ) : (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Không có lớp nào được phân công cho tuần này
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Tổng điểm trừ:</span>
            <p className="text-xl font-black text-rose-600 tabular-nums">
              -{totalDeduction} <span className="text-xs font-normal text-slate-500">điểm</span>
            </p>
          </div>
        </div>

        {/* Ca trực & Buổi trực */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Buổi trực:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedShift('Sáng')}
                disabled={!canGrade || !hasAssignmentThisWeek}
                className={`px-3 py-1 rounded-md font-bold text-xs transition-colors ${
                  selectedShift === 'Sáng' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buổi Sáng
              </button>
              <button
                type="button"
                onClick={() => setSelectedShift('Chiều')}
                disabled={!canGrade || !hasAssignmentThisWeek}
                className={`px-3 py-1 rounded-md font-bold text-xs transition-colors ${
                  selectedShift === 'Chiều' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Buổi Chiều
              </button>
            </div>
          </div>

          <div className="text-slate-500 text-[11px] truncate">
            <span>Khu vực: </span>
            <strong className="text-slate-700">{currentDayAssignment?.area || activeRedFlag.dutyArea || 'Sân trường - Dãy lớp'}</strong>
          </div>
        </div>

        {/* Quy định thời tiết đặc biệt (Quy chế Đội) */}
        <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" />
              Điều kiện thời tiết (Quy chế nề nếp Liên đội):
            </span>
            <span className="text-[10px] text-blue-600 italic">Nhấn để bật/tắt miễn trừ</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setIsRainyDayShoes(!isRainyDayShoes)}
              disabled={!canGrade || !hasAssignmentThisWeek}
              className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isRainyDayShoes
                  ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🌧️</span>
                <div>
                  <p className="font-bold text-xs">Ngày mưa: Miễn chấm giày</p>
                  <p className={`text-[10px] ${isRainyDayShoes ? 'text-blue-100' : 'text-slate-400'}`}>
                    Không trừ điểm nếu đi dép
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isRainyDayShoes ? 'bg-amber-400 text-blue-950' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isRainyDayShoes ? 'Đang bật' : 'Tắt'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setIsRainyDayWatering(!isRainyDayWatering)}
              disabled={!canGrade || !hasAssignmentThisWeek}
              className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                isRainyDayWatering
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">🌱</span>
                <div>
                  <p className="font-bold text-xs">Ngày mưa: Miễn tưới bồn hoa</p>
                  <p className={`text-[10px] ${isRainyDayWatering ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Không trừ điểm công trình MN
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  isRainyDayWatering ? 'bg-amber-400 text-blue-950' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {isRainyDayWatering ? 'Đang bật' : 'Tắt'}
              </span>
            </button>
          </div>
        </div>

        {/* Live Scorecard Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-3.5 rounded-xl border border-slate-700 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              BẢNG TÍNH ĐIỂM TRỰC TIẾP — LỚP {targetClass} ({selectedDay})
            </span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                dailyFinalScore === 50
                  ? 'bg-emerald-400 text-emerald-950'
                  : dailyFinalScore >= 45
                  ? 'bg-blue-400 text-blue-950'
                  : dailyFinalScore >= 35
                  ? 'bg-amber-400 text-amber-950'
                  : 'bg-rose-400 text-rose-950'
              }`}
            >
              {dailyFinalScore === 50
                ? '🌟 Xuất sắc'
                : dailyFinalScore >= 45
                ? '🟢 Tốt'
                : dailyFinalScore >= 35
                ? '🟡 Khá'
                : '🔴 Cần cố gắng'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/10 rounded-lg p-2 border border-white/10">
              <p className="text-[10px] text-blue-200">Điểm chuẩn ngày</p>
              <p className="text-base font-black text-white tabular-nums">50 đ</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 border border-white/10">
              <p className="text-[10px] text-rose-300">Điểm trừ ({stagedViolations.length} lỗi)</p>
              <p className="text-base font-black text-rose-400 tabular-nums">-{totalDeduction} đ</p>
            </div>
            <div className="bg-amber-400/20 rounded-lg p-2 border border-amber-400/40">
              <p className="text-[10px] text-amber-200">Điểm thực tế</p>
              <p className="text-base font-black text-amber-300 tabular-nums">{dailyFinalScore} / 50 đ</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher for Scoring Mode */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setGradingTab('official_sheet')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              gradingTab === 'official_sheet'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>10 Tiêu chí chấm chuẩn Liên đội</span>
          </button>
          <button
            type="button"
            onClick={() => setGradingTab('violations_list')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              gradingTab === 'violations_list'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Lỗi vi phạm đã ghi ({stagedViolations.length})</span>
          </button>
        </div>

        {/* TAB 1: 10 Tiêu chí chấm chuẩn Liên đội */}
        {gradingTab === 'official_sheet' && (
          <div className="space-y-3.5 pt-1">
            {/* BƯỚC 1: KHU VỰC CHỌN TÊN HỌC SINH VI PHẠM TRƯỚC KHI CHỌN LỖI */}
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50/70 rounded-2xl border-2 border-blue-300 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-black text-xs text-blue-950">
                  <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>BƯỚC 1: CHỌN TÊN HỌC SINH TRƯỚC KHI CHỌN LỖI</span>
                </div>
                <span className="text-[10px] text-blue-800 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  Lớp {targetClass} ({classStudents.length} hs)
                </span>
              </div>

              {activeGradingStudent ? (
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-blue-400 text-xs shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span className="text-slate-600 text-[11px] shrink-0">Đang chọn:</span>
                    <strong className="text-blue-950 font-black text-xs sm:text-sm truncate">
                      {activeGradingStudent}
                    </strong>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded shrink-0">
                      ✓ Đã sẵn sàng ghi lỗi
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveGradingStudent('')}
                    className="text-[11px] text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded-lg hover:bg-rose-50 border border-rose-200 cursor-pointer shrink-0 ml-2"
                  >
                    Đổi học sinh
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    <select
                      value={activeGradingStudent}
                      onChange={(e) => setActiveGradingStudent(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-blue-300 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Bấm vào đây chọn tên học sinh Lớp {targetClass} trước --</option>
                      <option value={`Tập thể Lớp ${targetClass}`}>👥 Tập thể Lớp {targetClass} / Chưa rõ từng cá nhân</option>
                      {classStudents.map((s) => (
                        <option key={s.id} value={s.fullName}>
                          {s.code} - {s.fullName} ({s.roleInClass} - {s.gender})
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setActiveGradingStudent(`Tập thể Lớp ${targetClass}`)}
                      className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded-xl text-[11px] font-bold shrink-0 cursor-pointer"
                    >
                      👥 Cả lớp
                    </button>
                  </div>

                  {/* Quick student chips for 1-click select */}
                  {classStudents.length > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold mb-1">
                        Bấm nhanh tên học sinh vi phạm:
                      </p>
                      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                        {classStudents.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setActiveGradingStudent(s.fullName)}
                            className="px-2 py-0.5 bg-white hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                          >
                            + {s.fullName} {s.roleInClass !== 'Đội viên' && s.roleInClass !== 'Học sinh' ? `(${s.roleInClass})` : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-blue-800 italic">
                    👉 Bấm chọn tên học sinh ở trên trước, sau đó bấm chọn các nút vi phạm (+ Khăn quàng, + Vệ sinh...) ở bảng tiêu chí bên dưới để tự động ghi nhận.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-700 font-bold text-xs flex items-center gap-1.5">
                <span>BƯỚC 2: CHỌN LỖI HOẶC SỬA TRỰC TIẾP ĐIỂM TRÊN Ô</span>
              </span>
              <button
                type="button"
                onClick={() => handleOpenAddViolation(undefined, activeGradingStudent)}
                disabled={!canGrade || !hasAssignmentThisWeek}
                className="text-blue-700 hover:text-blue-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm lỗi tùy chỉnh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {OFFICIAL_GRADING_CRITERIA.map((crit) => {
                const results = currentScoreSheetData.criteriaResults[crit.id] || { deducted: 0, details: [] };
                const isDeducted = results.deducted > 0;
                const remaining = Math.max(0, crit.maxPoints - results.deducted);

                return (
                  <div
                    key={crit.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isDeducted
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center">
                            {crit.order}
                          </span>
                          <span className="font-bold text-xs text-slate-900">{crit.name}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">
                            (Chuẩn {crit.maxPoints}đ)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {crit.description}
                        </p>
                      </div>

                      {/* Direct Cell Editing: Both Trừ and Còn */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs">
                          <span className="text-[10px] text-rose-600 font-bold">Trừ:</span>
                          <span className="font-bold text-rose-600 text-xs">-</span>
                          <input
                            type="number"
                            min="0"
                            max={crit.maxPoints}
                            step="0.5"
                            value={results.deducted}
                            onChange={(e) =>
                              handleDirectEditCriterionPoints(crit, parseFloat(e.target.value) || 0)
                            }
                            disabled={!canGrade || !hasAssignmentThisWeek}
                            className="w-12 text-center font-black text-rose-700 bg-rose-50/60 border border-rose-300 rounded text-xs py-0.5 focus:ring-2 focus:ring-rose-500"
                            title="Sửa trực tiếp điểm trừ của tiêu chí này trên ô"
                          />
                          <span className="text-[10px] text-slate-500">đ</span>
                        </div>

                        <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                          <span className="text-[10px] text-emerald-700 font-bold">Còn:</span>
                          <input
                            type="number"
                            min="0"
                            max={crit.maxPoints}
                            step="0.5"
                            value={remaining}
                            onChange={(e) => {
                              const remainingVal = parseFloat(e.target.value) || 0;
                              handleDirectEditCriterionPoints(crit, Math.max(0, crit.maxPoints - remainingVal));
                            }}
                            disabled={!canGrade || !hasAssignmentThisWeek}
                            className="w-12 text-center font-black text-emerald-800 bg-emerald-50/60 border border-emerald-300 rounded text-xs py-0.5 focus:ring-2 focus:ring-emerald-500"
                            title="Sửa trực tiếp điểm còn lại (điểm đạt) của tiêu chí này trên ô"
                          />
                          <span className="text-[10px] text-slate-500">đ</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Add Buttons for this criterion */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {crit.items.map((item) => {
                        const existing = stagedViolations.find((v) => v.catalogId === item.code || v.name === item.label);
                        return (
                          <button
                            key={item.code}
                            type="button"
                            onClick={() => handleQuickAddOfficialInfraction(crit, item)}
                            disabled={!canGrade || !hasAssignmentThisWeek}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              existing
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                            title={item.helper || item.label}
                          >
                            <span>+ {item.label}</span>
                            <span className={existing ? 'text-amber-200 font-black' : 'text-rose-600 font-black'}>
                              (-{item.pointsDeducted}đ)
                            </span>
                            {existing && existing.quantity > 1 && (
                              <span className="bg-white text-rose-700 px-1 rounded-full text-[9px] font-black">
                                x{existing.quantity}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* 10. Kỷ luật chung */}
              <div className="p-3 rounded-xl border bg-slate-50/80 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center">
                      10
                    </span>
                    <span className="font-bold text-xs text-slate-900">Kỷ luật & Nề nếp chung</span>
                    <span className="text-[10px] text-slate-500 font-semibold">(Chuẩn 8đ)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Chấp hành nội quy, đoàn kết nội bộ, không gây mất trật tự trường lớp
                  </p>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-rose-200 shadow-2xs">
                    <span className="text-[10px] text-rose-600 font-bold">Trừ:</span>
                    <span className="font-bold text-rose-600 text-xs">-</span>
                    <input
                      type="number"
                      min="0"
                      max="8"
                      step="0.5"
                      value={currentScoreSheetData.criteriaResults['crit-10']?.deducted || 0}
                      onChange={(e) =>
                        handleDirectEditCriterionPoints(
                          {
                            id: 'crit-10',
                            order: 10,
                            name: 'Kỷ luật & Nề nếp chung',
                            category: 'Nề nếp',
                            maxPoints: 8,
                            description: '',
                            items: [],
                          },
                          parseFloat(e.target.value) || 0
                        )
                      }
                      disabled={!canGrade || !hasAssignmentThisWeek}
                      className="w-12 text-center font-black text-rose-700 bg-rose-50/60 border border-rose-300 rounded text-xs py-0.5 focus:ring-2 focus:ring-rose-500"
                      title="Sửa trực tiếp điểm trừ nề nếp chung"
                    />
                    <span className="text-[10px] text-slate-500">đ</span>
                  </div>

                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] text-emerald-700 font-bold">Còn:</span>
                    <input
                      type="number"
                      min="0"
                      max="8"
                      step="0.5"
                      value={Math.max(0, 8 - (currentScoreSheetData.criteriaResults['crit-10']?.deducted || 0))}
                      onChange={(e) => {
                        const remVal = parseFloat(e.target.value) || 0;
                        handleDirectEditCriterionPoints(
                          {
                            id: 'crit-10',
                            order: 10,
                            name: 'Kỷ luật & Nề nếp chung',
                            category: 'Nề nếp',
                            maxPoints: 8,
                            description: '',
                            items: [],
                          },
                          Math.max(0, 8 - remVal)
                        );
                      }}
                      disabled={!canGrade || !hasAssignmentThisWeek}
                      className="w-12 text-center font-black text-emerald-800 bg-emerald-50/60 border border-emerald-300 rounded text-xs py-0.5 focus:ring-2 focus:ring-emerald-500"
                      title="Sửa trực tiếp điểm còn lại nề nếp chung"
                    />
                    <span className="text-[10px] text-slate-500">đ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Danh sách lỗi vi phạm đã ghi */}
        {gradingTab === 'violations_list' && (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => handleOpenAddViolation()}
              disabled={!canGrade || !hasAssignmentThisWeek}
              className={`w-full py-3 px-4 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-98 transition-all ${
                canGrade && hasAssignmentThisWeek
                  ? 'bg-blue-700 hover:bg-blue-800 text-white cursor-pointer'
                  : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ THÊM LỖI VI PHẠM TỪ DANH MỤC CHO LỚP {targetClass}</span>
            </button>

            {/* Staged violations list */}
            <div className="space-y-2 pt-1">
              {stagedViolations.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                  <p className="font-semibold text-slate-700">Chưa ghi nhận lỗi vi phạm nào</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Lớp đang giữ trọn 50/50 điểm chuẩn định mức hôm nay!
                  </p>
                </div>
              ) : (
                stagedViolations.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800 truncate">{item.name}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 mt-1">
                        <span>
                          Số lượng: <strong className="text-slate-900">{item.quantity}</strong>
                        </span>
                        <span>·</span>
                        <div className="inline-flex items-center gap-1">
                          <span className="text-slate-600">Sửa điểm trừ:</span>
                          <span className="font-bold text-rose-600">-</span>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={Math.abs(item.totalPoints)}
                            onChange={(e) =>
                              handleDirectEditStagedPoints(idx, parseFloat(e.target.value) || 0)
                            }
                            className="w-14 py-0.5 text-center font-black text-rose-700 bg-white border border-rose-300 rounded text-xs"
                            title="Sửa trực tiếp điểm trừ của lỗi này"
                          />
                          <span className="text-slate-600">điểm</span>
                        </div>
                      </div>

                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500 font-semibold shrink-0">Học sinh:</span>
                        <input
                          type="text"
                          value={item.studentNames || ''}
                          onChange={(e) => handleDirectEditStagedStudentNames(idx, e.target.value)}
                          placeholder="Ghi họ tên học sinh vi phạm..."
                          className="flex-1 px-2 py-0.5 border border-slate-300 rounded text-xs bg-white text-slate-800 font-medium"
                        />
                      </div>

                      {item.note && (
                        <p className="text-[11px] text-slate-500 mt-0.5 italic">Ghi chú: {item.note}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveStaged(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 cursor-pointer"
                      title="Xóa lỗi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* General note input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nhận xét & Ghi chú chung buổi trực (in trên phiếu chấm):
          </label>
          <textarea
            rows={2}
            value={generalNote}
            onChange={(e) => setGeneralNote(e.target.value)}
            placeholder="Ví dụ: Giờ truy bài lớp nghiêm túc, còn một vài bạn chạy nhảy cầu thang..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* ACTIONS: TẠO PHIẾU CHẤM CHO CỜ ĐỎ, TRƯỚC KHI GỬI ĐI */}
        <div className="space-y-2 pt-2">
          {/* Primary Action Button: Mở mẫu Phiếu chấm của Cờ đỏ trước khi gửi */}
          <button
            type="button"
            onClick={handleOpenPreviewScoreSheet}
            disabled={!canGrade || !hasAssignmentThisWeek}
            className={`w-full py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              canGrade && hasAssignmentThisWeek
                ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-sm active:scale-98'
                : 'bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
            }`}
            title="Thiết kế và xem mẫu phiếu chấm chính thức của Cờ đỏ trước khi gửi đi"
          >
            <FileText className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="tracking-wide">TẠO & XEM TRƯỚC PHIẾU CHẤM CỜ ĐỎ</span>
            <span className="bg-amber-400 text-blue-950 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0">
              Trước khi gửi
            </span>
          </button>

          <p className="text-[11px] text-center text-slate-500">
            Xem toàn bộ Phiếu chấm theo chuẩn Liên đội (bảng 10 tiêu chí, tên học sinh, điểm trừ, chữ ký) trước khi gửi Tổng phụ trách duyệt.
          </p>

          {/* Quick Submit Button */}
          <button
            type="button"
            onClick={handleOpenPreviewScoreSheet}
            disabled={!canGrade || !hasAssignmentThisWeek}
            className={`w-full py-2.5 px-4 font-bold text-xs rounded-xl border flex items-center justify-center gap-2 transition-all ${
              canGrade && hasAssignmentThisWeek
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 cursor-pointer'
                : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>GỬI PHIẾU CHẤM LỚP {targetClass} CHO TỔNG PHỤ TRÁCH</span>
          </button>
        </div>
      </div>

      {/* History of submitted records */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
            CÁC PHIẾU ĐÃ NỘP GẦN ĐÂY CỦA CỜ ĐỎ
          </h3>
          <span className="text-xs text-blue-700 font-semibold">{recentRecords.length} phiếu</span>
        </div>

        <div className="space-y-2.5">
          {recentRecords.map((rec) => {
            const isApproved = rec.status === 'approved';
            const isRevision = rec.status === 'revision_requested';

            return (
              <div
                key={rec.id}
                className={`p-3 rounded-xl border text-xs transition-colors ${
                  isRevision
                    ? 'bg-rose-50/70 border-rose-200'
                    : isApproved
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">
                      {rec.dayOfWeek} · Lớp {rec.className}
                    </span>
                    <span className="text-[10px] text-slate-500">{rec.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isApproved ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã duyệt
                      </span>
                    ) : isRevision ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-white px-2 py-0.5 rounded-md border border-rose-200 text-[10px]">
                        <AlertTriangle className="w-3 h-3" />
                        Yêu cầu sửa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                        <Clock className="w-3 h-3" />
                        Chờ duyệt
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleViewPastScoreSheet(rec)}
                      className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 text-[11px] transition-colors cursor-pointer"
                      title="Xem mẫu phiếu chấm chi tiết"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Xem phiếu</span>
                    </button>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center justify-between text-slate-600">
                  <span>
                    Vi phạm: {rec.violations.length} lỗi · Trừ{' '}
                    <strong className="text-rose-600">{rec.totalDeduction} điểm</strong>
                  </span>
                  {rec.totalBonus > 0 && (
                    <span className="text-emerald-700 font-semibold">Thưởng: +{rec.totalBonus}đ</span>
                  )}
                </div>

                {isRevision && rec.revisionReason && (
                  <div className="mt-2 p-2 bg-white rounded-lg border border-rose-200 text-[11px] text-rose-800">
                    <strong>Ý kiến TPT:</strong> {rec.revisionReason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: CHI TIẾT LỖI VI PHẠM (Explicit user requirement) */}
      {showAddViolationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 my-auto animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">CHI TIẾT LỖI VI PHẠM</h3>
                <p className="text-[11px] text-slate-500">
                  Lớp được chấm: <strong>Lớp {targetClass}</strong> — Buổi {selectedDay}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddViolationModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BƯỚC 1: CHỌN HỌC SINH VI PHẠM (BẮT BUỘC ĐẶT TRƯỚC KHI CHỌN DANH MỤC LỖI) */}
            <div className="bg-blue-50/80 p-3 rounded-2xl border-2 border-blue-300 space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-blue-950 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>1. CHỌN HỌC SINH VI PHẠM (BẮT BUỘC CHỌN TRƯỚC):</span>
                </label>
                <span className="text-[10px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded-full border border-blue-200">
                  Lớp {targetClass} ({classStudents.length} học sinh)
                </span>
              </div>

              {/* Search box for finding student */}
              <div className="relative">
                <input
                  type="text"
                  value={modalStudentSearch}
                  onChange={(e) => setModalStudentSearch(e.target.value)}
                  placeholder="🔍 Gõ tìm nhanh tên học sinh (VD: Sính, Hoa, Mai...)"
                  className="w-full pl-3 pr-8 py-1.5 border border-blue-300 rounded-xl text-xs bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 font-medium"
                />
                {modalStudentSearch && (
                  <button
                    type="button"
                    onClick={() => setModalStudentSearch('')}
                    className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Dropdown danh sách học sinh lớp được chấm */}
              <div>
                <select
                  value={selectedStudentId}
                  onChange={(e) => handleSelectStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-300 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">-- Bấm vào đây để chọn học sinh Lớp {targetClass} --</option>
                  <option value="all">👥 Tập thể Lớp {targetClass} / Chưa rõ từng cá nhân</option>
                  {classStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.fullName} ({s.roleInClass} - {s.gender})
                    </option>
                  ))}
                  <option value="custom">✍️ Tùy chọn: Nhập tên học sinh ngoài danh sách</option>
                </select>
              </div>

              {/* Quick Select Student Chips */}
              {filteredModalStudents.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-600 mb-1">
                    Bấm nhanh tên học sinh vi phạm:
                  </p>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    {filteredModalStudents.map((s) => {
                      const isSelected = studentNames.includes(s.fullName);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => handleToggleStudentChip(s.fullName)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-700 text-white font-bold shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-100 hover:text-blue-900'
                          }`}
                        >
                          {s.fullName} {s.roleInClass !== 'Đội viên' && s.roleInClass !== 'Học sinh' ? `(${s.roleInClass})` : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Input for student names */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-0.5">
                  Họ tên học sinh ghi vào phiếu chấm:
                </label>
                <input
                  type="text"
                  value={studentNames}
                  onChange={(e) => setStudentNames(e.target.value)}
                  placeholder="Ví dụ: Phạm Hồng Quân, Lò Mí Sính..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              {studentNames.trim() && (
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-100/90 text-emerald-900 text-[11px] font-bold border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">✓ Đã chọn học sinh: {studentNames}</span>
                </div>
              )}
            </div>

            {/* BƯỚC 2: CHỌN DANH MỤC LỖI & HÀNH VI VI PHẠM (SAU KHI CHỌN HỌC SINH) */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Chọn nhóm lỗi vi phạm:</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    const cat = e.target.value as CriteriaCategory;
                    setSelectedCategory(cat);
                    const firstOfCat = violationsCatalog.find((v) => v.category === cat);
                    if (firstOfCat) {
                      setSelectedViolationItem(firstOfCat);
                      setCustomUnitPoints(Math.abs(firstOfCat.pointsDeducted));
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-slate-50"
                >
                  {Array.from(new Set(violationsCatalog.map((v) => v.category))).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Hành vi vi phạm cụ thể:
                </label>
                <select
                  value={selectedViolationItem?.id || ''}
                  onChange={(e) => {
                    const item = violationsCatalog.find((v) => v.id === e.target.value);
                    if (item) {
                      setSelectedViolationItem(item);
                      setCustomUnitPoints(Math.abs(item.pointsDeducted));
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 bg-slate-50"
                >
                  {categoryViolations.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} (Định mức: -{v.pointsDeducted}đ/lần)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BƯỚC 3: SỬA TRỰC TIẾP ĐIỂM TRỪ TRÊN Ô DỮ LIỆU & SỐ LƯỢNG */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-800 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Sửa trực tiếp số lượng & điểm trừ trên ô:</span>
                </span>
                <span className="text-[10px] text-amber-800 italic">Cho phép sửa điểm</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Số lượng:</label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-l-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-12 h-8 text-center border-y border-slate-300 bg-white font-bold text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-r-lg bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Sửa đơn giá trừ (đ/lần):
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-rose-600">-</span>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={customUnitPoints}
                      onChange={(e) => setCustomUnitPoints(parseFloat(e.target.value) || 0)}
                      className="w-16 h-8 text-center border border-rose-300 rounded-lg bg-white font-black text-xs text-rose-700 focus:ring-2 focus:ring-rose-500 shadow-2xs"
                      title="Sửa trực tiếp điểm trừ của lỗi này trên ô"
                    />
                    <span className="text-xs text-slate-600">điểm</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-amber-200/80 text-xs">
                <span className="font-medium text-slate-700">Tổng điểm trừ tính ra:</span>
                <span className="text-base font-black text-rose-600 tabular-nums">
                  -{quantity * customUnitPoints} điểm
                </span>
              </div>
            </div>

            {/* BƯỚC 4: GHI CHÚ THÊM */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ghi chú thêm:
              </label>
              <input
                type="text"
                value={modalNote}
                onChange={(e) => setModalNote(e.target.value)}
                placeholder="Ví dụ: Giờ ra chơi tiết 2, truy bài đầu giờ..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Modal Actions: Hủy - Lưu lỗi */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddViolationModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-medium hover:bg-slate-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmAddViolation}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Lưu lỗi vào phiếu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: XEM TRƯỚC VÀ THIẾT KẾ PHIẾU CHẤM CỦA CỜ ĐỎ (TRƯỚC KHI GỬI ĐI) */}
      <OfficialScoreSheetModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        data={currentScoreSheetData}
        onConfirmSend={(customData) => handleSubmitRecord(customData)}
        isViewOnly={false}
      />

      {/* MODAL 2: XEM CHI TIẾT PHIẾU CHẤM ĐÃ NỘP GẦN ĐÂY */}
      {viewingRecordData && (
        <OfficialScoreSheetModal
          isOpen={true}
          onClose={() => setViewingRecordData(null)}
          data={viewingRecordData}
          isViewOnly={true}
        />
      )}
    </div>
  );
};
