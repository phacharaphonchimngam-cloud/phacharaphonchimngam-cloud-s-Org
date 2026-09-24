import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Star, CheckCircle } from 'lucide-react';
import heroImg from '../assets/images/mlp_hero_banner_1790230228743.jpg';

interface HeroSectionProps {
  currentUser: {
    userId: string;
    displayName: string;
    email: string;
  } | null;
  onStartQuiz: () => void;
  onOpenAuth: () => void;
  onGoToDashboard: () => void;
  onViewCharacters?: () => void;
  onManageQuestions?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentUser,
  onStartQuiz,
  onOpenAuth,
  onGoToDashboard,
  onViewCharacters,
  onManageQuestions,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
      {/* Soft background ambient gradient bubbles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-purple-200/40 via-pink-200/30 to-amber-100/40 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200/70 text-purple-800 text-xs font-medium shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-sparkle" />
              <span>Interactive Personality Quiz · 15 คำถามสุ่มจากคลัง 50 ข้อ</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
              🦄 คุณเป็นใครใน <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                My Little Pony?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              “ตอบคำถาม 15 ข้อ แล้วค้นพบว่าตัวละครไหนมีบุคลิกใกล้เคียงกับคุณที่สุด!”
              พร้อมการวิเคราะห์นิสัย จุดแข็ง สิ่งที่เหมาะกับคุณ และข้อควรระวังแบบเจาะลึก
            </p>

            {/* Login status greetings */}
            {currentUser && (
              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-sm font-medium flex items-center justify-center lg:justify-start gap-2">
                <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                <span>สวัสดี, {currentUser.displayName} 💕 ยินดีต้อนรับสู่ดินแดนเอเควสเทรีย!</span>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onStartQuiz}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-base rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-200" />
                <span>✨ เริ่มทำแบบทดสอบ</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {currentUser ? (
                <button
                  onClick={onGoToDashboard}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-purple-50 text-purple-800 font-semibold text-sm rounded-2xl border border-purple-200 shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📊 ไปที่แดชบอร์ดของฉัน</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-purple-50 text-purple-800 font-semibold text-sm rounded-2xl border border-purple-200 shadow-2xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🔐 เข้าสู่ระบบ</span>
                </button>
              )}

              {onViewCharacters && (
                <button
                  onClick={onViewCharacters}
                  className="w-full sm:w-auto px-5 py-3.5 text-slate-600 hover:text-purple-700 font-medium text-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>ทำความรู้จัก 6 ตัวละคร →</span>
                </button>
              )}
            </div>

            {/* Quality assurance badges */}
            <div className="pt-4 border-t border-purple-100 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>ชื่อและภาพตัวละครตรงกัน 100%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
                <span>ระบบสุ่มคำถาม 15 ข้อไม่ซ้ำ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>ระบบบันทึกประวัติเฉพาะบุคคล</span>
              </div>
              {onManageQuestions && (
                <button
                  onClick={onManageQuestions}
                  className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold cursor-pointer underline decoration-purple-300 underline-offset-2"
                >
                  <span>⚙️ จัดการคำถาม & ตั้งค่าการนับแต้ม</span>
                </button>
              )}
            </div>
          </div>

          {/* Image Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-purple-100">
              <img
                src={heroImg}
                alt="My Little Pony Equestria Realm"
                className="w-full h-auto object-cover aspect-16/10 transform hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>The Magic of Friendship</span>
                  </span>
                  <span className="text-white/85">Equestria Mane 6</span>
                </div>
              </div>
            </div>

            {/* Cute floating badge */}
            <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-purple-100 flex items-center gap-3 animate-float">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-xs font-bold text-slate-800">แม่นยำ & ละเอียด</p>
                <p className="text-[11px] text-purple-600">วิเคราะห์จากคำตอบจริง</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
