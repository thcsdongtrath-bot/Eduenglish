
import React from 'react';
import { View, UserRole } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  userRole: UserRole;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, userRole, onLogout }) => {
  const allMenuItems = [
    { id: View.TEACHER_DASHBOARD, label: 'Bảng điều khiển GV', icon: '🏠', role: UserRole.TEACHER },
    { id: View.CREATE_TEST, label: 'Soạn đề AI', icon: '📝', role: UserRole.TEACHER },
    { id: View.STUDENT_PORTAL, label: 'Cổng học sinh', icon: '🎓', role: UserRole.STUDENT },
    { id: View.ANALYTICS, label: 'Thống kê & Phân tích', icon: '📊', role: UserRole.TEACHER },
  ];

  // Lọc menu dựa trên vai trò
  const menuItems = allMenuItems.filter(item => {
    if (userRole === UserRole.TEACHER) return true; // GV thấy tất cả (để có thể test cổng HS)
    return item.role === UserRole.STUDENT; // HS chỉ thấy cổng HS
  });

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full hidden md:flex shadow-sm">
      <div className="p-6">
        <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2">
          <span>EduAI</span>
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-[0.2em] font-black">English Pro</p>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 font-bold translate-x-1'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${userRole === UserRole.TEACHER ? 'bg-blue-500' : 'bg-emerald-500'}`}>
            {userRole === UserRole.TEACHER ? 'GV' : 'HS'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">
              {userRole === UserRole.TEACHER ? 'Thầy Giáo' : 'Học Sinh'}
            </p>
            <p className="text-[10px] text-slate-400 truncate uppercase font-semibold">
              {userRole === UserRole.TEACHER ? 'Quản trị viên' : 'Thành viên'}
            </p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100"
        >
          <span>🚪</span> Đăng xuất / Đổi vai trò
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
