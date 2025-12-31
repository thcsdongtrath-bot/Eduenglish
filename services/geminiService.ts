
import { GoogleGenAI, Type } from "@google/genai";
import { Grade, TestType, TestData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateEnglishTest = async (
  grade: Grade,
  unit: string,
  testType: TestType,
  difficultyRatio: { [key: string]: number }
): Promise<TestData> => {
  const prompt = `
    Bạn là chuyên gia giáo dục Tiếng Anh THCS tại Việt Nam.
    Hãy soạn một đề kiểm tra Tiếng Anh cho lớp ${grade}, dựa trên sách Global Success, bài ${unit}.
    Loại đề: ${testType}.
    Tỷ lệ độ khó (Nhận biết/Thông hiểu/Vận dụng/Vận dụng cao): ${difficultyRatio['Nhận biết']}/${difficultyRatio['Thông hiểu']}/${difficultyRatio['Vận dụng']}/${difficultyRatio['Vận dụng cao']}.
    
    Yêu cầu các phần bắt buộc:
    1. Phonetics (Pronunciation & Stress)
    2. Vocabulary & Grammar (Topic related to ${unit})
    3. Communication
    4. Error Identification
    5. Reading Comprehension
    6. Writing (Reordering sentences or Sentence Transformation)
    
    LƯU Ý QUAN TRỌNG:
    - Các câu hỏi trắc nghiệm (Phonetics, Vocab, Grammar, Reading, Error) PHẢI có 4 đáp án A, B, C, D trong mảng "options".
    - Các câu hỏi Writing (Sắp xếp câu, Viết lại câu) KHÔNG ĐƯỢC có mảng "options". AI phải cung cấp đáp án đúng hoàn chỉnh vào trường "answer".
    - Ngôn ngữ đề bài: Tiếng Anh. Chỉ dẫn bằng Tiếng Việt.
    - Độ khó phải phù hợp với trình độ học sinh lớp ${grade} Việt Nam theo chuẩn 2018.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          grade: { type: Type.STRING },
          unit: { type: Type.STRING },
          duration: { type: Type.NUMBER },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                type: { type: Type.STRING },
                instruction: { type: Type.STRING },
                content: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["id", "type", "instruction", "content", "answer", "explanation"]
            }
          }
        },
        required: ["title", "grade", "unit", "duration", "questions"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeResults = async (results: any[]) => {
  const prompt = `
    Dưới đây là danh sách kết quả bài kiểm tra Tiếng Anh của học sinh. 
    Hãy phân tích:
    1. Nhận xét chung về năng lực cả lớp.
    2. Chỉ ra các mảng kiến thức (Từ vựng, Ngữ pháp, Reading...) mà học sinh còn yếu.
    3. Gợi ý các bài tập bổ trợ cho từng nhóm học sinh (Khá/Giỏi, Trung bình, Yếu).
    Kết quả: ${JSON.stringify(results)}
    Ngôn ngữ: Tiếng Việt.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text;
};
