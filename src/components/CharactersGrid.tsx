import React, { useState } from 'react';
import { CHARACTERS_LIST, verifyCharacterIntegrity } from '../data/characters';
import { Character } from '../types/quiz';
import { Sparkles, ChevronRight, X, Heart, Star, Lock } from 'lucide-react';

export const CharactersGrid: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  return (
    <section className="py-12 bg-purple-50/50 border-t border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Mane 6 แห่งดินแดน Equestria</span>
          </div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">
            ทำความรู้จัก 6 ตัวละครหลัก
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            ตัวแทนแห่งธาตุทั้ง 6 ของ Element of Harmony แต่ละตัวละครมีเสน่ห์ จุดแข็ง และเอกลักษณ์ที่ไม่เหมือนใคร
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHARACTERS_LIST.map((char) => {
            // Guarantee character integrity
            const isValid = verifyCharacterIntegrity(char);
            if (!isValid) {
              console.warn('Character integrity check failure for', char.characterId);
            }

            return (
              <div
                key={char.characterId}
                className="bg-white rounded-3xl p-5 border border-purple-100 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedCharacter(char)}
              >
                <div>
                  {/* Character Image Slot */}
                  <div className="relative rounded-2xl overflow-hidden aspect-square mb-4 bg-purple-50 border border-purple-100">
                    <img
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-semibold text-slate-800 shadow-2xs border border-white">
                      {char.elementThai}
                    </div>
                  </div>

                  {/* Character Names */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-purple-700 transition-colors">
                        {char.name}
                      </h3>
                      <span className="text-xs text-purple-600 font-medium">{char.species}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{char.thaiName}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {char.personality}
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-600 group-hover:underline flex items-center gap-1">
                    <span>ดูโปรไฟล์ตัวละครฉบับเต็ม</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Profile Details */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white relative">
              <button
                onClick={() => setSelectedCharacter(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                />
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-medium">
                    {selectedCharacter.elementThai}
                  </span>
                  <h3 className="font-heading font-bold text-2xl mt-1">{selectedCharacter.name}</h3>
                  <p className="text-xs text-white/90">{selectedCharacter.displayName}</p>
                </div>
              </div>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 italic text-purple-900 font-medium">
                {selectedCharacter.quote}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>บุคลิกภาพทั่วไป</span>
                </h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  {selectedCharacter.personality}
                </p>
              </div>

              {/* Notice that Strengths & Cautions are exclusively available in the Dashboard */}
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center gap-3 text-xs text-purple-900">
                <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-700">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold">จุดเด่นและข้อควรระวังจะแสดงเฉพาะในแดชบอร์ด</p>
                  <p className="text-[11px] text-purple-700/80">
                    เข้าสู่ระบบและไปที่แดชบอร์ดเพื่อดูการวิเคราะห์จุดเด่นและข้อควรระวังของแต่ละตัวละคร
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>กิจกรรมที่เหมาะสม</span>
                </h4>
                <div className="space-y-2">
                  {selectedCharacter.suitableActivities.map((act, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 mb-1">{act.category}</p>
                      <p className="text-xs text-slate-600">{act.items.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 text-pink-900">
                <h5 className="font-semibold text-xs flex items-center gap-1.5 mb-1 text-pink-800">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>คำแนะนำมิตรภาพ</span>
                </h5>
                <p className="text-xs leading-relaxed">{selectedCharacter.friendshipAdvice}</p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedCharacter(null)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
