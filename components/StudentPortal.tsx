
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

  // Tự động cập nhật test nếu props thay đổi
  useEffect(() => {
    setTest(initialTest);
  }, [initialTest]);

  const normalizeString = (str: string) => {
    return str.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.?!,]/g, '');
  };

  const loadSampleTest = () => {
    const sample: TestData = {
      title: "KIỂM TRA THỬ NGHIỆM - Unit 1: My New School",
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
      setError('Hiện tại chưa có bài thi nào được mở.');
      return;
    }
    if (!studentInfo.name.trim() || !studentInfo.class.trim()) {
      setError('Hãy nhập Tên và Lớp của bạn nhé!');
      return;
    }
    setStarted(true);
    setError('');
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    if (!test) return;
    
    if (Object.keys(answers).length < test.questions.length) {
      if (!confirm("Bạn chưa trả lời hết các câu hỏi. Vẫn muốn nộp bài chứ?")) return;
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
      <div className="w-full max-w-2xl mx-auto space-y-6 animate-in zoom-in duration-300 pb-24 px-4 pt-4">
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-3 ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Kết Quả Bài Làm</h2>
          <p className="text-slate-500 font-bold mb-8">
            Học sinh: {currentResult.studentName} • Lớp: {currentResult.studentClass}
          </p>
          
          <div className="bg-slate-50 py-10 rounded-[2rem] border border-slate-100 mb-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Điểm của bạn</p>
            <div className={`text-8xl font-black ${scoreColor}`}>{currentResult.score}</div>
            <p className="text-slate-400 font-bold mt-2">Thang điểm 10</p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            THOÁT PHÒNG THI
          </button>
        </div>

        <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 px-2 flex items-center gap-2">
                <span>📝</span> Xem lại đáp án
            </h3>
            {test?.questions.map((q, idx) => {
                const studentAns = answers[q.id] || "";
                const isCorrect = q.options && q.options.length > 0 
                ? studentAns === q.answer 
                : normalizeString(studentAns) === normalizeString(q.answer);

                return (
                <div key={q.id} className={`p-6 rounded-[1.5rem] border-2 bg-white shadow-sm ${isCorrect ? 'border-emerald-100' : 'border-red-100'}`}>
                    <div className="flex gap-4">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0 text-sm ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {idx + 1}
                        </span>
                        <div className="space-y-3 flex-1">
                            <p className="font-bold text-slate-900 text-sm sm:text-base">{q.content}</p>
                            <div className="text-xs font-bold space-y-1">
                                <div className={isCorrect ? 'text-emerald-600' : 'text-red-600'}>
                                    Bạn chọn: {studentAns || "Chưa trả lời"}
                                </div>
                                {!isCorrect && <div className="text-blue-600">Đáp án đúng: {q.answer}</div>}
                                <div className="text-slate-400 italic mt-2 font-medium">Giải thích: {q.explanation}</div>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="w-full max-w-md mx-auto px-4 pt-8 pb-20">
        <div className="bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="text-center mb-10">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-6 border border-blue-100 shadow-sm">✍️</div>
                <h2 className="text-3xl font-black text-slate-900">Vào Phòng Thi</h2>
                <p className="text-slate-400 mt-2 text-xs font-black uppercase tracking-widest">Global Success English</p>
            </div>
            
            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-3">Họ và tên của em</label>
                        <input 
                            type="text" 
                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-lg"
                            placeholder="Nguyễn Văn A"
                            style={{ fontSize: '16px' }}
                            value={studentInfo.name}
                            onChange={e => { setStudentInfo({...studentInfo, name: e.target.value}); setError(''); }}
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-3">Lớp</label>
                        <input 
                            type="text" 
                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-center text-lg uppercase"
                            placeholder="6A1"
                            style={{ fontSize: '16px' }}
                            value={studentInfo.class}
                            onChange={e => { setStudentInfo({...studentInfo, class: e.target.value}); setError(''); }}
                        />
                    </div>
                </div>

                {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest animate-pulse">{error}</div>}

                {(!test || !test.isPublished) ? (
                    <div className="space-y-4">
                        <div className="p-6 bg-amber-50 border-2 border-dashed border-amber-200 rounded-3xl text-amber-700 text-sm font-bold text-center leading-relaxed">
                            ⚠️ Hiện tại chưa có đề thi nào từ giáo viên trên thiết bị này.
                        </div>
                        <button 
                            onClick={loadSampleTest}
                            className="w-full py-4 bg-blue-50 text-blue-600 font-black rounded-2xl border-2 border-blue-100 hover:bg-blue-100 transition-all text-sm uppercase tracking-widest"
                        >
                            Dùng Đề Thi Mẫu Để Thử 🧪
                        </button>
                    </div>
                ) : (
                    <button 
                        disabled={!studentInfo.name || !studentInfo.class}
                        onClick={handleStart}
                        className="w-full py-6 bg-emerald-600 text-white font-black text-xl rounded-[2rem] hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                        BẮT ĐẦU THI 🚀
                    </button>
                )}
            </div>
        </div>
        
        <p className="mt-8 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-loose">
            Lưu ý: Nếu không thấy đề của giáo viên,<br/>hãy chắc chắn giáo viên đã bấm nút "Mở bài thi".
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 pb-32 px-4 pt-4 animate-in fade-in duration-500">
      <header className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-xl flex justify-between items-center sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-lg">{test?.grade}</div>
          <div className="overflow-hidden">
            <h3 className="text-sm font-black text-slate-900 truncate max-w-[140px]">{test?.title}</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase">{studentInfo.name} • Lớp {studentInfo.class}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-red-50 rounded-lg border border-red-100 text-center">
             <span className="text-[8px] font-black text-red-400 block uppercase tracking-widest">Thời gian</span>
             <span className="text-base font-mono font-black text-red-600">{test?.duration}:00</span>
        </div>
      </header>

      <div className="space-y-6 mt-8">
        {test?.questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-slate-100"></div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <span className="px-3 py-1 bg-slate-900 text-white rounded-lg font-black text-xs">Câu {idx + 1}</span>
                 <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{q.type}</span>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-400 text-[10px] italic font-bold leading-relaxed">{q.instruction}</p>
                <p className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">{q.content}</p>
                
                {q.options && q.options.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const label = String.fromCharCode(65 + optIdx);
                      const isSelected = answers[q.id] === label;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => setAnswers({...answers, [q.id]: label})}
                          className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                            isSelected ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-slate-50 bg-slate-50'
                          }`}
                        >
                          <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border-2 transition-all shrink-0 ${
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
                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-lg"
                    placeholder="Nhập câu trả lời..."
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex flex-col items-center z-50">
        <button 
          onClick={handleSubmit}
          className="w-full max-w-md py-5 bg-emerald-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-emerald-100 active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <span>NỘP BÀI NGAY</span>
          <span>📤</span>
        </button>
      </div>
    </div>
  );
};

export default StudentPortal;
