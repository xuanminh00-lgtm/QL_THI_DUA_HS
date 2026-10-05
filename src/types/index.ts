export type Role = 'admin' | 'bgh' | 'teacher' | 'red_flag' | 'student';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
  avatar?: string;
  className?: string; // If student or red flag
  phone?: string;
  title?: string;
}

export type GradeLevel = '6' | '7' | '8' | '9' | '1' | '2' | '3' | '4' | '5';

export interface StudentItem {
  id: string;
  code: string; // e.g. HS-9A-01
  fullName: string;
  classId: string;
  className: string;
  gender: 'Nam' | 'Nữ';
  dob: string; // YYYY-MM-DD
  roleInClass: string; // 'Lớp trưởng' | 'Lớp phó' | 'Đội viên' | 'Tổ trưởng' | 'Học sinh'
  phone?: string;
  status: 'active' | 'transferred' | 'suspended';
  violationCount: number;
}

export interface ClassItem {
  id: string;
  code: string;
  name: string;
  grade: GradeLevel;
  homeroomTeacher: string;
  studentCount: number;
  room: string;
  status: 'active' | 'inactive';
}

export interface RedFlagMember {
  id: string;
  code: string;
  name: string;
  classId: string;
  className: string;
  account: string;
  status: 'active' | 'locked';
  dutyArea: string;
  assignedCount?: number;
  phone?: string;
  role?: string; // 'Trưởng ban' | 'Phó ban' | 'Cờ đỏ viên'
}

export type WeekStatus = 'not_started' | 'in_progress' | 'pending_approval' | 'approved' | 'locked';

export interface WeekItem {
  id: string;
  weekNumber: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  schoolYear: string;
  status: WeekStatus;
  notes?: string;
}

export interface AssignmentItem {
  id: string;
  weekId: string;
  redFlagId: string;
  redFlagName: string;
  targetClassId: string;
  targetClassName: string;
  dayOfWeek: 'Thứ 2' | 'Thứ 3' | 'Thứ 4' | 'Thứ 5' | 'Thứ 6';
  area: string;
  shift: 'Sáng' | 'Chiều';
  content: string; // 'Nề nếp' | 'Vệ sinh' | 'Trang phục & Xếp hàng' | 'Toàn diện'
  status: 'pending' | 'completed';
}

export type CriteriaCategory = 
  | 'Trang phục'
  | 'Đi học'
  | 'Học tập'
  | 'Vệ sinh'
  | 'Nề nếp'
  | 'Thể dục'
  | 'Hoạt động Đội'
  | 'Khen thưởng & Điểm cộng'
  | 'Khác';

export interface CriterionItem {
  id: string;
  code: string;
  category: CriteriaCategory;
  name: string;
  defaultPoints: number; // negative for deductions, positive for bonuses
  type: 'deduction' | 'bonus';
  appliedGrades: string[]; // e.g. ['6', '7', '8', '9']
  maxTimesPerDay?: number;
  status: 'active' | 'inactive';
  description?: string;
}

export interface ViolationCatalogItem {
  id: string;
  code: string;
  category: CriteriaCategory;
  name: string;
  pointsDeducted: number; // positive number representing the penalty
  description?: string;
}

export interface GradingRecordItem {
  id: string;
  assignmentId?: string;
  weekId: string;
  weekNumber: number;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  redFlagId: string;
  redFlagName: string;
  classId: string;
  className: string;
  violations: {
    catalogId: string;
    category: CriteriaCategory;
    name: string;
    quantity: number;
    unitPoints: number; // e.g. -1, -2
    totalPoints: number; // e.g. -3
    studentNames?: string;
    note?: string;
  }[];
  bonuses: {
    name: string;
    points: number;
    reason: string;
  }[];
  totalDeduction: number;
  totalBonus: number;
  netScoreImpact: number; // totalBonus - totalDeduction
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  revisionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  generalNote?: string;
  createdAt: string;
}

export interface ClassWeeklySummary {
  classId: string;
  className: string;
  grade: GradeLevel;
  homeroomTeacher: string;
  baseScore: number; // 100
  totalDeductions: number;
  totalBonuses: number;
  finalScore: number;
  rank: number;
  rating: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Trung bình' | 'Cần cố gắng';
  violationCount: number;
  detailsByCategory: Record<CriteriaCategory, number>;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  linkModule?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  target: string;
  details: string;
  ip?: string;
}

export interface RolePermissionConfig {
  canGrade: boolean;              // Quyền chấm điểm nề nếp
  canApprove: boolean;            // Quyền duyệt kết quả
  canViewReports: boolean;        // Quyền xem thống kê - báo cáo
  canManageClasses: boolean;      // Quyền quản lý lớp và học sinh
  canManageRedFlags: boolean;     // Quyền quản lý đội cờ đỏ
  canEditSettings: boolean;       // Quyền cấu hình hệ thống
  canExportData: boolean;         // Quyền xuất Excel / Word / PDF
  canSignMinutes: boolean;        // Quyền ký duyệt biên bản trực tuần
  canRequestRevision: boolean;    // Quyền yêu cầu sửa phiếu chấm
}

export interface PermissionSettings {
  bgh: RolePermissionConfig;
  gvcn: RolePermissionConfig;
  red_flag: RolePermissionConfig;
}

export interface SchoolSettings {
  schoolName: string;
  schoolType: string; // PTDTBT TH&THCS
  district: string;   // Quản Bạ - Hà Giang
  systemName: string;
  schoolYear: string;
  currentWeekNumber: number;
  youthUnionLeader: string; // Tổng phụ trách
  principal: string;       // Hiệu trưởng
  baseScore: number;       // 100
  allowEditAfterSubmission: boolean;
  autoLockTime: string;    // e.g. "Chủ nhật 17:00"
  tieBreakerRule: 'violation_count' | 'study_score' | 'draw';
  permissions: PermissionSettings;
}

export interface WeeklyMinutes {
  id: string;
  weekId: string;
  weekNumber: number;
  title: string;
  periodText: string;
  advantages: string;
  shortcomings: string;
  evaluation: string;
  recommendations: string;
  signerLeader: string;
  signerPrincipal: string;
  updatedAt: string;
}
