import type { Recording } from "./../types/homePage.type";

export const getOverallScore = (rec: Recording): number => {
  const pronunciation = rec.speechToText?.pronunciationScore || 0;
  const fluency = rec.speechToText?.fluencyScore || 0;
  const confidence = rec.speechToText?.overallConfidence || 0;
  const grammar = rec.analysis?.overallGrammarScore || 0;
  const vocab = rec.analysis?.overallVocabScore || 0;

  const scores = [pronunciation, fluency, confidence, grammar, vocab].filter(
    (s) => s > 0,
  );
  return scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
};

