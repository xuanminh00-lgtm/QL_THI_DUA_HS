import { CriteriaCategory } from '../types';

export interface OfficialCriterion {
  id: string;
  order: number;
  name: string;
  category: CriteriaCategory;
  maxPoints: number; // e.g., 2, 5
  description: string;
  note?: string;
  dutyDays?: string[]; // e.g., ['Thứ 3', 'Thứ 5'] or ['Thứ 2', 'Thứ 4', 'Thứ 7']
  items: {
    code: string;
    label: string;
    pointsDeducted: number; // positive number of penalty
    unit: 'lần' | 'đội viên' | 'mục';
    requiresStudentNames?: boolean;
    helper?: string;
  }[];
}

export const OFFICIAL_GRADING_CRITERIA: OfficialCriterion[] = [
  {
    id: 'crit-1',
    order: 1,
    name: 'Xếp hàng',
    category: 'Nề nếp',
    maxPoints: 2,
    description: 'Nhanh, thẳng hàng, điểm danh đầy đủ',
    items: [
      {
        code: 'XH-01',
        label: 'Xếp hàng nhốn nháo, chậm',
        pointsDeducted: 1,
        unit: 'lần',
        helper: 'Trừ 1 điểm',
      },
      {
        code: 'XH-02',
        label: 'Không điểm danh',
        pointsDeducted: 1,
        unit: 'lần',
        helper: 'Trừ 1 điểm',
      },
    ],
  },
  {
    id: 'crit-2',
    order: 2,
    name: 'Trang phục',
    category: 'Trang phục',
    maxPoints: 5,
    description: 'Mặc áo có cổ bẻ cả tuần. Từ thứ 2 và các ngày lễ mặc áo trắng quần tối màu dép quai hậu hoặc giày và ghế ngồi chào cờ',
    note: 'Lưu ý: Ngày mưa Cờ đỏ không chấm điểm đi giày',
    items: [
      {
        code: 'TP-01',
        label: 'Không mặc đúng trang phục quy định',
        pointsDeducted: 1,
        unit: 'đội viên',
        requiresStudentNames: true,
        helper: 'Trừ 1 điểm / mỗi đội viên vi phạm',
      },
      {
        code: 'TP-02',
        label: 'Mặc áo không kéo khóa, cài cúc áo cẩu thả',
        pointsDeducted: 1,
        unit: 'đội viên',
        requiresStudentNames: true,
        helper: 'Trừ 1 điểm / mỗi đội viên',
      },
    ],
  },
  {
    id: 'crit-3',
    order: 3,
    name: 'Khăn quàng đỏ',
    category: 'Trang phục',
    maxPoints: 5,
    description: 'Khăn quàng đầy đủ, đeo đúng quy cách Đội TNTP Hồ Chí Minh',
    items: [
      {
        code: 'KQ-01',
        label: 'Không đeo khăn quàng hoặc đeo muộn',
        pointsDeducted: 1,
        unit: 'đội viên',
        requiresStudentNames: true,
        helper: 'Trừ 1 điểm / mỗi đội viên',
      },
    ],
  },
  {
    id: 'crit-4',
    order: 4,
    name: 'Đi học muộn',
    category: 'Đi học',
    maxPoints: 5,
    description: 'Đi học đúng giờ (trước trống báo đầu giờ)',
    items: [
      {
        code: 'DM-01',
        label: 'Có 2 đội viên đi học muộn',
        pointsDeducted: 1,
        unit: 'mục',
        requiresStudentNames: true,
        helper: '2 đội viên đi muộn trừ 1 điểm',
      },
      {
        code: 'DM-02',
        label: 'Từ 6 đội viên trở lên đi muộn',
        pointsDeducted: 5,
        unit: 'mục',
        requiresStudentNames: true,
        helper: 'Trừ trọn 5 điểm',
      },
      {
        code: 'DM-03',
        label: 'Đi học muộn lẻ (1 học sinh)',
        pointsDeducted: 0.5,
        unit: 'đội viên',
        requiresStudentNames: true,
        helper: 'Ghi nhận tên đội viên đi muộn',
      },
    ],
  },
  {
    id: 'crit-5',
    order: 5,
    name: 'Vệ sinh lớp và khu vực',
    category: 'Vệ sinh',
    maxPoints: 5,
    description: 'Vệ sinh sạch sẽ, đúng giờ (Xong trước 7 giờ 10 phút; khi trống vào lớp trực tuần chỉ 2 bạn đốt rác nếu chưa xong)',
    items: [
      {
        code: 'VS-01',
        label: 'Vệ sinh muộn (sau 7h10)',
        pointsDeducted: 1,
        unit: 'lần',
        helper: 'Trừ 1 điểm',
      },
      {
        code: 'VS-02',
        label: 'Vệ sinh lớp bẩn',
        pointsDeducted: 2,
        unit: 'lần',
        helper: 'Trừ 2 điểm',
      },
      {
        code: 'VS-03',
        label: 'Vệ sinh khu vực phân công bẩn',
        pointsDeducted: 2,
        unit: 'lần',
        helper: 'Trừ 2 điểm',
      },
    ],
  },
  {
    id: 'crit-6',
    order: 6,
    name: 'Truy bài đầu giờ',
    category: 'Học tập',
    maxPoints: 5,
    description: 'Nghiêm túc trật tự ôn bài 15 phút đầu giờ',
    items: [
      {
        code: 'TB-01',
        label: 'Đội viên mất trật tự trong giờ truy bài',
        pointsDeducted: 1,
        unit: 'đội viên',
        requiresStudentNames: true,
        helper: 'Trừ 1 điểm / mỗi đội viên',
      },
      {
        code: 'TB-02',
        label: 'Lớp mất trật tự nghiêm trọng (Từ 4 học sinh trở lên)',
        pointsDeducted: 5,
        unit: 'lần',
        helper: 'Từ 4 HS trở lên: trừ 5 điểm',
      },
    ],
  },
  {
    id: 'crit-7',
    order: 7,
    name: 'Đồ dùng học tập',
    category: 'Học tập',
    maxPoints: 5,
    description: 'Đầy đủ đồ dùng học tập: thước kẻ, bút chì, com pa (Kiểm tra vào Thứ 3 và Thứ 5 hàng tuần)',
    dutyDays: ['Thứ 3', 'Thứ 5'],
    items: [
      {
        code: 'DD-01',
        label: 'Đội viên thiếu đồ dùng học tập (thước kẻ, bút chì, com pa)',
        pointsDeducted: 1,
        unit: 'đội viên',
        requiresStudentNames: true,
        helper: 'Trừ 1 điểm / mỗi đội viên',
      },
      {
        code: 'DD-02',
        label: 'Từ 4 đội viên thiếu đồ dùng học tập trở lên',
        pointsDeducted: 5,
        unit: 'lần',
        helper: 'Trừ 5 điểm',
      },
    ],
  },
  {
    id: 'crit-8',
    order: 8,
    name: 'Chăm sóc công trình măng non',
    category: 'Hoạt động Đội',
    maxPoints: 5,
    description: 'Chi đội chăm sóc, bảo quản tốt, tưới cây (Tưới cây vào Thứ 2, 4, 7 hàng tuần; Lưu ý nếu trời mưa không phải tưới)',
    dutyDays: ['Thứ 2', 'Thứ 4', 'Thứ 7'],
    note: 'Lưu ý: Nếu trời mưa không phải tưới cây',
    items: [
      {
        code: 'MN-01',
        label: 'Chi đội không chăm sóc, bảo quản và tưới cây theo quy định',
        pointsDeducted: 5,
        unit: 'lần',
        helper: 'Trừ 5 điểm',
      },
    ],
  },
  {
    id: 'crit-9',
    order: 9,
    name: 'Hát đầu giờ',
    category: 'Hoạt động Đội',
    maxPoints: 5,
    description: 'Hát đúng nhạc, to rõ ràng, tác phong nghiêm túc',
    items: [
      {
        code: 'HD-01',
        label: 'Đội viên không hát đầu giờ',
        pointsDeducted: 1,
        unit: 'đội viên',
        requiresStudentNames: true,
        helper: 'Trừ 1 điểm / mỗi đội viên',
      },
      {
        code: 'HD-02',
        label: 'Cả lớp không hát hoặc hát hời hợt',
        pointsDeducted: 3,
        unit: 'lần',
        helper: 'Trừ 3 điểm',
      },
    ],
  },
];
