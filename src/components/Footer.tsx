import React from 'react';
import { Heart, Sparkles, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-purple-100 py-10 mt-16 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦄</span>
            <span className="font-heading font-bold text-slate-800 text-sm">
              คุณเป็นใครใน My Little Pony? (MLP Personality Quiz)
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-700 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Magic of Friendship is Alive</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-600 text-xs leading-relaxed space-y-1">
          <p className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>คำชี้แจงด้านลิขสิทธิ์และการใช้งาน (Disclaimer)</span>
          </p>
          <p>
            แบบทดสอบนี้จัดทำขึ้นเพื่อความบันเทิงและการสำรวจตนเองเชิงสร้างสรรค์เท่านั้น ไม่ใช่การทดสอบทางจิตวิทยาหรือการวินิจฉัยทางการแพทย์ ตัวละคร ชื่อ รูปภาพ และตราสัญลักษณ์ My Little Pony เป็นทรัพย์สินทางปัญญาและลิขสิทธิ์ของ Hasbro ทางผู้พัฒนาไม่มีเจตนาละเมิดลิขสิทธิ์เชิงพาณิชย์
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100 text-slate-400 text-[11px]">
          <p>© {new Date().getFullYear()} My Little Pony Interactive Personality Quiz. All rights reserved.</p>
          <p className="flex items-center gap-1">
            สร้างสรรค์ด้วยความอบอุ่นและมิตรภาพ <Heart className="w-3 h-3 text-pink-500 fill-pink-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
