import React from 'react';
import { useApp, NavigationModule } from '../context/AppContext';
import {
  LayoutDashboard,
  CalendarRange,
  School,
  Flag,
  CalendarClock,
  Sliders,
  AlertTriangle,
  ClipboardEdit,
  CheckCircle2,
  Trophy,
  BarChart3,
  FileText,
  Settings,
  Shield,
  PanelLeftClose,
  PanelLeftOpen,
  Lock,
} from 'lucide-react';

interface MenuItem {
  id: NavigationModule;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, kpiStats, currentUser, isAuthenticated } = useApp();

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'weeks', label: 'Quản lý tuần', icon: CalendarRange },
    { id: 'classes', label: 'Quản lý lớp', icon: School },
    { id: 'redflags', label: 'Quản lý cờ đỏ', icon: Flag },
    { id: 'assignments', label: 'Phân công trực tuần', icon: CalendarClock },
    { id: 'criteria', label: 'Tiêu chí chấm điểm', icon: Sliders },
    { id: 'violations', label: 'Danh mục lỗi vi phạm', icon: AlertTriangle },
    {
      id: 'grading_mobile',
      label: 'Nhập kết quả chấm',
      icon: ClipboardEdit,
      badge: 'Cờ đỏ',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    },
    {
      id: 'approvals',
      label: 'Duyệt kết quả',
      icon: CheckCircle2,
      badge: kpiStats.pendingApprovalsCount > 0 ? kpiStats.pendingApprovalsCount : undefined,
      badgeColor: 'bg-amber-500 text-white font-bold',
    },
    { id: 'rankings', label: 'Xếp hạng thi đua', icon: Trophy },
    { id: 'reports', label: 'Thống kê – Báo cáo', icon: BarChart3 },
    { id: 'minutes', label: 'Biên bản trực tuần', icon: FileText },
    { id: 'settings', label: 'Cài đặt hệ thống', icon: Settings },
  ];

  const handleSelect = (id: NavigationModule) => {
    // Khi chưa đăng nhập: tất cả tính năng bị khóa ngoại trừ trang Tổng quan
    if (!isAuthenticated && id !== 'dashboard') {
      return;
    }
    setActiveTab(id);
  };

  return (
    <aside
      className={`sticky top-0 h-screen shrink-0 z-20 bg-gradient-to-b from-[#0F275A] via-[#102A63] to-[#0A1B3F] text-slate-100 flex flex-col transition-all duration-200 ease-in-out shadow-xl border-r border-blue-900/50 ${
        sidebarOpen ? 'w-56 sm:w-64' : 'w-16 sm:w-20'
      }`}
    >
      {/* Sidebar Header */}
      <div className={`p-3.5 border-b border-blue-800/40 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/50 border border-blue-400/30 flex items-center justify-center text-amber-300 font-black shadow-xs shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-200 truncate">HỆ THỐNG NỀ NẾP</p>
              <p className="text-[11px] text-blue-300/80 font-medium truncate">Năm học 2026–2027</p>
            </div>
          )}
        </div>

        {/* Toggle Collapse/Expand button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-blue-300 hover:text-white hover:bg-blue-800/60 transition-colors shrink-0"
          title={sidebarOpen ? 'Thu gọn cột chức năng' : 'Mở rộng cột chức năng'}
          aria-label="Thu gọn hoặc mở rộng cột chức năng"
        >
          {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
        </button>
      </div>

      {/* Current Role Banner (when expanded) */}
      {sidebarOpen && (
        <div className="px-3.5 py-2 bg-blue-950/60 border-b border-blue-900/40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-300 font-medium text-[11px]">Đang thao tác:</span>
            <span className="font-bold text-amber-300 truncate max-w-[130px] text-right text-[11px]">
              {isAuthenticated
                ? currentUser.role === 'admin'
                  ? 'Tổng phụ trách'
                  : currentUser.role === 'red_flag'
                  ? 'Đội Cờ đỏ'
                  : currentUser.role === 'teacher'
                  ? 'GV Chủ nhiệm'
                  : 'Học sinh'
                : 'Chưa đăng nhập'}
            </span>
          </div>
          {!isAuthenticated && (
            <p className="text-[10px] text-amber-300/80 mt-1 flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Đã khóa tính năng, chỉ xem Tổng quan</span>
            </p>
          )}
        </div>
      )}

      {/* Navigation Items (Always visible in left column) */}
      <nav className="flex-1 overflow-y-auto px-2 py-2.5 space-y-1 scrollbar-thin scrollbar-thumb-blue-800">
        {menuItems
          .filter((item) => item.id !== 'settings' || currentUser.role === 'admin')
          .map((item) => {
            const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isLocked = !isAuthenticated && item.id !== 'dashboard';

          return (
            <button
              key={item.id}
              disabled={isLocked}
              onClick={() => handleSelect(item.id)}
              title={
                isLocked
                  ? `${item.label} (Đã khóa — Đăng nhập để sử dụng)`
                  : !sidebarOpen
                  ? item.label
                  : undefined
              }
              className={`w-full group relative flex items-center rounded-xl text-xs font-semibold transition-all ${
                sidebarOpen ? 'gap-2.5 px-3 py-2.5 text-left' : 'flex-col justify-center px-1.5 py-2 text-center'
              } ${
                isLocked
                  ? 'opacity-30 cursor-not-allowed text-blue-300/40 hover:bg-transparent pointer-events-none select-none'
                  : isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-950/50'
                  : 'text-blue-100/90 hover:bg-blue-800/50 hover:text-white'
              }`}
            >
              {/* Active Left indicator bar */}
              {isActive && (
                <span className={`absolute left-0 rounded-r-md bg-amber-400 ${
                  sidebarOpen ? 'top-1.5 bottom-1.5 w-1' : 'top-1 bottom-1 w-1'
                }`} />
              )}

              <div className="relative shrink-0 flex items-center justify-center">
                <Icon
                  className={`w-4.5 h-4.5 transition-transform ${
                    isLocked
                      ? 'text-blue-400/30'
                      : isActive
                      ? 'text-amber-300 scale-105'
                      : 'text-blue-300 group-hover:text-white'
                  }`}
                />
                {!sidebarOpen && isLocked && (
                  <span className="absolute -top-1 -right-1.5 text-amber-400/80">
                    <Lock className="w-2.5 h-2.5" />
                  </span>
                )}
                {!sidebarOpen && !isLocked && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 px-1 flex items-center justify-center text-[9px] font-bold rounded-full bg-amber-400 text-blue-950">
                    {item.badge}
                  </span>
                )}
              </div>

              {sidebarOpen ? (
                <>
                  <span className={`truncate flex-1 text-xs ${isLocked ? 'line-through decoration-blue-400/30 text-blue-300/50' : ''}`}>
                    {item.label}
                  </span>
                  {isLocked ? (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-blue-950/80 text-amber-300/80 border border-blue-800/50 flex items-center gap-1 font-normal">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Khóa</span>
                    </span>
                  ) : item.badge !== undefined ? (
                    <span
                      className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-md border ${
                        item.badgeColor || 'bg-blue-700/60 text-white border-blue-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </>
              ) : (
                <span className="text-[9px] leading-tight text-blue-200/90 mt-1 line-clamp-1 w-full font-medium">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      <div className="p-2.5 border-t border-blue-900/50 bg-[#0B1E46] text-blue-200/70">
        {sidebarOpen ? (
          <div className="text-[10px] flex items-center justify-between">
            <span className="truncate">PTDTBT Quản Bạ</span>
            <span className="text-blue-300 font-mono shrink-0">v2.4</span>
          </div>
        ) : (
          <div className="text-center text-[10px] text-blue-300 font-mono">v2.4</div>
        )}
      </div>
    </aside>
  );
};

