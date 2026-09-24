import React from 'react';
import { QuizResultRecord } from '../types/quiz';
import { getVerifiedCharacter } from '../data/characters';
import {
  Sparkles,
  Calendar,
  ChevronRight,
  RotateCcw,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

interface HistoryViewProps {
  history: QuizResultRecord[];
  onViewResult: (result: QuizResultRecord) => void;
  onRetakeQuiz: () => void;
  onBackToDashboard: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onViewResult,
  onRetakeQuiz,
  onBackToDashboard,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <div>
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>กลับสู่แดชบอร์ด</span>
          </button>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-purple-600" />
            <span>📚 ประวัติของฉัน</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ผลการทำแบบทดสอบทั้งหมดของคุณที่บันทึกไว้ในระบบ ({history.length} รายการ)
          </p>
        </div>

        <button
          onClick={onRetakeQuiz}
          className="self-start sm:self-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>ทำแบบทดสอบใหม่</span>
        </button>
      </div>

      {/* History Items list */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((record) => {
            const topPony = getVerifiedCharacter(record.topCharacter.characterId);

            return (
              <div
                key={record.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-xs hover:shadow-md hover:border-purple-200 transition-all flex flex-col sm:flex-row items-center gap-5 justify-between group"
              >
                {/* Left section: Image + Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-purple-50 border border-purple-100 shrink-0">
                    <img
                      src={topPony.image}
                      alt={topPony.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[11px] font-semibold">
                        {topPony.elementThai}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 group-hover:text-purple-700 transition-colors">
                      {topPony.name}
                    </h3>
                    <p className="text-xs text-slate-500">{topPony.thaiName}</p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{record.formattedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right section: Percentage & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">ความคล้าย</span>
                    <span className="font-heading font-extrabold text-2xl text-purple-700">
                      {record.topCharacter.percentage}%
                    </span>
                  </div>

                  <button
                    onClick={() => onViewResult(record)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <span>ดูผลลัพธ์</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 border border-purple-100 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-3xl">
            📜
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-800">
            ยังไม่มีประวัติการทำแบบทดสอบ
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            ผลลัพธ์แบบทดสอบที่คุณทำจะถูกเก็บไว้ที่นี่อย่างปลอดภัย เพื่อให้คุณสามารถกลับมาดูผลและทบทวนบุคลิกภาพของคุณได้ทุกเมื่อ
          </p>
          <div className="pt-2">
            <button
              onClick={onRetakeQuiz}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>เริ่มทำแบบทดสอบตอนนี้</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
