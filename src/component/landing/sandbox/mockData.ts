import type { AnalysisResult } from "../../../types/landingPageType";

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  overallScore: 82,
  bandScore: "7.0",
  cefrLevel: "B2",
  levelName: "Upper-Intermediate",
  overallInsight: "Bạn có khả năng diễn đạt lưu loát và tự nhiên. Tuy nhiên, cần chú ý phát âm chính xác các phụ âm cuối và tránh một số lỗi ngữ pháp nhỏ về số nhiều.",
  skills: {
    pronunciation: {
      score: 78,
      grade: "B+",
      details: "Tốt nhưng cần cải thiện phụ âm cuối."
    },
    fluency: {
      score: 85,
      grade: "A-",
      details: "Nói trôi chảy, nhịp điệu tự nhiên."
    },
    comprehensibility: {
      score: 88,
      grade: "A",
      details: "Người bản xứ dễ dàng hiểu được đại ý."
    },
    grammar: {
      score: 80,
      grade: "B",
      details: "Sử dụng tốt các thì nhưng có lỗi chia động từ số ít/nhiều."
    },
    vocabulary: {
      score: 84,
      grade: "A-",
      details: "Từ vựng khá phong phú, có sử dụng một số từ nâng cao."
    }
  },
  pronunciationFeedback: [
    {
      word: "Hello",
      expected: "/həˈloʊ/",
      actual: "/həˈlo/",
      issue: "Phát âm nguyên âm đôi /oʊ/ chưa rõ ở cuối từ.",
      tip: "Hãy kéo dài âm cuối ra một chút và khép miệng dần để tạo thành âm /ʊ/ nhẹ ở cuối."
    },
    {
      word: "practice",
      expected: "/ˈpræktɪs/",
      actual: "/ˈpræktɪk/",
      issue: "Phát âm sai phụ âm cuối thành âm /k/ thay vì /s/.",
      tip: "Chú ý đuôi 'ce' thường được phát âm là âm vô thanh /s/. Hãy thổi luồng hơi nhẹ qua kẽ răng."
    },
    {
      word: "English",
      expected: "/ˈɪŋɡlɪʃ/",
      actual: "/ˈɪŋɡlɪs/",
      issue: "Lẫn lộn giữa âm /ʃ/ và /s/ ở cuối từ.",
      tip: "Chu môi về phía trước và đẩy hơi mạnh hơn để tạo ra âm /ʃ/ dày."
    },
    {
      word: "spontaneously",
      expected: "/spɑːnˈteɪniəsli/",
      actual: "/spɑːnˈtæniəsli/",
      issue: "Phát âm sai nguyên âm chính /eɪ/ thành /æ/.",
      tip: "Phát âm rõ nguyên âm đôi /eɪ/ (giống âm 'ây' trong tiếng Việt nhưng mượt hơn)."
    }
  ],
  grammarFeedback: [
    {
      original: "I want to practice speaking English freely.",
      corrected: "I want to practice speaking English fluently.",
      rule: "Word Choice / Phù hợp ngữ cảnh",
      explain: "Mặc dù 'freely' không sai hoàn toàn về ngữ pháp, nhưng trong ngữ cảnh luyện nói học thuật, dùng 'fluently' (trôi chảy) hoặc 'freely' (tự do) cần được làm rõ. Đề xuất dùng 'fluently' để làm nổi bật mục tiêu học tập."
    },
    {
      original: "expressing random thoughts spontaneously is one of the best ways",
      corrected: "expressing random thoughts spontaneously is one of the best ways",
      rule: "Subject-Verb Agreement / Sự hòa hợp chủ vị",
      explain: "Chủ ngữ danh động từ 'expressing' đi với động từ số ít 'is' là hoàn toàn chính xác."
    }
  ],
  vocabularyFeedback: [
    {
      originalWord: "want",
      suggestedWord: "aspire",
      sentence: "I want to practice speaking English...",
      betterSentence: "I aspire to practice speaking English...",
      reason: "Dùng từ 'aspire' (khao khát/mong muốn) sẽ tạo cảm giác học thuật và mạnh mẽ hơn so với từ 'want' thông dụng."
    },
    {
      originalWord: "best",
      suggestedWord: "most effective",
      sentence: "...is one of the best ways to improve...",
      betterSentence: "...is one of the most effective ways to improve...",
      reason: "Dùng 'most effective' thay cho 'best' để tăng tính thuyết phục và chuyên nghiệp trong bài nói."
    }
  ],
  fluencyTimeline: [
    {
      time: "00:03",
      type: "hesitation",
      duration: "0.8s",
      severity: "minor",
      context: "I want to... practice"
    },
    {
      time: "00:10",
      type: "pause",
      duration: "1.5s",
      severity: "medium",
      context: "thoughts spontaneously... is one"
    }
  ]
};
