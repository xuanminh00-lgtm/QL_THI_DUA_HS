import {
  ClassItem,
  RedFlagMember,
  WeekItem,
  CriterionItem,
  ViolationCatalogItem,
  AssignmentItem,
  GradingRecordItem,
  SchoolSettings,
  NotificationItem,
  AuditLogItem,
  WeeklyMinutes,
  User,
  StudentItem,
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Thầy Nguyễn Văn Thành',
    username: 'tongphutrach',
    role: 'admin',
    title: 'Tổng phụ trách Đội',
    phone: '0988.123.456',
  },
  {
    id: 'u-bgh',
    name: 'Thầy Lê Hải Đăng',
    username: 'hieutruong_bgh',
    role: 'bgh',
    title: 'Hiệu trưởng nhà trường',
    phone: '0912.888.999',
  },
  {
    id: 'u-teacher',
    name: 'Cô Hoàng Thị Lan',
    username: 'gvcn_9a',
    role: 'teacher',
    title: 'Giáo viên Chủ nhiệm 9A',
    className: '9A',
    phone: '0912.345.678',
  },
  {
    id: 'u-redflag',
    name: 'Nguyễn Văn An',
    username: 'codo_an',
    role: 'red_flag',
    title: 'Đội trưởng Cờ đỏ - Chi đội 8A',
    className: '8A',
  },
  {
    id: 'u-student',
    name: 'Lớp 7A (Đại diện Lớp trưởng)',
    username: 'lop_7a',
    role: 'student',
    title: 'Học sinh / Ban Cán sự Lớp 7A',
    className: '7A',
  },
];

export const INITIAL_CLASSES: ClassItem[] = [
  // Khối 9 (THCS)
  { id: 'c-9a', code: '9A', name: 'Lớp 9A', grade: '9', homeroomTeacher: 'Hoàng Thị Lan', studentCount: 38, room: 'Phòng 201', status: 'active' },
  { id: 'c-9b', code: '9B', name: 'Lớp 9B', grade: '9', homeroomTeacher: 'Vàng Mí Chờ', studentCount: 36, room: 'Phòng 202', status: 'active' },
  { id: 'c-9c', code: '9C', name: 'Lớp 9C', grade: '9', homeroomTeacher: 'Lò Thị Mai', studentCount: 35, room: 'Phòng 203', status: 'active' },
  { id: 'c-9d', code: '9D', name: 'Lớp 9D', grade: '9', homeroomTeacher: 'Trần Văn Hùng', studentCount: 37, room: 'Phòng 204', status: 'active' },
  // Khối 8 (THCS)
  { id: 'c-8a', code: '8A', name: 'Lớp 8A', grade: '8', homeroomTeacher: 'Nguyễn Thị Dung', studentCount: 40, room: 'Phòng 101', status: 'active' },
  { id: 'c-8b', code: '8B', name: 'Lớp 8B', grade: '8', homeroomTeacher: 'Giàng A Phống', studentCount: 39, room: 'Phòng 102', status: 'active' },
  { id: 'c-8c', code: '8C', name: 'Lớp 8C', grade: '8', homeroomTeacher: 'Hầu Mí Say', studentCount: 38, room: 'Phòng 103', status: 'active' },
  { id: 'c-8d', code: '8D', name: 'Lớp 8D', grade: '8', homeroomTeacher: 'Lê Thị Hà', studentCount: 37, room: 'Phòng 104', status: 'active' },
  // Khối 7 (THCS)
  { id: 'c-7a', code: '7A', name: 'Lớp 7A', grade: '7', homeroomTeacher: 'Sùng Thị Hoa', studentCount: 42, room: 'Phòng B101', status: 'active' },
  { id: 'c-7b', code: '7B', name: 'Lớp 7B', grade: '7', homeroomTeacher: 'Vũ Quốc Khánh', studentCount: 41, room: 'Phòng B102', status: 'active' },
  { id: 'c-7c', code: '7C', name: 'Lớp 7C', grade: '7', homeroomTeacher: 'Mai Thị Tuyết', studentCount: 40, room: 'Phòng B103', status: 'active' },
  { id: 'c-7d', code: '7D', name: 'Lớp 7D', grade: '7', homeroomTeacher: 'Trịnh Đình Nam', studentCount: 39, room: 'Phòng B104', status: 'active' },
  // Khối 6 (THCS)
  { id: 'c-6a', code: '6A', name: 'Lớp 6A', grade: '6', homeroomTeacher: 'Đỗ Thị Minh', studentCount: 43, room: 'Phòng C101', status: 'active' },
  { id: 'c-6b', code: '6B', name: 'Lớp 6B', grade: '6', homeroomTeacher: 'Lý A Sáng', studentCount: 42, room: 'Phòng C102', status: 'active' },
  { id: 'c-6c', code: '6C', name: 'Lớp 6C', grade: '6', homeroomTeacher: 'Phạm Hồng Nhung', studentCount: 41, room: 'Phòng C103', status: 'active' },
  { id: 'c-6d', code: '6D', name: 'Lớp 6D', grade: '6', homeroomTeacher: 'Hoàng Văn Thắng', studentCount: 40, room: 'Phòng C104', status: 'active' },
  // Khối 5 (Tiểu học)
  { id: 'c-5a', code: '5A', name: 'Lớp 5A', grade: '5', homeroomTeacher: 'Vàng Thị Dở', studentCount: 34, room: 'Dãy Tiểu học T201', status: 'active' },
  { id: 'c-5b', code: '5B', name: 'Lớp 5B', grade: '5', homeroomTeacher: 'Hầu Mí Say', studentCount: 33, room: 'Dãy Tiểu học T202', status: 'active' },
  { id: 'c-5c', code: '5C', name: 'Lớp 5C', grade: '5', homeroomTeacher: 'Thào Thị Mai', studentCount: 32, room: 'Dãy Tiểu học T203', status: 'active' },
  // Khối 4 (Tiểu học)
  { id: 'c-4a', code: '4A', name: 'Lớp 4A', grade: '4', homeroomTeacher: 'Nguyễn Thị Phương', studentCount: 35, room: 'Dãy Tiểu học T101', status: 'active' },
  { id: 'c-4b', code: '4B', name: 'Lớp 4B', grade: '4', homeroomTeacher: 'Giàng A Sùng', studentCount: 34, room: 'Dãy Tiểu học T102', status: 'active' },
  { id: 'c-4c', code: '4C', name: 'Lớp 4C', grade: '4', homeroomTeacher: 'Lò Thị Hoa', studentCount: 33, room: 'Dãy Tiểu học T103', status: 'active' },
  // Khối 3 (Tiểu học)
  { id: 'c-3a', code: '3A', name: 'Lớp 3A', grade: '3', homeroomTeacher: 'Bùi Thị Thanh', studentCount: 32, room: 'Dãy Tiểu học A101', status: 'active' },
  { id: 'c-3b', code: '3B', name: 'Lớp 3B', grade: '3', homeroomTeacher: 'Lục Văn Páo', studentCount: 31, room: 'Dãy Tiểu học A102', status: 'active' },
  { id: 'c-3c', code: '3C', name: 'Lớp 3C', grade: '3', homeroomTeacher: 'Mai Thị Linh', studentCount: 30, room: 'Dãy Tiểu học A103', status: 'active' },
  // Khối 2 (Tiểu học)
  { id: 'c-2a', code: '2A', name: 'Lớp 2A', grade: '2', homeroomTeacher: 'Hoàng Thị Huệ', studentCount: 33, room: 'Dãy Tiểu học B101', status: 'active' },
  { id: 'c-2b', code: '2B', name: 'Lớp 2B', grade: '2', homeroomTeacher: 'Đặng Văn Tuấn', studentCount: 32, room: 'Dãy Tiểu học B102', status: 'active' },
  { id: 'c-2c', code: '2C', name: 'Lớp 2C', grade: '2', homeroomTeacher: 'Lý Thị Lan', studentCount: 31, room: 'Dãy Tiểu học B103', status: 'active' },
  // Khối 1 (Tiểu học)
  { id: 'c-1a', code: '1A', name: 'Lớp 1A', grade: '1', homeroomTeacher: 'Trần Thị Nga', studentCount: 34, room: 'Dãy Tiểu học C101', status: 'active' },
  { id: 'c-1b', code: '1B', name: 'Lớp 1B', grade: '1', homeroomTeacher: 'Sùng Mí Lử', studentCount: 33, room: 'Dãy Tiểu học C102', status: 'active' },
  { id: 'c-1c', code: '1C', name: 'Lớp 1C', grade: '1', homeroomTeacher: 'Nông Thị Hằng', studentCount: 32, room: 'Dãy Tiểu học C103', status: 'active' },
];

export const INITIAL_RED_FLAGS: RedFlagMember[] = [
  { id: 'rf-1', code: 'CD01', name: 'Nguyễn Văn An', classId: 'c-8a', className: '8A', account: 'codo_an', status: 'active', dutyArea: 'Dãy nhà B - Khối 7', assignedCount: 5 },
  { id: 'rf-2', code: 'CD02', name: 'Lục Thị Mai', classId: 'c-8a', className: '8A', account: 'codo_mai', status: 'active', dutyArea: 'Sân cờ & Khu thể thao', assignedCount: 5 },
  { id: 'rf-3', code: 'CD03', name: 'Vàng Seo Lử', classId: 'c-8b', className: '8B', account: 'codo_lu', status: 'active', dutyArea: 'Dãy nhà A - Khối 9', assignedCount: 5 },
  { id: 'rf-4', code: 'CD04', name: 'Sùng Mí Pó', classId: 'c-8b', className: '8B', account: 'codo_po', status: 'active', dutyArea: 'Cổng trường & Nhà xe', assignedCount: 5 },
  { id: 'rf-5', code: 'CD05', name: 'Hầu Thị Dở', classId: 'c-9a', className: '9A', account: 'codo_do', status: 'active', dutyArea: 'Dãy nhà C - Khối 6', assignedCount: 5 },
  { id: 'rf-6', code: 'CD06', name: 'Trần Minh Đức', classId: 'c-9a', className: '9A', account: 'codo_duc', status: 'active', dutyArea: 'Khu vệ sinh & Vườn hoa', assignedCount: 5 },
  { id: 'rf-7', code: 'CD07', name: 'Lý Mí Sinh', classId: 'c-9b', className: '9B', account: 'codo_sinh', status: 'active', dutyArea: 'Dãy nhà A - Khối 8', assignedCount: 5 },
  { id: 'rf-8', code: 'CD08', name: 'Hoàng Thùy Linh', classId: 'c-9b', className: '9B', account: 'codo_linh', status: 'active', dutyArea: 'Khu bán trú & Nhà ăn', assignedCount: 5 },
  { id: 'rf-9', code: 'CD09', name: 'Thào A Dũng', classId: 'c-8c', className: '8C', account: 'codo_dung', status: 'active', dutyArea: 'Hành lang tầng 2', assignedCount: 5 },
  { id: 'rf-10', code: 'CD10', name: 'Vàng Thị Máy', classId: 'c-8c', className: '8C', account: 'codo_may', status: 'active', dutyArea: 'Cầu thang số 1', assignedCount: 4 },
  { id: 'rf-11', code: 'CD11', name: 'Lò Văn Kiên', classId: 'c-9c', className: '9C', account: 'codo_kien', status: 'active', dutyArea: 'Cầu thang số 2', assignedCount: 5 },
  { id: 'rf-12', code: 'CD12', name: 'Đặng Mai Phương', classId: 'c-9d', className: '9D', account: 'codo_phuong', status: 'active', dutyArea: 'Sân bóng đá mini', assignedCount: 5 },
  { id: 'rf-13', code: 'CD13', name: 'Phùng Tiến Đạt', classId: 'c-8d', className: '8D', account: 'codo_dat', status: 'active', dutyArea: 'Khu thư viện & Tin học', assignedCount: 5 },
  { id: 'rf-14', code: 'CD14', name: 'Lý Thị Chớ', classId: 'c-8d', className: '8D', account: 'codo_cho', status: 'active', dutyArea: 'Bờ rào khuôn viên', assignedCount: 5 },
  { id: 'rf-15', code: 'CD15', name: 'Hồ Văn Cường', classId: 'c-9d', className: '9D', account: 'codo_cuong', status: 'active', dutyArea: 'Khu bồn nước rửa tay', assignedCount: 4 },
  { id: 'rf-16', code: 'CD16', name: 'Bùi Thị Hà', classId: 'c-7a', className: '7A', account: 'codo_ha', status: 'active', dutyArea: 'Khu tập thể dục', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234016' },
  // Cờ đỏ khối Tiểu học (Sao đỏ măng non Khối 4 & Khối 5)
  { id: 'rf-17', code: 'CD17', name: 'Vàng Mí Pó', classId: 'c-5a', className: '5A', account: 'codo_5a_po', status: 'active', dutyArea: 'Dãy phòng Tiểu học 5A-5B', assignedCount: 5, role: 'Đội trưởng Sao đỏ TH', phone: '0981234017' },
  { id: 'rf-18', code: 'CD18', name: 'Thào Thị Dở', classId: 'c-5a', className: '5A', account: 'codo_5a_do', status: 'active', dutyArea: 'Khu vệ sinh Tiểu học', assignedCount: 4, role: 'Cờ đỏ viên', phone: '0981234018' },
  { id: 'rf-19', code: 'CD19', name: 'Hầu Văn Chứ', classId: 'c-5b', className: '5B', account: 'codo_5b_chu', status: 'active', dutyArea: 'Sân chơi Măng Non', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234019' },
  { id: 'rf-20', code: 'CD20', name: 'Sùng Thị Mỷ', classId: 'c-5b', className: '5B', account: 'codo_5b_my', status: 'active', dutyArea: 'Cầu thang Tiểu học Dãy 1', assignedCount: 4, role: 'Cờ đỏ viên', phone: '0981234020' },
  { id: 'rf-21', code: 'CD21', name: 'Tráng Seo Lử', classId: 'c-5c', className: '5C', account: 'codo_5c_lu', status: 'active', dutyArea: 'Hành lang lớp 1 và 2', assignedCount: 5, role: 'Đội phó Sao đỏ TH', phone: '0981234021' },
  { id: 'rf-22', code: 'CD22', name: 'Ly Thị Chớ', classId: 'c-5c', className: '5C', account: 'codo_5c_cho', status: 'active', dutyArea: 'Khu bồn rửa tay Tiểu học', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234022' },
  { id: 'rf-23', code: 'CD23', name: 'Ma Seo Pháng', classId: 'c-4a', className: '4A', account: 'codo_4a_phang', status: 'active', dutyArea: 'Sân tập thể dục Tiểu học', assignedCount: 4, role: 'Cờ đỏ viên', phone: '0981234023' },
  { id: 'rf-24', code: 'CD24', name: 'Lò Thị Hoa', classId: 'c-4a', className: '4A', account: 'codo_4a_hoa', status: 'active', dutyArea: 'Cổng trường đón học sinh TH', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234024' },
  { id: 'rf-25', code: 'CD25', name: 'Hoàng Văn Báo', classId: 'c-4b', className: '4B', account: 'codo_4b_bao', status: 'active', dutyArea: 'Hành lang khối 3', assignedCount: 4, role: 'Cờ đỏ viên', phone: '0981234025' },
  { id: 'rf-26', code: 'CD26', name: 'Nguyễn Thị Thùy', classId: 'c-4b', className: '4B', account: 'codo_4b_thuy', status: 'active', dutyArea: 'Khu thư viện Xanh', assignedCount: 4, role: 'Cờ đỏ viên', phone: '0981234026' },
  // Cờ đỏ khối THCS (Khối 6, 7, 8, 9)
  { id: 'rf-27', code: 'CD27', name: 'Giàng Mí Nô', classId: 'c-8b', className: '8B', account: 'codo_no', status: 'active', dutyArea: 'Khu vực phân ban 1', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234027' },
  { id: 'rf-28', code: 'CD28', name: 'Lò Văn Thanh', classId: 'c-9c', className: '9C', account: 'codo_thanh', status: 'active', dutyArea: 'Khu vực phân ban 2', assignedCount: 4, role: 'Cờ đỏ viên', phone: '0981234028' },
  { id: 'rf-29', code: 'CD29', name: 'Nguyễn Thị Oanh', classId: 'c-7b', className: '7B', account: 'codo_oanh', status: 'active', dutyArea: 'Khu vực phân ban 3', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234029' },
  { id: 'rf-30', code: 'CD30', name: 'Vàng A Lềnh', classId: 'c-6a', className: '6A', account: 'codo_lenh', status: 'active', dutyArea: 'Khu vực phân ban 4', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234030' },
  { id: 'rf-31', code: 'CD31', name: 'Tráng A Tủa', classId: 'c-6b', className: '6B', account: 'codo_tua', status: 'locked', dutyArea: 'Khu vực phân ban 5', assignedCount: 4, role: 'Cờ đỏ viên', phone: '0981234031' },
  { id: 'rf-32', code: 'CD32', name: 'Châu Thị Bé', classId: 'c-7c', className: '7C', account: 'codo_be', status: 'active', dutyArea: 'Khu vực phân ban 6', assignedCount: 5, role: 'Cờ đỏ viên', phone: '0981234032' },
];

export const INITIAL_WEEKS: WeekItem[] = [
  { id: 'w-1', weekNumber: 1, startDate: '2026-09-07', endDate: '2026-09-13', schoolYear: '2026-2027', status: 'locked', notes: 'Tuần lễ Khai giảng & Ổn định nền nếp' },
  { id: 'w-2', weekNumber: 2, startDate: '2026-09-14', endDate: '2026-09-20', schoolYear: '2026-2027', status: 'locked', notes: 'Thi đua Chào mừng năm học mới' },
  { id: 'w-3', weekNumber: 3, startDate: '2026-09-21', endDate: '2026-09-27', schoolYear: '2026-2027', status: 'approved', notes: 'Kiểm tra nề nếp bán trú' },
  { id: 'w-4', weekNumber: 4, startDate: '2026-09-28', endDate: '2026-10-04', schoolYear: '2026-2027', status: 'in_progress', notes: 'Tuần thi đua cao điểm tháng 9' },
  { id: 'w-5', weekNumber: 5, startDate: '2026-10-05', endDate: '2026-10-11', schoolYear: '2026-2027', status: 'not_started', notes: 'Kế hoạch phát động phong trào tháng 10' },
  { id: 'w-6', weekNumber: 6, startDate: '2026-10-12', endDate: '2026-10-18', schoolYear: '2026-2027', status: 'not_started' },
];

export const INITIAL_CRITERIA: CriterionItem[] = [
  // Trang phục
  { id: 'cr-1', code: 'TP01', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', defaultPoints: -1, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active', description: 'Trừ 1 điểm/học sinh/lần' },
  { id: 'cr-2', code: 'TP02', category: 'Trang phục', name: 'Không mặc đúng đồng phục quy định', defaultPoints: -2, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active', description: 'Trừ 2 điểm/học sinh' },
  { id: 'cr-3', code: 'TP03', category: 'Trang phục', name: 'Đi dép lê, không có quai hậu', defaultPoints: -1, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  // Đi học
  { id: 'cr-4', code: 'DH01', category: 'Đi học', name: 'Đi học muộn (sau trống báo)', defaultPoints: -2, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-5', code: 'DH02', category: 'Đi học', name: 'Vắng học không phép', defaultPoints: -5, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-6', code: 'DH03', category: 'Đi học', name: 'Bỏ tiết, trốn ra ngoài trường', defaultPoints: -10, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  // Vệ sinh
  { id: 'cr-7', code: 'VS01', category: 'Vệ sinh', name: 'Không trực nhật lớp đúng giờ', defaultPoints: -5, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-8', code: 'VS02', category: 'Vệ sinh', name: 'Xả rác bừa bãi trong lớp hoặc sân trường', defaultPoints: -2, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-9', code: 'VS03', category: 'Vệ sinh', name: 'Vệ sinh khu vực phân công chưa sạch', defaultPoints: -3, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  // Nề nếp
  { id: 'cr-10', code: 'NN01', category: 'Nề nếp', name: 'Nói chuyện, mất trật tự trong giờ học', defaultPoints: -2, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-11', code: 'NN02', category: 'Nề nếp', name: 'Nói tục, chửi thề, gây gổ đánh nhau', defaultPoints: -10, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-12', code: 'NN03', category: 'Nề nếp', name: 'Sử dụng điện thoại trái phép', defaultPoints: -5, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-13', code: 'NN04', category: 'Nề nếp', name: 'Không xếp hàng đầu giờ / thể dục giữa giờ', defaultPoints: -3, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  // Học tập
  { id: 'cr-14', code: 'HT01', category: 'Học tập', name: 'Giờ học xếp loại B hoặc C trong sổ đầu bài', defaultPoints: -3, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-15', code: 'HT02', category: 'Học tập', name: 'Không chuẩn bị bài / không mang sách vở', defaultPoints: -1, type: 'deduction', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  // Hoạt động & Khen thưởng
  { id: 'cr-16', code: 'KT01', category: 'Khen thưởng & Điểm cộng', name: 'Lớp đạt 100% tiết học Tốt trong tuần', defaultPoints: 5, type: 'bonus', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-17', code: 'KT02', category: 'Khen thưởng & Điểm cộng', name: 'Nhặt được của rơi trả lại người mất', defaultPoints: 3, type: 'bonus', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
  { id: 'cr-18', code: 'KT03', category: 'Khen thưởng & Điểm cộng', name: 'Tham gia xuất sắc phong trào văn nghệ/thể thao', defaultPoints: 5, type: 'bonus', appliedGrades: ['6', '7', '8', '9'], status: 'active' },
];

export const INITIAL_VIOLATIONS_CATALOG: ViolationCatalogItem[] = [
  // 1. Xếp hàng (2đ)
  { id: 'vc-1', code: 'XH01', category: 'Nề nếp', name: 'Xếp hàng nhốn nháo, chậm', pointsDeducted: 1, description: 'Trừ 1 điểm' },
  { id: 'vc-2', code: 'XH02', category: 'Nề nếp', name: 'Không điểm danh khi xếp hàng', pointsDeducted: 1, description: 'Trừ 1 điểm' },
  // 2. Trang phục (5đ)
  { id: 'vc-3', code: 'TP01', category: 'Trang phục', name: 'Không mặc đúng trang phục quy định (cổ bẻ/áo trắng/dép quai hậu)', pointsDeducted: 1, description: 'Trừ 1 điểm/đội viên' },
  { id: 'vc-4', code: 'TP02', category: 'Trang phục', name: 'Mặc áo không kéo khóa, cài cúc áo', pointsDeducted: 1, description: 'Trừ 1 điểm/đội viên' },
  // 3. Khăn quàng (5đ)
  { id: 'vc-5', code: 'KQ01', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ hoặc đeo muộn', pointsDeducted: 1, description: 'Trừ 1 điểm/đội viên' },
  // 4. Đi học muộn (5đ)
  { id: 'vc-6', code: 'DH01', category: 'Đi học', name: 'Đội viên đi học muộn (tính theo 2 bạn)', pointsDeducted: 1, description: '2 đội viên đi học muộn trừ 1 điểm' },
  { id: 'vc-7', code: 'DH02', category: 'Đi học', name: 'Từ 6 đội viên trở lên đi học muộn', pointsDeducted: 5, description: 'Trừ 5 điểm' },
  // 5. Vệ sinh lớp và khu vực (5đ)
  { id: 'vc-8', code: 'VS01', category: 'Vệ sinh', name: 'Vệ sinh muộn (sau 7 giờ 10 phút)', pointsDeducted: 1, description: 'Trừ 1 điểm' },
  { id: 'vc-9', code: 'VS02', category: 'Vệ sinh', name: 'Vệ sinh lớp bẩn', pointsDeducted: 2, description: 'Trừ 2 điểm' },
  { id: 'vc-10', code: 'VS03', category: 'Vệ sinh', name: 'Vệ sinh khu vực phân công bẩn', pointsDeducted: 2, description: 'Trừ 2 điểm' },
  // 6. Truy bài (5đ)
  { id: 'vc-11', code: 'TB01', category: 'Học tập', name: 'Đội viên mất trật tự giờ truy bài', pointsDeducted: 1, description: 'Trừ 1 điểm/đội viên' },
  { id: 'vc-12', code: 'TB02', category: 'Học tập', name: 'Lớp mất trật tự giờ truy bài (từ 4 HS trở lên)', pointsDeducted: 5, description: 'Trừ 5 điểm' },
  // 7. Đồ dùng học tập (5đ - T3, T5)
  { id: 'vc-13', code: 'DD01', category: 'Học tập', name: 'Thiếu đồ dùng học tập (thước kẻ, bút chì, com pa)', pointsDeducted: 1, description: 'Trừ 1 điểm/đội viên' },
  { id: 'vc-14', code: 'DD02', category: 'Học tập', name: 'Từ 4 đội viên thiếu đồ dùng học tập trở lên', pointsDeducted: 5, description: 'Trừ 5 điểm' },
  // 8. Chăm sóc công trình măng non (5đ - T2, T4, T7)
  { id: 'vc-15', code: 'MN01', category: 'Hoạt động Đội', name: 'Chi đội không chăm sóc, bảo quản và tưới cây theo quy định', pointsDeducted: 5, description: 'Trừ 5 điểm' },
  // 9. Hát đầu giờ (5đ)
  { id: 'vc-16', code: 'HD01', category: 'Hoạt động Đội', name: 'Đội viên không hát đầu giờ', pointsDeducted: 1, description: 'Trừ 1 điểm/đội viên' },
  { id: 'vc-17', code: 'HD02', category: 'Hoạt động Đội', name: 'Cả lớp không hát hoặc hát hời hợt', pointsDeducted: 3, description: 'Trừ 3 điểm' },
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  // Cờ đỏ Nguyễn Văn An (8A) được phân công chấm lớp 7A (Sân trường & Nề nếp)
  { id: 'as-1', weekId: 'w-4', redFlagId: 'rf-1', redFlagName: 'Nguyễn Văn An', targetClassId: 'c-7a', targetClassName: '7A', dayOfWeek: 'Thứ 2', area: 'Sân trường - Dãy B', shift: 'Sáng', content: 'Nề nếp & Xếp hàng', status: 'completed' },
  { id: 'as-2', weekId: 'w-4', redFlagId: 'rf-1', redFlagName: 'Nguyễn Văn An', targetClassId: 'c-7a', targetClassName: '7A', dayOfWeek: 'Thứ 3', area: 'Sân trường - Dãy B', shift: 'Sáng', content: 'Trang phục & Vệ sinh', status: 'completed' },
  { id: 'as-3', weekId: 'w-4', redFlagId: 'rf-1', redFlagName: 'Nguyễn Văn An', targetClassId: 'c-7a', targetClassName: '7A', dayOfWeek: 'Thứ 4', area: 'Sân trường - Dãy B', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-4', weekId: 'w-4', redFlagId: 'rf-1', redFlagName: 'Nguyễn Văn An', targetClassId: 'c-7a', targetClassName: '7A', dayOfWeek: 'Thứ 5', area: 'Sân trường - Dãy B', shift: 'Sáng', content: 'Nề nếp toàn diện', status: 'pending' },
  { id: 'as-5', weekId: 'w-4', redFlagId: 'rf-1', redFlagName: 'Nguyễn Văn An', targetClassId: 'c-7a', targetClassName: '7A', dayOfWeek: 'Thứ 6', area: 'Sân trường - Dãy B', shift: 'Sáng', content: 'Tổng kết & Xếp hàng', status: 'pending' },

  // Cờ đỏ Lục Thị Mai (8A) chấm lớp 7B
  { id: 'as-6', weekId: 'w-4', redFlagId: 'rf-2', redFlagName: 'Lục Thị Mai', targetClassId: 'c-7b', targetClassName: '7B', dayOfWeek: 'Thứ 2', area: 'Hành lang Tầng 1 Dãy B', shift: 'Sáng', content: 'Toàn diện', status: 'completed' },
  { id: 'as-7', weekId: 'w-4', redFlagId: 'rf-2', redFlagName: 'Lục Thị Mai', targetClassId: 'c-7b', targetClassName: '7B', dayOfWeek: 'Thứ 3', area: 'Hành lang Tầng 1 Dãy B', shift: 'Sáng', content: 'Toàn diện', status: 'completed' },
  { id: 'as-8', weekId: 'w-4', redFlagId: 'rf-2', redFlagName: 'Lục Thị Mai', targetClassId: 'c-7b', targetClassName: '7B', dayOfWeek: 'Thứ 4', area: 'Hành lang Tầng 1 Dãy B', shift: 'Sáng', content: 'Toàn diện', status: 'completed' },
  { id: 'as-9', weekId: 'w-4', redFlagId: 'rf-2', redFlagName: 'Lục Thị Mai', targetClassId: 'c-7b', targetClassName: '7B', dayOfWeek: 'Thứ 5', area: 'Hành lang Tầng 1 Dãy B', shift: 'Sáng', content: 'Toàn diện', status: 'completed' },
  { id: 'as-10', weekId: 'w-4', redFlagId: 'rf-2', redFlagName: 'Lục Thị Mai', targetClassId: 'c-7b', targetClassName: '7B', dayOfWeek: 'Thứ 6', area: 'Hành lang Tầng 1 Dãy B', shift: 'Sáng', content: 'Toàn diện', status: 'pending' },

  // Cờ đỏ Hầu Thị Dở (9A) chấm lớp 6A
  { id: 'as-11', weekId: 'w-4', redFlagId: 'rf-5', redFlagName: 'Hầu Thị Dở', targetClassId: 'c-6a', targetClassName: '6A', dayOfWeek: 'Thứ 2', area: 'Dãy nhà C', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'completed' },
  { id: 'as-12', weekId: 'w-4', redFlagId: 'rf-5', redFlagName: 'Hầu Thị Dở', targetClassId: 'c-6a', targetClassName: '6A', dayOfWeek: 'Thứ 3', area: 'Dãy nhà C', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'completed' },
  { id: 'as-13', weekId: 'w-4', redFlagId: 'rf-5', redFlagName: 'Hầu Thị Dở', targetClassId: 'c-6a', targetClassName: '6A', dayOfWeek: 'Thứ 4', area: 'Dãy nhà C', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'completed' },
  { id: 'as-14', weekId: 'w-4', redFlagId: 'rf-5', redFlagName: 'Hầu Thị Dở', targetClassId: 'c-6a', targetClassName: '6A', dayOfWeek: 'Thứ 5', area: 'Dãy nhà C', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'completed' },
  { id: 'as-15', weekId: 'w-4', redFlagId: 'rf-5', redFlagName: 'Hầu Thị Dở', targetClassId: 'c-6a', targetClassName: '6A', dayOfWeek: 'Thứ 6', area: 'Dãy nhà C', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'pending' },

  // Cờ đỏ Vàng Seo Lử (8B) chấm lớp 9A
  { id: 'as-16', weekId: 'w-4', redFlagId: 'rf-3', redFlagName: 'Vàng Seo Lử', targetClassId: 'c-9a', targetClassName: '9A', dayOfWeek: 'Thứ 2', area: 'Dãy nhà A Tầng 2', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-17', weekId: 'w-4', redFlagId: 'rf-3', redFlagName: 'Vàng Seo Lử', targetClassId: 'c-9a', targetClassName: '9A', dayOfWeek: 'Thứ 3', area: 'Dãy nhà A Tầng 2', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-18', weekId: 'w-4', redFlagId: 'rf-3', redFlagName: 'Vàng Seo Lử', targetClassId: 'c-9a', targetClassName: '9A', dayOfWeek: 'Thứ 4', area: 'Dãy nhà A Tầng 2', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-19', weekId: 'w-4', redFlagId: 'rf-3', redFlagName: 'Vàng Seo Lử', targetClassId: 'c-9a', targetClassName: '9A', dayOfWeek: 'Thứ 5', area: 'Dãy nhà A Tầng 2', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-20', weekId: 'w-4', redFlagId: 'rf-3', redFlagName: 'Vàng Seo Lử', targetClassId: 'c-9a', targetClassName: '9A', dayOfWeek: 'Thứ 6', area: 'Dãy nhà A Tầng 2', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  // Cờ đỏ Tiểu học: Vàng Mí Pó (5A) chấm lớp 4A
  { id: 'as-21', weekId: 'w-4', redFlagId: 'rf-17', redFlagName: 'Vàng Mí Pó', targetClassId: 'c-4a', targetClassName: '4A', dayOfWeek: 'Thứ 2', area: 'Dãy Tiểu học Tầng 1', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'completed' },
  { id: 'as-22', weekId: 'w-4', redFlagId: 'rf-17', redFlagName: 'Vàng Mí Pó', targetClassId: 'c-4a', targetClassName: '4A', dayOfWeek: 'Thứ 3', area: 'Dãy Tiểu học Tầng 1', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'completed' },
  { id: 'as-23', weekId: 'w-4', redFlagId: 'rf-17', redFlagName: 'Vàng Mí Pó', targetClassId: 'c-4a', targetClassName: '4A', dayOfWeek: 'Thứ 4', area: 'Dãy Tiểu học Tầng 1', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'completed' },
  { id: 'as-24', weekId: 'w-4', redFlagId: 'rf-17', redFlagName: 'Vàng Mí Pó', targetClassId: 'c-4a', targetClassName: '4A', dayOfWeek: 'Thứ 5', area: 'Dãy Tiểu học Tầng 1', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'pending' },
  { id: 'as-25', weekId: 'w-4', redFlagId: 'rf-17', redFlagName: 'Vàng Mí Pó', targetClassId: 'c-4a', targetClassName: '4A', dayOfWeek: 'Thứ 6', area: 'Dãy Tiểu học Tầng 1', shift: 'Sáng', content: 'Khăn quàng & Vệ sinh', status: 'pending' },
  // Cờ đỏ Tiểu học: Hầu Văn Chứ (5B) chấm lớp 3B
  { id: 'as-26', weekId: 'w-4', redFlagId: 'rf-19', redFlagName: 'Hầu Văn Chứ', targetClassId: 'c-3b', targetClassName: '3B', dayOfWeek: 'Thứ 2', area: 'Khu lớp 3 Tiểu học', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-27', weekId: 'w-4', redFlagId: 'rf-19', redFlagName: 'Hầu Văn Chứ', targetClassId: 'c-3b', targetClassName: '3B', dayOfWeek: 'Thứ 3', area: 'Khu lớp 3 Tiểu học', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-28', weekId: 'w-4', redFlagId: 'rf-19', redFlagName: 'Hầu Văn Chứ', targetClassId: 'c-3b', targetClassName: '3B', dayOfWeek: 'Thứ 4', area: 'Khu lớp 3 Tiểu học', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'completed' },
  { id: 'as-29', weekId: 'w-4', redFlagId: 'rf-19', redFlagName: 'Hầu Văn Chứ', targetClassId: 'c-3b', targetClassName: '3B', dayOfWeek: 'Thứ 5', area: 'Khu lớp 3 Tiểu học', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'pending' },
  { id: 'as-30', weekId: 'w-4', redFlagId: 'rf-19', redFlagName: 'Hầu Văn Chứ', targetClassId: 'c-3b', targetClassName: '3B', dayOfWeek: 'Thứ 6', area: 'Khu lớp 3 Tiểu học', shift: 'Sáng', content: 'Nề nếp & Giờ học', status: 'pending' },
];

export const INITIAL_GRADING_RECORDS: GradingRecordItem[] = [
  // Approved records
  {
    id: 'gr-1',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-28',
    dayOfWeek: 'Thứ 2',
    redFlagId: 'rf-1',
    redFlagName: 'Nguyễn Văn An',
    classId: 'c-7a',
    className: '7A',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 3, unitPoints: -1, totalPoints: -3, studentNames: 'Sùng Mí Vần, Thào Thị Sua, Lò A Sính' },
      { catalogId: 'vc-4', category: 'Đi học', name: 'Đi học muộn', quantity: 1, unitPoints: -2, totalPoints: -2, studentNames: 'Vàng Mí Dính' },
    ],
    bonuses: [],
    totalDeduction: 5,
    totalBonus: 0,
    netScoreImpact: -5,
    status: 'approved',
    approvedBy: 'Thầy Nguyễn Văn Thành (TPT)',
    approvedAt: '2026-09-28 17:30',
    generalNote: 'Các em đi học tương đối nghiêm túc, còn quên khăn quàng',
    createdAt: '2026-09-28 11:35',
  },
  {
    id: 'gr-2',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-29',
    dayOfWeek: 'Thứ 3',
    redFlagId: 'rf-1',
    redFlagName: 'Nguyễn Văn An',
    classId: 'c-7a',
    className: '7A',
    violations: [
      { catalogId: 'vc-8', category: 'Vệ sinh', name: 'Xả rác bừa bãi', quantity: 1, unitPoints: -2, totalPoints: -2, note: 'Vỏ kẹo ở góc cuối lớp' },
      { catalogId: 'vc-10', category: 'Nề nếp', name: 'Nói chuyện trong giờ', quantity: 1, unitPoints: -2, totalPoints: -2, studentNames: 'Lý A Pó' },
    ],
    bonuses: [],
    totalDeduction: 4,
    totalBonus: 0,
    netScoreImpact: -4,
    status: 'approved',
    approvedBy: 'Thầy Nguyễn Văn Thành (TPT)',
    approvedAt: '2026-09-29 17:15',
    createdAt: '2026-09-29 11:40',
  },
  {
    id: 'gr-3',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-30',
    dayOfWeek: 'Thứ 4',
    redFlagId: 'rf-1',
    redFlagName: 'Nguyễn Văn An',
    classId: 'c-7a',
    className: '7A',
    violations: [
      { catalogId: 'vc-7', category: 'Vệ sinh', name: 'Không trực nhật', quantity: 1, unitPoints: -5, totalPoints: -5, note: 'Tổ 2 chưa đổ rác trước giờ truy bài' },
    ],
    bonuses: [],
    totalDeduction: 5,
    totalBonus: 0,
    netScoreImpact: -5,
    status: 'approved',
    approvedBy: 'Thầy Nguyễn Văn Thành (TPT)',
    approvedAt: '2026-09-30 17:00',
    createdAt: '2026-09-30 11:20',
  },
  // Pending approvals (5 records pending approval - matches user prompt!)
  {
    id: 'gr-4',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-10-01',
    dayOfWeek: 'Thứ 5',
    redFlagId: 'rf-2',
    redFlagName: 'Lục Thị Mai',
    classId: 'c-7b',
    className: '7B',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 2, unitPoints: -1, totalPoints: -2, studentNames: 'Lý Mí Phống, Hầu Thị Chớ' },
      { catalogId: 'vc-10', category: 'Nề nếp', name: 'Nói chuyện trong giờ', quantity: 1, unitPoints: -2, totalPoints: -2, note: 'Tiết 2 môn Lịch sử' },
    ],
    bonuses: [
      { name: 'Nhặt được của rơi', points: 3, reason: 'Em Hầu Mí Pó nhặt được 50k trả lại bạn lớp 6B' }
    ],
    totalDeduction: 4,
    totalBonus: 3,
    netScoreImpact: -1,
    status: 'pending',
    generalNote: 'Lớp trật tự, có việc tốt được tuyên dương',
    createdAt: '2026-10-01 11:30',
  },
  {
    id: 'gr-5',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-10-01',
    dayOfWeek: 'Thứ 5',
    redFlagId: 'rf-3',
    redFlagName: 'Vàng Seo Lử',
    classId: 'c-9a',
    className: '9A',
    violations: [
      { catalogId: 'vc-4', category: 'Đi học', name: 'Đi học muộn', quantity: 2, unitPoints: -2, totalPoints: -4, studentNames: 'Trần Văn Kiên, Lò Thị Bông' },
    ],
    bonuses: [],
    totalDeduction: 4,
    totalBonus: 0,
    netScoreImpact: -4,
    status: 'pending',
    createdAt: '2026-10-01 11:45',
  },
  {
    id: 'gr-6',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-10-01',
    dayOfWeek: 'Thứ 5',
    redFlagId: 'rf-5',
    redFlagName: 'Hầu Thị Dở',
    classId: 'c-6a',
    className: '6A',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 4, unitPoints: -1, totalPoints: -4 },
      { catalogId: 'vc-8', category: 'Vệ sinh', name: 'Xả rác bừa bãi', quantity: 2, unitPoints: -2, totalPoints: -4, note: 'Vỏ hộp sữa sau giờ ra chơi' },
    ],
    bonuses: [],
    totalDeduction: 8,
    totalBonus: 0,
    netScoreImpact: -8,
    status: 'pending',
    createdAt: '2026-10-01 12:00',
  },
  {
    id: 'gr-7',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-10-01',
    dayOfWeek: 'Thứ 5',
    redFlagId: 'rf-7',
    redFlagName: 'Lý Mí Sinh',
    classId: 'c-8a',
    className: '8A',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 1, unitPoints: -1, totalPoints: -1 },
      { catalogId: 'vc-10', category: 'Nề nếp', name: 'Nói chuyện trong giờ', quantity: 1, unitPoints: -2, totalPoints: -2 },
    ],
    bonuses: [],
    totalDeduction: 3,
    totalBonus: 0,
    netScoreImpact: -3,
    status: 'pending',
    createdAt: '2026-10-01 11:50',
  },
  {
    id: 'gr-8',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-10-01',
    dayOfWeek: 'Thứ 5',
    redFlagId: 'rf-8',
    redFlagName: 'Hoàng Thùy Linh',
    classId: 'c-8b',
    className: '8B',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 2, unitPoints: -1, totalPoints: -2 },
      { catalogId: 'vc-4', category: 'Đi học', name: 'Đi học muộn', quantity: 1, unitPoints: -2, totalPoints: -2 },
    ],
    bonuses: [],
    totalDeduction: 4,
    totalBonus: 0,
    netScoreImpact: -4,
    status: 'pending',
    createdAt: '2026-10-01 12:15',
  },
  // Revision requested (2 records requiring revision - matches user prompt!)
  {
    id: 'gr-9',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-30',
    dayOfWeek: 'Thứ 4',
    redFlagId: 'rf-10',
    redFlagName: 'Vàng Thị Máy',
    classId: 'c-6b',
    className: '6B',
    violations: [
      { catalogId: 'vc-7', category: 'Vệ sinh', name: 'Không trực nhật', quantity: 2, unitPoints: -5, totalPoints: -10, note: 'Ghi nhầm lớp 6B với 6C' },
    ],
    bonuses: [],
    totalDeduction: 10,
    totalBonus: 0,
    netScoreImpact: -10,
    status: 'revision_requested',
    revisionReason: 'GVCN phản hồi buổi sáng thứ 4 lớp 6B đã trực nhật đầy đủ trước 7h, đề nghị cờ đỏ xác minh lại số phòng.',
    createdAt: '2026-09-30 11:55',
  },
  {
    id: 'gr-10',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-30',
    dayOfWeek: 'Thứ 4',
    redFlagId: 'rf-15',
    redFlagName: 'Hồ Văn Cường',
    classId: 'c-8c',
    className: '8C',
    violations: [
      { catalogId: 'vc-12', category: 'Nề nếp', name: 'Nói tục, gây gổ', quantity: 1, unitPoints: -10, totalPoints: -10 },
    ],
    bonuses: [],
    totalDeduction: 10,
    totalBonus: 0,
    netScoreImpact: -10,
    status: 'revision_requested',
    revisionReason: 'Cần ghi rõ họ tên học sinh vi phạm và có chữ ký xác nhận của lớp trưởng hoặc GVCN theo quy chế.',
    createdAt: '2026-09-30 12:10',
  },
  // Additional previous week 4 records for classes so that we have full weekly score ranking:
  // 9A: 96 pts (base 100 - 4 = 96)
  {
    id: 'gr-11',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-29',
    dayOfWeek: 'Thứ 3',
    redFlagId: 'rf-3',
    redFlagName: 'Vàng Seo Lử',
    classId: 'c-9a',
    className: '9A',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 1, unitPoints: -1, totalPoints: -1 },
    ],
    bonuses: [
      { name: 'Tiết học tốt', points: 2, reason: 'Có 5 giờ học Tốt' }
    ],
    totalDeduction: 1,
    totalBonus: 2,
    netScoreImpact: 1,
    status: 'approved',
    approvedBy: 'Thầy Nguyễn Văn Thành (TPT)',
    approvedAt: '2026-09-29 17:00',
    createdAt: '2026-09-29 11:30',
  },
  // 8A: 94 pts
  {
    id: 'gr-12',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-29',
    dayOfWeek: 'Thứ 3',
    redFlagId: 'rf-7',
    redFlagName: 'Lý Mí Sinh',
    classId: 'c-8a',
    className: '8A',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 3, unitPoints: -1, totalPoints: -3 },
      { catalogId: 'vc-10', category: 'Nề nếp', name: 'Nói chuyện trong giờ', quantity: 1, unitPoints: -2, totalPoints: -2 },
    ],
    bonuses: [],
    totalDeduction: 5,
    totalBonus: 0,
    netScoreImpact: -5,
    status: 'approved',
    approvedBy: 'Thầy Nguyễn Văn Thành (TPT)',
    approvedAt: '2026-09-29 17:00',
    createdAt: '2026-09-29 11:30',
  },
  // 7B: 91 pts
  {
    id: 'gr-13',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-29',
    dayOfWeek: 'Thứ 3',
    redFlagId: 'rf-2',
    redFlagName: 'Lục Thị Mai',
    classId: 'c-7b',
    className: '7B',
    violations: [
      { catalogId: 'vc-4', category: 'Đi học', name: 'Đi học muộn', quantity: 2, unitPoints: -2, totalPoints: -4 },
      { catalogId: 'vc-8', category: 'Vệ sinh', name: 'Xả rác bừa bãi', quantity: 2, unitPoints: -2, totalPoints: -4 },
    ],
    bonuses: [],
    totalDeduction: 8,
    totalBonus: 0,
    netScoreImpact: -8,
    status: 'approved',
    approvedBy: 'Thầy Nguyễn Văn Thành (TPT)',
    approvedAt: '2026-09-29 17:00',
    createdAt: '2026-09-29 11:30',
  },
  // 6A: 88 pts
  {
    id: 'gr-14',
    weekId: 'w-4',
    weekNumber: 4,
    date: '2026-09-29',
    dayOfWeek: 'Thứ 3',
    redFlagId: 'rf-5',
    redFlagName: 'Hầu Thị Dở',
    classId: 'c-6a',
    className: '6A',
    violations: [
      { catalogId: 'vc-1', category: 'Trang phục', name: 'Không đeo khăn quàng đỏ', quantity: 5, unitPoints: -1, totalPoints: -5 },
      { catalogId: 'vc-7', category: 'Vệ sinh', name: 'Không trực nhật', quantity: 1, unitPoints: -5, totalPoints: -5 },
      { catalogId: 'vc-11', category: 'Nề nếp', name: 'Mất trật tự khi xếp hàng', quantity: 1, unitPoints: -2, totalPoints: -2 },
    ],
    bonuses: [],
    totalDeduction: 12,
    totalBonus: 0,
    netScoreImpact: -12,
    status: 'approved',
    approvedBy: 'Thầy Nguyễn Văn Thành (TPT)',
    approvedAt: '2026-09-29 17:00',
    createdAt: '2026-09-29 11:30',
  },
];

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'TRƯỜNG PTDTBT TH&THCS QUẢN BẠ',
  schoolType: 'Phổ thông dân tộc bán trú Tiểu học & THCS',
  district: 'Huyện Quản Bạ, Tỉnh Hà Giang',
  systemName: 'QUẢN LÝ THI ĐUA NỀ NẾP HỌC SINH',
  schoolYear: '2026–2027',
  currentWeekNumber: 4,
  youthUnionLeader: 'Thầy Nguyễn Văn Thành',
  principal: 'Thầy Lê Hải Đăng',
  baseScore: 100,
  allowEditAfterSubmission: false,
  autoLockTime: 'Chủ nhật 17:00',
  tieBreakerRule: 'violation_count',
  permissions: {
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
  },
};

export const INITIAL_STUDENTS: StudentItem[] = [
  // Lớp 9A
  { id: 's-9a-1', code: 'HS-9A-01', fullName: 'Sùng Mí Sính', classId: 'c-9a', className: '9A', gender: 'Nam', dob: '2011-03-15', roleInClass: 'Lớp trưởng', phone: '0981.111.001', status: 'active', violationCount: 0 },
  { id: 's-9a-2', code: 'HS-9A-02', fullName: 'Vàng Thị Máy', classId: 'c-9a', className: '9A', gender: 'Nữ', dob: '2011-06-20', roleInClass: 'Lớp phó Học tập', phone: '0981.111.002', status: 'active', violationCount: 0 },
  { id: 's-9a-3', code: 'HS-9A-03', fullName: 'Lò Mí Thắng', classId: 'c-9a', className: '9A', gender: 'Nam', dob: '2011-09-12', roleInClass: 'Lớp phó Lao động', status: 'active', violationCount: 1 },
  { id: 's-9a-4', code: 'HS-9A-04', fullName: 'Mai Thị Hoa', classId: 'c-9a', className: '9A', gender: 'Nữ', dob: '2011-01-25', roleInClass: 'Tổ trưởng Tổ 1', status: 'active', violationCount: 0 },
  { id: 's-9a-5', code: 'HS-9A-05', fullName: 'Giàng A Dinh', classId: 'c-9a', className: '9A', gender: 'Nam', dob: '2011-11-05', roleInClass: 'Đội viên', status: 'active', violationCount: 2 },
  { id: 's-9a-6', code: 'HS-9A-06', fullName: 'Hầu Thị Chứ', classId: 'c-9a', className: '9A', gender: 'Nữ', dob: '2011-08-18', roleInClass: 'Đội viên', status: 'active', violationCount: 0 },

  // Lớp 8A
  { id: 's-8a-1', code: 'HS-8A-01', fullName: 'Nguyễn Văn An', classId: 'c-8a', className: '8A', gender: 'Nam', dob: '2012-04-10', roleInClass: 'Đội viên (Cờ đỏ)', phone: '0982.222.001', status: 'active', violationCount: 0 },
  { id: 's-8a-2', code: 'HS-8A-02', fullName: 'Lò Thị Mai', classId: 'c-8a', className: '8A', gender: 'Nữ', dob: '2012-07-22', roleInClass: 'Lớp trưởng', phone: '0982.222.002', status: 'active', violationCount: 0 },
  { id: 's-8a-3', code: 'HS-8A-03', fullName: 'Trần Quốc Bảo', classId: 'c-8a', className: '8A', gender: 'Nam', dob: '2012-02-14', roleInClass: 'Lớp phó Kỷ luật', status: 'active', violationCount: 1 },
  { id: 's-8a-4', code: 'HS-8A-04', fullName: 'Vàng Thị Dở', classId: 'c-8a', className: '8A', gender: 'Nữ', dob: '2012-10-30', roleInClass: 'Tổ trưởng Tổ 2', status: 'active', violationCount: 0 },
  { id: 's-8a-5', code: 'HS-8A-05', fullName: 'Sùng A Páo', classId: 'c-8a', className: '8A', gender: 'Nam', dob: '2012-05-19', roleInClass: 'Đội viên', status: 'active', violationCount: 0 },

  // Lớp 7A
  { id: 's-7a-1', code: 'HS-7A-01', fullName: 'Phạm Hồng Quân', classId: 'c-7a', className: '7A', gender: 'Nam', dob: '2013-03-08', roleInClass: 'Lớp trưởng', phone: '0983.333.001', status: 'active', violationCount: 0 },
  { id: 's-7a-2', code: 'HS-7A-02', fullName: 'Lò Mí Sính', classId: 'c-7a', className: '7A', gender: 'Nam', dob: '2013-05-17', roleInClass: 'Đội viên', status: 'active', violationCount: 3 },
  { id: 's-7a-3', code: 'HS-7A-03', fullName: 'Vàng Thị Hoa', classId: 'c-7a', className: '7A', gender: 'Nữ', dob: '2013-09-02', roleInClass: 'Đội viên', status: 'active', violationCount: 2 },
  { id: 's-7a-4', code: 'HS-7A-04', fullName: 'Giàng Thị Mỷ', classId: 'c-7a', className: '7A', gender: 'Nữ', dob: '2013-12-11', roleInClass: 'Lớp phó Văn thể', status: 'active', violationCount: 0 },
  { id: 's-7a-5', code: 'HS-7A-05', fullName: 'Trần Văn Kiên', classId: 'c-7a', className: '7A', gender: 'Nam', dob: '2013-01-20', roleInClass: 'Đội viên', status: 'active', violationCount: 1 },

  // Lớp 7B
  { id: 's-7b-1', code: 'HS-7B-01', fullName: 'Lê Thị Thảo', classId: 'c-7b', className: '7B', gender: 'Nữ', dob: '2013-04-14', roleInClass: 'Lớp trưởng', status: 'active', violationCount: 0 },
  { id: 's-7b-2', code: 'HS-7B-02', fullName: 'Hầu A Dũng', classId: 'c-7b', className: '7B', gender: 'Nam', dob: '2013-08-29', roleInClass: 'Lớp phó Lao động', status: 'active', violationCount: 0 },
  { id: 's-7b-3', code: 'HS-7B-03', fullName: 'Sùng Thị Say', classId: 'c-7b', className: '7B', gender: 'Nữ', dob: '2013-11-03', roleInClass: 'Đội viên', status: 'active', violationCount: 1 },

  // Lớp 6A
  { id: 's-6a-1', code: 'HS-6A-01', fullName: 'Vàng Mí Pó', classId: 'c-6a', className: '6A', gender: 'Nam', dob: '2014-02-18', roleInClass: 'Lớp trưởng', status: 'active', violationCount: 0 },
  { id: 's-6a-2', code: 'HS-6A-02', fullName: 'Giàng Thị Dua', classId: 'c-6a', className: '6A', gender: 'Nữ', dob: '2014-06-25', roleInClass: 'Đội viên', status: 'active', violationCount: 2 },
  { id: 's-6a-3', code: 'HS-6A-03', fullName: 'Lò A Sáng', classId: 'c-6a', className: '6A', gender: 'Nam', dob: '2014-10-15', roleInClass: 'Đội viên', status: 'active', violationCount: 1 },

  // Lớp 8B
  { id: 's-8b-1', code: 'HS-8B-01', fullName: 'Hoàng Văn Nam', classId: 'c-8b', className: '8B', gender: 'Nam', dob: '2012-03-21', roleInClass: 'Lớp trưởng', status: 'active', violationCount: 1 },
  { id: 's-8b-2', code: 'HS-8B-02', fullName: 'Mai Thị Dinh', classId: 'c-8b', className: '8B', gender: 'Nữ', dob: '2012-09-09', roleInClass: 'Đội viên', status: 'active', violationCount: 2 },

  // Lớp 5A (Tiểu học)
  { id: 's-5a-1', code: 'HS-5A-01', fullName: 'Thào A Chờ', classId: 'c-5a', className: '5A', gender: 'Nam', dob: '2015-02-14', roleInClass: 'Lớp trưởng', phone: '0985.123.456', status: 'active', violationCount: 0 },
  { id: 's-5a-2', code: 'HS-5A-02', fullName: 'Vàng Thị Dua', classId: 'c-5a', className: '5A', gender: 'Nữ', dob: '2015-05-18', roleInClass: 'Lớp phó Học tập', status: 'active', violationCount: 0 },
  { id: 's-5a-3', code: 'HS-5A-03', fullName: 'Sùng Mí Say', classId: 'c-5a', className: '5A', gender: 'Nam', dob: '2015-08-22', roleInClass: 'Đội viên', status: 'active', violationCount: 1 },

  // Lớp 4A (Tiểu học)
  { id: 's-4a-1', code: 'HS-4A-01', fullName: 'Lò Thị Mỷ', classId: 'c-4a', className: '4A', gender: 'Nữ', dob: '2016-03-10', roleInClass: 'Lớp trưởng', phone: '0984.234.567', status: 'active', violationCount: 0 },
  { id: 's-4a-2', code: 'HS-4A-02', fullName: 'Giàng A Pó', classId: 'c-4a', className: '4A', gender: 'Nam', dob: '2016-07-15', roleInClass: 'Lớp phó', status: 'active', violationCount: 0 },

  // Lớp 3A (Tiểu học)
  { id: 's-3a-1', code: 'HS-3A-01', fullName: 'Vàng Seo Sính', classId: 'c-3a', className: '3A', gender: 'Nam', dob: '2017-04-12', roleInClass: 'Lớp trưởng', phone: '0983.345.678', status: 'active', violationCount: 0 },
  { id: 's-3a-2', code: 'HS-3A-02', fullName: 'Hầu Thị Mai', classId: 'c-3a', className: '3A', gender: 'Nữ', dob: '2017-09-20', roleInClass: 'Sao nhi đồng', status: 'active', violationCount: 0 },

  // Lớp 2A (Tiểu học)
  { id: 's-2a-1', code: 'HS-2A-01', fullName: 'Sùng A Dũng', classId: 'c-2a', className: '2A', gender: 'Nam', dob: '2018-01-25', roleInClass: 'Lớp trưởng', phone: '0982.456.789', status: 'active', violationCount: 0 },
  { id: 's-2a-2', code: 'HS-2A-02', fullName: 'Lý Thị Chớ', classId: 'c-2a', className: '2A', gender: 'Nữ', dob: '2018-06-30', roleInClass: 'Sao nhi đồng', status: 'active', violationCount: 0 },

  // Lớp 1A (Tiểu học)
  { id: 's-1a-1', code: 'HS-1A-01', fullName: 'Vàng Mí Lử', classId: 'c-1a', className: '1A', gender: 'Nam', dob: '2019-02-18', roleInClass: 'Lớp trưởng', phone: '0981.567.890', status: 'active', violationCount: 0 },
  { id: 's-1a-2', code: 'HS-1A-02', fullName: 'Thào Thị Lan', classId: 'c-1a', className: '1A', gender: 'Nữ', dob: '2019-08-05', roleInClass: 'Sao nhi đồng', status: 'active', violationCount: 0 },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Tuần 4 sắp đóng',
    message: 'Hệ thống sẽ tự động chốt kết quả tuần 4 vào 17:00 Chủ nhật. Các cờ đỏ khẩn trương hoàn thành phiếu.',
    timestamp: '10 phút trước',
    read: false,
    type: 'warning',
    linkModule: 'weeks',
  },
  {
    id: 'n-2',
    title: '5 phiếu đang chờ duyệt',
    message: 'Đã nhận được 5 phiếu chấm từ các chi đội cần Tổng phụ trách phê duyệt.',
    timestamp: '35 phút trước',
    read: false,
    type: 'info',
    linkModule: 'approvals',
  },
  {
    id: 'n-3',
    title: '2 dữ liệu yêu cầu sửa',
    message: 'Phiếu chấm lớp 6B và 8C đã gửi yêu cầu điều chỉnh do thông tin chưa khớp.',
    timestamp: '2 giờ trước',
    read: false,
    type: 'error',
    linkModule: 'approvals',
  },
  {
    id: 'n-4',
    title: 'Phân công tuần 4 đã kích hoạt',
    message: '32 cờ đỏ đã nhận nhiệm vụ trực ban tuần 4 từ 28/09 đến 04/10/2026.',
    timestamp: '3 ngày trước',
    read: true,
    type: 'success',
    linkModule: 'assignments',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-01 12:15:30',
    user: 'Hoàng Thùy Linh',
    role: 'Cờ đỏ',
    action: 'Nhập kết quả chấm',
    target: 'Lớp 8B',
    details: 'Nhập 2 lỗi vi phạm (khăn quàng, đi muộn), trừ 4 điểm',
    ip: '192.168.1.45',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-01 11:30:12',
    user: 'Nguyễn Văn Thành',
    role: 'Tổng phụ trách',
    action: 'Duyệt phiếu chấm',
    target: 'Phiếu #gr-1 (Lớp 7A)',
    details: 'Phê duyệt phiếu chấm ngày Thứ 2, trừ 5 điểm',
    ip: '192.168.1.10',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-30 17:10:45',
    user: 'Nguyễn Văn Thành',
    role: 'Tổng phụ trách',
    action: 'Yêu cầu sửa',
    target: 'Phiếu #gr-9 (Lớp 6B)',
    details: 'Yêu cầu cờ đỏ Vàng Thị Máy kiểm tra lại thời gian trực nhật',
    ip: '192.168.1.10',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-28 07:00:00',
    user: 'Nguyễn Văn Thành',
    role: 'Tổng phụ trách',
    action: 'Mở tuần mới',
    target: 'Tuần 4 (28/09 - 04/10/2026)',
    details: 'Kích hoạt đợt chấm thi đua tuần 4 năm học 2026-2027',
    ip: '192.168.1.10',
  },
  {
    id: 'log-5',
    timestamp: '2026-09-27 16:30:00',
    user: 'Nguyễn Văn Thành',
    role: 'Tổng phụ trách',
    action: 'Khóa tuần',
    target: 'Tuần 3',
    details: 'Chốt bảng xếp hạng thi đua Tuần 3, công bố biên bản',
    ip: '192.168.1.10',
  },
];

export const INITIAL_MINUTES: WeeklyMinutes = {
  id: 'min-w4',
  weekId: 'w-4',
  weekNumber: 4,
  title: 'BIÊN BẢN NHẬN XÉT TRỰC TUẦN & KẾT QUẢ THI ĐUA NỀ NẾP',
  periodText: 'Từ ngày 28/09/2026 đến ngày 04/10/2026',
  advantages: `1. Nền nếp chung: Toàn trường duy trì tốt giờ giấc ra vào lớp, truy bài 15 phút đầu giờ nghiêm túc. Đa số các chi đội thực hiện tốt đồng phục, xếp hàng thể dục giữa giờ nhanh chóng, dứt khoát.
2. Học tập: Nhiều chi đội đạt hoa điểm tốt, tiêu biểu như 9A, 8A, 7B. Các bạn học sinh bán trú tự giác ôn bài buổi tối đúng quy chế.
3. Hoạt động Đội: Ban Cờ đỏ hoạt động tích cực, chấm điểm khách quan, có tinh thần trách nhiệm cao.`,
  shortcomings: `1. Trang phục: Một số bạn học sinh khối 6 và khối 7 vẫn còn quên đeo khăn quàng đỏ vào các buổi sáng đầu tuần (7A, 6A).
2. Đi học: Hiện tượng đi học sát giờ hoặc muộn sau hiệu lệnh trống vẫn còn xảy ra ở lớp 8B và 9A.
3. Vệ sinh môi trường: Khu vực bồn hoa dãy C còn vương vỏ kẹo, một số lớp tổ trực nhật đổ rác muộn trước giờ học.`,
  evaluation: `Đánh giá chung: Nền nếp tuần 4 có bước chuyển biến tích cực so với tuần 3. Tinh thần thi đua giữa các chi đội diễn ra sôi nổi, công bằng, minh bạch. Ban chỉ huy Liên đội tuyên dương các lớp dẫn đầu.`,
  recommendations: `1. Đề nghị các Thầy/Cô Giáo viên Chủ nhiệm (đặc biệt các lớp xếp loại Khá và Cần cố gắng) tăng cường sinh hoạt 15 phút đầu giờ nhắc nhở học sinh về khăn quàng đỏ và trang phục.
2. Đoàn Đội phối hợp Đoàn xã tổ chức kiểm tra cổng trường, xử lý dứt điểm tình trạng học sinh tụ tập ăn quà vặt trước cổng.
3. Yêu cầu Ban Cờ đỏ tiếp tục duy trì chấm điểm công tâm, ghi chép đầy đủ họ tên học sinh vi phạm.`,
  signerLeader: 'Nguyễn Văn Thành',
  signerPrincipal: 'Lê Hải Đăng',
  updatedAt: '2026-10-01 10:00',
};
