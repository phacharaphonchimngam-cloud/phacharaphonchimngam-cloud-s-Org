import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CharactersPage } from './components/CharactersPage';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { DashboardView } from './components/DashboardView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { QuestionManagerView } from './components/QuestionManagerView';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { StorageService } from './services/storage';
import { calculateQuizResult } from './services/quizCalculator';
import { CHARACTERS_MAP } from './data/characters';
import { CharacterId, QuizResultRecord, UserAnswerRecord } from './types/quiz';

export default function App() {
  const [currentUser, setCurrentUser] = useState<ReturnType<typeof StorageService.getCurrentUser>>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeResult, setActiveResult] = useState<QuizResultRecord | null>(null);
  const [userHistory, setUserHistory] = useState<QuizResultRecord[]>([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [inviteData, setInviteData] = useState<{
    from: string;
    ponyId?: string;
    score?: string;
  } | null>(null);

  // Check for invite links in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from');
      const ponyId = params.get('pony') || undefined;
      const score = params.get('score') || undefined;
      if (from) {
        setInviteData({ from, ponyId, score });
      }
    }
  }, []);

  // Load session & initialize demo user on mount
  useEffect(() => {
    StorageService.ensureDemoUser().then(() => {
      const session = StorageService.getCurrentUser();
      setCurrentUser(session);
      if (session) {
        const hist = StorageService.getUserHistory(session.userId);
        setUserHistory(hist);
      }
    });
  }, []);

  // Sync history when user changes
  const refreshUserData = () => {
    const session = StorageService.getCurrentUser();
    setCurrentUser(session);
    if (session) {
      const hist = StorageService.getUserHistory(session.userId);
      setUserHistory(hist);
    } else {
      setUserHistory([]);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setUserHistory([]);
    setCurrentView('home');
  };

  const handleAuthSuccess = () => {
    refreshUserData();
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteQuiz = (answers: UserAnswerRecord[]) => {
    const userId = currentUser ? currentUser.userId : 'guest_' + Date.now();
    const result = calculateQuizResult(userId, answers);

    // Save to storage if user is logged in
    if (currentUser) {
      StorageService.saveQuizResult(result);
      const updated = StorageService.getUserHistory(currentUser.userId);
      setUserHistory(updated);
    }

    setActiveResult(result);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewSpecificResult = (record: QuizResultRecord) => {
    setActiveResult(record);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string) => {
    // Check if view requires authentication
    if (['dashboard', 'history', 'profile'].includes(view) && !currentUser) {
      handleOpenAuth('login');
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract set of matched character IDs from user history for badges
  const matchedCharacterIds: CharacterId[] = Array.from(
    new Set(userHistory.map((h) => h.topCharacter.characterId))
  );

  const latestResult = userHistory.length > 0 ? userHistory[0] : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50/40 via-white to-pink-50/30 text-slate-800 font-sans antialiased selection:bg-purple-200 selection:text-purple-900">
      {/* Top Bar Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {inviteData && (
              <div className="max-w-4xl mx-auto px-4 pt-6">
                <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-400 p-0.5 rounded-3xl shadow-lg animate-in slide-in-from-top-4 duration-300">
                  <div className="bg-white rounded-[22px] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl shrink-0">
                        💌
                      </div>
                      <div>
                        <p className="font-heading font-bold text-slate-900 text-sm sm:text-base">
                          {inviteData.from} ส่งคำชวนให้คุณมาลองทำแบบทดสอบ!
                        </p>
                        <p className="text-xs text-slate-500">
                          {inviteData.ponyId && CHARACTERS_MAP[inviteData.ponyId as CharacterId]
                            ? `เพื่อนของคุณทำแบบทดสอบได้เป็น ${CHARACTERS_MAP[inviteData.ponyId as CharacterId].name} (${CHARACTERS_MAP[inviteData.ponyId as CharacterId].thaiName})${inviteData.score ? ` คล้าย ${inviteData.score}%` : ''}!`
                            : 'มาร่วมค้นหาตัวละครที่ตรงกับบุคลิกของคุณใน Equestria กัน'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={handleStartQuiz}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap"
                      >
                        ✨ เริ่มทำแบบทดสอบเลย
                      </button>
                      <button
                        onClick={() => setInviteData(null)}
                        className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-xs font-bold"
                        title="ปิดข้อความแจ้งเตือน"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <HeroSection
              currentUser={currentUser}
              onStartQuiz={handleStartQuiz}
              onOpenAuth={() => handleOpenAuth('login')}
              onGoToDashboard={() => handleNavigate('dashboard')}
              onViewCharacters={() => handleNavigate('characters')}
              onManageQuestions={() => handleNavigate('questions')}
            />
          </>
        )}

        {currentView === 'characters' && (
          <CharactersPage
            onStartQuiz={handleStartQuiz}
            onBackToHome={() => handleNavigate('home')}
          />
        )}

        {currentView === 'quiz' && (
          <QuizView
            onCompleteQuiz={handleCompleteQuiz}
            onCancel={() => handleNavigate('home')}
          />
        )}

        {currentView === 'result' && activeResult && (
          <ResultView
            result={activeResult}
            onRetakeQuiz={handleStartQuiz}
            onViewHistory={() => handleNavigate('history')}
            onGoToDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            latestResult={latestResult}
            historyCount={userHistory.length}
            onStartQuiz={handleStartQuiz}
            onViewHistory={() => handleNavigate('history')}
            onViewProfile={() => handleNavigate('profile')}
            onLogout={handleLogout}
            onViewSpecificResult={handleViewSpecificResult}
            onManageQuestions={() => handleNavigate('questions')}
          />
        )}

        {currentView === 'questions' && (
          <QuestionManagerView
            onBack={() => handleNavigate('home')}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {currentView === 'history' && currentUser && (
          <HistoryView
            history={userHistory}
            onViewResult={handleViewSpecificResult}
            onRetakeQuiz={handleStartQuiz}
            onBackToDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'profile' && currentUser && (
          <ProfileView
            currentUser={currentUser}
            matchedCharacterIds={matchedCharacterIds}
            onUpdateSuccess={refreshUserData}
            onBackToDashboard={() => handleNavigate('dashboard')}
          />
        )}
      </main>

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
