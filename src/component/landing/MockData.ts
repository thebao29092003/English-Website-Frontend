import type { AnalysisResult, GoalCard, DimensionDetail } from "../../types/landingPageType";
import { Award, Languages, Sliders, Volume2, Activity } from "lucide-react";
import {Image} from "../../assets/image/imgs.js";

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  overallScore: 82,
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
      tip: "Hãy kéo dài âm cuối ra một chút và khép miệng dần để tạo thành âm /ʊ/ nhẹ ở cuối.",
      score: 65,
    },
    {
      word: "practice",
      expected: "/ˈpræktɪs/",
      actual: "/ˈpræktɪk/",
      issue: "Phát âm sai phụ âm cuối thành âm /k/ thay vì /s/.",
      tip: "Chú ý đuôi 'ce' thường được phát âm là âm vô thanh /s/. Hãy thổi luồng hơi nhẹ qua kẽ răng.",
      score: 35,
    },
    {
      word: "English",
      expected: "/ˈɪŋɡlɪʃ/",
      actual: "/ˈɪŋɡlɪs/",
      issue: "Lẫn lộn giữa âm /ʃ/ và /s/ ở cuối từ.",
      tip: "Chu môi về phía trước và đẩy hơi mạnh hơn để tạo ra âm /ʃ/ dày.",
      score: 58,
    },
    {
      word: "spontaneously",
      expected: "/spɑːnˈteɪniəsli/",
      actual: "/spɑːnˈtæniəsli/",
      issue: "Phát âm sai nguyên âm chính /eɪ/ thành /æ/.",
      tip: "Phát âm rõ nguyên âm đôi /eɪ/ (giống âm 'ây' trong tiếng Việt nhưng mượt hơn).",
      score: 40,
    },
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

export const GOALS: GoalCard[] = [
  {
    id: "communication",
    title: "Giao Tiếp Hàng Ngày",
    subtitle:
      "Tự tin bắt chuyện, hỏi đường, gọi món khi đi du lịch nước ngoài hoặc giao lưu cơ bản với bạn bè quốc tế.",
    image:`${Image.Communication}`,
    gradient: "from-blue-500/20 to-indigo-500/10",
  },
  {
    id: "job",
    title: "Phục Vụ Công Việc",
    subtitle:
      "Tự tin trả lời phỏng vấn cơ bản, viết email ngắn gọn, và trao đổi các chủ đề quen thuộc với đồng nghiệp.",
    image:
      `${Image.Interview}`,
    gradient: "from-indigo-500/20 to-purple-500/10",
  },
  {
    id: "hobby",
    title: "Giải Trí & Sở Thích",
    subtitle:
      "Hiểu nội dung video ngắn, nghe nhạc tiếng Anh, và cập nhật nhanh chóng các xu hướng trên mạng xã hội.",
    image:
      `${Image.UnderstandShortVideo}`,
    gradient: "from-purple-500/20 to-pink-500/10",
  },
];

export const DIMENSIONS: DimensionDetail[] = [
  {
    id: "pron",
    title: "Phát âm chuẩn IPA",
    engTitle: "Cách Phát Âm",
    icon: Award,
    metricLabel: "Thanh đo chuẩn",
    metricVal: "Pronunciation",
    description:
      "Nhận diện chính xác từng âm tiết nhỏ nhất (phonemes), phát hiện tức thì các lỗi nuốt âm đuôi và lỗi phát âm sai.",
    details: [
      "Kiểm tra đầy đủ các âm tiết.",
      "Đối chiếu trực quan khẩu hình miệng và âm học của người bản xứ.",
      "Hướng dẫn cụ thể cách phát âm tự nhiên.",
    ], 
  },
  {
    id: "confidence",
    title: "Độ dễ hiểu",
    engTitle: "Độ dễ hiểu",
    icon: Volume2,
    metricLabel: "AI chuyên biệt",
    metricVal: "Comprehensibility",
    description:
      "Khi AI nhận diện giọng nói của bạn, hệ thống sẽ trả về chỉ số confidence (độ tự tin). Chỉ số này càng cao nghĩa là phát âm của bạn rõ ràng, chính xác. Ngược lại, chỉ số thấp thể hiện AI phải nhờ đến ngữ cảnh xung quanh để phán đoán từ bạn vừa nói.",
    details: [
      "Đánh giá mức độ tròn vành rõ chữ của bạn.",
      "Đưa ra điểm số cụ thể cho từng từ.",
      "AI được đào tạo tên 12.5 triệu giờ dữ liệu âm thanh thực tế.",
    ],  
  },
  {
    id: "fluency",
    title: "Độ trôi chảy",
    engTitle: "Độ trôi chảy",
    icon: Activity,
    metricLabel: "Đo lường nhịp độ",
    metricVal: "Words per minute",
    description:
      "Phân tích tốc độ nói trung bình, nhận diện các khoảng ngập ngừng ngắt quãng bất thường và ngập ngừng.",
    details: [
      "Phân biệt giữa ngừng tự nhiên và ngập ngừng do bí từ.",
      "Chấm điểm độ trôi chảy dựa trên việc phát hiện các khoảng ngập ngừng.",
      "Phân tích nhịp độ phát âm để cảnh báo khi bạn nói quá nhanh hoặc quá chậm.",
    ],
  },
  {
    id: "gram",
    title: "Ngữ pháp",
    engTitle: "Ngữ pháp",
    icon: Sliders,
    metricLabel: "Độ chính xác",
    metricVal: "Grammar Score",
    description:
      "Phát hiện lỗi sai và chấm điểm ngữ pháp trực tiếp từ bài nói. Hệ thống không chỉ chỉ ra điểm không chính xác mà còn giải thích chi tiết nguyên nhân và đề xuất cách tối ưu câu nói.",
    details: [
      "Phát hiện và chỉ ra cụ thể các lỗi sai ngữ pháp trong bài nói.",
      "Giải thích chi tiết lý do sai và hướng dẫn cách sửa chính xác.",
      "Chấm điểm độ chuẩn xác ngữ pháp để bạn dễ dàng theo dõi tiến độ.",
    ],
  },
  {
    id: "vocab",
    title: "Từ Vựng",
    engTitle: "Từ Vựng",
    icon: Languages,
    metricLabel: "Vốn từ vựng",
    metricVal: "Vocabulary Score",
    description:
      "Đánh giá mức độ phong phú và sự đa dạng của từ vựng trong bài nói. Hệ thống gợi ý các từ vựng hoặc cụm từ nâng cấp thay thế cho từ đơn điệu, giải thích chi tiết lý do và chấm điểm cụ thể.",
    details: [
      "Gợi ý các từ vựng nâng cấp hoặc cụm từ  để thay thế từ lặp.",
      "Giải thích lý do lựa chọn từ vựng thay thế phù hợp với ngữ cảnh.",
      "Chấm điểm độ đa dạng từ vựng giúp bạn mở rộng vốn từ nhanh chóng.",
    ],
  },
];