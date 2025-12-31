
import React, { useState } from 'react';
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
  const [copyStatus, setCopyStatus] = useState<'idle' | 'link' | 'code'>('idle');

  const getEncodedData = () => {
    if (!activeTest) return '';
    const testToShare = { ...activeTest, isPublished: true };
    return btoa(encodeURIComponent(JSON.stringify(testToShare)));
  };

  const handleCopyLink = () => {
    const encodedData = getEncodedData();
    const shareUrl = `${window.location.origin}${window.location.pathname}?role=student&testData=${encodedData}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyStatus('link');
      setTimeout(() => setCopyStatus('idle'), 3000);
    });
  };

  const handleCopyCode = () => {
    const encodedData = getEncodedData();
    navigator.clipboard.writeText(encodedData).then(() => {
      setCopyStatus('code');
      setTimeout(() => setCopyStatus('idle'), 3000);
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Quản lý lớp học 👨‍🏫</h2>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Hệ thống tự động lưu trữ kết quả của học sinh.</p>
        </div>
        <button 
          onClick={onCreateClick}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>✨</span> Soạn đề mới
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
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

          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={onTogglePublish}
                className={`px-8 py-5 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  activeTest.isPublished 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {activeTest.isPublished ? (
                  <><span className="text-2xl">⏹️</span> Dừng giao bài</>
                ) : (
                  <><span className="text-2xl">🚀</span> Mở bài thi cho HS</>
                )}
              </button>
              
              <button 
                onClick={handleCopyLink}
                className={`px-8 py-5 rounded-2xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 ${
                  copyStatus === 'link' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copyStatus === 'link' ? (
                  <><span className="text-2xl">✅</span> Đã chép link!</>
                ) : (
                  <><span className="text-2xl">🔗</span> Chép link gửi HS</>
                )}
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Mã đề dự phòng (Nếu link Zalo bị lỗi)</span>
                  <button 
                    onClick={handleCopyCode}
                    className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                  >
                    {copyStatus === 'code' ? 'Đã chép mã!' : 'Chép mã đề'}
                  </button>
               </div>
               <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[10px] text-slate-400 break-all line-clamp-2">
                 {getEncodedData()}
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100 pt-6">
              <button 
                onClick={() => window.open('/?role=student', '_blank')}
                className="w-full sm:w-auto px-6 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all text-sm"
              >
                👁️ Xem trước giao diện HS
              </button>
              <button 
                onClick={onDeleteTest}
                className="w-full sm:w-auto px-6 py-2 text-red-400 font-bold hover:bg-red-50 rounded-xl transition-all text-sm"
              >
                🗑️ Xóa đề thi này
              </button>
            </div>
          </div>
        </div>
      )}

      {!activeTest && (
        <div className="py-20 text-center bg-white rounded-[2.5rem] border-4 border-dashed border-slate-100">
           <div className="text-7xl mb-6">✍️</div>
           <h3 className="text-2xl font-black text-slate-900">Sẵn sàng soạn đề chưa?</h3>
           <p className="text-slate-500 mt-2 max-w-sm mx-auto px-4 font-medium">Sử dụng trí tuệ nhân tạo để tạo đề kiểm tra bám sát chương trình Global Success 2018.</p>
           <button 
             onClick={onCreateClick}
             className="mt-10 px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-lg hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:-translate-y-1 active:scale-95"
           >
             + Bắt đầu soạn đề ngay
           </button>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
