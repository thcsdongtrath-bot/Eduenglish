
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
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
      <div className="w-full max-w-4xl">
        {!showPasswordInput ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 animate-in fade-in zoom-in duration-300">
            {/* Thẻ Giáo viên */}
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-2xl border-4 border-transparent hover:border-blue-500 transition-all cursor-pointer group"
                 onClick={handleTeacherClick}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-blue-100 text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">👨‍🏫</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Tôi là Giáo viên</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Soạn đề bằng AI, quản lý lớp học và phân tích kết quả chi tiết.</p>
              <div className="mt-6 sm:mt-8 flex items-center gap-2 text-blue-600 font-bold text-sm sm:text-base">
                Yêu cầu mật khẩu <span>🔒</span>
              </div>
            </div>

            {/* Thẻ Học sinh */}
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-2xl border-4 border-transparent hover:border-emerald-500 transition-all cursor-pointer group"
                 onClick={() => onSelect(UserRole.STUDENT)}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">🎓</div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">Tôi là Học sinh</h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">Vào làm bài kiểm tra trực tuyến và nhận kết quả ngay lập tức.</p>
              <div className="mt-6 sm:mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm sm:text-base">
                Vào làm bài ngay <span>→</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <button 
              onClick={() => setShowPasswordInput(false)}
              className="mb-6 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-xs font-bold"
            >
              ← Quay lại
            </button>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-6">Xác thực Giáo viên</h2>
            
            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <input 
                type="password" 
                autoFocus
                placeholder="Mật khẩu..."
                className={`w-full p-4 bg-slate-50 border-2 rounded-xl outline-none focus:ring-4 transition-all font-bold text-center tracking-widest ${error ? 'border-red-200 focus:ring-red-50' : 'border-slate-100 focus:ring-blue-50 focus:border-blue-400'}`}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
              />
              {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase">{error}</p>}
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
              >
                Xác nhận
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;
