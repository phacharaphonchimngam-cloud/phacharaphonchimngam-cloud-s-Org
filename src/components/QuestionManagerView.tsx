import React, { useState, useEffect, useMemo } from 'react';
import { Question, QuestionCategory, CharacterId } from '../types/quiz';
import { StorageService } from '../services/storage';
import { CHARACTERS_MAP } from '../data/characters';
import {
  Sparkles,
  Search,
  Filter,
  Sliders,
  Edit3,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  BookOpen,
  Settings2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface QuestionManagerViewProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

const CATEGORIES: { id: QuestionCategory; label: string }[] = [
  { id: 'personality', label: 'บุคลิกภาพทั่วไป' },
  { id: 'friendship', label: 'มิตรภาพ' },
  { id: 'decision', label: 'การตัดสินใจ' },
  { id: 'work', label: 'การทำงานและความรับผิดชอบ' },
  { id: 'dreams', label: 'ความฝันและเป้าหมาย' },
  { id: 'emotions', label: 'อารมณ์และความรู้สึก' },
  { id: 'problem_solving', label: 'การแก้ปัญหา' },
  { id: 'courage', label: 'ความกล้าหาญ' },
  { id: 'creativity', label: 'ความคิดสร้างสรรค์' },
  { id: 'social', label: 'การเข้าสังคม' },
  { id: 'responsibility', label: 'ความซื่อสัตย์และภาระหน้าที่' },
];

const MANE_PONIES: { id: CharacterId; name: string; thai: string }[] = [
  { id: 'twilight_sparkle', name: 'Twilight Sparkle', thai: 'ทไวไลท์ สปาร์เคิล' },
  { id: 'rainbow_dash', name: 'Rainbow Dash', thai: 'เรนโบว์ แดช' },
  { id: 'pinkie_pie', name: 'Pinkie Pie', thai: 'พิงกี้ พาย' },
  { id: 'fluttershy', name: 'Fluttershy', thai: 'ฟลัตเตอร์ชาย' },
  { id: 'rarity', name: 'Rarity', thai: 'แรริตี้' },
  { id: 'applejack', name: 'Applejack', thai: 'แอปเปิ้ลแจ็ค' },
];

export const QuestionManagerView: React.FC<QuestionManagerViewProps> = ({
  onBack,
  onStartQuiz,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'scored' | 'unscored'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Expanded cards preview state
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Edit Modal State
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Load questions on mount
  useEffect(() => {
    const loaded = StorageService.getQuestions();
    setQuestions(loaded);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Quick toggle score for a question
  const handleQuickToggleScoring = (questionId: number, currentScored: boolean) => {
    const newScored = !currentScored;
    const updated = StorageService.toggleQuestionScoring(questionId, newScored);
    setQuestions(updated);
    showToast(
      newScored
        ? `คำถามข้อที่ ${questionId} ถูกตั้งค่าให้ "นับแต้มในการคำนวณ" แล้ว`
        : `คำถามข้อที่ ${questionId} ถูกตั้งค่าให้ "ไม่นับแต้มในการคำนวณ" แล้ว`
    );
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (
      window.confirm(
        'คุณแน่ใจหรือไม่ว่าต้องการรีเซ็ตคำถามทั้งหมดกลับเป็นค่าเริ่มต้นจากระบบ? การแก้ไขทั้งหมดจะถูกล้าง'
      )
    ) {
      const resetList = StorageService.resetQuestionsToDefault();
      setQuestions(resetList);
      showToast('รีเซ็ตคำถามทั้งหมดกลับเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const isScored = q.isScored !== false;

      // Score filter
      if (scoreFilter === 'scored' && !isScored) return false;
      if (scoreFilter === 'unscored' && isScored) return false;

      // Category filter
      if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchText = q.text.toLowerCase().includes(query);
        const matchCat = q.categoryLabel.toLowerCase().includes(query);
        const matchOpts = q.options.some((opt) => opt.text.toLowerCase().includes(query));
        if (!matchText && !matchCat && !matchOpts) return false;
      }

      return true;
    });
  }, [questions, scoreFilter, categoryFilter, searchQuery]);

  // Statistics
  const totalCount = questions.length;
  const scoredCount = questions.filter((q) => q.isScored !== false).length;
  const unscoredCount = totalCount - scoredCount;

  // Open Edit modal
  const handleOpenEdit = (q: Question) => {
    // Deep clone so changes in modal don't mutate state before save
    setEditingQuestion(JSON.parse(JSON.stringify(q)));
  };

  // Save edited question
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;

    if (!editingQuestion.text.trim()) {
      alert('กรุณากรอกข้อความคำถาม');
      return;
    }

    const updated = StorageService.updateQuestion(editingQuestion);
    setQuestions(updated);
    setEditingQuestion(null);
    showToast(`บันทึกคำถามข้อที่ ${editingQuestion.id} เรียบร้อยแล้ว`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับสู่หน้าหลัก</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetToDefault}
            className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50/50 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="คืนค่าคำถามทั้งหมดเป็นค่าเริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตเป็นค่าเริ่มต้น</span>
          </button>
          <button
            onClick={onStartQuiz}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>ลองทำแบบทดสอบ</span>
          </button>
        </div>
      </div>

      {/* Hero / Intro Card */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
          <Settings2 className="w-3.5 h-3.5 text-amber-300" />
          <span>ระบบจัดการและปรับแต่งชุดคำถาม (Question Bank Editor)</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl">
          จัดการคำถามและตั้งค่าการนับแต้ม 📝
        </h2>
        <p className="text-xs sm:text-sm text-purple-100 max-w-2xl leading-relaxed">
          คุณสามารถปรับแก้ข้อความคำถาม ตัวเลือก คะแนน และกำหนดให้บางคำถามเป็น{' '}
          <strong className="text-amber-300 font-semibold">"ไม่นับแต้มในการคำนวณ"</strong>{' '}
          เพื่อใช้เป็นคำถามสำรวจความคิดเห็น อุ่นเครื่อง (Warm-up) หรือแบบสอบถามทั่วไปโดยไม่ส่งผลต่อผลลัพธ์ตัวละครโพนี่
        </p>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-purple-200">คำถามทั้งหมดในคลัง</p>
              <p className="font-heading font-bold text-xl sm:text-2xl">{totalCount} ข้อ</p>
            </div>
            <BookOpen className="w-6 h-6 text-purple-200/60" />
          </div>

          <div
            onClick={() => setScoreFilter('scored')}
            className={`cursor-pointer transition-all border rounded-2xl p-3.5 flex items-center justify-between ${
              scoreFilter === 'scored'
                ? 'bg-emerald-500/30 border-emerald-300'
                : 'bg-white/10 backdrop-blur-xs border-white/15 hover:bg-white/15'
            }`}
          >
            <div>
              <p className="text-[11px] text-purple-200">คำถามที่นับแต้มคำนวณ</p>
              <p className="font-heading font-bold text-xl sm:text-2xl text-emerald-300">
                {scoredCount} ข้อ
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-emerald-300/80" />
          </div>

          <div
            onClick={() => setScoreFilter('unscored')}
            className={`cursor-pointer transition-all border rounded-2xl p-3.5 flex items-center justify-between ${
              scoreFilter === 'unscored'
                ? 'bg-amber-500/30 border-amber-300'
                : 'bg-white/10 backdrop-blur-xs border-white/15 hover:bg-white/15'
            }`}
          >
            <div>
              <p className="text-[11px] text-purple-200">คำถามที่ไม่นับแต้ม (สำรวจ)</p>
              <p className="font-heading font-bold text-xl sm:text-2xl text-amber-300">
                {unscoredCount} ข้อ
              </p>
            </div>
            <AlertTriangle className="w-6 h-6 text-amber-300/80" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาข้อความคำถาม, หมวดหมู่, หรือตัวเลือก..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-400 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setScoreFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                scoreFilter === 'all'
                  ? 'bg-white text-purple-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({totalCount})
            </button>
            <button
              onClick={() => setScoreFilter('scored')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                scoreFilter === 'scored'
                  ? 'bg-white text-emerald-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              นับแต้ม ({scoredCount})
            </button>
            <button
              onClick={() => setScoreFilter('unscored')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                scoreFilter === 'unscored'
                  ? 'bg-white text-amber-800 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ไม่นับแต้ม ({unscoredCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:border-purple-400 cursor-pointer"
          >
            <option value="all">ทุกหมวดหมู่</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-purple-100 space-y-3">
            <p className="text-3xl">🔍</p>
            <h4 className="font-heading font-bold text-slate-800 text-base">
              ไม่พบคำถามที่ตรงกับเงื่อนไขการค้นหา
            </h4>
            <p className="text-xs text-slate-500">
              ลองปรับคำค้นหาหรือเปลี่ยนฟิลเตอร์สถานะการนับคะแนน
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setScoreFilter('all');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors cursor-pointer"
            >
              ล้างการค้นหาทั้งหมด
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isScored = q.isScored !== false;
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  !isScored
                    ? 'border-amber-200 shadow-2xs bg-amber-50/20'
                    : 'border-slate-200/80 shadow-2xs hover:border-purple-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-heading font-bold text-xs text-purple-900 bg-purple-100/70 px-2.5 py-0.5 rounded-md">
                        ข้อที่ #{q.id}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        หมวด: {q.categoryLabel}
                      </span>

                      {/* Scoring Status Indicator */}
                      {isScored ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>นับแต้มในการคำนวณ</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>ไม่นับแต้ม (คำถามสำรวจ / Warm-up)</span>
                        </span>
                      )}
                    </div>

                    {/* Question Text */}
                    <h4 className="font-heading font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {q.text}
                    </h4>

                    {q.situation && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{q.situation}"
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                    {/* Quick Toggle Scoring Button */}
                    <button
                      type="button"
                      onClick={() => handleQuickToggleScoring(q.id, isScored)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                        isScored
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title={
                        isScored
                          ? 'คลิกเพื่อเปลี่ยนเป็นไม่นับแต้มในการคำนวณ'
                          : 'คลิกเพื่อเปลี่ยนให้นับแต้มคำนวณตามปกติ'
                      }
                    >
                      {isScored ? (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>ตั้งเป็นไม่นับแต้ม</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>เปิดให้นับแต้ม</span>
                        </>
                      )}
                    </button>

                    {/* Edit question button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(q)}
                      className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>แก้ไขคำถาม</span>
                    </button>

                    {/* Expand/Collapse preview */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                      title={isExpanded ? 'ซ่อนตัวเลือก' : 'ดูตัวเลือกทั้ง 5 ข้อ'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Options preview */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      ตัวเลือกคำตอบและคะแนน (5 ตัวเลือก):
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {q.options.map((opt, i) => (
                        <div
                          key={opt.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-bold text-purple-700">
                              {String.fromCharCode(65 + i)}.
                            </span>
                            <span className="text-slate-800">{opt.text}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 text-[10px] text-slate-500">
                            <span className="bg-purple-100/80 text-purple-800 px-2 py-0.5 rounded-md font-medium">
                              {opt.primaryTrait}
                            </span>
                            {isScored ? (
                              <span className="text-emerald-700">
                                (มีคะแนนสำหรับตัวละคร)
                              </span>
                            ) : (
                              <span className="text-amber-700 font-semibold">
                                (ไม่ถูกนำไปบวกคะแนน)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Question Edit Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-300" />
                <h3 className="font-heading font-bold text-lg">
                  แก้ไขคำถามข้อที่ #{editingQuestion.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingQuestion(null)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleSaveEdit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Scoring Count Toggle (Most Prominent Requirement) */}
              <div
                className={`p-4 rounded-2xl border-2 transition-all ${
                  editingQuestion.isScored !== false
                    ? 'bg-emerald-50/80 border-emerald-300'
                    : 'bg-amber-50/80 border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-slate-900">
                        การนับแต้มในการคำนวณผลลัพธ์
                      </span>
                      {editingQuestion.isScored !== false ? (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                          นับแต้มปกติ
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-200 px-2 py-0.5 rounded-md">
                          ไม่นับแต้ม (คำถามสำรวจ)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {editingQuestion.isScored !== false
                        ? 'คำถามนี้จะนำคะแนนจากตัวเลือกที่ผู้ใช้ตอบ ไปบวกคำนวณหาตัวละครโพนี่ที่ตรงกับผู้ใช้ตามปกติ'
                        : '⚠️ คำถามนี้จะไม่นำคะแนนไปคำนวณหาตัวละครโพนี่ เหมาะสำหรับคำถามสำรวจความคิดเห็นหรือสร้างความสนุกสนานโดยไม่กระทบผลลัพธ์'}
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={editingQuestion.isScored !== false}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          isScored: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-800 text-xs">
                  ข้อความคำถาม <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={editingQuestion.text}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      text: e.target.value,
                    })
                  }
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Situation & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800 text-xs">
                    หมวดหมู่คำถาม
                  </label>
                  <select
                    value={editingQuestion.category}
                    onChange={(e) => {
                      const found = CATEGORIES.find((c) => c.id === e.target.value);
                      setEditingQuestion({
                        ...editingQuestion,
                        category: e.target.value as QuestionCategory,
                        categoryLabel: found ? found.label : editingQuestion.categoryLabel,
                      });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800 text-xs">
                    สถานการณ์สมมุติ (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.situation || ''}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        situation: e.target.value,
                      })
                    }
                    placeholder="เช่น ในงานเลี้ยงเต้นรำครั้งใหญ่..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Options Editing */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-slate-800 text-xs">
                    ตัวเลือกคำตอบทั้ง 5 ข้อ
                  </label>
                  <span className="text-[11px] text-slate-500">
                    แก้ไขข้อความตัวเลือกและลักษณะนิสัย
                  </span>
                </div>

                <div className="space-y-3">
                  {editingQuestion.options.map((opt, optIdx) => (
                    <div
                      key={opt.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOptions = [...editingQuestion.options];
                            newOptions[optIdx] = {
                              ...newOptions[optIdx],
                              text: e.target.value,
                            };
                            setEditingQuestion({
                              ...editingQuestion,
                              options: newOptions,
                            });
                          }}
                          required
                          placeholder="ข้อความตัวเลือก..."
                          className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-purple-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                            ลักษณะเด่น (Primary Trait)
                          </label>
                          <input
                            type="text"
                            value={opt.primaryTrait}
                            onChange={(e) => {
                              const newOptions = [...editingQuestion.options];
                              newOptions[optIdx] = {
                                ...newOptions[optIdx],
                                primaryTrait: e.target.value,
                              };
                              setEditingQuestion({
                                ...editingQuestion,
                                options: newOptions,
                              });
                            }}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block mb-0.5">
                            คำอธิบายลักษณะนิสัย
                          </label>
                          <input
                            type="text"
                            value={opt.traitDescription}
                            onChange={(e) => {
                              const newOptions = [...editingQuestion.options];
                              newOptions[optIdx] = {
                                ...newOptions[optIdx],
                                traitDescription: e.target.value,
                              };
                              setEditingQuestion({
                                ...editingQuestion,
                                options: newOptions,
                              });
                            }}
                            className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Save / Cancel */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกการแก้ไข</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
