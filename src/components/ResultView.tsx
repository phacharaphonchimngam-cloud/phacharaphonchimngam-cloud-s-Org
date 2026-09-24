import React, { useState } from 'react';
import { QuizResultRecord } from '../types/quiz';
import { getVerifiedCharacter, verifyCharacterIntegrity } from '../data/characters';
import {
  Sparkles,
  Heart,
  Star,
  ShieldAlert,
  Check,
  Share2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';

interface ResultViewProps {
  result: QuizResultRecord;
  onRetakeQuiz: () => void;
  onViewHistory: () => void;
  onGoToDashboard: () => void;
  isSaved?: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onRetakeQuiz,
  onViewHistory,
  onGoToDashboard,
  isSaved = true,
}) => {
  const [copied, setCopied] = useState(false);

  // Runtime verification: fetch verified character data strictly by characterId
  const verifiedTopPony = getVerifiedCharacter(result.topCharacter.characterId);
  const isValid = verifyCharacterIntegrity(verifiedTopPony);

  if (!isValid) {
    console.error('CRITICAL: Character integrity verification failed for', result.topCharacter.characterId);
  }

  const verifiedSecondPony = result.secondCharacter
    ? getVerifiedCharacter(result.secondCharacter.characterId)
    : null;
  const verifiedThirdPony = result.thirdCharacter
    ? getVerifiedCharacter(result.thirdCharacter.characterId)
    : null;

  const handleShare = async () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : '';
    const shareUrl = `${baseUrl}?ref=invite&pony=${verifiedTopPony.characterId}&score=${result.topCharacter.percentage}`;
    const text = `🦄 ผลแบบทดสอบ: ฉันคือ "${verifiedTopPony.name}" (${verifiedTopPony.thaiName}) คล้ายถึง ${result.topCharacter.percentage}%! มาค้นหาตัวละคร My Little Pony ของคุณกันเถอะ 👉 ${shareUrl}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-purple-200 shadow-xl text-center relative overflow-hidden">
        {/* Soft pastel aura background */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6">
          {/* Subtitle tag */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs sm:text-sm font-semibold shadow-2xs">
            <Sparkles className="w-4 h-4 text-purple-600 animate-sparkle" />
            <span>ผลการวิเคราะห์บุคลิกภาพของคุณ</span>
          </div>

          <p className="text-sm sm:text-base font-heading font-medium text-slate-500">
            ✨ คุณคือ...
          </p>

          {/* Primary Top Character Name */}
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-purple-950 tracking-tight">
            {verifiedTopPony.name}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium -mt-3">
            {verifiedTopPony.thaiName} ({verifiedTopPony.elementThai})
          </p>

          {/* Character Image Slot (Guaranteed to match characterId) */}
          <div className="relative max-w-xs sm:max-w-sm mx-auto my-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-purple-100 to-pink-50 aspect-square group">
              <img
                src={verifiedTopPony.image}
                alt={verifiedTopPony.name}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Repeating Character Name clearly under the image as specified */}
            <div className="mt-3 py-1.5 px-4 bg-purple-50 border border-purple-200 rounded-xl inline-block shadow-2xs">
              <p className="font-heading font-bold text-sm text-purple-900">
                {verifiedTopPony.name}
              </p>
            </div>
          </div>

          {/* Percentage badge */}
          <div className="inline-block p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white shadow-lg">
            <div className="text-xs uppercase tracking-wider font-semibold opacity-90">
              ระดับความสอดคล้องของบุคลิกภาพ
            </div>
            <div className="font-heading font-extrabold text-3xl sm:text-4xl mt-1">
              💜 คุณคล้าย {verifiedTopPony.name} {result.topCharacter.percentage}%
            </div>
          </div>

          {/* Character Quote */}
          <p className="italic text-xs sm:text-sm text-purple-900/80 max-w-xl mx-auto pt-2">
            {verifiedTopPony.quote}
          </p>
        </div>
      </div>

      {/* Secondary & Tertiary Matches */}
      {verifiedSecondPony && verifiedThirdPony && (
        <div className="bg-purple-50/70 rounded-3xl p-6 border border-purple-100 space-y-4">
          <h3 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span>ตัวละครอื่น ๆ ที่มีบุคลิกใกล้เคียงกับคุณ</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 2nd Place */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 flex items-center gap-3.5 shadow-2xs">
              <img
                src={verifiedSecondPony.image}
                alt={verifiedSecondPony.name}
                className="w-14 h-14 rounded-xl object-cover border border-purple-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {verifiedSecondPony.name}
                  </h4>
                  <span className="text-xs font-bold text-purple-600">
                    {result.secondCharacter?.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{verifiedSecondPony.elementThai}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${result.secondCharacter?.percentage || 70}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 flex items-center gap-3.5 shadow-2xs">
              <img
                src={verifiedThirdPony.image}
                alt={verifiedThirdPony.name}
                className="w-14 h-14 rounded-xl object-cover border border-purple-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 truncate">
                    {verifiedThirdPony.name}
                  </h4>
                  <span className="text-xs font-bold text-pink-600">
                    {result.thirdCharacter?.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{verifiedThirdPony.elementThai}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full"
                    style={{ width: `${result.thirdCharacter?.percentage || 60}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deep Dynamic Analysis Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why you are like this */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shadow-2xs">
            💕
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            ทำไมคุณถึงคล้าย {verifiedTopPony.name}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {result.dynamicAnalysis.whyYouAreLikeThis}
          </p>
        </div>

        {/* User Persona Profile */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shadow-2xs">
            🔮
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            แล้วคุณเป็นคนแบบไหน?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {result.dynamicAnalysis.userPersona}
          </p>
          {result.dynamicAnalysis.dominantTraits && (
            <div className="pt-2 flex flex-wrap gap-1.5">
              {result.dynamicAnalysis.dominantTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-800 text-[11px] font-medium"
                >
                  ✨ {trait}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Character Core Traits & How you think */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
          <span>🦄 {verifiedTopPony.name} มีบุคลิกอย่างไร?</span>
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {verifiedTopPony.personality}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
            <h4 className="text-xs font-bold text-purple-900 mb-1">🧠 วิธีคิดและการตัดสินใจ</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{verifiedTopPony.howYouThink}</p>
          </div>
          <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-100">
            <h4 className="text-xs font-bold text-pink-900 mb-1">🤝 มิตรภาพและการเข้าสังคม</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{verifiedTopPony.socialAndFriendship}</p>
          </div>
        </div>

        {/* Strengths & Things to watch out for */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Strengths */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>จุดเด่น & พลังความสามารถของคุณ</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-900">
              {verifiedTopPony.strengths.map((str, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 shrink-0 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Things to watch out for */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 space-y-2">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>⚠️ สิ่งที่คุณควรระวัง</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-amber-900">
              {verifiedTopPony.thingsToWatchOutFor.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-amber-500 shrink-0 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Suitable activities & environment */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-5">
        <h3 className="font-heading font-bold text-xl text-slate-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span>🌟 สิ่งที่เหมาะกับคุณ</span>
        </h3>
        <p className="text-xs text-slate-500">
          จากแนวโน้มบุคลิกภาพ นี่คือกิจกรรมและสิ่งแวดล้อมที่ช่วยดึงศักยภาพสูงสุดของคุณออกมา
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {verifiedTopPony.suitableActivities.map((act, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="text-xs font-bold text-purple-700 block">{act.category}</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {act.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-1">
                    <span className="text-purple-400 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tailored Custom Advice */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-purple-200 shadow-sm space-y-3">
        <h3 className="font-heading font-bold text-lg text-purple-950 flex items-center gap-2">
          <span>💡 คำแนะนำพิเศษสำหรับคุณ</span>
        </h3>
        <p className="text-xs sm:text-sm text-purple-900/90 leading-relaxed font-medium">
          {result.dynamicAnalysis.customAdvice}
        </p>
      </div>

      {/* Official Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-slate-700">ข้อความชี้แจง (Disclaimer): </strong>
          แบบทดสอบนี้สร้างขึ้นเพื่อความบันเทิงและการสำรวจตัวเอง ไม่ใช่แบบประเมินทางจิตวิทยา และไม่สามารถใช้วินิจฉัยบุคลิกภาพหรือกำหนดอาชีพที่เหมาะสมได้อย่างแน่นอน
        </p>
      </div>

      {/* Actions and Navigation */}
      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onRetakeQuiz}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>✨ ทำแบบทดสอบใหม่อีกครั้ง</span>
        </button>

        <button
          onClick={handleShare}
          className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-purple-600" />
          <span>{copied ? 'คัดลอกข้อความแล้ว! 🎉' : 'แชร์ผลลัพธ์'}</span>
        </button>

        <button
          onClick={onViewHistory}
          className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>📚 ดูในประวัติของฉัน</span>
        </button>

        <button
          onClick={onGoToDashboard}
          className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>แดชบอร์ด</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
