import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { CHARACTERS_LIST, getVerifiedCharacter } from '../data/characters';
import { CharacterId } from '../types/quiz';
import {
  User,
  Mail,
  Calendar,
  Sparkles,
  Save,
  ArrowLeft,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: {
    userId: string;
    displayName: string;
    email: string;
    birthday?: string;
    createdAt?: string;
  };
  matchedCharacterIds: CharacterId[];
  onUpdateSuccess: () => void;
  onBackToDashboard: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  matchedCharacterIds,
  onUpdateSuccess,
  onBackToDashboard,
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [birthday, setBirthday] = useState(currentUser.birthday || '');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const success = StorageService.updateProfile(currentUser.userId, {
      displayName,
      birthday,
    });
    if (success) {
      setSavedMsg(true);
      onUpdateSuccess();
      setTimeout(() => setSavedMsg(false), 3000);
    }
  };

  const formattedJoinDate = currentUser.createdAt
    ? new Intl.DateTimeFormat('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(currentUser.createdAt))
    : 'ไม่ระบุ';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div>
        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1 mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>กลับสู่แดชบอร์ด</span>
        </button>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 flex items-center gap-2">
          <User className="w-7 h-7 text-purple-600" />
          <span>👤 ข้อมูลโปรไฟล์</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          จัดการข้อมูลส่วนตัวและดูเหรียญตราตัวละครที่คุณค้นพบ
        </p>
      </div>

      {/* Edit Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          {savedMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ชื่อที่แสดง (Display Name)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              อีเมลบัญชี (ไม่สามารถเปลี่ยนได้)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              วันเกิด
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              วันที่สมัครสมาชิก: {formattedJoinDate}
            </span>

            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>

      {/* Mane 6 Character Discovery Badges */}
      <div className="bg-purple-50/70 rounded-3xl p-6 sm:p-8 border border-purple-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span>คอลเลกชันตัวละครโพนี่ที่ค้นพบ ({matchedCharacterIds.length} / 6)</span>
            </h3>
            <p className="text-xs text-slate-500">
              ทำแบบทดสอบเพื่อสะสมและปลดล็อกตัวละครหลักแห่ง Equestria ให้ครบทั้ง 6 ตัว
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
          {CHARACTERS_LIST.map((char) => {
            const isUnlocked = matchedCharacterIds.includes(char.characterId);

            return (
              <div
                key={char.characterId}
                className={`p-3 rounded-2xl text-center border transition-all ${
                  isUnlocked
                    ? 'bg-white border-purple-200 shadow-2xs'
                    : 'bg-slate-100/60 border-slate-200 opacity-40 grayscale'
                }`}
              >
                <div className="w-14 h-14 mx-auto rounded-xl overflow-hidden mb-2 bg-slate-50">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-heading font-bold text-xs text-slate-900 truncate">
                  {char.name}
                </p>
                <span className="text-[10px] text-purple-600 font-medium">
                  {isUnlocked ? 'ปลดล็อกแล้ว ✨' : 'ยังไม่พบ'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
