
import React, { useState, useEffect } from 'react';
import { TestData, StudentResult, Grade } from '../types';

interface StudentPortalProps {
  test: TestData | null;
  onSubmit: (result: StudentResult) => void;
  results: StudentResult[];
}

const StudentPortal: React.FC<StudentPortalProps> = ({ test: initialTest, onSubmit, results }) => {
  const [test, setTest] = useState<TestData | null>(initialTest);
  const [studentInfo, setStudentInfo] = useState({ name: '', class: '' });
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [currentResult, setCurrentResult] = useState<StudentResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [showManualCode, setShowManualCode] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (initialTest) {
      setTest(initialTest);
      setError('');
    }
  }, [initialTest]);

  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.?!,]/g, '');
  };

  const handleManualCodeSubmit = () => {
    try {
      const decodedData = JSON.parse(decodeURIComponent(atob(manualCode)));
      setTest(decodedData);
      setShowManualCode(false);
      setError('');
    } catch (e) {
      setError('Mã đề thi không hợp lệ. Em hãy kiểm tra lại nhé!');
    }
  };

  const loadSampleTest = () => {
    const sample: TestData = {
      title: "ĐỀ THI MẪU - Unit 1: My New School",
      grade: Grade.GRADE_6,
      unit: "Unit 1: My New School",
      duration: 15,
      isPublished: true,
      questions: [
        {
          id: "q1",
          type: "Phonetics",
          instruction: "Choose the word whose underlined part is pronounced differently.",
          content: "A. study  B. subject  C. music  D. lunch",
          options: ["study", "subject", "music", "lunch"],
          answer: "C",
          explanation: "music /uː/, còn lại /ʌ/"
        },
        {
          id: "q2",
          type: "Grammar",
          instruction: "Choose the correct answer.",
          content: "I ___ my homework every afternoon.",
          options: ["do", "does", "am doing", "did"],
          answer: "A",
          explanation: "Hiện tại đơn với chủ ngữ 'I'"
        }
      ]
    };
    setTest(sample);
    setError('');
  };

  const handleStart = () => {
    if (!test || !test.isPublished) {
      setError('Đề thi này hiện đang đóng. Hãy đợi giáo viên mở nhé!');
      return;
    }
    if (!studentInfo.name.trim() || !studentInfo.class.trim()) {
      setError('Hãy nhập Tên và Lớp của bạn trước khi bắt đầu.');
      return;
    }
    setStarted(true);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = () => {
    if (!test) return;
    
    if (Object.keys(answers).length < test.questions.length) {
      if (!confirm("Bạn vẫn còn câu hỏi chưa làm xong. Bạn có chắc muốn nộp bài?")) return;
    }

    let correctCount = 0;
    test.questions.forEach(q => {
      const studentAnswer = answers[q.id] || "";
      if (q.options && q.options.length > 0) {
        if (studentAnswer === q.answer) correctCount++;
      } else {
        if (normalizeString(studentAnswer) === normalizeString(q.answer)) correctCount++;
      }
    });
    
    const rawScore = (correctCount / test.questions.length) * 10;
    const finalScore = Math.round(rawScore * 10) / 10;

    const result: StudentResult = {
      id: Math.random().toString(36).substr(2, 9),
      studentName: studentInfo.name,
      studentClass: studentInfo.class,
      score: finalScore,
      maxScore: 10,
      submittedAt: new Date().toISOString(),
      answers
    };
    
    setCurrentResult(result);
    setFinished(true);
    onSubmit(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (finished && currentResult) {
    const isPassed = currentResult.score >= 5;
    const scoreColor = currentResult.score >= 8 ? 'text-emerald-500' : currentResult.score >= 5 ? 'text-blue-500' : 'text-red-500';
    
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-in zoom-in duration-300 pb-24 px-2 pt-2">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-3 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <div className="text-7xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Hoàn Thành!</h2>
          <p className="text-slate-500 font-bold mb-8 italic">"{currentResult.studentName} đã nộp bài thành công"</p>
          <div className="bg-slate-50 py-10 rounded-[3rem] border border-slate-100 mb-8 shadow-inner">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Số điểm đạt được</p>
            <div className={`text-9xl font-black leading-none ${scoreColor}`}>{currentResult.score}</div>
            <p className="text-slate-400 font-bold mt-4">Điểm tối đa: 10</p>
          </div>
          <button onClick={() => window.location.reload()} className="w-full py-6 bg-slate-900 text-white font-black text-xl rounded-[2rem] shadow-2xl active:scale-95 transition-all">
            QUAY LẠI TRANG CHỦ
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="w-full max-w-md mx-auto px-2 pt-4 pb-20 sm:pt-12">
        <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-500 overflow-hidden relative">
            <div className="text-center mb-10 relative z-10">
                <div className="w-24 h-24 bg-white text-blue-600 rounded-[2.5rem] shadow-xl flex items-center justify-center text-5xl mx-auto mb-6 border border-slate-100">📖</div>
                <h2 className="text-3xl font-black text-slate-900 leading-none">Phòng Thi Online</h2>
                <p className="text-slate-400 mt-3 text-xs font-black uppercase tracking-[0.2em]">Global Success English</p>
            </div>
            
            <div className="space-y-6 relative z-10">
                {!showManualCode ? (
                  <>
                    <div className="space-y-4">
                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-4 transition-colors group-focus-within:text-blue-500">Họ và tên học sinh</label>
                            <input 
                                type="text" 
                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-lg shadow-sm"
                                placeholder="Nhập tên của em..."
                                style={{ fontSize: '16px' }}
                                value={studentInfo.name}
                                onChange={e => { setStudentInfo({...studentInfo, name: e.target.value}); setError(''); }}
                            />
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-4 transition-colors group-focus-within:text-blue-500">Lớp học</label>
                            <input 
                                type="text" 
                                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-center text-lg uppercase shadow-sm"
                                placeholder="Ví dụ: 6A1"
                                style={{ fontSize: '16px' }}
                                value={studentInfo.class}
                                onChange={e => { setStudentInfo({...studentInfo, class: e.target.value}); setError(''); }}
                            />
                        </div>
                    </div>

                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest">{error}</div>}

                    {(!test || !test.isPublished) ? (
                        <div className="space-y-4">
                            <div className="p-6 bg-slate-900 text-white rounded-[2rem] text-sm font-bold text-center leading-relaxed shadow-xl">
                                👋 Chưa thấy đề thi tự động tải lên...
                            </div>
                            <button 
                                onClick={() => setShowManualCode(true)}
                                className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-lg transition-all text-sm uppercase tracking-widest active:scale-95"
                            >
                                NHẬP MÃ ĐỀ THI ⌨️
                            </button>
                            <button 
                                onClick={loadSampleTest}
                                className="w-full py-3 text-slate-400 font-bold transition-all text-[10px] uppercase tracking-widest active:scale-95"
                            >
                                Hoặc làm đề mẫu thử nghiệm
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3">
                               <span className="text-xl animate-pulse">📝</span>
                               <div className="overflow-hidden">
                                  <p className="text-[10px] font-black uppercase opacity-60">Đã tìm thấy đề:</p>
                                  <p className="text-sm font-black truncate">{test.title}</p>
                               </div>
                            </div>
                            <button 
                                disabled={!studentInfo.name || !studentInfo.class}
                                onClick={handleStart}
                                className="w-full py-6 bg-emerald-600 text-white font-black text-xl rounded-[2rem] hover:bg-emerald-700 shadow-2xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                            >
                                BẮT ĐẦU LÀM BÀI ⚡
                            </button>
                        </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                    <button onClick={() => setShowManualCode(false)} className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">← Quay lại</button>
                    <h3 className="text-xl font-black text-slate-900">Dán Mã Đề Thi</h3>
                    <p className="text-xs text-slate-500 font-medium">Nếu link giáo viên gửi bị lỗi, em hãy dán mã đề thi vào đây.</p>
                    <textarea 
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-mono text-[10px] focus:border-blue-500 outline-none"
                      rows={5}
                      placeholder="Dán mã đề tại đây..."
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                    ></textarea>
                    <button 
                      onClick={handleManualCodeSubmit}
                      className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
                    >
                      TẢI ĐỀ THI 🚀
                    </button>
                  </div>
                )}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-40 px-2 pt-2 animate-in fade-in duration-500">
      <header className="bg-white/90 backdrop-blur-md p-4 rounded-[1.5rem] border border-white shadow-xl flex justify-between items-center sticky top-2 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0">{test?.grade}</div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 truncate max-w-[120px]">{test?.title}</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase">{studentInfo.name} • Lớp {studentInfo.class}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-red-50 rounded-xl border border-red-100 text-center shrink-0">
             <span className="text-[8px] font-black text-red-400 block uppercase">Thời gian</span>
             <span className="text-sm font-mono font-black text-red-600">{test?.duration}:00</span>
        </div>
      </header>

      <div className="space-y-6 mt-6">
        {test?.questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative group">
            <div className="absolute top-0 left-0 w-2 h-full bg-slate-50 group-focus-within:bg-blue-500 transition-colors"></div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase">Câu {idx + 1}</span>
                 <span className="text-[10px] font-black text-blue-500 uppercase bg-blue-50 px-3 py-1 rounded-full">{q.type}</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <p className="text-slate-400 text-[10px] italic font-bold mb-2">📌 Chỉ dẫn: {q.instruction}</p>
                   <p className="text-lg font-bold text-slate-900 leading-relaxed">{q.content}</p>
                </div>
                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const label = String.fromCharCode(65 + optIdx);
                      const isSelected = answers[q.id] === label;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setAnswers({...answers, [q.id]: label})}
                          className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 text-left transition-all ${
                            isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-slate-50'
                          }`}
                        >
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 ${
                             isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-300 border-slate-100'
                          }`}>{label}</span>
                          <span className={`text-base font-bold ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    rows={3}
                    className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-lg"
                    placeholder="Viết câu trả lời của em vào đây..."
                    style={{ fontSize: '16px' }}
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                  ></textarea>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex flex-col items-center z-50">
        <button 
          onClick={handleSubmit}
          className="w-full max-w-md py-6 bg-emerald-600 text-white font-black text-xl rounded-[2rem] shadow-2xl shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-4"
        >
          <span className="tracking-widest uppercase">Nộp bài ngay</span>
          <span className="text-2xl">📤</span>
        </button>
      </div>
    </div>
  );
};

export default StudentPortal;
