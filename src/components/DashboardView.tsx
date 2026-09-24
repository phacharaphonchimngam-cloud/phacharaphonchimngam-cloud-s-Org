import React, { useState } from 'react';
import { QuizResultRecord, CharacterId } from '../types/quiz';
import { CHARACTERS_LIST, getVerifiedCharacter } from '../data/characters';
import {
  Sparkles,
  BookOpen,
  User,
  LogOut,
  ArrowRight,
  Clock,
  Award,
  ChevronRight,
  Check,
  ShieldAlert,
  Shield,
  Star,
  Share2,
  Copy,
  ExternalLink,
  X,
  MessageCircle,
  Settings2,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: {
    userId: string;
    displayName: string;
    email: string;
    birthday?: string;
  };
  latestResult: QuizResultRecord | null;
  historyCount: number;
  onStartQuiz: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
  onLogout: () => void;
  onViewSpecificResult: (result: QuizResultRecord) => void;
  onManageQuestions?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  latestResult,
  historyCount,
  onStartQuiz,
  onViewHistory,
  onViewProfile,
  onLogout,
  onViewSpecificResult,
  onManageQuestions,
}) => {
  const latestCharacter = latestResult
    ? getVerifiedCharacter(latestResult.topCharacter.characterId)
    : null;

  // Selected character in the Dashboard's Mane 6 Strengths & Cautions Explorer
  const [selectedPonyId, setSelectedPonyId] = useState<CharacterId>(
    latestResult ? latestResult.topCharacter.characterId : 'twilight_sparkle'
  );

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const activePony = getVerifiedCharacter(selectedPonyId);

  const getShareUrl = () => {
    if (typeof window === 'undefined') return '';
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set('ref', 'invite');
    params.set('from', currentUser.displayName);
    if (latestCharacter) {
      params.set('pony', latestCharacter.characterId);
      params.set('score', String(latestResult?.topCharacter.percentage || 95));
    }
    return `${baseUrl}?${params.toString()}`;
  };

  const getShareText = () => {
    const shareUrl = getShareUrl();
    if (!latestCharacter || !latestResult) {
      return `🦄 ${currentUser.displayName} ชวนคุณมาค้นหาว่าคุณคือใครใน My Little Pony! มาลองตอบคำถาม 15 ข้อกันเถอะ 👉 ${shareUrl}`;
    }
    return `🦄 ${currentUser.displayName} ทำแบบทดสอบแล้วได้เป็น "${latestCharacter.name}" (${latestCharacter.thaiName}) คล้ายถึง ${latestResult.topCharacter.percentage}%! ✨ แล้วคุณล่ะเป็นใครใน My Little Pony? ลองทำแบบทดสอบเลย 👉 ${shareUrl}`;
  };

  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'คุณเป็นใครใน My Little Pony? (MLP Personality Quiz)',
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch {
        // Canceled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
            Equestria Member Dashboard
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl">
            สวัสดี {currentUser.displayName} 🦄
          </h2>
          <p className="text-xs sm:text-sm text-white/90 max-w-xl">
            ยินดีต้อนรับสู่ศูนย์กลางการสำรวจบุคลิกภาพโพนี่ของคุณ ในแดชบอร์ดนี้คุณสามารถดูผลทดสอบล่าสุด รวมถึงเข้าถึงการวิเคราะห์จุดเด่นและข้อควรระวังของแต่ละตัวละครได้โดยเฉพาะ
          </p>

          {/* Quick Action bar */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={onStartQuiz}
              className="px-5 py-2.5 bg-white text-purple-700 font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md hover:bg-purple-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>✨ ทำแบบทดสอบใหม่</span>
            </button>
            <button
              onClick={onViewHistory}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>📖 ดูประวัติ ({historyCount})</span>
            </button>
            <button
              onClick={onViewProfile}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>👤 โปรไฟล์</span>
            </button>
            {onManageQuestions && (
              <button
                onClick={onManageQuestions}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="จัดการและแก้ไขคำถาม รวมถึงตั้งค่าไม่นับแต้ม"
              >
                <Settings2 className="w-4 h-4" />
                <span>⚙️ จัดการคำถาม</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-3 py-2.5 bg-black/20 hover:bg-black/30 text-white/90 font-medium text-xs rounded-xl backdrop-blur-xs transition-all flex items-center gap-1 cursor-pointer"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Latest Result Card */}
      <div className="space-y-3">
        <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-600" />
          <span>ผลการทดสอบล่าสุดของคุณ</span>
        </h3>

        {latestResult && latestCharacter ? (
          <div className="bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-purple-50 border border-purple-100 shrink-0">
                <img
                  src={latestCharacter.image}
                  alt={latestCharacter.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 text-[10px] font-bold text-purple-800 shadow-2xs">
                  ล่าสุด
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h4 className="font-heading font-bold text-2xl text-purple-950">
                      {latestCharacter.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {latestCharacter.thaiName} · {latestCharacter.elementThai}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block flex items-center gap-1 justify-center sm:justify-end">
                      <Clock className="w-3 h-3" />
                      <span>{latestResult.formattedDate}</span>
                    </span>
                    <span className="font-heading font-extrabold text-xl text-purple-700">
                      คล้าย {latestResult.topCharacter.percentage}%
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {latestResult.dynamicAnalysis.whyYouAreLikeThis}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => onViewSpecificResult(latestResult)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>ดูผลลัพธ์แบบละเอียดทั้งหมด</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:shadow-sm transition-all inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>แชร์ลิงก์ชวนเพื่อนทำแบบทดสอบ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Strengths & Cautions specifically highlighted in Dashboard for the user's matched pony */}
            <div className="pt-4 border-t border-purple-50 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="font-heading font-bold text-sm text-slate-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <span>จุดเด่นและข้อควรระวังประจำตัวของคุณ ({latestCharacter.name})</span>
                </h5>
                <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  แดชบอร์ดเอ็กซ์คลูซีฟ ✨
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-100 space-y-2">
                  <h6 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>🌟 จุดเด่น & จุดแข็งของคุณ</span>
                  </h6>
                  <ul className="space-y-1.5 text-xs text-emerald-900">
                    {latestCharacter.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 shrink-0 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cautions */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-100 space-y-2">
                  <h6 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>⚠️ ข้อควรระวังของคุณ</span>
                  </h6>
                  <ul className="space-y-1.5 text-xs text-amber-900">
                    {latestCharacter.thingsToWatchOutFor.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-500 shrink-0 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 border border-purple-100 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-3xl">
              🦄
            </div>
            <div>
              <h4 className="font-heading font-bold text-base text-slate-800">
                ยังไม่มีประวัติการทำแบบทดสอบ
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                คุณยังไม่ได้ทำแบบทดสอบบุคลิกภาพ มาเริ่มตอบคำถาม 15 ข้อเพื่อค้นหาว่าคุณคือใครในดินแดนโพนี่กันเถอะ!
              </p>
            </div>
            <button
              onClick={onStartQuiz}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>เริ่มทำแบบทดสอบ 15 ข้อ</span>
            </button>
          </div>
        )}
      </div>

      {/* Dedicated Section: Strengths and Cautions of each character (Mane 6) exclusively in Dashboard */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-50 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-1">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>ระบบวิเคราะห์พิเศษเฉพาะในแดชบอร์ด</span>
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900">
              จุดเด่นและข้อควรระวังของแต่ละตัวละคร (Mane 6)
            </h3>
            <p className="text-xs text-slate-500">
              เลือกตัวละครด้านล่างเพื่อตรวจสอบจุดเด่นและข้อควรระวังเชิงลึกของแต่ละตัวละคร
            </p>
          </div>
        </div>

        {/* Character Selector Pills / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {CHARACTERS_LIST.map((char) => {
            const isSelected = selectedPonyId === char.characterId;

            return (
              <button
                key={char.characterId}
                onClick={() => setSelectedPonyId(char.characterId)}
                className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/90 ring-2 ring-purple-200 shadow-xs'
                    : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50/60 bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-purple-50 border border-purple-100">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span
                  className={`text-xs font-bold truncate max-w-full ${
                    isSelected ? 'text-purple-900' : 'text-slate-700'
                  }`}
                >
                  {char.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {char.elementThai}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Character Strengths & Cautions Display */}
        <div className="bg-purple-50/50 rounded-2xl p-5 sm:p-6 border border-purple-100 space-y-5">
          <div className="flex items-center gap-4">
            <img
              src={activePony.image}
              alt={activePony.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-lg text-purple-950">
                  {activePony.name}
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-xs font-semibold">
                  {activePony.elementThai}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {activePony.thaiName} ({activePony.species})
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-2xs space-y-2">
              <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>🌟 จุดเด่น & จุดแข็ง ({activePony.name})</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activePony.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 shrink-0 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cautions */}
            <div className="p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs space-y-2">
              <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>⚠️ ข้อควรระวัง / จุดเปราะบาง ({activePony.name})</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {activePony.thingsToWatchOutFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Stats and features summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-2xs">
          <p className="text-xs text-slate-400 font-medium">จำนวนครั้งที่ทำแบบทดสอบ</p>
          <p className="font-heading font-extrabold text-3xl text-purple-900 mt-1">
            {historyCount} <span className="text-xs font-normal text-slate-500">ครั้ง</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-2xs">
          <p className="text-xs text-slate-400 font-medium">คลังคำถามในระบบ</p>
          <p className="font-heading font-extrabold text-3xl text-pink-600 mt-1">
            50 <span className="text-xs font-normal text-slate-500">ข้อ (สุ่มครั้งละ 15)</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-2xs">
          <p className="text-xs text-slate-400 font-medium">การยืนยันข้อมูลรูปและชื่อ</p>
          <p className="font-heading font-extrabold text-3xl text-emerald-600 mt-1">
            100% <span className="text-xs font-normal text-slate-500">Strict Mapping</span>
          </p>
        </div>
      </div>

      {/* Share Result & Invite Friends Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-200" />
                <h3 className="font-heading font-bold text-lg">แชร์ลิงก์ชวนเพื่อนทำแบบทดสอบ</h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
                title="ปิด"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Result Preview Teaser Card */}
              {latestCharacter && latestResult ? (
                <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-3.5">
                  <img
                    src={latestCharacter.image}
                    alt={latestCharacter.name}
                    className="w-14 h-14 rounded-xl object-cover border border-purple-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-purple-700">
                      🦄 ผลลัพธ์ของคุณ: {currentUser.displayName}
                    </p>
                    <h4 className="font-heading font-bold text-slate-900 text-sm truncate">
                      {latestCharacter.name} ({latestResult.topCharacter.percentage}%)
                    </h4>
                    <p className="text-xs text-slate-500">
                      ชวนเพื่อนมาลองค้นหาดูว่าใครจะมีบุคลิกตรงกับโพนี่ตัวไหน!
                    </p>
                  </div>
                </div>
              ) : null}

              {/* Shareable Link Box */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  คัดลอกลิงก์ส่งให้เพื่อน
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-hidden font-mono truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>คัดลอกแล้ว! 🎉</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกลิงก์</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 1-Click Social Share Buttons */}
              <div className="space-y-2 pt-1">
                <span className="block text-xs font-semibold text-slate-600">
                  หรือแชร์ผ่านโซเชียลมีเดียทันที:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* LINE Share */}
                  <a
                    href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
                      getShareUrl()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>💬 แชร์ทาง LINE</span>
                  </a>

                  {/* Facebook Share */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      getShareUrl()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>📘 Facebook</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      getShareText()
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>🐦 X (Twitter)</span>
                  </a>
                </div>

                {/* Mobile Native Share (if available) */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="w-full mt-2 py-2 px-3 border border-purple-200 bg-purple-50/60 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>แชร์ผ่านแอปอื่น ๆ (Share via Apps...)</span>
                  </button>
                )}
              </div>

              {/* Informative footer */}
              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-100">
                💡 เมื่อเพื่อนเปิดลิงก์นี้ จะพบข้อความคำชวนจากคุณและสามารถกดเริ่มทำแบบทดสอบ 15 ข้อได้ทันที!
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
