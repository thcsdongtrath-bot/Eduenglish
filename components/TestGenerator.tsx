
import React, { useState } from 'react';
import { Grade, TestType, TestData } from '../types';
import { CURRICULUM_DATA, DIFFICULTY_LEVELS } from '../constants';
import { generateEnglishTest } from '../services/geminiService';

interface TestGeneratorProps {
  onGenerated: (test: TestData) => void;
}

const TestGenerator: React.FC<TestGeneratorProps> = ({ onGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    grade: Grade.GRADE_6,
    unit: CURRICULUM_DATA[Grade.GRADE_6][0],
    testType: TestType.MIN_15,
    difficultyRatio: {
      'Nhận biết': 40,
      'Thông hiểu': 30,
      'Vận dụng': 20,
      'Vận dụng cao': 10
    }
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const test = await generateEnglishTest(
        config.grade,
        config.unit,
        config.testType,
        config.difficultyRatio
      );
      onGenerated(test);
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo đề. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const updateDifficulty = (level: string, value: number) => {
    setConfig(prev => ({
      ...prev,
      difficultyRatio: { ...prev.difficultyRatio, [level]: value }
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Cấu hình đề kiểm tra AI</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Khối lớp</label>
            <div className="flex gap-2">
              {Object.values(Grade).map(g => (
                <button
                  key={g}
                  onClick={() => setConfig({ ...config, grade: g, unit: CURRICULUM_DATA[g][0] })}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    config.grade === g 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                      : 'border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Đơn vị bài học (Unit)</label>
            <select
              value={config.unit}
              onChange={(e) => setConfig({ ...config, unit: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {CURRICULUM_DATA[config.grade].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Loại đề</label>
            <select
              value={config.testType}
              onChange={(e) => setConfig({ ...config, testType: e.target.value as TestType })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {Object.values(TestType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Tỉ lệ mức độ nhận thức (%)</label>
          {DIFFICULTY_LEVELS.map(level => (
            <div key={level.label} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{level.label}</span>
                <span className="font-bold text-blue-600">{(config.difficultyRatio as any)[level.label]}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={(config.difficultyRatio as any)[level.label]}
                onChange={(e) => updateDifficulty(level.label, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          ))}
          <p className="text-xs text-slate-400 italic">* Đảm bảo tổng tỉ lệ là 100% để có kết quả tốt nhất.</p>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-100 pt-8 flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-8 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all ${
            loading ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:-translate-y-1'
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
              Đang soạn đề bằng AI...
            </>
          ) : (
            <>✨ Bắt đầu soạn đề ngay</>
          )}
        </button>
      </div>
    </div>
  );
};

export default TestGenerator;
