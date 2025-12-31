
import React from 'react';
import { TestData } from '../types';

interface TeacherDashboardProps {
  activeTest: TestData | null;
  resultsCount: number;
  onCreateClick: () => void;
  onTogglePublish: () => void;
  onDeleteTest: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  activeTest, 
  resultsCount, 
  onCreateClick, 
  onTogglePublish,
  onDeleteTest
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Quản lý lớp học 👨‍🏫</h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Hệ thống tự động lưu trữ kết quả của học sinh.</p>
        </div>
        <button 
          onClick={onCreateClick}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
        >
          <span>✨</span> Soạn đề mới
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">📚</div>
          <h3 className="text-lg font-bold text-slate-900">Đề đang soạn</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{activeTest ? 1 : 0}</p>
          <p className="text-sm text-slate-500 mt-1">Sẵn sàng để giao bài</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">✅</div>
          <h3 className="text-lg font-bold text-slate-900">Lượt nộp bài</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{resultsCount}</p>
          <p className="text-sm text-slate-500 mt-1">Học sinh đã hoàn thành</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl mb-4">📢</div>
          <h3 className="text-lg font-bold text-slate-900">Trạng thái</h3>
          <p className={`text-xl font-bold mt-2 ${activeTest?.isPublished ? 'text-emerald-600' : 'text-slate-400'}`}>
            {activeTest?.isPublished ? 'Đang mở bài thi' : 'Đang đóng'}
          </p>
        </div>
      </div>

      {activeTest && (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 sm:p-8 bg-slate-900 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black shrink-0">
                {activeTest.grade}
              </div>
              <div className="text-center sm:text-left overflow-hidden">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Đề kiểm tra khối {activeTest.grade}</span>
                <h3 className="text-xl sm:text-2xl font-black mt-1 truncate">{activeTest.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">{activeTest.unit} • {activeTest.questions.length} câu hỏi</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onTogglePublish}
                className={`flex-1 px-8 py-4 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                  activeTest.isPublished 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-1'
                }`}
              >
                {activeTest.isPublished ? (
                  <><span className="text-2xl">⏹️</span> Dừng giao bài</>
                ) : (
                  <><span className="text-2xl">🚀</span> Mở bài thi cho HS</>
                )}
              </button>
              
              <button 
                onClick={() => window.open('/?role=student', '_blank')}
                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
              >
                <span className="text-2xl">👁️</span> Xem trước (HS)
              </button>
            </div>

            <div className="flex justify-center sm:justify-end mt-4">
              <button 
                onClick={onDeleteTest}
                className="px-6 py-2 text-red-400 font-bold hover:bg-red-50 rounded-xl transition-all text-sm"
              >
                🗑️ Xóa đề thi này
              </button>
            </div>
          </div>

          <div className="px-6 sm:px-8 pb-8">
            <div className={`p-4 rounded-2xl flex items-center gap-3 border ${activeTest.isPublished ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
              <span className="text-xl">{activeTest.isPublished ? '✅' : '🔒'}</span>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {activeTest.isPublished 
                  ? "Học sinh chỉ cần chọn vai trò 'Học sinh', nhập tên và lớp là có thể làm bài ngay."
                  : "Bài thi đang đóng. Học sinh sẽ không thể bắt đầu làm bài cho đến khi bạn 'Mở bài thi'."}
              </p>
            </div>
          </div>
        </div>
      )}

      {!activeTest && (
        <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
           <div className="text-6xl mb-6">📝</div>
           <h3 className="text-xl font-bold text-slate-900">Bạn chưa có đề thi nào</h3>
           <p className="text-slate-500 mt-2 max-w-sm mx-auto px-4">Hãy sử dụng AI để tạo ra một đề kiểm tra chất lượng cao theo chuẩn 2018 chỉ trong 30 giây!</p>
           <button 
             onClick={onCreateClick}
             className="mt-8 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl transition-all"
           >
             + Soạn đề ngay bây giờ
           </button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
