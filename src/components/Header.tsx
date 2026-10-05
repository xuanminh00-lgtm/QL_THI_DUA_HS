import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolEmblem } from './SchoolEmblem';
import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  UserCheck,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  CheckCheck,
  Smartphone,
  LogOut,
  LogIn,
  KeyRound,
  Shield,
  X,
  User as UserIcon,
  Lock,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    allUsers,
    redFlags,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sidebarOpen,
    setSidebarOpen,
    setActiveTab,
    isAuthenticated,
    login,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Login form: ONLY 2 inputs: Tài khoản & Mật khẩu
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Change password modal
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userVal = usernameInput.trim().toLowerCase();
    const passVal = passwordInput.trim();

    if (!userVal) {
      setLoginError('Vui lòng nhập tên tài khoản.');
      return;
    }

    if (!passVal) {
      setLoginError('Vui lòng nhập mật khẩu.');
      return;
    }

    // 1. Check in allUsers by username, name, or id
    let matchedUser = allUsers.find(
      (u) =>
        u.username.toLowerCase() === userVal ||
        u.name.toLowerCase() === userVal ||
        u.id.toLowerCase() === userVal
    );

    // 2. Check in redFlags if not found
    if (!matchedUser && redFlags) {
      const rf = redFlags.find(
        (r) =>
          r.account.toLowerCase() === userVal ||
          r.code.toLowerCase() === userVal ||
          r.name.toLowerCase() === userVal
      );
      if (rf) {
        matchedUser = {
          id: `u-${rf.id}`,
          name: rf.name,
          username: rf.account,
          role: 'red_flag',
          title: `Cờ đỏ Lớp ${rf.className}`,
          className: rf.className,
        };
      }
    }

    // 3. Aliases
    if (!matchedUser) {
      if (userVal === 'admin' || userVal === 'tpt') {
        matchedUser = allUsers.find((u) => u.role === 'admin') || allUsers[0];
      } else if (userVal === 'codo' || userVal === 'codoan') {
        matchedUser = allUsers.find((u) => u.role === 'red_flag') || allUsers[3];
      } else if (userVal === 'gv' || userVal === 'gvcn') {
        matchedUser = allUsers.find((u) => u.role === 'teacher') || allUsers[2];
      } else if (userVal === 'bgh' || userVal === 'hieutruong') {
        matchedUser = allUsers.find((u) => u.role === 'bgh') || allUsers[1];
      } else if (userVal === 'hocsinh' || userVal === 'lop7a') {
        matchedUser = allUsers.find((u) => u.role === 'student') || allUsers[4];
      }
    }

    if (!matchedUser) {
      setLoginError('Tài khoản không tồn tại. Vui lòng kiểm tra lại tên đăng nhập.');
      return;
    }

    login(matchedUser);
    setShowLoginModal(false);
    setUsernameInput('');
    setPasswordInput('');
    setLoginError(null);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);

    if (!currentPassword) {
      setChangePasswordError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError('Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangePasswordError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setChangePasswordSuccess(true);
    setTimeout(() => {
      setChangePasswordSuccess(false);
      setShowChangePasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#0A1E42] via-[#0E2C68] to-[#133D8D] text-white border-b border-blue-900/60 shadow-md px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Menu toggle + School Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-1 text-blue-200 hover:text-white hover:bg-blue-800/60 rounded-xl focus:outline-hidden transition-colors"
            title={sidebarOpen ? 'Thu gọn cột chức năng bên trái' : 'Mở rộng cột chức năng bên trái'}
            aria-label="Thu gọn hoặc mở rộng cột menu chức năng"
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <SchoolEmblem size={44} className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 drop-shadow-md" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight leading-tight truncate drop-shadow-xs">
                QUẢN LÝ THI ĐUA NỀ NẾP HỌC SINH
              </h1>
              <p className="text-[11px] sm:text-xs font-semibold text-blue-200/90 tracking-wide truncate">
                TRƯỜNG PTDTBT TH&THCS QUẢN BẠ
              </p>
            </div>
          </div>
        </div>

        {/* Right: Slogans + 2 Auth Buttons + Notifications + User Profile */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Core Values */}
          <div className="hidden 2xl:flex items-center gap-2 text-xs font-medium text-blue-100 bg-blue-950/60 px-3.5 py-1.5 rounded-lg border border-blue-500/30 shadow-inner">
            <span className="text-amber-300 font-bold">Hiệu quả</span>
            <span className="text-blue-400">·</span>
            <span className="text-emerald-300 font-bold">Minh bạch</span>
            <span className="text-blue-400">·</span>
            <span className="text-cyan-300 font-bold">Công bằng</span>
            <span className="text-blue-400">·</span>
            <span className="text-sky-300 font-bold">Kịp thời</span>
          </div>

          {/* Quick link: Cờ đỏ mobile input mode shortcut */}
          <button
            disabled={!isAuthenticated}
            onClick={() => setActiveTab('grading_mobile')}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors shadow-xs ${
              isAuthenticated
                ? 'text-white bg-blue-600/60 hover:bg-blue-500/70 border border-blue-400/40 cursor-pointer'
                : 'opacity-30 cursor-not-allowed bg-transparent text-blue-300/50 border border-transparent pointer-events-none select-none'
            }`}
            title={isAuthenticated ? 'Mở giao diện nhập điểm cho Cờ đỏ' : 'Đã khóa — Đăng nhập để sử dụng giao diện Cờ đỏ'}
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden lg:inline">Giao diện Cờ đỏ</span>
            {!isAuthenticated && <Lock className="w-3 h-3 text-amber-300/80" />}
          </button>

          {/* 2 NÚT ĐĂNG NHẬP & ĐĂNG XUẤT (THEO YÊU CẦU: Nếu đã đăng nhập thì nút đăng nhập mờ đi chỉ có nút đăng xuất; Nếu đã đăng xuất thì nút đăng xuất mờ đi chỉ có nút đăng nhập sáng) */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-950/50 p-1 rounded-xl border border-blue-800/40">
            {/* Nút Đăng nhập */}
            <button
              disabled={isAuthenticated}
              onClick={() => setShowLoginModal(true)}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isAuthenticated
                  ? 'bg-amber-400 hover:bg-amber-300 text-blue-950 cursor-pointer shadow-md ring-2 ring-amber-300/40'
                  : 'opacity-30 cursor-not-allowed bg-transparent text-blue-300/70 border border-transparent pointer-events-none'
              }`}
              title={!isAuthenticated ? 'Nhấn để đăng nhập vào hệ thống' : 'Bạn đã đăng nhập'}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </button>

            {/* Nút Đăng xuất */}
            <button
              disabled={!isAuthenticated}
              onClick={() => {
                setShowUserMenu(false);
                logout();
              }}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isAuthenticated
                  ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md'
                  : 'opacity-30 cursor-not-allowed bg-transparent text-blue-300/70 border border-transparent pointer-events-none'
              }`}
              title={isAuthenticated ? 'Nhấn để đăng xuất khỏi hệ thống' : 'Bạn chưa đăng nhập'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              disabled={!isAuthenticated}
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative p-2 rounded-xl transition-colors ${
                isAuthenticated
                  ? 'text-blue-200 hover:text-white hover:bg-blue-800/60 cursor-pointer'
                  : 'opacity-30 cursor-not-allowed text-blue-300/50 pointer-events-none'
              }`}
              title={isAuthenticated ? 'Thông báo hệ thống' : 'Đăng nhập để xem thông báo'}
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {isAuthenticated && unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white p-3 shadow-2xl border border-blue-200 z-50 text-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-semibold text-sm text-blue-950">Thông báo hệ thống</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Đã đọc tất cả
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400">Không có thông báo mới</p>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          markNotificationAsRead(item.id);
                          if (item.linkModule) {
                            setActiveTab(item.linkModule as any);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer hover:bg-blue-50/50 ${
                          !item.read ? 'bg-blue-50/80 border-l-2 border-blue-600' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Role Switcher - Chỉ hiển thị tên và menu sổ xuống khi đã đăng nhập */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-blue-800/50 transition-colors text-left border border-blue-500/20 cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-400 text-blue-950 flex items-center justify-center font-black text-xs shadow-xs border border-amber-300 shrink-0">
                  {currentUser.name
                    .split(' ')
                    .slice(-2)
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight flex items-center gap-1">
                    <span className="truncate max-w-[120px]">{currentUser.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
                  </div>
                  <div className="text-[10px] text-blue-200 font-medium leading-none mt-0.5 truncate max-w-[120px]">
                    {currentUser.title || currentUser.role}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white p-3 shadow-2xl border border-blue-200 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-100">
                  <div className="pb-2.5 mb-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-blue-950">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.title || currentUser.role}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Đã đăng nhập trực tuyến
                      </span>
                    </div>
                  </div>

                  {/* Không còn danh sách tài khoản mà chỉ hiện lên dòng đổi mật khẩu */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowChangePasswordModal(true);
                        setChangePasswordError(null);
                        setChangePasswordSuccess(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer border border-transparent hover:border-blue-200"
                    >
                      <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Đổi mật khẩu</span>
                    </button>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                    {currentUser.role === 'admin' ? (
                      <button
                        onClick={() => {
                          setActiveTab('settings');
                          setShowUserMenu(false);
                        }}
                        className="text-xs text-blue-700 hover:underline font-semibold cursor-pointer"
                      >
                        Cài đặt hệ thống
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Tài khoản thành viên</span>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Khi đã đăng xuất: Trạng thái góc trên bên phải KHÔNG hiện tên và KHÔNG có chức năng sổ xuống */
            <div
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-300/80 text-xs select-none cursor-default"
              title="Bạn hiện chưa đăng nhập vào hệ thống"
            >
              <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></span>
              <span className="font-semibold text-[11px] text-blue-200/90 whitespace-nowrap">Chưa đăng nhập</span>
            </div>
          )}
        </div>
      </div>

      {/* LOGIN MODAL: CHỈ HIỆN 2 Ô TÀI KHOẢN VÀ MẬT KHẨU */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-blue-300 shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-xs">
                  <LogIn className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase">ĐĂNG NHẬP HỆ THỐNG NỀ NẾP</h3>
                  <p className="text-[11px] text-blue-200">Trường PTDTBT TH&THCS Quản Bạ</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError(null);
                }}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmLogin} className="p-5 space-y-4 text-xs">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Ô 1: TÀI KHOẢN */}
              <div>
                <label className="block font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-blue-700" />
                  <span>Tài khoản:</span>
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setLoginError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium text-xs text-slate-900 placeholder:text-slate-400 transition-all"
                  placeholder="Nhập tên tài khoản (VD: tongphutrach, codo_an, admin...)"
                  required
                  autoFocus
                />
              </div>

              {/* Ô 2: MẬT KHẨU */}
              <div>
                <label className="block font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-700" />
                  <span>Mật khẩu:</span>
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs text-slate-900 placeholder:text-slate-400 transition-all"
                  placeholder="Nhập mật khẩu..."
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <span>Mật khẩu mặc định:</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">123456</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginError(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Đăng nhập</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ĐỔI MẬT KHẨU */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border-2 border-blue-300 shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden text-slate-800 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0F275A] to-[#183B7E] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-xs">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase">ĐỔI MẬT KHẨU TÀI KHOẢN</h3>
                  <p className="text-[11px] text-blue-200">{currentUser.name} (@{currentUser.username})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowChangePasswordModal(false);
                  setChangePasswordError(null);
                  setChangePasswordSuccess(false);
                }}
                className="p-1 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-5 space-y-4 text-xs">
              {changePasswordSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center gap-2 font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đổi mật khẩu thành công!</span>
                </div>
              )}

              {changePasswordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{changePasswordError}</span>
                </div>
              )}

              {/* Mật khẩu hiện tại */}
              <div>
                <label className="block font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mật khẩu hiện tại:</span>
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    setChangePasswordError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs text-slate-900"
                  placeholder="Nhập mật khẩu hiện tại (mặc định: 123456)..."
                  required
                />
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mật khẩu mới:</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setChangePasswordError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs text-slate-900"
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)..."
                  required
                />
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div>
                <label className="block font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Xác nhận mật khẩu mới:</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setChangePasswordError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono text-xs text-slate-900"
                  placeholder="Nhập lại mật khẩu mới..."
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setChangePasswordError(null);
                    setChangePasswordSuccess(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={changePasswordSuccess}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{changePasswordSuccess ? 'Đã cập nhật' : 'Lưu mật khẩu mới'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
