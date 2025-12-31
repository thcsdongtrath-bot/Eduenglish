
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StudentResult, TestData } from '../types';
import { analyzeResults } from '../services/geminiService';

interface AnalyticsDashboardProps {
  results: StudentResult[];
  test: TestData | null;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ results, test }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  // Sử dụng useMemo để tính toán lại dữ liệu biểu đồ mỗi khi results thay đổi
  const scoreData = useMemo(() => [
    { name: '0-2', count: results.filter(r => r.score <= 2).length },
    { name: '2-5', count: results.filter(r => r.score > 2 && r.score <= 5).length },
    { name: '5-8', count: results.filter(r => r.score > 5 && r.score <= 8).length },
    { name: '8-10', count: results.filter(r => r.score > 8).length },
  ], [results]);

  const passRate = useMemo(() => 
    results.length > 0 ? (results.filter(r => r.score >= 5).length / results.length) * 100 : 0
  , [results]);
  
  const pieData = useMemo(() => [
    { name: 'Đạt', value: passRate },
    { name: 'Chưa đạt', value: 100 - passRate },
  ], [passRate]);

  const COLORS = ['#10b981', '#ef4444'];

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (results.length > 0) {
        setAnalyzing(true);
        try {
          const text = await analyzeResults(results);
          setAiAnalysis(text || '');
        } catch (e) {
          console.error(e);
          setAiAnalysis('Không thể kết nối AI để phân tích. Vui lòng thử lại sau.');
        } finally {
          setAnalyzing(false);
        }
      }
    };
    fetchAnalysis();
  }, [results.length]); // Chỉ chạy lại phân tích AI khi số lượng bài nộp thay đổi

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Thống kê thông minh 📊</h2>
          <p className="text-slate-500">Cập nhật tự động khi có học sinh nộp bài</p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Đang trực tuyến
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">📈</span>
            Phân bố điểm số
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:shadow-md">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-sm">🎯</span>
            Tỉ lệ Đạt / Chưa đạt
          </h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-bold text-slate-600">Đạt: {passRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-bold text-slate-600">Chưa đạt: {(100 - passRate).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <span className="text-3xl">✨</span> Phân tích năng lực từ Gemini AI
            </h3>
            {analyzing && (
              <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="text-xs font-bold animate-pulse">Đang xử lý dữ liệu...</span>
              </div>
            )}
          </div>
          
          <div className="prose prose-invert max-w-none">
            {aiAnalysis ? (
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10">
                 <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-medium">{aiAnalysis}</p>
              </div>
            ) : (
              <div className="text-center py-10 opacity-50">
                <p className="text-lg">Chưa có đủ dữ liệu để AI thực hiện phân tích chuyên sâu.</p>
                <p className="text-sm mt-2 font-bold uppercase tracking-widest">Hệ thống cần ít nhất 1 bài nộp</p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-xl text-slate-900">Danh sách nộp bài ({results.length})</h3>
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Thời gian thực</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Học sinh</th>
                <th className="px-8 py-5 text-center">Lớp</th>
                <th className="px-8 py-5 text-center">Điểm số</th>
                <th className="px-8 py-5">Thời gian nộp</th>
                <th className="px-8 py-5">Xếp loại</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {results.length > 0 ? [...results].reverse().map(r => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900">{r.studentName}</td>
                  <td className="px-8 py-5 text-slate-600 text-center font-bold">{r.studentClass}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-lg font-black ${r.score >= 8 ? 'text-emerald-600' : r.score >= 5 ? 'text-blue-600' : 'text-red-600'}`}>
                      {r.score}
                    </span>
                    <span className="text-slate-300 text-[10px] font-bold">/10</span>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium">
                    {new Date(r.submittedAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      r.score >= 8 ? 'bg-emerald-100 text-emerald-700' : 
                      r.score >= 6.5 ? 'bg-blue-100 text-blue-700' : 
                      r.score >= 5 ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {r.score >= 8 ? 'Giỏi' : r.score >= 6.5 ? 'Khá' : r.score >= 5 ? 'Trung bình' : 'Yếu'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">
                    Chưa có học sinh nào nộp bài...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
