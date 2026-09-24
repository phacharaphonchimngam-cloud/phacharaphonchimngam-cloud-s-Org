import React, { useState } from 'react';
import { X, Lock, Mail, User, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await StorageService.login(email, password);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
        }
      } else {
        const res = await StorageService.register({
          displayName,
          email,
          password,
          birthday: birthday || undefined,
        });
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.error || 'ลงทะเบียนไม่สำเร็จ');
        }
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await StorageService.ensureDemoUser();
      const res = await StorageService.login('demo@ponyquiz.com', 'password123');
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError('เข้าสู่ระบบบัญชีตัวอย่างไม่สำเร็จ');
      }
    } catch {
      setError('ไม่สามารถเข้าสู่ระบบตัวอย่างได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-400 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="ปิด"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner mb-2">
            🦄
          </div>
          <h3 className="font-heading font-bold text-xl">
            {mode === 'login' ? 'ยินดีต้อนรับกลับสู่เอเควสเทรีย' : 'สร้างบัญชีโพนี่ของคุณ'}
          </h3>
          <p className="text-xs text-white/85 mt-1">
            {mode === 'login'
              ? 'เข้าสู่ระบบเพื่อดูประวัติและผลลัพธ์ย้อนหลัง'
              : 'สมัครสมาชิกเพื่อบันทึกผลการทดสอบและปลดล็อกการวิเคราะห์'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-purple-100 bg-purple-50/40">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors text-center ${
              mode === 'login'
                ? 'text-purple-700 border-b-2 border-purple-600 bg-white'
                : 'text-slate-500 hover:text-purple-600'
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-semibold transition-colors text-center ${
              mode === 'register'
                ? 'text-purple-700 border-b-2 border-purple-600 bg-white'
                : 'text-slate-500 hover:text-purple-600'
            }`}
          >
            สมัครสมาชิกใหม่
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ชื่อที่แสดง (Display Name) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="เช่น Twilight Fan, มิตรภาพเวทมนตร์"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              อีเมล <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              รหัสผ่าน <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden transition-all"
              />
            </div>
            {mode === 'register' && (
              <p className="text-[11px] text-slate-400 mt-1">
                🔒 ปลอดภัย: ระบบเข้ารหัสผ่านแบบ Salted Hashing ไม่จัดเก็บรหัสผ่านเปลือย
              </p>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                วันเกิด (ถ้าต้องการระบุ)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden transition-all"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span>กำลังดำเนินการ...</span>
            ) : mode === 'login' ? (
              <>
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>สร้างบัญชีและเริ่มใช้งาน</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Quick Demo Access */}
          <div className="pt-2 border-t border-purple-50">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-2 px-3 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⚡ เข้าสู่ระบบทันทีด้วยบัญชีทดสอบ (Demo Account)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
