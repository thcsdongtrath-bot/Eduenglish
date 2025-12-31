
import React, { useState } from 'react';
import { UserRole } from '../types';

interface RoleSelectorProps {
  onSelect: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelect }) => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const TEACHER_PASSWORD = 'gv2024';

  const handleTeacherClick = () => {
    setShowPasswordInput(true);
    setError('');
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEACHER_PASSWORD) {
      onSelect(UserRole.TEACHER);
    } else {
      setError('Mật khẩu không chính xác!');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl my-auto py-8">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
           <h1 className="text-4xl sm:text-6xl font-black text-white mb-2">EduAI <span className="text-blue-500">English</span></h1>
           <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Global Success 2018 Assistant</p>
        </div>

        {!showPasswordInput ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 animate-in fade-in zoom-in duration-500">
            {/* Thẻ Giáo viên */}
            <button className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border-4 border-transparent hover:border-blue-500 transition-all cursor-pointer group text-left w-full"
                 onClick={handleTeacherClick}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-6 group-hover:scale-110 transition-transform">👨‍🏫</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Tôi là Giáo viên</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Soạn đề bằng AI, quản lý lớp học và phân tích kết quả.</p>
              <div className="mt-8 flex items-center gap-2 text-blue-600 font-black">
                Dành cho Thầy/Cô 🔒
              </div>
            </button>

            {/* Thẻ Học sinh */}
            <button className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border-4 border-transparent hover:border-emerald-500 transition-all cursor-pointer group text-left w-full"
                 onClick={() => onSelect(UserRole.STUDENT)}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-6 group-hover:scale-110 transition-transform">🎓</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Tôi là Học sinh</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Vào phòng thi, làm bài trực tuyến và xem điểm ngay.</p>
              <div className="mt-8 flex items-center gap-2 text-emerald-600 font-black text-lg">
                VÀO LÀM BÀI NGAY ⚡
              </div>
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white p-8 sm:p-12 rounded-[3rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
            <button 
              onClick={() => setShowPasswordInput(false)}
              className="mb-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-black uppercase tracking-widest"
            >
              ← Quay lại
            </button>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Xác thực Giáo viên</h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">Vui lòng nhập mật khẩu để quản lý đề thi.</p>
            
            <form onSubmit={handleVerifyPassword} className="space-y-6">
              <input 
                type="password" 
                autoFocus
                placeholder="Nhập mật khẩu..."
                className={`w-full p-5 bg-slate-50 border-2 rounded-2xl outline-none focus:ring-4 transition-all font-black text-center text-xl tracking-widest ${error ? 'border-red-200 focus:ring-red-50' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-400'}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
              {error && <p className="text-red-500 text-xs font-black text-center uppercase tracking-widest animate-bounce">{error}</p>}
              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 text-white font-black text-lg rounded-2xl hover:bg-blue-700 shadow-xl active:scale-95 transition-all"
              >
                XÁC NHẬN TRUY CẬP
              </button>
            </form>
            <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gợi ý: gv2024</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
