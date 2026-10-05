import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';

// Views
import { DashboardView } from './views/DashboardView';
import { WeekManagementView } from './views/WeekManagementView';
import { ClassManagementView } from './views/ClassManagementView';
import { RedFlagManagementView } from './views/RedFlagManagementView';
import { AssignmentView } from './views/AssignmentView';
import { CriteriaView } from './views/CriteriaView';
import { ViolationsCatalogView } from './views/ViolationsCatalogView';
import { GradingMobileView } from './views/GradingMobileView';
import { ApprovalsView } from './views/ApprovalsView';
import { RankingsView } from './views/RankingsView';
import { ReportsView } from './views/ReportsView';
import { MinutesView } from './views/MinutesView';
import { SettingsView } from './views/SettingsView';

const MainContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  const renderActiveView = () => {
    // Khi admin hoặc các tài khoản khác đã đăng xuất thì tất cả các tính năng sẽ bị khóa, mờ đi, trừ mỗi trang tổng quan thôi
    if (!isAuthenticated && activeTab !== 'dashboard') {
      return <DashboardView />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'weeks':
        return <WeekManagementView />;
      case 'classes':
        return <ClassManagementView />;
      case 'redflags':
        return <RedFlagManagementView />;
      case 'assignments':
        return <AssignmentView />;
      case 'criteria':
        return <CriteriaView />;
      case 'violations':
        return <ViolationsCatalogView />;
      case 'grading_mobile':
        return <GradingMobileView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'rankings':
        return <RankingsView />;
      case 'reports':
        return <ReportsView />;
      case 'minutes':
        return <MinutesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#E1EDFB] via-[#EBF3FC] to-[#DBEAFE] text-slate-800">
      {/* Sidebar: Always visible in the left column */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header />

        {/* Viewport Content */}
        <main className="flex-1 p-3 sm:p-6 lg:p-7 max-w-7xl w-full mx-auto pb-8 sm:pb-10">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
