import React, { useState, useEffect } from 'react';
import { Question, UserAnswerRecord } from '../types/quiz';
import { sampleRandomQuestions } from '../services/quizCalculator';
import { Sparkles, ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

interface QuizViewProps {
  onCompleteQuiz: (answers: UserAnswerRecord[]) => void;
  onCancel: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onCompleteQuiz, onCancel }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, UserAnswerRecord>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize 15 random questions from the 50-question bank
  useEffect(() => {
    const sampled = sampleRandomQuestions(15);
    setQuestions(sampled);
    setCurrentIndex(0);
    setSelectedAnswers({});
  }, []);

  if (questions.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="inline-block animate-spin text-3xl mb-3">🦄</div>
        <p className="text-sm text-slate-500 font-medium">กำลังเตรียมชุดคำถาม 15 ข้อเพื่อคุณ...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = selectedAnswers[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const totalAnswered = Object.keys(selectedAnswers).length;
  const isAllAnswered = totalAnswered === questions.length;

  const handleSelectOption = (opt: Question['options'][0]) => {
    const isScored = currentQ.isScored !== false;
    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      questionText: currentQ.text,
      optionId: opt.id,
      optionText: opt.text,
      primaryTrait: opt.primaryTrait,
      traitDescription: opt.traitDescription,
      scores: isScored
        ? opt.scores
        : {
            twilight_sparkle: 0,
            rainbow_dash: 0,
            pinkie_pie: 0,
            fluttershy: 0,
            rarity: 0,
            applejack: 0,
          },
      isScored,
    };

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: record,
    }));

    // Auto-advance if not last question
    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handleFinish = () => {
    if (!isAllAnswered) return;
    setIsSubmitting(true);
    const answersArray: UserAnswerRecord[] = questions.map((_, idx) => selectedAnswers[idx]);
    onCompleteQuiz(answersArray);
  };

  const handleResetQuiz = () => {
    if (window.confirm('คุณต้องการสุ่มคำถามชุดใหม่และเริ่มทำใหม่ใช่หรือไม่?')) {
      const sampled = sampleRandomQuestions(15);
      setQuestions(sampled);
      setCurrentIndex(0);
      setSelectedAnswers({});
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Quiz Top bar with progress */}
      <div className="mb-8 space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-purple-900 text-base sm:text-lg">
              คำถาม {currentIndex + 1} / {questions.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              {currentQ.categoryLabel}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>ตอบแล้ว {totalAnswered} / {questions.length} ข้อ</span>
            <button
              onClick={handleResetQuiz}
              className="text-slate-400 hover:text-purple-600 transition-colors p-1 rounded-md"
              title="สุ่มชุดคำถามใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-purple-100/70 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-lg space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="text-xs font-semibold text-purple-600 tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>คำถามข้อที่ {currentIndex + 1}</span>
            </div>
            {currentQ.isScored === false ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-850 text-[11px] font-semibold border border-amber-200 inline-flex items-center gap-1">
                <span>💡</span>
                <span>คำถามสำรวจพิเศษ (ไม่คิดคะแนนคำนวณ)</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[11px] font-medium">
                นับคะแนนคำนวณผล
              </span>
            )}
          </div>
          <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 leading-snug">
            {currentQ.text}
          </h3>
        </div>

        {/* Option list */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, optIndex) => {
            const isSelected = currentAnswer?.optionId === opt.id;
            const optionLetter = String.fromCharCode(65 + optIndex); // A, B, C, D, E

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer group min-h-[56px] ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/80 shadow-xs'
                    : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50/60 bg-white'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-heading font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-700'
                  }`}
                >
                  {optionLetter}
                </span>
                <span
                  className={`text-sm sm:text-base leading-relaxed pt-0.5 ${
                    isSelected ? 'text-purple-950 font-medium' : 'text-slate-700'
                  }`}
                >
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation bottom buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              type="button"
              onClick={handleFinish}
              disabled={!isAllAnswered || isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'กำลังวิเคราะห์ผล...' : 'ดูผลลัพธ์ตัวละครของคุณ'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={!currentAnswer}
              className="px-5 py-2 text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <span>ข้อถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Cancel or quit notice */}
      <div className="text-center mt-6">
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          ยกเลิกและกลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
};
