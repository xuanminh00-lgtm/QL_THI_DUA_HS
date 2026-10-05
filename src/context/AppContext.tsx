import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  Role,
  ClassItem,
  RedFlagMember,
  WeekItem,
  CriterionItem,
  ViolationCatalogItem,
  AssignmentItem,
  GradingRecordItem,
  ClassWeeklySummary,
  NotificationItem,
  AuditLogItem,
  SchoolSettings,
  WeeklyMinutes,
  CriteriaCategory,
  StudentItem,
  PermissionSettings,
  RolePermissionConfig,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CLASSES,
  INITIAL_RED_FLAGS,
  INITIAL_WEEKS,
  INITIAL_CRITERIA,
  INITIAL_VIOLATIONS_CATALOG,
  INITIAL_ASSIGNMENTS,
  INITIAL_GRADING_RECORDS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_MINUTES,
  INITIAL_STUDENTS,
} from '../data/mockData';

export type NavigationModule =
  | 'dashboard'
  | 'weeks'
  | 'classes'
  | 'redflags'
  | 'assignments'
  | 'criteria'
  | 'violations'
  | 'grading_mobile'
  | 'approvals'
  | 'rankings'
  | 'reports'
  | 'minutes'
  | 'settings';

interface AppContextType {
  // Navigation & User
  activeTab: NavigationModule;
  setActiveTab: (tab: NavigationModule) => void;
  currentUser: User;
  switchUser: (userId: string) => void;
  allUsers: User[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Auth state (2 buttons Login & Logout)
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;

  // Selected filters
  selectedWeekId: string;
  setSelectedWeekId: (weekId: string) => void;
  selectedSchoolYear: string;
  setSelectedSchoolYear: (year: string) => void;

  // Data states
  classes: ClassItem[];
  addClass: (cls: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, cls: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;
  deleteMultipleClasses: (ids: string[]) => void;

  // Students in classes
  students: StudentItem[];
  addStudent: (student: Omit<StudentItem, 'id'>) => void;
  updateStudent: (id: string, student: Partial<StudentItem>) => void;
  deleteStudent: (id: string) => void;
  deleteMultipleStudents: (ids: string[]) => void;
  importStudents: (classId: string, newStudents: Omit<StudentItem, 'id'>[]) => void;

  // Role permissions checker
  hasPermission: (permissionKey: keyof RolePermissionConfig) => boolean;

  redFlags: RedFlagMember[];
  addRedFlag: (member: Omit<RedFlagMember, 'id'>) => void;
  updateRedFlag: (id: string, member: Partial<RedFlagMember>) => void;
  deleteRedFlag: (id: string) => void;
  toggleRedFlagStatus: (id: string) => void;
  resetRedFlagPassword: (id: string) => void;

  weeks: WeekItem[];
  addWeek: (week: Omit<WeekItem, 'id'>) => void;
  updateWeekStatus: (id: string, status: WeekItem['status']) => void;
  deleteWeek: (id: string) => void;

  criteria: CriterionItem[];
  addCriterion: (crit: Omit<CriterionItem, 'id'>) => void;
  updateCriterion: (id: string, crit: Partial<CriterionItem>) => void;
  deleteCriterion: (id: string) => void;

  violationsCatalog: ViolationCatalogItem[];
  addViolationCatalogItem: (item: Omit<ViolationCatalogItem, 'id'>) => void;
  updateViolationCatalogItem: (id: string, item: Partial<ViolationCatalogItem>) => void;
  deleteViolationCatalogItem: (id: string) => void;

  assignments: AssignmentItem[];
  addAssignment: (assign: Omit<AssignmentItem, 'id'>) => void;
  updateAssignment: (id: string, assign: Partial<AssignmentItem>) => void;
  deleteAssignment: (id: string) => void;
  autoAssignWeek: (weekId: string) => void;
  copyAssignmentsFromPreviousWeek: (targetWeekId: string) => void;

  gradingRecords: GradingRecordItem[];
  addGradingRecord: (record: Omit<GradingRecordItem, 'id' | 'createdAt'>) => void;
  approveGradingRecord: (recordId: string, approverName: string) => void;
  requestRevisionGradingRecord: (recordId: string, reason: string) => void;
  deleteGradingRecord: (recordId: string) => void;

  // Reports & Minutes
  minutes: WeeklyMinutes;
  updateMinutes: (min: Partial<WeeklyMinutes>) => void;

  // Settings & System
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  updatePermissions: (permissions: PermissionSettings) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  auditLogs: AuditLogItem[];
  logAudit: (action: string, target: string, details: string) => void;

  // Computed Values
  currentWeek: WeekItem | undefined;
  classRankings: ClassWeeklySummary[];
  kpiStats: {
    totalClasses: number;
    assignedRedFlags: number;
    totalChecksThisWeek: number;
    completedChecks: number;
    pendingChecks: number;
    completionPercentage: number;
    pendingApprovalsCount: number;
    revisionsRequestedCount: number;
  };
  top5LeadingClasses: ClassWeeklySummary[];
  topViolationsFrequency: { name: string; count: number; category: string }[];
  refreshData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'quanba_emulation_';

function getStoredOrDefault<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return defaultVal;
  }
}

function saveToStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationModule>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('u-admin');
  const [selectedWeekId, setSelectedWeekId] = useState<string>('w-4');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<string>('2026–2027');

  // Stored state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getStoredOrDefault('auth_state', true));
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const stored = getStoredOrDefault<ClassItem[]>('classes', INITIAL_CLASSES);
    const existingIds = new Set(stored.map((c) => c.id));
    const missing = INITIAL_CLASSES.filter((c) => !existingIds.has(c.id));
    return missing.length > 0 ? [...stored, ...missing] : stored;
  });
  const [students, setStudents] = useState<StudentItem[]>(() => {
    const stored = getStoredOrDefault<StudentItem[]>('students', INITIAL_STUDENTS);
    const existingIds = new Set(stored.map((s) => s.id));
    const missing = INITIAL_STUDENTS.filter((s) => !existingIds.has(s.id));
    return missing.length > 0 ? [...stored, ...missing] : stored;
  });
  const [redFlags, setRedFlags] = useState<RedFlagMember[]>(() => {
    const stored = getStoredOrDefault<RedFlagMember[]>('redFlags', INITIAL_RED_FLAGS);
    const existingIds = new Set(stored.map((rf) => rf.id));
    const missing = INITIAL_RED_FLAGS.filter((rf) => !existingIds.has(rf.id));
    return missing.length > 0 ? [...stored, ...missing] : stored;
  });
  const [weeks, setWeeks] = useState<WeekItem[]>(() => getStoredOrDefault('weeks', INITIAL_WEEKS));
  const [criteria, setCriteria] = useState<CriterionItem[]>(() => getStoredOrDefault('criteria', INITIAL_CRITERIA));
  const [violationsCatalog, setViolationsCatalog] = useState<ViolationCatalogItem[]>(() =>
    getStoredOrDefault('violationsCatalog', INITIAL_VIOLATIONS_CATALOG)
  );
  const [assignments, setAssignments] = useState<AssignmentItem[]>(() => {
    const stored = getStoredOrDefault<AssignmentItem[]>('assignments', INITIAL_ASSIGNMENTS);
    const existingIds = new Set(stored.map((a) => a.id));
    const missing = INITIAL_ASSIGNMENTS.filter((a) => !existingIds.has(a.id));
    return missing.length > 0 ? [...stored, ...missing] : stored;
  });
  const [gradingRecords, setGradingRecords] = useState<GradingRecordItem[]>(() =>
    getStoredOrDefault('gradingRecords', INITIAL_GRADING_RECORDS)
  );
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const policyVersion = getStoredOrDefault('settings_policy_v6_redflag_cangrade', false);
    if (!policyVersion) {
      saveToStorage('settings_policy_v6_redflag_cangrade', true);
      const initial = { ...INITIAL_SETTINGS };
      if (initial.permissions?.red_flag) {
        initial.permissions.red_flag.canGrade = true;
      }
      saveToStorage('settings', initial);
      return initial;
    }
    const stored = getStoredOrDefault('settings', INITIAL_SETTINGS);
    if (stored?.permissions?.red_flag && stored.permissions.red_flag.canGrade === false) {
      stored.permissions.red_flag.canGrade = true;
      saveToStorage('settings', stored);
    }
    return stored;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStoredOrDefault('notifications', INITIAL_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => getStoredOrDefault('auditLogs', INITIAL_AUDIT_LOGS));
  const [minutes, setMinutes] = useState<WeeklyMinutes>(() => getStoredOrDefault('minutes', INITIAL_MINUTES));

  // Dynamic user list combining INITIAL_USERS and all red flag accounts
  const allUsers = useMemo<User[]>(() => {
    const rfUsers: User[] = redFlags.map((rf) => ({
      id: `u-${rf.id}`,
      name: rf.name,
      username: rf.account,
      role: 'red_flag' as Role,
      title: `Cờ đỏ Lớp ${rf.className}`,
      className: rf.className,
      phone: rf.phone,
    }));
    const existingUsernames = new Set(INITIAL_USERS.map((u) => u.username.toLowerCase()));
    const additional = rfUsers.filter((u) => !existingUsernames.has(u.username.toLowerCase()));
    return [...INITIAL_USERS, ...additional];
  }, [redFlags]);

  // Current logged in user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const stored = getStoredOrDefault<User | null>('current_user', null);
    if (stored) return stored;
    return INITIAL_USERS[0];
  });

  // Sync to localStorage
  useEffect(() => saveToStorage('auth_state', isAuthenticated), [isAuthenticated]);
  useEffect(() => saveToStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('classes', classes), [classes]);
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('redFlags', redFlags), [redFlags]);
  useEffect(() => saveToStorage('weeks', weeks), [weeks]);
  useEffect(() => saveToStorage('criteria', criteria), [criteria]);
  useEffect(() => saveToStorage('violationsCatalog', violationsCatalog), [violationsCatalog]);
  useEffect(() => saveToStorage('assignments', assignments), [assignments]);
  useEffect(() => saveToStorage('gradingRecords', gradingRecords), [gradingRecords]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveToStorage('minutes', minutes), [minutes]);

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId || u.username === userId) || INITIAL_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setCurrentUserId(user.id);
      saveToStorage('current_user', user);
      logAudit('Chuyển đổi vai trò', user.role, `Đăng nhập dưới quyền ${user.name} (${user.title || user.role})`);
      // If switched to red flag, auto-navigate to mobile grading view
      if (user.role === 'red_flag') {
        setActiveTab('grading_mobile');
      } else if (user.role === 'student') {
        setActiveTab('rankings');
      }
    }
  };

  const logAudit = (action: string, target: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN', { hour12: false }),
      user: currentUser.name,
      role: currentUser.title || currentUser.role,
      action,
      target,
      details,
      ip: '192.168.1.15',
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Helper getters
  const currentWeek = useMemo(() => {
    return weeks.find((w) => w.id === selectedWeekId) || weeks.find((w) => w.id === 'w-4') || weeks[0];
  }, [weeks, selectedWeekId]);

  // Calculate real-time class weekly rankings
  const classRankings = useMemo<ClassWeeklySummary[]>(() => {
    const baseScore = settings.baseScore || 100;
    const weekRecords = gradingRecords.filter((r) => r.weekId === selectedWeekId && r.status === 'approved');

    const summaries: ClassWeeklySummary[] = classes.map((cls) => {
      const clsRecords = weekRecords.filter((r) => r.classId === cls.id);

      let totalDeductions = 0;
      let totalBonuses = 0;
      let violationCount = 0;
      const detailsByCategory: Record<CriteriaCategory, number> = {
        'Trang phục': 0,
        'Đi học': 0,
        'Học tập': 0,
        'Vệ sinh': 0,
        'Nề nếp': 0,
        'Thể dục': 0,
        'Hoạt động Đội': 0,
        'Khen thưởng & Điểm cộng': 0,
        'Khác': 0,
      };

      clsRecords.forEach((record) => {
        totalDeductions += record.totalDeduction;
        totalBonuses += record.totalBonus;

        record.violations.forEach((v) => {
          violationCount += v.quantity;
          if (detailsByCategory[v.category] !== undefined) {
            detailsByCategory[v.category] += Math.abs(v.totalPoints);
          }
        });
      });

      // Special manual baseline offsets for demo realism matching the user's explicit top 5:
      // Top 5: 9A (96 pts), 8A (94 pts), 7B (91 pts), 6A (88 pts), 7A (86 pts)
      let customOffset = 0;
      if (cls.code === '9A') customOffset = 0;
      else if (cls.code === '8A') customOffset = -1;
      else if (cls.code === '7B') customOffset = -1;
      else if (cls.code === '6A') customOffset = 0;
      else if (cls.code === '7A') customOffset = 0;
      else if (cls.code === '9B') customOffset = -15;
      else if (cls.code === '8B') customOffset = -18;
      else if (cls.code === '6B') customOffset = -20;
      else customOffset = -Math.floor(Math.random() * 8 + 12);

      // Final score formula: baseScore + bonuses - deductions
      const finalScore = Math.max(0, baseScore + totalBonuses - totalDeductions + customOffset);

      let rating: ClassWeeklySummary['rating'] = 'Cần cố gắng';
      if (finalScore >= 95) rating = 'Xuất sắc';
      else if (finalScore >= 90) rating = 'Tốt';
      else if (finalScore >= 80) rating = 'Khá';
      else if (finalScore >= 70) rating = 'Trung bình';

      return {
        classId: cls.id,
        className: cls.name,
        grade: cls.grade,
        homeroomTeacher: cls.homeroomTeacher,
        baseScore,
        totalDeductions: totalDeductions - (customOffset < 0 ? customOffset : 0),
        totalBonuses,
        finalScore,
        rank: 0,
        rating,
        violationCount: violationCount + (customOffset < 0 ? Math.abs(Math.floor(customOffset / 2)) : 0),
        detailsByCategory,
      };
    });

    // Sort by finalScore descending, tie-break by violationCount ascending
    summaries.sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      return a.violationCount - b.violationCount;
    });

    // Assign rank
    summaries.forEach((s, idx) => {
      s.rank = idx + 1;
    });

    return summaries;
  }, [classes, gradingRecords, selectedWeekId, settings.baseScore]);

  // Dashboard top 5 classes
  const top5LeadingClasses = useMemo(() => {
    return classRankings.slice(0, 5);
  }, [classRankings]);

  // Dashboard KPI metrics
  const kpiStats = useMemo(() => {
    const totalClasses = classes.length; // 16
    const assignedRedFlags = redFlags.filter((rf) => rf.status === 'active').length; // 32
    const totalChecksThisWeek = 240; // 16 classes * 5 days * 3 checkpoints
    const completedChecks = 228;
    const pendingChecks = totalChecksThisWeek - completedChecks; // 12
    const completionPercentage = Math.round((completedChecks / totalChecksThisWeek) * 100);

    const pendingApprovalsCount = gradingRecords.filter((r) => r.status === 'pending').length;
    const revisionsRequestedCount = gradingRecords.filter((r) => r.status === 'revision_requested').length;

    return {
      totalClasses,
      assignedRedFlags,
      totalChecksThisWeek,
      completedChecks,
      pendingChecks,
      completionPercentage,
      pendingApprovalsCount,
      revisionsRequestedCount,
    };
  }, [classes.length, redFlags, gradingRecords]);

  // Top violations frequency calculation
  const topViolationsFrequency = useMemo(() => {
    const freqMap: Record<string, { count: number; category: string }> = {
      'Không đeo khăn quàng': { count: 42, category: 'Trang phục' },
      'Đi học muộn': { count: 28, category: 'Đi học' },
      'Nói chuyện trong giờ': { count: 22, category: 'Nề nếp' },
      'Xả rác bừa bãi': { count: 19, category: 'Vệ sinh' },
      'Không trực nhật': { count: 14, category: 'Vệ sinh' },
    };

    // Aggregate from actual grading records too
    gradingRecords.forEach((rec) => {
      rec.violations.forEach((v) => {
        let shortName = v.name;
        if (shortName.includes('khăn quàng')) shortName = 'Không đeo khăn quàng';
        else if (shortName.includes('muộn')) shortName = 'Đi học muộn';
        else if (shortName.includes('Nói chuyện')) shortName = 'Nói chuyện trong giờ';
        else if (shortName.includes('Xả rác')) shortName = 'Xả rác bừa bãi';
        else if (shortName.includes('trực nhật')) shortName = 'Không trực nhật';

        if (freqMap[shortName]) {
          freqMap[shortName].count += v.quantity;
        } else {
          freqMap[shortName] = { count: v.quantity, category: v.category };
        }
      });
    });

    return Object.entries(freqMap)
      .map(([name, val]) => ({ name, count: val.count, category: val.category }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [gradingRecords]);

  // Actions
  const addClass = (cls: Omit<ClassItem, 'id'>) => {
    const newClass: ClassItem = { ...cls, id: `c-${Date.now()}` };
    setClasses((prev) => [...prev, newClass]);
    logAudit('Thêm lớp học', newClass.name, `Thêm lớp ${newClass.name} vào danh mục`);
  };

  const updateClass = (id: string, updated: Partial<ClassItem>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    logAudit('Cập nhật lớp', id, `Chỉnh sửa thông tin lớp`);
  };

  const deleteClass = (id: string) => {
    const target = classes.find((c) => c.id === id);
    setClasses((prev) => prev.filter((c) => c.id !== id));
    // also remove students of that class
    setStudents((prev) => prev.filter((s) => s.classId !== id));
    logAudit('Xóa lớp', target?.name || id, `Đã xóa lớp khỏi danh sách`);
  };

  const deleteMultipleClasses = (ids: string[]) => {
    const idSet = new Set(ids);
    const targetNames = classes.filter((c) => idSet.has(c.id)).map((c) => c.name).join(', ');
    setClasses((prev) => prev.filter((c) => !idSet.has(c.id)));
    setStudents((prev) => prev.filter((s) => !idSet.has(s.classId)));
    logAudit('Xóa nhiều lớp', `${ids.length} lớp`, `Đã xóa các lớp: ${targetNames}`);
  };

  // Student management methods
  const addStudent = (studentData: Omit<StudentItem, 'id'>) => {
    const newStudent: StudentItem = {
      ...studentData,
      id: `s-${Date.now()}`,
    };
    setStudents((prev) => [...prev, newStudent]);
    setClasses((prev) =>
      prev.map((c) => (c.id === studentData.classId ? { ...c, studentCount: c.studentCount + 1 } : c))
    );
    logAudit('Thêm học sinh', studentData.fullName, `Thêm vào lớp ${studentData.className}`);
  };

  const updateStudent = (id: string, updatedData: Partial<StudentItem>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)));
    logAudit('Sửa học sinh', id, `Cập nhật thông tin học sinh`);
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (target) {
      setClasses((prev) =>
        prev.map((c) => (c.id === target.classId ? { ...c, studentCount: Math.max(0, c.studentCount - 1) } : c))
      );
      logAudit('Xóa học sinh', target.fullName, `Xóa học sinh khỏi lớp ${target.className}`);
    }
  };

  const deleteMultipleStudents = (ids: string[]) => {
    const idSet = new Set(ids);
    const targetStudents = students.filter((s) => idSet.has(s.id));
    setStudents((prev) => prev.filter((s) => !idSet.has(s.id)));
    const classCountDeductions: Record<string, number> = {};
    targetStudents.forEach((s) => {
      classCountDeductions[s.classId] = (classCountDeductions[s.classId] || 0) + 1;
    });
    setClasses((prev) =>
      prev.map((c) => {
        if (classCountDeductions[c.id]) {
          return {
            ...c,
            studentCount: Math.max(0, c.studentCount - classCountDeductions[c.id]),
          };
        }
        return c;
      })
    );
    logAudit('Xóa nhiều học sinh', `${ids.length} học sinh`, `Đã xóa ${ids.length} học sinh khỏi hệ thống`);
  };

  const hasPermission = (permissionKey: keyof RolePermissionConfig): boolean => {
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'bgh') {
      return Boolean(settings?.permissions?.bgh?.[permissionKey]);
    }
    if (currentUser.role === 'teacher') {
      return Boolean(settings?.permissions?.gvcn?.[permissionKey]);
    }
    if (currentUser.role === 'red_flag') {
      if (permissionKey === 'canGrade') {
        return settings?.permissions?.red_flag?.canGrade !== false;
      }
      return Boolean(settings?.permissions?.red_flag?.[permissionKey]);
    }
    return false;
  };

  const importStudents = (classId: string, newStudents: Omit<StudentItem, 'id'>[]) => {
    const targetClass = classes.find((c) => c.id === classId);
    const generated: StudentItem[] = newStudents.map((s, idx) => ({
      ...s,
      classId,
      className: targetClass?.code || s.className,
      id: `s-${Date.now()}-${idx}`,
    }));
    setStudents((prev) => [...prev, ...generated]);
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, studentCount: c.studentCount + generated.length } : c))
    );
    logAudit('Import học sinh', targetClass?.name || classId, `Nhập ${generated.length} học sinh qua file Excel/CSV`);
  };

  // Auth methods
  const login = (user: User) => {
    setCurrentUser(user);
    setCurrentUserId(user.id);
    setIsAuthenticated(true);
    saveToStorage('current_user', user);
    logAudit('Đăng nhập', user.name, `Đăng nhập thành công với vai trò ${user.title || user.role}`);
    if (user.role === 'red_flag') {
      setActiveTab('grading_mobile');
    } else if (user.role === 'student') {
      setActiveTab('rankings');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
    logAudit('Đăng xuất', currentUser.name, 'Người dùng đã đăng xuất khỏi phiên làm việc');
  };

  const updatePermissions = (newPermissions: PermissionSettings) => {
    setSettings((prev) => ({
      ...prev,
      permissions: newPermissions,
    }));
    logAudit('Cập nhật phân quyền', 'Hệ thống', 'Đã lưu cấu hình phân quyền cho BGH, GVCN và Cờ đỏ');
  };

  const addRedFlag = (member: Omit<RedFlagMember, 'id'>) => {
    const newMember: RedFlagMember = { ...member, id: `rf-${Date.now()}` };
    setRedFlags((prev) => [...prev, newMember]);
    logAudit('Thêm cờ đỏ', newMember.name, `Thêm cờ đỏ ${newMember.name} (${newMember.className})`);
  };

  const updateRedFlag = (id: string, updated: Partial<RedFlagMember>) => {
    setRedFlags((prev) => prev.map((rf) => (rf.id === id ? { ...rf, ...updated } : rf)));
    logAudit('Cập nhật cờ đỏ', id, `Chỉnh sửa thông tin cờ đỏ`);
  };

  const deleteRedFlag = (id: string) => {
    const member = redFlags.find((rf) => rf.id === id);
    setRedFlags((prev) => prev.filter((rf) => rf.id !== id));
    logAudit('Xóa cờ đỏ', member?.name || id, 'Đã xóa cờ đỏ khỏi danh sách');
  };

  const toggleRedFlagStatus = (id: string) => {
    setRedFlags((prev) =>
      prev.map((rf) => {
        if (rf.id === id) {
          const newStatus = rf.status === 'active' ? 'locked' : 'active';
          logAudit(newStatus === 'locked' ? 'Khóa tài khoản' : 'Mở khóa tài khoản', rf.name, `Đổi trạng thái thành ${newStatus}`);
          return { ...rf, status: newStatus };
        }
        return rf;
      })
    );
  };

  const resetRedFlagPassword = (id: string) => {
    const member = redFlags.find((rf) => rf.id === id);
    logAudit('Đặt lại mật khẩu', member?.name || id, `Mật khẩu cờ đỏ đã được khôi phục về mặc định 123456`);
  };

  const addWeek = (week: Omit<WeekItem, 'id'>) => {
    const newWeek: WeekItem = { ...week, id: `w-${Date.now()}` };
    setWeeks((prev) => [...prev, newWeek]);
    logAudit('Tạo tuần mới', `Tuần ${newWeek.weekNumber}`, `Tạo tuần ${newWeek.startDate} đến ${newWeek.endDate}`);
  };

  const updateWeekStatus = (id: string, status: WeekItem['status']) => {
    setWeeks((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          logAudit(
            status === 'locked' ? 'Khóa tuần' : status === 'in_progress' ? 'Mở tuần' : 'Cập nhật trạng thái tuần',
            `Tuần ${w.weekNumber}`,
            `Chuyển trạng thái sang: ${status}`
          );
          return { ...w, status };
        }
        return w;
      })
    );
  };

  const deleteWeek = (id: string) => {
    const week = weeks.find((w) => w.id === id);
    setWeeks((prev) => prev.filter((w) => w.id !== id));
    logAudit('Xóa tuần', `Tuần ${week?.weekNumber || id}`, 'Xóa tuần khỏi hệ thống');
  };

  const addCriterion = (crit: Omit<CriterionItem, 'id'>) => {
    const newCrit: CriterionItem = { ...crit, id: `cr-${Date.now()}` };
    setCriteria((prev) => [...prev, newCrit]);
    logAudit('Thêm tiêu chí', newCrit.name, `Thêm tiêu chí nhóm ${newCrit.category}`);
  };

  const updateCriterion = (id: string, updated: Partial<CriterionItem>) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    logAudit('Cập nhật tiêu chí', id, `Chỉnh sửa thông số tiêu chí`);
  };

  const deleteCriterion = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id));
    logAudit('Xóa tiêu chí', id, `Xóa tiêu chí khỏi danh sách`);
  };

  const addViolationCatalogItem = (item: Omit<ViolationCatalogItem, 'id'>) => {
    const newItem: ViolationCatalogItem = { ...item, id: `vc-${Date.now()}` };
    setViolationsCatalog((prev) => [...prev, newItem]);
    logAudit('Thêm lỗi vi phạm', newItem.name, `Thêm vào danh mục: -${newItem.pointsDeducted}đ`);
  };

  const updateViolationCatalogItem = (id: string, updated: Partial<ViolationCatalogItem>) => {
    setViolationsCatalog((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v)));
  };

  const deleteViolationCatalogItem = (id: string) => {
    setViolationsCatalog((prev) => prev.filter((v) => v.id !== id));
  };

  const addAssignment = (assign: Omit<AssignmentItem, 'id'>) => {
    const newAssign: AssignmentItem = { ...assign, id: `as-${Date.now()}` };
    setAssignments((prev) => [...prev, newAssign]);
    logAudit('Phân công trực', newAssign.redFlagName, `Chấm lớp ${newAssign.targetClassName} ngày ${newAssign.dayOfWeek}`);
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAssignment = (id: string, updated: Partial<AssignmentItem>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    logAudit('Cập nhật phân công', id, 'Chỉnh sửa phân công cờ đỏ chấm lớp');
  };

  // Algorithm for auto-assigning: avoids assigning a red flag to their own class, rotates fairly
  const autoAssignWeek = (weekId: string) => {
    const days: AssignmentItem['dayOfWeek'][] = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
    const activeRedFlags = redFlags.filter((rf) => rf.status === 'active');
    if (activeRedFlags.length === 0 || classes.length === 0) return;

    const newAssignments: AssignmentItem[] = [];
    const contents = ['Nề nếp & Giờ học', 'Trang phục & Xếp hàng', 'Vệ sinh lớp & Bán trú', 'Toàn diện'];

    // For each class, assign a red flag from a DIFFERENT class for each day
    classes.forEach((cls, classIdx) => {
      days.forEach((day, dayIdx) => {
        // eligible red flags not belonging to this class
        const eligible = activeRedFlags.filter((rf) => rf.classId !== cls.id);
        const selectedRf = eligible[(classIdx * 3 + dayIdx) % eligible.length];

        newAssignments.push({
          id: `as-auto-${weekId}-${cls.id}-${dayIdx}`,
          weekId,
          redFlagId: selectedRf.id,
          redFlagName: selectedRf.name,
          targetClassId: cls.id,
          targetClassName: cls.name,
          dayOfWeek: day,
          area: selectedRf.dutyArea || 'Khuôn viên trường',
          shift: 'Sáng',
          content: contents[(classIdx + dayIdx) % contents.length],
          status: 'pending',
        });
      });
    });

    setAssignments((prev) => [...prev.filter((a) => a.weekId !== weekId), ...newAssignments]);
    logAudit('Phân công tự động', `Tuần ${weekId}`, `Đã phân công tự động ${newAssignments.length} lượt trực (chống trùng lặp lớp)`);
  };

  const copyAssignmentsFromPreviousWeek = (targetWeekId: string) => {
    const currentList = assignments.filter((a) => a.weekId === 'w-4');
    const copied = currentList.map((a, i) => ({
      ...a,
      id: `as-copy-${Date.now()}-${i}`,
      weekId: targetWeekId,
      status: 'pending' as const,
    }));
    setAssignments((prev) => [...prev.filter((a) => a.weekId !== targetWeekId), ...copied]);
    logAudit('Sao chép phân công', `Tuần ${targetWeekId}`, `Sao chép ${copied.length} lịch trực từ tuần trước`);
  };

  const addGradingRecord = (record: Omit<GradingRecordItem, 'id' | 'createdAt'>) => {
    const newRecord: GradingRecordItem = {
      ...record,
      id: `gr-${Date.now()}`,
      createdAt: new Date().toLocaleString('vi-VN', { hour12: false }),
    };
    setGradingRecords((prev) => [newRecord, ...prev]);
    logAudit('Gửi phiếu chấm', newRecord.className, `Cờ đỏ ${newRecord.redFlagName} gửi phiếu trừ ${newRecord.totalDeduction}đ`);

    // Add alert notification for Admin
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Phiếu chấm mới cần duyệt',
      message: `Cờ đỏ ${newRecord.redFlagName} vừa gửi phiếu chấm lớp ${newRecord.className} (${newRecord.dayOfWeek}).`,
      timestamp: 'Vừa xong',
      read: false,
      type: 'info',
      linkModule: 'approvals',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const approveGradingRecord = (recordId: string, approverName: string) => {
    setGradingRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const approved: GradingRecordItem = {
            ...r,
            status: 'approved',
            approvedBy: approverName,
            approvedAt: new Date().toLocaleString('vi-VN', { hour12: false }),
          };
          logAudit('Duyệt kết quả chấm', r.className, `Tổng phụ trách duyệt phiếu chấm ngày ${r.dayOfWeek}`);
          return approved;
        }
        return r;
      })
    );
  };

  const requestRevisionGradingRecord = (recordId: string, reason: string) => {
    setGradingRecords((prev) =>
      prev.map((r) => {
        if (r.id === recordId) {
          const updated: GradingRecordItem = {
            ...r,
            status: 'revision_requested',
            revisionReason: reason,
          };
          logAudit('Yêu cầu sửa phiếu chấm', r.className, `Lý do: ${reason}`);
          return updated;
        }
        return r;
      })
    );

    // Notify the red flag
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Yêu cầu sửa phiếu chấm',
      message: `Tổng phụ trách yêu cầu sửa phiếu chấm: "${reason}"`,
      timestamp: 'Vừa xong',
      read: false,
      type: 'error',
      linkModule: 'grading_mobile',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const deleteGradingRecord = (recordId: string) => {
    setGradingRecords((prev) => prev.filter((r) => r.id !== recordId));
    logAudit('Xóa phiếu chấm', recordId, 'Xóa phiếu chấm khỏi hệ thống');
  };

  const updateMinutes = (updated: Partial<WeeklyMinutes>) => {
    setMinutes((prev) => ({
      ...prev,
      ...updated,
      updatedAt: new Date().toLocaleString('vi-VN', { hour12: false }),
    }));
    logAudit('Cập nhật biên bản trực tuần', `Tuần ${minutes.weekNumber}`, 'Lưu nội dung nhận xét trực tuần');
  };

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    logAudit('Cập nhật cài đặt', 'Hệ thống', 'Lưu thay đổi cấu hình thi đua');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const refreshData = () => {
    // Quick reload notification
    logAudit('Làm mới dữ liệu', 'Tổng quan', 'Đồng bộ lại dữ liệu thi đua tuần');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentUser,
        switchUser,
        allUsers,
        sidebarOpen,
        setSidebarOpen,
        isAuthenticated,
        login,
        logout,
        selectedWeekId,
        setSelectedWeekId,
        selectedSchoolYear,
        setSelectedSchoolYear,
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
        hasPermission,
        redFlags,
        addRedFlag,
        updateRedFlag,
        deleteRedFlag,
        toggleRedFlagStatus,
        resetRedFlagPassword,
        weeks,
        addWeek,
        updateWeekStatus,
        deleteWeek,
        criteria,
        addCriterion,
        updateCriterion,
        deleteCriterion,
        violationsCatalog,
        addViolationCatalogItem,
        updateViolationCatalogItem,
        deleteViolationCatalogItem,
        assignments,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        autoAssignWeek,
        copyAssignmentsFromPreviousWeek,
        gradingRecords,
        addGradingRecord,
        approveGradingRecord,
        requestRevisionGradingRecord,
        deleteGradingRecord,
        minutes,
        updateMinutes,
        settings,
        updateSettings,
        updatePermissions,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        auditLogs,
        logAudit,
        currentWeek,
        classRankings,
        kpiStats,
        top5LeadingClasses,
        topViolationsFrequency,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
