import React from 'react';
import { Sparkles, User, LogOut, BookOpen, Heart, Award, Settings2 } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: {
    userId: string;
    displayName: string;
    email: string;
  } | null;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-left cursor-pointer group focus:outline-hidden"
        >
          <span className="text-2xl select-none group-hover:scale-110 transition-transform">🦄</span>
          <span className="font-heading font-bold text-lg sm:text-xl text-purple-900 tracking-tight whitespace-nowrap">
            คุณเป็นใครใน My Little Pony?
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 ${
              currentView === 'home'
                ? 'text-purple-700 border-purple-500 font-semibold'
                : 'text-slate-600 border-transparent hover:text-purple-700'
            }`}
          >
            หน้าแรก
          </button>
          <button
            onClick={() => onNavigate('quiz')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'quiz'
                ? 'text-purple-700 border-purple-500 font-semibold'
                : 'text-slate-600 border-transparent hover:text-purple-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>เริ่มทำแบบทดสอบ</span>
          </button>
          <button
            onClick={() => onNavigate('characters')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'characters'
                ? 'text-purple-700 border-purple-500 font-semibold'
                : 'text-slate-600 border-transparent hover:text-purple-700'
            }`}
          >
            <Award className="w-4 h-4 text-pink-500" />
            <span>ทำความรู้จัก 6 ตัวละคร</span>
          </button>
          <button
            onClick={() => onNavigate('questions')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
              currentView === 'questions'
                ? 'text-purple-700 border-purple-500 font-semibold'
                : 'text-slate-600 border-transparent hover:text-purple-700'
            }`}
          >
            <Settings2 className="w-4 h-4 text-indigo-500" />
            <span>จัดการคำถาม</span>
          </button>
          {currentUser && (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`cursor-pointer transition-colors pb-1 border-b-2 ${
                  currentView === 'dashboard'
                    ? 'text-purple-700 border-purple-500 font-semibold'
                    : 'text-slate-600 border-transparent hover:text-purple-700'
                }`}
              >
                แดชบอร์ด
              </button>
              <button
                onClick={() => onNavigate('history')}
                className={`cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                  currentView === 'history'
                    ? 'text-purple-700 border-purple-500 font-semibold'
                    : 'text-slate-600 border-transparent hover:text-purple-700'
                }`}
              >
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>ประวัติของฉัน</span>
              </button>
              <button
                onClick={() => onNavigate('profile')}
                className={`cursor-pointer transition-colors pb-1 border-b-2 flex items-center gap-1.5 ${
                  currentView === 'profile'
                    ? 'text-purple-700 border-purple-500 font-semibold'
                    : 'text-slate-600 border-transparent hover:text-purple-700'
                }`}
              >
                <User className="w-4 h-4 text-indigo-500" />
                <span>โปรไฟล์</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline-block text-xs md:text-sm font-medium text-purple-900 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200">
                สวัสดี, {currentUser.displayName} 💕
              </span>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                เข้าสู่ระบบ
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                สมัครสมาชิก
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sub-menu bar */}
      <div className="md:hidden flex items-center justify-around py-2 px-3 border-t border-purple-50 bg-purple-50/60 text-xs overflow-x-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`px-2 py-1 rounded-md ${currentView === 'home' ? 'bg-white font-semibold text-purple-700 shadow-xs' : 'text-slate-600'}`}
        >
          หน้าแรก
        </button>
        <button
          onClick={() => onNavigate('quiz')}
          className={`px-2 py-1 rounded-md ${currentView === 'quiz' ? 'bg-white font-semibold text-purple-700 shadow-xs' : 'text-slate-600'}`}
        >
          ทำแบบทดสอบ
        </button>
        <button
          onClick={() => onNavigate('characters')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${currentView === 'characters' ? 'bg-white font-semibold text-purple-700 shadow-xs' : 'text-slate-600'}`}
        >
          6 ตัวละคร
        </button>
        <button
          onClick={() => onNavigate('questions')}
          className={`px-2 py-1 rounded-md whitespace-nowrap ${currentView === 'questions' ? 'bg-white font-semibold text-purple-700 shadow-xs' : 'text-slate-600'}`}
        >
          จัดการคำถาม
        </button>
        {currentUser && (
          <>
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-2 py-1 rounded-md ${currentView === 'dashboard' ? 'bg-white font-semibold text-purple-700 shadow-xs' : 'text-slate-600'}`}
            >
              แดชบอร์ด
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`px-2 py-1 rounded-md ${currentView === 'history' ? 'bg-white font-semibold text-purple-700 shadow-xs' : 'text-slate-600'}`}
            >
              ประวัติ
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`px-2 py-1 rounded-md ${currentView === 'profile' ? 'bg-white font-semibold text-purple-700 shadow-xs' : 'text-slate-600'}`}
            >
              โปรไฟล์
            </button>
          </>
        )}
      </div>
    </header>
  );
};
